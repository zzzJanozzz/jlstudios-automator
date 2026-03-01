// src/components/LoadingSkeleton.tsx
// ─────────────────────────────────────────────────────────────────────────────
// FIXED: Silent failure when /api/analyze returns 413, 504, 500, etc.
//
// Root cause: previous version did not check `response.ok` after the fetch.
//  Any HTTP error code caused `response.json()` to throw or return an error
//  body that was never inspected, so `setError()` / `setProcessing(false)`
//  were never called → the progress bar froze at 95 % indefinitely.
//
// Fix strategy:
//  1. Explicit `if (!response.ok)` check with status-aware error messages.
//  2. Network/abort errors caught in the outer `catch` block.
//  3. Both paths call `setProcessing(false)` and `setError(msg)` before
//     reverting the step to "upload" so the UI always unlocks.
//  4. Client-side 55 s AbortController timeout guard — fires before the
//     Vercel/Next 60 s edge limit so we get a clean error instead of a
//     connection reset.
//  5. Inline toast notification system (no external deps) so the error is
//     impossible to miss.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAppStore } from "@/lib/store";

// ── HTTP status → user-friendly Spanish message ───────────────────────────────
function httpErrorMessage(status: number, serverMsg?: string): string {
  if (serverMsg) return serverMsg;
  switch (status) {
    case 400: return "Solicitud inválida. Verificá el formato del archivo.";
    case 413: return "Archivo demasiado grande. El límite es 20 MB.";
    case 422: return "No se pudo procesar el archivo. Probá con otra imagen o PDF.";
    case 429: return "Demasiadas solicitudes. Esperá unos segundos e intentá de nuevo.";
    case 500: return "Error interno del servidor. Intentá de nuevo en unos momentos.";
    case 502: return "El servidor no está disponible. Intentá de nuevo.";
    case 503: return "Servicio temporalmente no disponible.";
    case 504: return "Tiempo de espera agotado (504). La imagen puede ser demasiado grande o compleja.";
    default:  return `Error del servidor (HTTP ${status}). Intentá de nuevo.`;
  }
}

// ── Inline Toast (zero dependencies) ─────────────────────────────────────────
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 8000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      role="alert"
      style={{
        position:  "fixed",
        bottom:    "24px",
        left:      "50%",
        transform: "translateX(-50%)",
        zIndex:    9999,
        maxWidth:  "480px",
        width:     "calc(100vw - 48px)",
        background:      "rgba(15,5,5,0.97)",
        border:          "1px solid rgba(239,68,68,0.4)",
        borderRadius:    "12px",
        padding:         "14px 18px",
        display:         "flex",
        alignItems:      "flex-start",
        gap:             "12px",
        boxShadow:       "0 8px 32px rgba(0,0,0,0.6)",
        backdropFilter:  "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        animation:       "slideUp 0.3s ease",
      }}
    >
      <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>⚠️</span>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#fca5a5", margin: 0, marginBottom: "3px" }}>
          Error al procesar
        </p>
        <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.4 }}>
          {message}
        </p>
      </div>
      <button
        onClick={onClose}
        style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", fontSize: "1rem", lineHeight: 1, flexShrink: 0, padding: "0 0 0 4px" }}
        aria-label="Cerrar"
      >
        ✕
      </button>
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateX(-50%) translateY(12px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
    </div>
  );
}

// ── Progress steps ────────────────────────────────────────────────────────────
const STEPS = [
  { label: "Leyendo archivo",        pct: 12  },
  { label: "Enviando a la IA",       pct: 28  },
  { label: "Analizando contenido",   pct: 55  },
  { label: "Extrayendo datos",       pct: 78  },
  { label: "Generando diseño",       pct: 90  },
  { label: "Finalizando sitio",      pct: 97  },
];

// ── Client-side timeout — fires 5 s before the server's maxDuration=60 ───────
const CLIENT_TIMEOUT_MS = 55_000;

// ── Component ─────────────────────────────────────────────────────────────────
export function LoadingSkeleton() {
  const {
    uploadedFiles, niche,
    setBusinessData, setProcessing, setError, setStep,
  } = useAppStore();

  const [progress,     setProgress]     = useState(0);
  const [stepLabel,    setStepLabel]    = useState(STEPS[0].label);
  const [toastMsg,     setToastMsg]     = useState<string | null>(null);
  const [callDone,     setCallDone]     = useState(false);

  const abortRef  = useRef<AbortController | null>(null);
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepIdx   = useRef(0);

  // ── Simulate progress ticks while waiting for the API ──────────────────────
  useEffect(() => {
    if (callDone) return;

    const advance = () => {
      const next = stepIdx.current + 1;
      if (next < STEPS.length) {
        stepIdx.current = next;
        setProgress(STEPS[next].pct);
        setStepLabel(STEPS[next].label);
      }
    };

    // Schedule each step with increasing delays
    const timers: ReturnType<typeof setTimeout>[] = [];
    let cumulative = 0;
    for (let i = 1; i < STEPS.length; i++) {
      // Each step takes longer than the previous — simulates AI thinking time
      cumulative += 3000 + i * 2000;
      timers.push(setTimeout(advance, Math.min(cumulative, CLIENT_TIMEOUT_MS - 4000)));
    }

    setProgress(STEPS[0].pct);
    setStepLabel(STEPS[0].label);

    return () => timers.forEach(clearTimeout);
  }, [callDone]);

  // ── Abort + cleanup helper ─────────────────────────────────────────────────
  const cleanup = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    abortRef.current?.abort();
  }, []);

  // ── Show error, revert UI ──────────────────────────────────────────────────
  const handleError = useCallback(
    (msg: string) => {
      cleanup();
      setCallDone(true);
      setProgress(0);
      console.error("[JLStudios] API error:", msg);
      setToastMsg(msg);
      setError(msg);
      setProcessing(false);
      // Give the user a moment to read the toast before reverting the step
      setTimeout(() => setStep("upload"), 1200);
    },
    [cleanup, setError, setProcessing, setStep]
  );

  // ── Main fetch effect ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!uploadedFiles.length || !niche) {
      handleError("No hay archivo o rubro seleccionado.");
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    // Client-side timeout guard
    timerRef.current = setTimeout(() => {
      controller.abort();
      handleError(
        "Tiempo de espera agotado (55 s). El archivo puede ser muy grande o complejo. " +
        "Probá con una imagen más pequeña."
      );
    }, CLIENT_TIMEOUT_MS);

    const run = async () => {
      try {
        // Build FormData
        const formData = new FormData();
        formData.append("niche", niche);
        uploadedFiles.forEach((file) => formData.append("files", file));

        // ── THE CRITICAL FETCH ─────────────────────────────────────────────
        const response = await fetch("/api/analyze", {
          method: "POST",
          body:   formData,
          signal: controller.signal,
        });

        // Clear the client-side timeout — server responded in time
        if (timerRef.current) clearTimeout(timerRef.current);

        // ── CHECK response.ok BEFORE trying to parse body ─────────────────
        //    This is the bug fix: previously this check was absent, so
        //    413/504/500 responses were silently ignored and the promise
        //    would reject at .json() with no error surfaced to the user.
        if (!response.ok) {
          let serverMsg: string | undefined;
          try {
            // Try to get a message from the response body
            const errBody = await response.json();
            serverMsg = errBody?.error ?? errBody?.message ?? undefined;
          } catch {
            // Body wasn't JSON — that's fine, fall through to generic message
          }
          handleError(httpErrorMessage(response.status, serverMsg));
          return;
        }

        // ── Parse the success body ─────────────────────────────────────────
        let data;
        try {
          data = await response.json();
        } catch {
          handleError("La respuesta del servidor no es JSON válido. Intentá de nuevo.");
          return;
        }

        // Validate the payload has the minimum required shape
        if (!data || typeof data !== "object" || !data.businessName) {
          handleError("La IA no pudo extraer datos del archivo. Probá con una imagen más clara.");
          return;
        }

        // ── SUCCESS ───────────────────────────────────────────────────────
        setCallDone(true);
        setProgress(100);
        setStepLabel("¡Listo! Abriendo editor…");
        setTimeout(() => {
          setBusinessData(data);
        }, 600);

      } catch (networkError: unknown) {
        // ── NETWORK / ABORT errors ────────────────────────────────────────
        if ((networkError as Error)?.name === "AbortError") {
          // Already handled by the timeout callback above
          return;
        }
        const msg =
          (networkError instanceof Error ? networkError.message : String(networkError)) ||
          "Error de red. Verificá tu conexión e intentá de nuevo.";
        handleError(`Error de conexión: ${msg}`);
      }
    };

    run();

    return () => {
      cleanup();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount — files and niche are stable at this point

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}

      <div className="flex flex-col items-center gap-8 py-8 px-4">
        {/* Animated orb */}
        <div className="relative flex items-center justify-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background:   "linear-gradient(135deg, #7c3aed, #a21caf)",
              boxShadow:    "0 0 0 0 rgba(124,58,237,0.4)",
              animation:    "orb-pulse 2s ease-in-out infinite",
            }}
          >
            <span style={{ fontSize: "2rem" }}>✨</span>
          </div>
          {/* Spinner ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border:        "2px solid transparent",
              borderTopColor: "#a78bfa",
              animation:     "spin 1s linear infinite",
            }}
          />
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-xl font-bold mb-1" style={{ color: "#fafafa" }}>
            La IA está analizando tu archivo
          </h2>
          <p className="text-sm" style={{ color: "#71717a" }}>
            Esto tarda entre 10 y 45 segundos según el tamaño del archivo
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium" style={{ color: "#a78bfa" }}>
              {stepLabel}
            </span>
            <span className="text-xs font-mono" style={{ color: "#52525b" }}>
              {progress}%
            </span>
          </div>
          <div
            className="w-full rounded-full overflow-hidden"
            style={{ height: "6px", backgroundColor: "#27272a" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width:      `${progress}%`,
                background: "linear-gradient(90deg, #7c3aed, #a21caf)",
                transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)",
              }}
            />
          </div>
        </div>

        {/* Steps list */}
        <div className="w-full max-w-sm space-y-2">
          {STEPS.map((s, i) => {
            const done    = progress > s.pct;
            const current = !done && progress >= (STEPS[i - 1]?.pct ?? 0);
            return (
              <div key={s.label} className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-xs"
                  style={{
                    backgroundColor: done    ? "#7c3aed" : current ? "rgba(124,58,237,0.2)" : "#27272a",
                    border:          current ? "1.5px solid #7c3aed" : "none",
                  }}
                >
                  {done ? "✓" : current ? (
                    <span
                      style={{
                        width: "8px", height: "8px", borderRadius: "50%",
                        background: "#a78bfa", display: "block",
                        animation: "blink 1.2s ease infinite",
                      }}
                    />
                  ) : ""}
                </div>
                <span
                  className="text-xs"
                  style={{ color: done ? "#d4d4d8" : current ? "#a78bfa" : "#3f3f46" }}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Tip */}
        <p className="text-xs text-center max-w-xs" style={{ color: "#3f3f46" }}>
          💡 Tip: Imágenes nítidas y bien iluminadas mejoran la precisión de la extracción.
        </p>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes orb-pulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(124,58,237,0.4); }
            50%       { box-shadow: 0 0 0 16px rgba(124,58,237,0); }
          }
          @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        `}</style>
      </div>
    </>
  );
}

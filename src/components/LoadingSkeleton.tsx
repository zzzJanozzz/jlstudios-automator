// src/components/LoadingSkeleton.tsx
// ─────────────────────────────────────────────────────────────────────────────
// BUGFIXES:
//
// BUG #1 — ROOT CAUSE DEL ERROR VISIBLE (la IA SÍ funciona, pero se leía mal):
//   route.ts devuelve: { success: true, DATA: { businessName, items, ... } }
//   Versión anterior chequeaba: if (!data.businessName) → SIEMPRE undefined
//   porque "data" era el envelope { success, data } y businessName estaba un
//   nivel más adentro en data.data.businessName.
//   Fix: ahora se desestructura correctamente: const { success, data: biz } = body
//
// BUG #2 — Sin chequeo de response.ok:
//   Si el server devolvía 413/504/500, la promesa se rechazaba en .json() sin
//   ningún error visible → UI congelada en 95%.
//   Fix: if (!response.ok) → handleError() con mensaje por status
//
// BUG #3 — Sin timeout cliente:
//   Si el server tardaba más de 60s, el browser dejaba la conexión abierta
//   sin nunca llamar catch(). Fix: AbortController de 55s
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAppStore } from "@/lib/store";

function httpErrorMessage(status: number, serverMsg?: string): string {
  if (serverMsg) return serverMsg;
  switch (status) {
    case 400: return "Solicitud inválida. Verificá el formato del archivo.";
    case 413: return "Archivo demasiado grande. El límite es 20 MB.";
    case 422: return "La IA no pudo procesar el archivo. Probá con una foto más clara o con mejor iluminación.";
    case 429: return "Demasiadas solicitudes seguidas. Esperá unos segundos e intentá de nuevo.";
    case 500: return "Error interno del servidor. Intentá de nuevo en unos momentos.";
    case 504: return "Tiempo de espera agotado (504). Probá con un archivo más pequeño o simple.";
    default:  return `Error del servidor (HTTP ${status}). Intentá de nuevo.`;
  }
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 9000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div role="alert" style={{
      position:"fixed", bottom:"24px", left:"50%",
      transform:"translateX(-50%)", zIndex:9999,
      maxWidth:"480px", width:"calc(100vw - 48px)",
      background:"rgba(12,4,4,0.97)",
      border:"1px solid rgba(239,68,68,0.35)", borderRadius:"12px",
      padding:"14px 16px", display:"flex", alignItems:"flex-start", gap:"12px",
      boxShadow:"0 8px 32px rgba(0,0,0,0.7)", backdropFilter:"blur(12px)",
      animation:"toastIn 0.3s ease",
    }}>
      <span style={{fontSize:"1.1rem",flexShrink:0,marginTop:"1px"}}>⚠️</span>
      <div style={{flex:1}}>
        <p style={{fontSize:"0.8rem",fontWeight:700,color:"#fca5a5",margin:"0 0 3px"}}>Error al procesar</p>
        <p style={{fontSize:"0.76rem",color:"rgba(255,255,255,0.6)",margin:0,lineHeight:1.45}}>{message}</p>
      </div>
      <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",
        color:"rgba(255,255,255,0.25)",fontSize:"0.95rem",padding:"0 0 0 6px",flexShrink:0}} aria-label="Cerrar">✕</button>
      <style>{`@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
    </div>
  );
}

const STEPS = [
  { label: "Leyendo archivo",       pct: 10 },
  { label: "Enviando a Gemini",     pct: 25 },
  { label: "Analizando contenido",  pct: 50 },
  { label: "Extrayendo datos",      pct: 72 },
  { label: "Generando diseño",      pct: 88 },
  { label: "Finalizando sitio",     pct: 96 },
];

const CLIENT_TIMEOUT_MS = 55_000;

export function LoadingSkeleton() {
  const { uploadedFiles, niche, setBusinessData, setProcessing, setError, setStep } = useAppStore();
  const [progress,  setProgress]  = useState(STEPS[0].pct);
  const [stepLabel, setStepLabel] = useState(STEPS[0].label);
  const [toastMsg,  setToastMsg]  = useState<string | null>(null);
  const [done,      setDone]      = useState(false);

  const abortRef   = useRef<AbortController | null>(null);
  const timersRef  = useRef<ReturnType<typeof setTimeout>[]>([]);
  const stepIdxRef = useRef(0);

  const cleanup = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    abortRef.current?.abort();
  }, []);

  const handleError = useCallback((msg: string) => {
    cleanup();
    setDone(true);
    setProgress(0);
    console.error("[LoadingSkeleton] handleError:", msg);
    setToastMsg(msg);
    setError(msg);
    setProcessing(false);
    setTimeout(() => setStep("upload"), 1400);
  }, [cleanup, setError, setProcessing, setStep]);

  // Animar barra de progreso mientras espera la respuesta
  useEffect(() => {
    if (done) return;
    let cumDelay = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i < STEPS.length; i++) {
      cumDelay += 2800 + i * 2200;
      const delay = Math.min(cumDelay, CLIENT_TIMEOUT_MS - 5000);
      timers.push(setTimeout(() => {
        if (!done && stepIdxRef.current < i) {
          stepIdxRef.current = i;
          setProgress(STEPS[i].pct);
          setStepLabel(STEPS[i].label);
        }
      }, delay));
    }
    timersRef.current = timers;
    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  // Fetch al API
  useEffect(() => {
    if (!uploadedFiles.length || !niche) {
      handleError("No hay archivo o rubro seleccionado.");
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
      handleError("Tiempo de espera agotado (55 s). Probá con un archivo más pequeño.");
    }, CLIENT_TIMEOUT_MS);

    const run = async () => {
      try {
        const formData = new FormData();
        formData.append("niche", niche);
        uploadedFiles.forEach((file) => formData.append("files", file));

        const response = await fetch("/api/analyze", {
          method: "POST",
          body: formData,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // ── BUG #2 FIX ────────────────────────────────────────────────────────
        if (!response.ok) {
          let serverMsg: string | undefined;
          try {
            const errBody = await response.json();
            serverMsg = errBody?.error ?? errBody?.message;
          } catch { /* body no era JSON */ }
          handleError(httpErrorMessage(response.status, serverMsg));
          return;
        }

        // Parsear el body
        let responseBody: unknown;
        try {
          responseBody = await response.json();
        } catch {
          handleError("La respuesta del servidor no es JSON válido. Intentá de nuevo.");
          return;
        }

        // ── BUG #1 FIX ────────────────────────────────────────────────────────
        // route.ts devuelve { success: true, data: { businessName, ... } }
        // Hay que leer `.data` del envelope, NO el envelope directamente.
        const envelope = responseBody as { success?: boolean; data?: unknown; error?: string };

        if (!envelope.success) {
          handleError(envelope.error || "La IA no pudo procesar el archivo.");
          return;
        }

        const businessData = envelope.data;

        if (!businessData || typeof businessData !== "object") {
          handleError("La IA retornó una respuesta vacía. Probá con una imagen más clara.");
          return;
        }

        // ── Éxito ─────────────────────────────────────────────────────────────
        setDone(true);
        setProgress(100);
        setStepLabel("¡Listo! Abriendo editor…");
        setTimeout(() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setBusinessData(businessData as any);
        }, 600);

      } catch (err: unknown) {
        clearTimeout(timeoutId);
        if ((err as Error)?.name === "AbortError") return;
        const msg = err instanceof Error ? err.message : String(err);
        handleError(`Error de conexión: ${msg}`);
      }
    };

    run();
    return () => { clearTimeout(timeoutId); cleanup(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}

      <div className="flex flex-col items-center gap-8 py-8 px-4">
        {/* Orb */}
        <div className="relative flex items-center justify-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background:"linear-gradient(135deg,#7c3aed,#a21caf)", animation:"orbPulse 2s ease-in-out infinite" }}>
            <span style={{ fontSize:"2rem" }}>✨</span>
          </div>
          <div className="absolute inset-0 rounded-full"
            style={{ border:"2px solid transparent", borderTopColor:"#a78bfa", animation:"spin 1s linear infinite" }} />
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold mb-1" style={{ color:"#fafafa" }}>Gemini está analizando tu archivo</h2>
          <p className="text-sm" style={{ color:"#71717a" }}>Esto tarda entre 10 y 45 segundos</p>
        </div>

        {/* Barra de progreso */}
        <div className="w-full max-w-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium" style={{ color:"#a78bfa" }}>{stepLabel}</span>
            <span className="text-xs font-mono" style={{ color:"#52525b" }}>{progress}%</span>
          </div>
          <div className="w-full rounded-full overflow-hidden" style={{ height:"6px", backgroundColor:"#27272a" }}>
            <div className="h-full rounded-full"
              style={{ width:`${progress}%`, background:"linear-gradient(90deg,#7c3aed,#a21caf)", transition:"width 1.4s cubic-bezier(0.4,0,0.2,1)" }} />
          </div>
        </div>

        {/* Lista de pasos */}
        <div className="w-full max-w-sm space-y-2">
          {STEPS.map((s, i) => {
            const isDone    = progress > s.pct;
            const isCurrent = !isDone && progress >= (STEPS[i-1]?.pct ?? 0);
            return (
              <div key={s.label} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs"
                  style={{
                    backgroundColor: isDone ? "#7c3aed" : isCurrent ? "rgba(124,58,237,0.15)" : "#27272a",
                    border: isCurrent ? "1.5px solid #7c3aed" : "none", color:"#fff",
                  }}>
                  {isDone ? "✓" : isCurrent ? (
                    <span style={{ width:7, height:7, borderRadius:"50%", background:"#a78bfa", display:"block", animation:"blink 1.2s ease infinite" }} />
                  ) : ""}
                </div>
                <span className="text-xs" style={{ color: isDone ? "#d4d4d8" : isCurrent ? "#a78bfa" : "#3f3f46" }}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-center max-w-xs" style={{ color:"#3f3f46" }}>
          💡 Imágenes bien iluminadas y con texto legible mejoran la extracción
        </p>

        <style>{`
          @keyframes spin { to { transform:rotate(360deg); } }
          @keyframes orbPulse { 0%,100%{box-shadow:0 0 0 0 rgba(124,58,237,0.4)} 50%{box-shadow:0 0 0 16px rgba(124,58,237,0)} }
          @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        `}</style>
      </div>
    </>
  );
}

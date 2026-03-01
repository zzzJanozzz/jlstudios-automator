// src/components/DropZone.tsx
"use client";

import { useCallback, useRef, useState } from "react";
import { useAppStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, FileSpreadsheet, ImageIcon, Pencil, Loader2 } from "lucide-react";

// ── Accepted file types ───────────────────────────────────────────────────────
const ACCEPTED_TYPES: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  "image/jpeg":                                  { label: "JPG / JPEG",   icon: <ImageIcon       size={14} />, color: "#a78bfa" },
  "image/png":                                   { label: "PNG",          icon: <ImageIcon       size={14} />, color: "#a78bfa" },
  "image/webp":                                  { label: "WEBP",         icon: <ImageIcon       size={14} />, color: "#a78bfa" },
  "application/pdf":                             { label: "PDF",          icon: <FileText        size={14} />, color: "#f97316" },
  "application/msword":                          { label: "DOC",          icon: <FileText        size={14} />, color: "#3b82f6" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                                                 { label: "DOCX",         icon: <FileText        size={14} />, color: "#3b82f6" },
  "application/vnd.ms-excel":                   { label: "XLS",          icon: <FileSpreadsheet size={14} />, color: "#22c55e" },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                                                 { label: "XLSX",         icon: <FileSpreadsheet size={14} />, color: "#22c55e" },
};

const ACCEPT_ATTR = Object.keys(ACCEPTED_TYPES).join(",");

function isAccepted(file: File): boolean {
  return file.type in ACCEPTED_TYPES;
}

function FileTag({ type }: { type: string }) {
  const info = ACCEPTED_TYPES[type];
  if (!info) return null;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold"
      style={{ backgroundColor: `${info.color}18`, color: info.color, border: `1px solid ${info.color}30` }}
    >
      {info.icon} {info.label}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function DropZone() {
  const { niche, setUploadedFiles, setStep, setProcessing, createFromScratch } = useAppStore();
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles]           = useState<File[]>([]);
  const [error, setError]           = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Drag handlers ─────────────────────────────────────────────────────────
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(Array.from(e.dataTransfer.files));
  }, []); // eslint-disable-line

  const handleFiles = useCallback((incoming: File[]) => {
    setError(null);
    const valid   = incoming.filter(isAccepted);
    const invalid = incoming.filter((f) => !isAccepted(f));

    if (invalid.length > 0) {
      setError(`Tipo de archivo no soportado: ${invalid.map((f) => f.name).join(", ")}`);
    }
    if (valid.length === 0) return;

    // Max 5 files, 20 MB each
    const oversized = valid.filter((f) => f.size > 20 * 1024 * 1024);
    if (oversized.length > 0) {
      setError(`Archivo muy grande (máx. 20 MB): ${oversized.map((f) => f.name).join(", ")}`);
      return;
    }

    setFiles(valid.slice(0, 5));
  }, []);

  // ── Process with AI ───────────────────────────────────────────────────────
  const handleProcess = useCallback(() => {
    if (files.length === 0 || !niche) return;
    setUploadedFiles(files);
    setProcessing(true);
    setStep("processing");
  }, [files, niche, setUploadedFiles, setProcessing, setStep]);

  // ── Create from scratch (bypass AI) ──────────────────────────────────────
  const handleManual = useCallback(() => {
    if (!niche) return;
    createFromScratch(niche);
  }, [niche, createFromScratch]);

  return (
    <div className="glass-panel p-6 space-y-5">
      <div>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "#fafafa" }}>
          2. Subí tu archivo o creá desde cero
        </h3>
        <p className="text-xs" style={{ color: "#71717a" }}>
          La IA extrae nombre, productos, precios y diseño automáticamente.
        </p>
      </div>

      {/* ── Drop area ── */}
      <div
        className="relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer"
        style={{
          borderColor:     isDragging ? "#7c3aed"  : files.length > 0 ? "#6d28d9" : "#3f3f46",
          backgroundColor: isDragging ? "rgba(124,58,237,0.06)" : "rgba(255,255,255,0.015)",
          minHeight: "160px",
        }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_ATTR}
          multiple
          className="hidden"
          onChange={(e) => handleFiles(Array.from(e.target.files ?? []))}
        />

        <AnimatePresence mode="wait">
          {files.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}
              >
                <Upload size={20} color="#7c3aed" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium mb-1" style={{ color: "#e4e4e7" }}>
                  Arrastrá o hacé click para subir
                </p>
                <p className="text-xs" style={{ color: "#71717a" }}>
                  Fotos de menú, catálogos, listas de precios
                </p>
              </div>
              {/* Accepted format badges */}
              <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                {Object.values(ACCEPTED_TYPES)
                  .filter((v, i, a) => a.findIndex(x => x.label === v.label) === i)
                  .map((info) => (
                    <span
                      key={info.label}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium"
                      style={{ backgroundColor: `${info.color}12`, color: info.color }}
                    >
                      {info.icon} {info.label}
                    </span>
                  ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="files"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 space-y-2"
            >
              {files.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                  style={{ backgroundColor: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}
                >
                  <div style={{ flexShrink: 0 }}>
                    <FileTag type={file.type} />
                  </div>
                  <span className="text-xs flex-1 truncate" style={{ color: "#d4d4d8" }}>
                    {file.name}
                  </span>
                  <span className="text-[10px] shrink-0" style={{ color: "#71717a" }}>
                    {(file.size / 1024).toFixed(0)} KB
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFiles((prev) => prev.filter((_, j) => j !== i));
                    }}
                    className="shrink-0 text-[10px] px-1.5 py-0.5 rounded"
                    style={{ color: "#71717a", backgroundColor: "rgba(255,255,255,0.05)" }}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <p
                className="text-[10px] text-center pt-1 cursor-pointer"
                style={{ color: "#52525b" }}
                onClick={() => inputRef.current?.click()}
              >
                + Agregar más archivos (hasta 5)
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs px-3 py-2 rounded-lg"
            style={{ backgroundColor: "rgba(239,68,68,0.08)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            ⚠️ {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── Primary CTA: Process with AI ── */}
      <button
        onClick={handleProcess}
        disabled={files.length === 0}
        className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200"
        style={{
          background:    files.length > 0 ? "linear-gradient(135deg,#7c3aed,#a21caf)" : "#27272a",
          color:         files.length > 0 ? "#fff" : "#52525b",
          cursor:        files.length > 0 ? "pointer" : "not-allowed",
          boxShadow:     files.length > 0 ? "0 4px 24px rgba(124,58,237,0.35)" : "none",
        }}
      >
        <Loader2 size={15} className={files.length > 0 ? "" : "hidden"} />
        {files.length > 0
          ? `✨ Generar sitio con IA (${files.length} archivo${files.length > 1 ? "s" : ""})`
          : "Seleccioná archivos para continuar"}
      </button>

      {/* ── Divider ── */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ backgroundColor: "#27272a" }} />
        <span className="text-xs" style={{ color: "#52525b" }}>o</span>
        <div className="flex-1 h-px" style={{ backgroundColor: "#27272a" }} />
      </div>

      {/* ── Secondary CTA: Manual / from scratch ── */}
      <button
        onClick={handleManual}
        className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 border"
        style={{
          borderColor:     "#3f3f46",
          color:           "#a1a1aa",
          backgroundColor: "transparent",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#7c3aed";
          e.currentTarget.style.color = "#d4d4d8";
          e.currentTarget.style.backgroundColor = "rgba(124,58,237,0.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#3f3f46";
          e.currentTarget.style.color = "#a1a1aa";
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <Pencil size={14} />
        Crear desde cero manualmente
      </button>

      <p className="text-[10px] text-center" style={{ color: "#3f3f46" }}>
        Sin IA · Completás nombre, servicios y precios a mano en el editor
      </p>
    </div>
  );
}

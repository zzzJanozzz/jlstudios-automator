// src/components/DropZone.tsx

"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useAppStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export function DropZone() {
  const {
    niche,
    uploadedFiles,
    setUploadedFiles,
    setStep,
    setBusinessData,
    setProcessing,
    setError,
  } = useAppStore();

  const [additionalContext, setAdditionalContext] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const allFiles = [...uploadedFiles, ...acceptedFiles].slice(0, 5);
      setUploadedFiles(allFiles);

      // Generar previews
      const newPreviews = allFiles.map((f) => URL.createObjectURL(f));
      setPreviews(newPreviews);
    },
    [uploadedFiles, setUploadedFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/heic": [".heic"],
    },
    maxSize: 20 * 1024 * 1024, // 20MB
    maxFiles: 5,
    onDropRejected: (rejections) => {
      rejections.forEach((r) => {
        r.errors.forEach((e) => {
          if (e.code === "file-too-large") {
            toast.error("Archivo demasiado grande. Máximo 20MB.");
          } else if (e.code === "file-invalid-type") {
            toast.error("Formato no soportado. Usá JPG, PNG o WebP.");
          }
        });
      });
    },
  });

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleAnalyze = async () => {
    if (uploadedFiles.length === 0 || !niche) return;

    setStep("processing");
    setProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("niche", niche);

      if (additionalContext.trim()) {
        formData.append("context", additionalContext.trim());
      }

      uploadedFiles.forEach((file, i) => {
        formData.append(`file${i}`, file);
      });

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Error desconocido al analizar.");
      }

      setBusinessData(result.data);
      toast.success("¡Análisis completado! Datos extraídos con éxito.");
    } catch (err: any) {
      console.error("[DropZone] Error:", err);
      setError(err.message);
      setStep("upload");
      toast.error(err.message || "Error al procesar las imágenes.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="glass-panel p-6 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-white">
          2. Subí las fotos del negocio
        </h3>
        <p className="text-xs text-zinc-500 mt-0.5">
          Menús, catálogos, listas de precios, folletos — hasta 5 imágenes.
        </p>
      </div>

      {/* Drop Area */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center
          cursor-pointer transition-all duration-300
          ${
            isDragActive
              ? "border-violet-500 bg-violet-500/10"
              : "border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/30"
          }
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-3">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
              isDragActive ? "bg-violet-500/20" : "bg-zinc-800"
            }`}
          >
            <svg
              className={`w-6 h-6 ${isDragActive ? "text-violet-400" : "text-zinc-400"}`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>

          <div>
            <p className="text-sm text-zinc-300">
              {isDragActive ? (
                <span className="text-violet-400 font-medium">Soltá las imágenes acá</span>
              ) : (
                <>
                  <span className="text-violet-400 font-medium">Hacé click para subir</span> o
                  arrastrá y soltá
                </>
              )}
            </p>
            <p className="text-xs text-zinc-600 mt-1">
              JPG, PNG, WebP o HEIC — Máximo 20MB cada una
            </p>
          </div>
        </div>
      </div>

      {/* Previews */}
      <AnimatePresence>
        {previews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-3 flex-wrap"
          >
            {previews.map((src, i) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group"
              >
                <img
                  src={src}
                  alt={`Preview ${i + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(i);
                  }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white
                             text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100
                             transition-opacity"
                >
                  ✕
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[9px] text-zinc-300 text-center py-0.5 rounded-b-lg">
                  {(uploadedFiles[i]?.size / 1024 / 1024).toFixed(1)}MB
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contexto adicional */}
      <div>
        <label className="label-text mb-1.5 block">
          Contexto adicional (opcional)
        </label>
        <textarea
          value={additionalContext}
          onChange={(e) => setAdditionalContext(e.target.value)}
          placeholder='Ej: "El negocio se llama La Esquina Gourmet, queda en Palermo, el estilo es moderno e industrial..."'
          rows={2}
          className="input-field resize-none"
        />
      </div>

      {/* Botón de Análisis */}
      <button
        onClick={handleAnalyze}
        disabled={uploadedFiles.length === 0}
        className="btn-primary w-full py-3 text-base font-semibold"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
        </svg>
        Analizar con IA — Generar sitio web
      </button>
    </div>
  );
}
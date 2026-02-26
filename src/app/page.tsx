// src/app/page.tsx (continuación completa)

"use client";

import { useAppStore } from "@/lib/store";
import { NicheSelector } from "@/components/NicheSelector";
import { DropZone } from "@/components/DropZone";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { DesignStudio } from "@/components/DesignStudio";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { step, niche, reset } = useAppStore();

  return (
    <div className="min-h-screen flex flex-col">
      {/* ═══ Header ═══ */}
      <header className="sticky top-0 z-50 glass-panel border-t-0 border-x-0 rounded-none px-6 py-3">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm">
              JL
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white">
                JLStudios Web Automator
              </h1>
              <p className="text-[11px] text-zinc-500">Next-Gen Engine v2.0</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Indicador de paso actual */}
            <div className="hidden sm:flex items-center gap-1">
              {(["upload", "processing", "editing", "exporting"] as const).map(
                (s, i) => (
                  <div key={s} className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        step === s
                          ? "bg-violet-500 scale-125"
                          : (["upload", "processing", "editing", "exporting"] as const).indexOf(step) > i
                          ? "bg-violet-500/40"
                          : "bg-zinc-700"
                      }`}
                    />
                    {i < 3 && (
                      <div
                        className={`w-6 h-px transition-colors ${
                          (["upload", "processing", "editing", "exporting"] as const).indexOf(step) > i
                            ? "bg-violet-500/40"
                            : "bg-zinc-700"
                        }`}
                      />
                    )}
                  </div>
                )
              )}
            </div>

            {step !== "upload" && (
              <button onClick={reset} className="btn-secondary text-xs py-1.5 px-3">
                ✕ Nuevo proyecto
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ═══ Contenido principal ═══ */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {step === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="max-w-4xl mx-auto px-6 py-16"
            >
              {/* Hero */}
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-6"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                  Motor de IA Activo
                </motion.div>

                <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
                  Foto a{" "}
                  <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                    Website Premium
                  </span>
                  <br />
                  en minutos.
                </h2>

                <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                  Subí una foto del menú, catálogo o lista de servicios de tu
                  cliente. La IA extrae los datos, diseña el sitio y lo exporta
                  listo para subir.
                </p>
              </div>

              {/* Paso 1: Selector de nicho */}
              <div className="mb-10">
                <NicheSelector />
              </div>

              {/* Paso 2: DropZone (solo visible si se seleccionó nicho) */}
              <AnimatePresence>
                {niche && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <DropZone />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {step === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto px-6 py-24"
            >
              <LoadingSkeleton />
            </motion.div>
          )}

          {(step === "editing" || step === "exporting") && (
            <motion.div
              key="editing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[calc(100vh-52px)]"
            >
              <DesignStudio />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
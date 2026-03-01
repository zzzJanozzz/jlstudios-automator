// src/app/page.tsx
// ── No changes to page.tsx structure required ──
// The "crear desde cero" flow is handled inside DropZone.tsx via createFromScratch().
// page.tsx already renders <DropZone /> when a niche is selected, so the button
// appears naturally inside the existing upload step.
//
// Only change: description text updated to reflect multi-format support.
"use client";

import { useAppStore } from "@/lib/store";
import { NicheSelector } from "@/components/NicheSelector";
import { DropZone } from "@/components/DropZone";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { DesignStudio } from "@/components/DesignStudio";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = ["upload", "processing", "editing", "exporting"] as const;

export default function Home() {
  const { step, niche, reset } = useAppStore();
  const currentStepIndex = STEPS.indexOf(step);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#09090b" }}>

      {/* ═══ Header ═══ */}
      <header
        className="sticky top-0 z-50 px-6 py-3"
        style={{
          backgroundColor: "rgb(9 9 11 / 0.9)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid #27272a",
        }}
      >
        <div className="max-w-450 mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
              style={{ background: "linear-gradient(135deg, #7c3aed, #c026d3)" }}
            >
              JL
            </div>
            <div>
              <h1 className="text-sm font-semibold" style={{ color: "#fafafa" }}>
                JLStudios Web Automator
              </h1>
              <p className="text-[10px]" style={{ color: "#71717a" }}>
                Next-Gen Engine v2.3
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-1.5">
                  <div
                    className="rounded-full transition-all duration-300"
                    style={{
                      width:  step === s ? "8px" : "6px",
                      height: step === s ? "8px" : "6px",
                      backgroundColor:
                        step === s
                          ? "#7c3aed"
                          : currentStepIndex > i
                          ? "rgb(124 58 237 / 0.4)"
                          : "#3f3f46",
                    }}
                  />
                  {i < STEPS.length - 1 && (
                    <div
                      style={{
                        width: "20px", height: "1px",
                        backgroundColor: currentStepIndex > i ? "rgb(124 58 237 / 0.4)" : "#27272a",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
            {step !== "upload" && (
              <button onClick={reset} className="btn-secondary text-xs py-1.5 px-3">
                ✕ Nuevo proyecto
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ═══ Main ═══ */}
      <main className="flex-1" style={{ backgroundColor: "#09090b" }}>
        <AnimatePresence mode="wait">

          {step === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="max-w-4xl mx-auto px-6 py-16"
            >
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
                  style={{
                    backgroundColor: "rgb(109 40 217 / 0.1)",
                    border: "1px solid rgb(109 40 217 / 0.25)",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#a78bfa" }} />
                  <span className="text-xs font-medium" style={{ color: "#a78bfa" }}>
                    Motor de IA Activo · Gemini 2.5 Flash
                  </span>
                </motion.div>

                <h2
                  className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight leading-tight"
                  style={{ color: "#fafafa" }}
                >
                  Archivo a{" "}
                  <span
                    style={{
                      background: "linear-gradient(135deg, #a78bfa, #e879f9)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Website Premium
                  </span>
                  <br />
                  en minutos.
                </h2>

                <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "#a1a1aa" }}>
                  Subí una foto, PDF, Word o Excel con tu menú, servicios o precios.
                  La IA extrae todo y diseña el sitio. O creá desde cero manualmente.
                </p>
              </div>

              <div className="mb-8">
                <NicheSelector />
              </div>

              <AnimatePresence>
                {niche && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35 }}
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
              style={{ height: "calc(100vh - 53px)" }}
            >
              <DesignStudio />
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

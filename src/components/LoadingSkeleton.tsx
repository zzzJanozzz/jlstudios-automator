// src/components/LoadingSkeleton.tsx

"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const LOADING_PHASES = [
  { label: "Enviando imágenes al motor de IA...", icon: "📡", progress: 15 },
  { label: "Analizando contenido visual...", icon: "🔍", progress: 30 },
  { label: "Extrayendo datos y precios...", icon: "📋", progress: 50 },
  { label: "Generando descripciones comerciales...", icon: "✍️", progress: 70 },
  { label: "Diseñando sistema de colores y tipografías...", icon: "🎨", progress: 85 },
  { label: "Armando tu sitio web premium...", icon: "🚀", progress: 95 },
];

export function LoadingSkeleton() {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseIndex((prev) =>
        prev < LOADING_PHASES.length - 1 ? prev + 1 : prev
      );
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const phase = LOADING_PHASES[phaseIndex];

  return (
    <div className="flex flex-col items-center text-center">
      {/* Animación central */}
      <div className="relative w-32 h-32 mb-8">
        {/* Anillo exterior */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-violet-500/30"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        />
        {/* Anillo medio */}
        <motion.div
          className="absolute inset-3 rounded-full border-2 border-t-violet-500 border-r-transparent border-b-transparent border-l-transparent"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        />
        {/* Anillo interior */}
        <motion.div
          className="absolute inset-6 rounded-full border-2 border-b-fuchsia-500 border-t-transparent border-r-transparent border-l-transparent"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        />
        {/* Icono central */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            key={phase.icon}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-3xl"
          >
            {phase.icon}
          </motion.span>
        </div>
      </div>

      {/* Texto de estado */}
      <motion.p
        key={phase.label}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg font-medium text-white mb-2"
      >
        {phase.label}
      </motion.p>

      <p className="text-sm text-zinc-500 mb-8">
        Esto toma entre 10 y 30 segundos dependiendo de la complejidad.
      </p>

      {/* Barra de progreso */}
      <div className="w-full max-w-md">
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
            initial={{ width: "5%" }}
            animate={{ width: `${phase.progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs text-zinc-600 mt-2 text-right">{phase.progress}%</p>
      </div>

      {/* Skeleton preview del sitio que se está generando */}
      <div className="mt-12 w-full max-w-lg glass-panel p-4 space-y-3">
        <div className="shimmer-bg h-5 w-2/3 rounded" />
        <div className="shimmer-bg h-3 w-full rounded" />
        <div className="shimmer-bg h-3 w-5/6 rounded" />
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="shimmer-bg h-20 rounded-lg" />
              <div className="shimmer-bg h-3 w-3/4 rounded" />
              <div className="shimmer-bg h-3 w-1/2 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
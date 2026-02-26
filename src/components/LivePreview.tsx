"use client";

import { useAppStore } from "@/lib/store";
import { renderPremiumStarter } from "@/templates/premium-starter";
import { useEffect, useState, useRef } from "react";
import { Monitor, Smartphone, RefreshCw, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function LivePreview() {
  const { businessData } = useAppStore();
  const [htmlContent, setHtmlContent] = useState("");
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");
  const [isSyncing, setIsSyncing] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Efecto de renderizado reactivo
  useEffect(() => {
    if (businessData) {
      setIsSyncing(true);
      // Generamos el HTML usando el motor de plantillas premium
      const generated = renderPremiumStarter(businessData);
      setHtmlContent(generated);
      
      // Pequeño delay visual para el indicador de sincronización
      const timer = setTimeout(() => setIsSyncing(false), 400);
      return () => clearTimeout(timer);
    }
  }, [businessData]);

  if (!businessData) return null;

  return (
    <div className="flex flex-col items-center w-full h-full p-4 overflow-hidden">
      
      {/* ─── BARRA DE HERRAMIENTAS DE PREVIEW ─── */}
      <div className="flex items-center justify-between w-full max-w-5xl mb-6 bg-zinc-900/80 border border-zinc-800 p-2 rounded-2xl backdrop-blur-md shadow-xl">
        
        {/* Indicador de Estado */}
        <div className="flex items-center gap-3 px-3">
          <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'}`} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            {isSyncing ? 'Sincronizando...' : 'Live Preview'}
          </span>
        </div>

        {/* Toggles de Dispositivo */}
        <div className="flex bg-zinc-800/50 p-1 rounded-xl border border-zinc-700/50">
          <button
            onClick={() => setDevice("mobile")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              device === "mobile" 
              ? "bg-violet-600 text-white shadow-lg" 
              : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Smartphone size={14} /> Mobile
          </button>
          <button
            onClick={() => setDevice("desktop")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              device === "desktop" 
              ? "bg-violet-600 text-white shadow-lg" 
              : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Monitor size={14} /> Desktop
          </button>
        </div>

        {/* Acciones Rápidas */}
        <div className="flex gap-2">
           <button 
             onClick={() => {
               const win = window.open();
               win?.document.write(htmlContent);
             }}
             className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors"
             title="Abrir en pestaña nueva"
           >
             <ExternalLink size={16} />
           </button>
        </div>
      </div>

      {/* ─── ÁREA DEL SIMULADOR ─── */}
      
      <div className="flex-1 w-full flex items-center justify-center relative" style={{ perspective: '1000px' }}
        
        >
        <AnimatePresence mode="wait">
          <motion.div
            key={device}
            initial={{ opacity: 0, scale: 0.95, rotateX: 5 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className={`
              relative bg-zinc-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-zinc-800
              ${device === "mobile" 
                ? "w-[375px] h-[780px] rounded-[3.5rem] border-[12px] border-zinc-900 outline-2 outline-zinc-800" 
                : "w-full max-w-6xl h-full max-h-[750px] rounded-2xl border-[8px]"
              }
              overflow-hidden transition-all duration-700
            `}
          >
            {/* Elementos Estéticos del Celular (Notch) */}
            {device === "mobile" && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-zinc-900 rounded-b-3xl z-30 flex items-center justify-center">
                <div className="w-12 h-1.5 bg-zinc-800 rounded-full" />
              </div>
            )}

            {/* Iframe del sitio */}
            <iframe
              ref={iframeRef}
              title="JLStudios Preview"
              srcDoc={htmlContent}
              className="w-full h-full bg-white transition-opacity duration-300"
              sandbox="allow-scripts allow-same-origin"
            />

            {/* Overlay de carga suave */}
            {isSyncing && (
              <div className="absolute inset-0 bg-zinc-950/20 backdrop-blur-[2px] pointer-events-none flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-violet-500 animate-spin opacity-40" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Decoración: Reflejo en el suelo (opcional para estilo Apple) */}
        <div className="absolute bottom-[-100px] w-full h-40 bg-gradient-to-t from-transparent via-violet-500/5 to-transparent blur-3xl pointer-events-none" />
      </div>

      {/* Footer del Preview */}
      <div className="mt-6 flex items-center gap-6 text-[10px] text-zinc-600 font-medium uppercase tracking-widest">
        <span>Resolución: {device === "mobile" ? "375x812 (iPhone 13/14)" : "Dynamic Desktop"}</span>
        <div className="w-1 h-1 bg-zinc-800 rounded-full" />
        <span>FPS: 60 (Optimized)</span>
      </div>
    </div>
  );
}
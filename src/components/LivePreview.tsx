// src/components/LivePreview.tsx
"use client";

import { useAppStore } from "@/lib/store";
import { renderPremiumStarter } from "@/templates/premium-starter";
import { useEffect, useState, useRef, useCallback } from "react";
import { Monitor, Smartphone, RefreshCw, ExternalLink, ZoomIn, ZoomOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Device configs
const DEVICES = {
  mobile: { width: 390, height: 844, label: "iPhone 14 Pro", scale: 0.72 },
  tablet: { width: 768, height: 1024, label: "iPad", scale: 0.55 },
  desktop: { width: 1280, height: 800, label: "Desktop", scale: 1 },
} as const;

type DeviceKey = keyof typeof DEVICES;

export function LivePreview() {
  const { businessData } = useAppStore();
  const [htmlContent, setHtmlContent] = useState("");
  const [device, setDevice] = useState<DeviceKey>("mobile");
  const [isSyncing, setIsSyncing] = useState(false);
  const [renderKey, setRenderKey] = useState(0); // Force iframe remount on content change
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ w: 800, h: 600 });

  // Measure available container space for scaling
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setContainerSize({
          w: containerRef.current.clientWidth,
          h: containerRef.current.clientHeight,
        });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Re-render HTML whenever businessData changes
  useEffect(() => {
    if (!businessData) return;
    setIsSyncing(true);
    // Slight timeout so the UI can show the syncing indicator
    const t = setTimeout(() => {
      const html = renderPremiumStarter(businessData);
      setHtmlContent(html);
      setRenderKey((k) => k + 1);
      setIsSyncing(false);
    }, 80);
    return () => clearTimeout(t);
  }, [businessData]);

  // Compute scale so the simulated device fits inside the container
  const computedScale = useCallback((): number => {
    const dev = DEVICES[device];
    const padH = 80; // toolbar
    const padV = 96; // top + bottom padding
    const availW = containerSize.w - padH;
    const availH = containerSize.h - padV;
    const scaleW = availW / dev.width;
    const scaleH = availH / dev.height;
    return Math.min(scaleW, scaleH, 1); // never upscale
  }, [device, containerSize]);

  const scale = computedScale();
  const dev = DEVICES[device];

  const openExternal = useCallback(() => {
    const win = window.open("", "_blank");
    if (win && htmlContent) {
      win.document.open();
      win.document.write(htmlContent);
      win.document.close();
    }
  }, [htmlContent]);

  if (!businessData) return null;

  return (
    <div className="flex flex-col w-full h-full overflow-hidden bg-zinc-950">
      {/* ── TOOLBAR ── */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur-sm">
        {/* Status indicator */}
        <div className="flex items-center gap-2.5 min-w-[120px]">
          <div
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              isSyncing
                ? "bg-amber-400 animate-pulse"
                : "bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
            }`}
          />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            {isSyncing ? "Sincronizando…" : "Live Preview"}
          </span>
        </div>

        {/* Device selector */}
        <div className="flex items-center gap-1 bg-zinc-800/60 border border-zinc-700/50 p-1 rounded-xl">
          <button
            onClick={() => setDevice("mobile")}
            title="Mobile"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              device === "mobile"
                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Smartphone size={13} />
            <span className="hidden sm:inline">Mobile</span>
          </button>
          <button
            onClick={() => setDevice("tablet")}
            title="Tablet"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              device === "tablet"
                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Monitor size={13} />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            onClick={() => setDevice("desktop")}
            title="Desktop"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              device === "desktop"
                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Monitor size={14} />
            <span className="hidden sm:inline">Desktop</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 min-w-[120px] justify-end">
          <span className="text-[10px] text-zinc-600 font-mono hidden md:inline">
            {dev.width}×{dev.height} · {Math.round(scale * 100)}%
          </span>
          <button
            onClick={openExternal}
            title="Abrir en nueva pestaña"
            className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <ExternalLink size={15} />
          </button>
          <button
            onClick={() => setRenderKey((k) => k + 1)}
            title="Forzar recarga"
            className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <RefreshCw size={15} className={isSyncing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* ── CANVAS ── */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center overflow-hidden relative"
        style={{
          background:
            "radial-gradient(ellipse at 60% 40%, rgba(109,40,217,0.05) 0%, transparent 60%), #09090b",
          backgroundImage:
            "radial-gradient(ellipse at 60% 40%, rgba(109,40,217,0.05) 0%, transparent 60%), linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 32px 32px, 32px 32px",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={device}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.03, y: -8 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            style={{
              width: dev.width,
              height: dev.height,
              transform: `scale(${scale})`,
              transformOrigin: "center center",
              flexShrink: 0,
            }}
            className={`relative bg-zinc-900 overflow-hidden shadow-2xl ${
              device === "mobile"
                ? "rounded-[48px] border-[10px] border-zinc-800 ring-1 ring-zinc-700/50"
                : device === "tablet"
                ? "rounded-[24px] border-[8px] border-zinc-800 ring-1 ring-zinc-700/50"
                : "rounded-xl border-[4px] border-zinc-800"
            }`}
          >
            {/* Mobile notch */}
            {device === "mobile" && (
              <div className="absolute top-0 inset-x-0 flex justify-center z-30 pointer-events-none">
                <div className="w-36 h-8 bg-zinc-800 rounded-b-3xl flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-zinc-700" />
                  <div className="w-16 h-1.5 bg-zinc-700 rounded-full" />
                </div>
              </div>
            )}

            {/* Tablet camera bar */}
            {device === "tablet" && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
              </div>
            )}

            {/* THE IFRAME — key forces full remount to prevent stale CSS */}
            <iframe
              key={`${device}-${renderKey}`}
              ref={iframeRef}
              title="JLStudios Site Preview"
              srcDoc={htmlContent}
              className={`w-full h-full bg-white ${device === "mobile" ? "pt-8" : ""}`}
              sandbox="allow-scripts allow-same-origin allow-popups"
              loading="eager"
            />

            {/* Loading overlay */}
            <AnimatePresence>
              {isSyncing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-zinc-950/30 backdrop-blur-[1px] flex items-center justify-center z-40 pointer-events-none"
                >
                  <div className="bg-zinc-900/90 border border-zinc-700 rounded-xl px-4 py-3 flex items-center gap-2.5">
                    <RefreshCw size={14} className="text-violet-400 animate-spin" />
                    <span className="text-xs text-zinc-300 font-medium">Actualizando…</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Floor reflection */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(109,40,217,0.04), transparent)",
            filter: "blur(20px)",
          }}
        />
      </div>

      {/* ── STATUS BAR ── */}
      <div className="flex-shrink-0 flex items-center justify-center gap-4 py-2 border-t border-zinc-800/50 bg-zinc-900/30">
        <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest">
          {dev.label}
        </span>
        <div className="w-1 h-1 rounded-full bg-zinc-700" />
        <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest">
          {dev.width} × {dev.height}
        </span>
        <div className="w-1 h-1 rounded-full bg-zinc-700" />
        <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest">
          Zoom {Math.round(scale * 100)}%
        </span>
      </div>
    </div>
  );
}

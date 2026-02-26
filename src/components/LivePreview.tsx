// src/components/LivePreview.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAppStore } from "@/lib/store";
import { renderPremiumStarter } from "@/templates/premium-starter";

type Device = "mobile" | "tablet" | "desktop";

const DEVICES: Record<Device, { width: number; height: number; label: string }> = {
  mobile:  { width: 390,  height: 844,  label: "iPhone" },
  tablet:  { width: 768,  height: 1024, label: "iPad" },
  desktop: { width: 1280, height: 800,  label: "Desktop" },
};

export function LivePreview() {
  const { businessData } = useAppStore();
  const [device, setDevice]       = useState<Device>("mobile");
  const [htmlContent, setContent] = useState("");
  const [renderKey, setKey]       = useState(0);
  const [isSyncing, setSyncing]   = useState(false);
  const containerRef              = useRef<HTMLDivElement>(null);
  const [scale, setScale]         = useState(1);

  // Regenerate HTML whenever businessData changes
  useEffect(() => {
    if (!businessData) return;
    setSyncing(true);
    const t = setTimeout(() => {
      setContent(renderPremiumStarter(businessData));
      setKey(k => k + 1);   // Forces iframe DOM remount → clears stale CSS vars
      setSyncing(false);
    }, 80);
    return () => clearTimeout(t);
  }, [businessData]);

  // Compute scale to fit device frame in available container
  const computeScale = useCallback(() => {
    if (!containerRef.current) return;
    const dev    = DEVICES[device];
    const rect   = containerRef.current.getBoundingClientRect();
    const availW = rect.width  - 48;
    const availH = rect.height - 80;
    const scaleW = availW / dev.width;
    const scaleH = availH / dev.height;
    setScale(Math.min(scaleW, scaleH, 1));
  }, [device]);

  useEffect(() => {
    computeScale();
    const ro = new ResizeObserver(computeScale);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [computeScale]);

  const dev = DEVICES[device];

  if (!businessData) {
    return (
      <div className="flex items-center justify-center h-full" style={{ color: "#52525b" }}>
        <p className="text-sm">El preview aparecerá aquí tras el análisis</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: "#0c0c0d" }}>
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-4 py-2 flex-shrink-0"
        style={{ borderBottom: "1px solid #27272a" }}
      >
        {/* Device selector */}
        <div className="flex gap-1">
          {(["mobile", "tablet", "desktop"] as Device[]).map(d => (
            <button
              key={d}
              onClick={() => setDevice(d)}
              className="px-3 py-1 rounded text-xs font-medium transition-colors"
              style={{
                backgroundColor: device === d ? "#27272a" : "transparent",
                color:           device === d ? "#fafafa"  : "#71717a",
              }}
            >
              {d === "mobile" ? "📱" : d === "tablet" ? "📲" : "🖥️"} {DEVICES[d].label}
            </button>
          ))}
        </div>

        {/* Status + actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "#71717a" }}>
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: isSyncing ? "#f59e0b" : "#22c55e",
                animation: isSyncing ? "pulse 1s infinite" : "none",
              }}
            />
            {isSyncing ? "Sincronizando..." : "En vivo"}
          </div>
          <span className="text-xs" style={{ color: "#52525b" }}>
            {dev.width}×{dev.height} · {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => { setKey(k => k + 1); }}
            className="text-xs px-2 py-1 rounded transition-colors"
            style={{ color: "#a1a1aa", backgroundColor: "#18181b", border: "1px solid #27272a" }}
            title="Forzar recarga"
          >
            ↺
          </button>
          <button
            onClick={() => {
              const w = window.open("", "_blank");
              if (w) { w.document.write(htmlContent); w.document.close(); }
            }}
            className="text-xs px-2 py-1 rounded transition-colors"
            style={{ color: "#a1a1aa", backgroundColor: "#18181b", border: "1px solid #27272a" }}
          >
            ↗ Abrir
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div ref={containerRef} className="flex-1 flex items-center justify-center overflow-hidden relative p-6">
        {/* Syncing overlay */}
        {isSyncing && (
          <div
            className="absolute inset-0 flex items-center justify-center z-10"
            style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
          >
            <span className="text-sm" style={{ color: "#a1a1aa" }}>Actualizando preview...</span>
          </div>
        )}

        {/* Device frame */}
        <div
          style={{
            width:         `${dev.width}px`,
            height:        `${dev.height}px`,
            transform:     `scale(${scale})`,
            transformOrigin: "top center",
            borderRadius:  device === "mobile" ? "36px" : device === "tablet" ? "20px" : "8px",
            overflow:      "hidden",
            boxShadow:     "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07)",
            border:        "8px solid #1a1a1a",
            position:      "relative",
            flexShrink:    0,
          }}
        >
          {/* Notch — mobile only */}
          {device === "mobile" && (
            <div
              style={{
                position:        "absolute",
                top:             "0",
                left:            "50%",
                transform:       "translateX(-50%)",
                width:           "120px",
                height:          "28px",
                backgroundColor: "#1a1a1a",
                borderRadius:    "0 0 20px 20px",
                zIndex:          10,
              }}
            />
          )}

          <iframe
            key={`${device}-${renderKey}`}
            srcDoc={htmlContent}
            style={{
              width:   "100%",
              height:  "100%",
              border:  "none",
              display: "block",
              backgroundColor: "#fff",
            }}
            title={`Preview — ${businessData.businessName}`}
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}

// src/components/LivePreview.tsx  v2.4
// Changes:
//  • iPhone frame con chrome real: notch dinámico, botones laterales, barra inferior
//  • iPad frame con esquinas y botón home
//  • Escala automática que centra el dispositivo correctamente
//  • Barra de URL falsa dentro del frame para mayor realismo
//  • Indicador de sincronización mejorado
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAppStore } from "@/lib/store";
import { renderPremiumStarter } from "@/templates/premium-starter";

type Device = "mobile" | "tablet" | "desktop";

const DEVICES: Record<Device, { w: number; h: number; label: string; icon: string }> = {
  mobile:  { w: 390,  h: 844,  label: "iPhone 14", icon: "📱" },
  tablet:  { w: 768,  h: 1024, label: "iPad",       icon: "📲" },
  desktop: { w: 1280, h: 800,  label: "Desktop",    icon: "🖥️" },
};

// ─── iPhone chrome ──────────────────────────────────────────────────────────
function IPhoneShell({ children, scale }: { children: React.ReactNode; scale: number }) {
  const d = DEVICES.mobile;
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      {/* Body */}
      <div style={{
        width: `${d.w}px`, height: `${d.h}px`,
        transform: `scale(${scale})`, transformOrigin: "top center",
        borderRadius: "54px",
        background: "linear-gradient(160deg, #2a2a2e 0%, #1a1a1d 40%, #111113 100%)",
        boxShadow: `
          0 0 0 1px rgba(255,255,255,0.12),
          0 0 0 3px #0a0a0b,
          0 0 0 4px rgba(255,255,255,0.06),
          0 40px 120px rgba(0,0,0,0.8),
          inset 0 1px 0 rgba(255,255,255,0.08)
        `,
        padding: "12px",
        display: "flex", flexDirection: "column",
        position: "relative", overflow: "visible",
      }}>
        {/* Side buttons — volume up */}
        <div style={{ position:"absolute", left:"-3px", top:"120px", width:"3px", height:"36px", background:"#2a2a2e", borderRadius:"2px 0 0 2px", boxShadow:"inset 0 1px 0 rgba(255,255,255,0.1)" }} />
        <div style={{ position:"absolute", left:"-3px", top:"165px", width:"3px", height:"36px", background:"#2a2a2e", borderRadius:"2px 0 0 2px", boxShadow:"inset 0 1px 0 rgba(255,255,255,0.1)" }} />
        {/* Silent switch */}
        <div style={{ position:"absolute", left:"-3px", top:"84px", width:"3px", height:"28px", background:"#2a2a2e", borderRadius:"2px 0 0 2px" }} />
        {/* Power button */}
        <div style={{ position:"absolute", right:"-3px", top:"140px", width:"3px", height:"60px", background:"#2a2a2e", borderRadius:"0 2px 2px 0", boxShadow:"inset 0 1px 0 rgba(255,255,255,0.1)" }} />

        {/* Inner screen area */}
        <div style={{
          flex: 1, borderRadius: "44px", overflow: "hidden",
          background: "#000", position: "relative",
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.5)",
        }}>
          {/* Dynamic Island */}
          <div style={{
            position: "absolute", top: "12px", left: "50%",
            transform: "translateX(-50%)",
            width: "120px", height: "34px",
            background: "#000", borderRadius: "20px",
            zIndex: 20,
            boxShadow: "0 0 0 1px rgba(255,255,255,0.05)",
          }}>
            {/* Camera dot */}
            <div style={{ position:"absolute", right:"20px", top:"50%", transform:"translateY(-50%)", width:"10px", height:"10px", borderRadius:"50%", background:"#1a1a1a", border:"1px solid #222" }}>
              <div style={{ position:"absolute", inset:"2px", borderRadius:"50%", background:"#0d1f3c" }}>
                <div style={{ position:"absolute", top:"1px", left:"1px", width:"3px", height:"3px", borderRadius:"50%", background:"rgba(255,255,255,0.4)" }} />
              </div>
            </div>
          </div>

          {/* Fake status bar */}
          <div style={{
            position:"absolute", top:0, left:0, right:0, height:"50px",
            display:"flex", alignItems:"flex-end", justifyContent:"space-between",
            padding:"0 24px 6px", zIndex:15, pointerEvents:"none",
            background:"linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)",
          }}>
            <span style={{ fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,0.85)", letterSpacing:"0.02em" }}>9:41</span>
            <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
              {/* Signal */}
              <div style={{ display:"flex", gap:"2px", alignItems:"flex-end" }}>
                {[3,4,5,6].map(h => (
                  <div key={h} style={{ width:"3px", height:`${h}px`, background:"rgba(255,255,255,0.85)", borderRadius:"1px" }} />
                ))}
              </div>
              {/* WiFi */}
              <svg width="14" height="11" viewBox="0 0 24 18" fill="none">
                <path d="M1 6C4.8 2.2 10.1 0 12 0s7.2 2.2 11 6" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round"/>
                <path d="M4 10c2.2-2.2 4.8-3.5 8-3.5s5.8 1.3 8 3.5" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round"/>
                <path d="M7.5 14c1.3-1.3 2.8-2 4.5-2s3.2.7 4.5 2" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="18" r="2" fill="rgba(255,255,255,0.85)"/>
              </svg>
              {/* Battery */}
              <div style={{ display:"flex", alignItems:"center", gap:"1px" }}>
                <div style={{ width:"22px", height:"11px", border:"1.5px solid rgba(255,255,255,0.85)", borderRadius:"3px", padding:"1.5px" }}>
                  <div style={{ height:"100%", width:"75%", background:"rgba(255,255,255,0.85)", borderRadius:"1px" }} />
                </div>
                <div style={{ width:"2px", height:"5px", background:"rgba(255,255,255,0.6)", borderRadius:"0 1px 1px 0" }} />
              </div>
            </div>
          </div>

          {/* URL bar */}
          <div style={{
            position:"absolute", top:"50px", left:0, right:0, zIndex:14,
            padding:"0 12px 8px",
            background:"linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)",
            pointerEvents:"none",
          }}>
            <div style={{
              background:"rgba(255,255,255,0.12)", backdropFilter:"blur(8px)",
              borderRadius:"10px", padding:"6px 12px",
              display:"flex", alignItems:"center", gap:"6px",
            }}>
              <svg width="10" height="12" viewBox="0 0 12 14" fill="none">
                <rect x="1" y="5" width="10" height="8" rx="1.5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
                <path d="M4 5V3.5a2 2 0 114 0V5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span style={{ fontSize:"10px", color:"rgba(255,255,255,0.65)", flex:1, textAlign:"center", letterSpacing:"0.01em" }}>
                mi-negocio.jlstudios.ar
              </span>
            </div>
          </div>

          {/* The actual iframe */}
          {children}

          {/* Bottom home indicator */}
          <div style={{
            position:"absolute", bottom:"8px", left:"50%", transform:"translateX(-50%)",
            width:"120px", height:"5px",
            background:"rgba(255,255,255,0.25)", borderRadius:"3px",
            zIndex:20, pointerEvents:"none",
          }} />
        </div>
      </div>
    </div>
  );
}

// ─── iPad chrome ─────────────────────────────────────────────────────────────
function IPadShell({ children, scale }: { children: React.ReactNode; scale: number }) {
  const d = DEVICES.tablet;
  return (
    <div style={{ position:"relative", flexShrink:0 }}>
      <div style={{
        width:`${d.w}px`, height:`${d.h}px`,
        transform:`scale(${scale})`, transformOrigin:"top center",
        borderRadius:"20px",
        background:"linear-gradient(160deg, #2e2e32 0%, #1e1e21 100%)",
        boxShadow:"0 0 0 1px rgba(255,255,255,0.1), 0 0 0 3px #0a0a0b, 0 0 0 4px rgba(255,255,255,0.05), 0 40px 100px rgba(0,0,0,0.75)",
        padding:"16px 12px",
        display:"flex", flexDirection:"column", gap:"0",
        position:"relative",
      }}>
        {/* Camera */}
        <div style={{ position:"absolute", top:"8px", left:"50%", transform:"translateX(-50%)", width:"8px", height:"8px", borderRadius:"50%", background:"#1a1a1a", border:"1px solid #333" }} />
        {/* Power */}
        <div style={{ position:"absolute", top:"60px", right:"-3px", width:"3px", height:"40px", background:"#2a2a2e", borderRadius:"0 2px 2px 0" }} />
        {/* Volume */}
        <div style={{ position:"absolute", top:"120px", right:"-3px", width:"3px", height:"30px", background:"#2a2a2e", borderRadius:"0 2px 2px 0" }} />
        <div style={{ position:"absolute", top:"160px", right:"-3px", width:"3px", height:"30px", background:"#2a2a2e", borderRadius:"0 2px 2px 0" }} />

        <div style={{ flex:1, borderRadius:"10px", overflow:"hidden", background:"#000", position:"relative" }}>
          {children}
        </div>

        {/* Home bar */}
        <div style={{ height:"16px", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ width:"80px", height:"4px", background:"rgba(255,255,255,0.15)", borderRadius:"2px" }} />
        </div>
      </div>
    </div>
  );
}

// ─── Desktop chrome ──────────────────────────────────────────────────────────
function DesktopShell({ children, scale }: { children: React.ReactNode; scale: number }) {
  const d = DEVICES.desktop;
  return (
    <div style={{ position:"relative", flexShrink:0 }}>
      <div style={{
        width:`${d.w}px`, height:`${d.h + 40}px`,
        transform:`scale(${scale})`, transformOrigin:"top center",
        borderRadius:"12px",
        background:"#1a1a1d",
        boxShadow:"0 0 0 1px rgba(255,255,255,0.08), 0 40px 100px rgba(0,0,0,0.7)",
        overflow:"hidden",
        display:"flex", flexDirection:"column",
      }}>
        {/* Browser chrome */}
        <div style={{
          height:"40px", background:"#242428", borderBottom:"1px solid rgba(255,255,255,0.07)",
          display:"flex", alignItems:"center", gap:"8px", padding:"0 16px",
          flexShrink:0,
        }}>
          {/* Traffic lights */}
          <div style={{ display:"flex", gap:"6px" }}>
            {["#ff5f56","#ffbd2e","#27c93f"].map(c => (
              <div key={c} style={{ width:"12px", height:"12px", borderRadius:"50%", background:c }} />
            ))}
          </div>
          {/* URL bar */}
          <div style={{
            flex:1, maxWidth:"500px", margin:"0 auto",
            background:"rgba(255,255,255,0.07)", borderRadius:"6px",
            padding:"4px 12px", display:"flex", alignItems:"center", gap:"6px",
          }}>
            <svg width="10" height="12" viewBox="0 0 12 14" fill="none">
              <rect x="1" y="5" width="10" height="8" rx="1.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
              <path d="M4 5V3.5a2 2 0 114 0V5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize:"11px", color:"rgba(255,255,255,0.45)" }}>mi-negocio.jlstudios.ar</span>
          </div>
        </div>
        {/* Content */}
        <div style={{ flex:1, overflow:"hidden", background:"#fff" }}>
          {children}
        </div>
      </div>
      {/* Monitor stand */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
        <div style={{ width:"6px", height:"30px", background:"rgba(255,255,255,0.08)", transform:`scaleX(${scale})`, transformOrigin:"top center" }} />
        <div style={{ width:`${160 * scale}px`, height:"6px", background:"rgba(255,255,255,0.06)", borderRadius:"3px" }} />
      </div>
    </div>
  );
}

// ─── LivePreview ─────────────────────────────────────────────────────────────
export function LivePreview() {
  const { businessData } = useAppStore();
  const [device,      setDevice]  = useState<Device>("mobile");
  const [htmlContent, setContent] = useState("");
  const [renderKey,   setKey]     = useState(0);
  const [isSyncing,   setSyncing] = useState(false);
  const containerRef              = useRef<HTMLDivElement>(null);
  const [scale,       setScale]   = useState(1);

  useEffect(() => {
    if (!businessData) return;
    setSyncing(true);
    const t = setTimeout(() => {
      setContent(renderPremiumStarter(businessData));
      setKey(k => k + 1);
      setSyncing(false);
    }, 80);
    return () => clearTimeout(t);
  }, [businessData]);

  const computeScale = useCallback(() => {
    if (!containerRef.current) return;
    const d     = DEVICES[device];
    const rect  = containerRef.current.getBoundingClientRect();
    // Extra vertical space for device chrome (buttons, stand, etc.)
    const frameH = device === "desktop" ? d.h + 70 : d.h + (device === "mobile" ? 20 : 32);
    const frameW = device === "desktop" ? d.w : d.w;
    const availW = rect.width  - 48;
    const availH = rect.height - 80;
    const s = Math.min(availW / frameW, availH / frameH, 1);
    setScale(Math.max(s, 0.2));
  }, [device]);

  useEffect(() => {
    computeScale();
    const ro = new ResizeObserver(computeScale);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [computeScale]);

  const d = DEVICES[device];

  if (!businessData) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4" style={{ color:"#52525b" }}>
        <div style={{ fontSize:"3rem", opacity:0.3 }}>📱</div>
        <p className="text-sm">El preview aparecerá aquí tras el análisis</p>
      </div>
    );
  }

  const iframe = (
    <iframe
      key={`${device}-${renderKey}`}
      srcDoc={htmlContent}
      style={{
        width:"100%", height:"100%",
        border:"none", display:"block",
        backgroundColor:"#fff",
      }}
      title={`Preview — ${businessData.businessName}`}
      sandbox="allow-scripts allow-same-origin"
    />
  );

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor:"#0c0c0d" }}>

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between px-4 py-2 shrink-0"
        style={{ borderBottom:"1px solid #27272a" }}>

        {/* Device tabs */}
        <div className="flex gap-0.5 p-0.5 rounded-lg" style={{ backgroundColor:"#18181b" }}>
          {(["mobile","tablet","desktop"] as Device[]).map(dv => (
            <button key={dv} onClick={() => setDevice(dv)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
              style={{
                backgroundColor: device === dv ? "#27272a" : "transparent",
                color:           device === dv ? "#fafafa"  : "#52525b",
                boxShadow:       device === dv ? "0 1px 3px rgba(0,0,0,0.3)" : "none",
              }}>
              {DEVICES[dv].icon}
              <span style={{ fontSize:"10px" }}>{DEVICES[dv].label}</span>
            </button>
          ))}
        </div>

        {/* Status + actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs" style={{ color:"#71717a" }}>
            <div style={{
              width:"6px", height:"6px", borderRadius:"50%",
              backgroundColor: isSyncing ? "#f59e0b" : "#22c55e",
              boxShadow: isSyncing ? "0 0 6px #f59e0b" : "0 0 6px #22c55e",
              animation: isSyncing ? "pulse 1s infinite" : "none",
            }} />
            <span style={{ fontSize:"10px" }}>{isSyncing ? "Sincronizando..." : "En vivo"}</span>
          </div>
          <span className="text-[10px]" style={{ color:"#3f3f46" }}>
            {d.w}×{d.h} · {Math.round(scale * 100)}%
          </span>
          <button onClick={() => setKey(k => k + 1)}
            className="text-xs px-2 py-1 rounded transition-colors"
            style={{ color:"#71717a", backgroundColor:"#18181b", border:"1px solid #27272a" }}
            title="Forzar recarga">↺</button>
          <button
            onClick={() => {
              const w = window.open("", "_blank");
              if (w) { w.document.write(htmlContent); w.document.close(); }
            }}
            className="text-xs px-2 py-1 rounded transition-colors"
            style={{ color:"#71717a", backgroundColor:"#18181b", border:"1px solid #27272a" }}>
            ↗ Abrir
          </button>
        </div>
      </div>

      {/* ── Preview area ── */}
      <div ref={containerRef}
        className="flex-1 flex items-start justify-center overflow-hidden relative"
        style={{ paddingTop:"32px", paddingBottom:"16px" }}>

        {/* Syncing overlay */}
        {isSyncing && (
          <div className="absolute inset-0 flex items-center justify-center z-30"
            style={{ backgroundColor:"rgba(0,0,0,0.5)", backdropFilter:"blur(6px)" }}>
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl"
              style={{ background:"rgba(30,30,35,0.95)", border:"1px solid #27272a" }}>
              <div style={{ width:"14px", height:"14px", border:"2px solid #7c3aed", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />
              <span className="text-xs" style={{ color:"#a1a1aa" }}>Actualizando preview…</span>
            </div>
          </div>
        )}

        {device === "mobile"  && <IPhoneShell  scale={scale}>{iframe}</IPhoneShell>}
        {device === "tablet"  && <IPadShell    scale={scale}>{iframe}</IPadShell>}
        {device === "desktop" && <DesktopShell scale={scale}>{iframe}</DesktopShell>}
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  );
}

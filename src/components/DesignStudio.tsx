"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { ColorPicker } from "./ColorPicker";
import { LivePreview } from "./LivePreview";
import { ExportPanel } from "./ExportPanel";
import { NICHE_CONFIGS } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, 
  FileText, 
  Share2, 
  Settings2, 
  Type, 
  Store,
  ArrowLeft
} from "lucide-react";

export function DesignStudio() {
  const { 
    businessData, 
    updateDesignSystem, 
    updateBusinessField, 
    reset,
    niche 
  } = useAppStore();
  
  const [activeTab, setActiveTab] = useState<"datos" | "diseno" | "exportar">("diseno");

  if (!businessData || !niche) return null;

  const ds = businessData.designSystem;
  const nicheInfo = NICHE_CONFIGS[niche];

  return (
    <div className="flex h-screen bg-studio-bg overflow-hidden">
      {/* ─── SIDEBAR DE CONTROL ─── */}
      <aside className="w-[400px] flex flex-col border-r border-studio-border bg-studio-surface/50 backdrop-blur-xl z-20 shadow-2xl">
        
        {/* Header del Panel */}
        <div className="p-4 border-b border-studio-border flex items-center justify-between bg-studio-surface">
          <div className="flex items-center gap-3">
            <button 
              onClick={reset}
              className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors"
              title="Volver al inicio"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-tighter">Estudio de Edición</h2>
              <p className="text-[10px] text-violet-400 font-mono uppercase">{nicheInfo.label}</p>
            </div>
          </div>
          <Settings2 size={18} className="text-zinc-600" />
        </div>

        {/* Tabs de Navegación Estilo iOS/Linear */}
        <div className="p-4">
          <div className="flex p-1 bg-zinc-900/50 border border-zinc-800 rounded-xl gap-1">
            <button
              onClick={() => setActiveTab("diseno")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "diseno" ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Palette size={14} /> Diseño
            </button>
            <button
              onClick={() => setActiveTab("datos")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "datos" ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <FileText size={14} /> Contenido
            </button>
            <button
              onClick={() => setActiveTab("exportar")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "exportar" ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Share2 size={14} /> Exportar
            </button>
          </div>
        </div>

        {/* Área de Scroll de Controles */}
        <div className="flex-1 overflow-y-auto px-6 py-2 custom-scrollbar">
          <AnimatePresence mode="wait">
            
            {/* TAB: DISEÑO VISUAL */}
            {activeTab === "diseno" && (
              <motion.div
                key="diseno"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-8 pb-10"
              >
                <section>
                  <label className="label-text flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Colores de Marca
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <ColorPicker label="Primario" value={ds.primaryColor} onChange={(c) => updateDesignSystem({ primaryColor: c })} />
                    <ColorPicker label="Fondo" value={ds.backgroundColor} onChange={(c) => updateDesignSystem({ backgroundColor: c })} />
                    <ColorPicker label="Secundario" value={ds.secondaryColor} onChange={(c) => updateDesignSystem({ secondaryColor: c })} />
                    <ColorPicker label="Texto" value={ds.textColor} onChange={(c) => updateDesignSystem({ textColor: c })} />
                  </div>
                </section>

                <div className="h-px bg-studio-border" />

                <section>
                  <label className="label-text flex items-center gap-2 mb-4">
                    <Type size={14} className="text-violet-400" /> Tipografías
                  </label>
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-bold mb-1.5 block">Fuente para Títulos</span>
                      <select 
                        value={ds.fontHeading}
                        onChange={(e) => updateDesignSystem({ fontHeading: e.target.value })}
                        className="input-field"
                      >
                        <option value="Inter">Inter (SaaS Style)</option>
                        <option value="Playfair Display">Playfair (Elegante)</option>
                        <option value="Montserrat">Montserrat (Moderno)</option>
                        <option value="Oswald">Oswald (Fuerte)</option>
                        <option value="Bebas Neue">Bebas Neue (Impacto)</option>
                      </select>
                    </div>
                  </div>
                </section>

                <section>
                  <label className="label-text flex items-center gap-2 mb-4">
                    <Settings2 size={14} className="text-violet-400" /> Estilo de Interfaz
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["minimal", "bold", "elegant", "playful"].map((style) => (
                      <button
                        key={style}
                        onClick={() => updateDesignSystem({ style: style as any })}
                        className={`py-2 px-3 rounded-lg border text-[10px] uppercase font-bold transition-all ${
                          ds.style === style 
                          ? "bg-violet-500/20 border-violet-500 text-violet-300" 
                          : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </section>
              </motion.div>
            )}

            {/* TAB: CONTENIDO DEL NEGOCIO */}
            {activeTab === "datos" && (
              <motion.div
                key="datos"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <div className="p-4 bg-violet-500/5 border border-violet-500/10 rounded-xl mb-6">
                  <p className="text-[11px] text-violet-300 leading-relaxed italic">
                    "La IA ya redactó descripciones comerciales para los productos que no las tenían. Podés editarlas aquí abajo."
                  </p>
                </div>

                <div>
                  <label className="label-text flex items-center gap-2 mb-2">
                    <Store size={14} /> Nombre Comercial
                  </label>
                  <input
                    type="text"
                    value={businessData.businessName}
                    onChange={(e) => updateBusinessField("businessName", e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label-text flex items-center gap-2 mb-2">Tagline / Slogan</label>
                  <textarea
                    value={businessData.tagline}
                    onChange={(e) => updateBusinessField("tagline", e.target.value)}
                    className="input-field min-h-[80px] py-3"
                  />
                </div>
              </motion.div>
            )}

            {/* TAB: EXPORTACIÓN */}
            {activeTab === "exportar" && (
              <motion.div
                key="exportar"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <ExportPanel />
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer del Sidebar con créditos */}
        <div className="p-4 border-t border-studio-border bg-studio-surface/80">
          <div className="flex items-center justify-between opacity-50 grayscale hover:grayscale-0 transition-all">
            <span className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase">JLStudios Automator</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            </div>
          </div>
        </div>
      </aside>

      {/* ─── LIENZO DE PREVISUALIZACIÓN ─── */}
      
      <main className="flex-1 relative bg-zinc-950 flex flex-col items-center justify-center">
        {/* Fondo decorativo con gradientes suaves */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-fuchsia-600/5 blur-[120px] rounded-full" />
        </div>

        <LivePreview />
      </main>
    </div>
  );
}
// src/components/DesignStudio.tsx
"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { ColorPicker } from "@/components/ColorPicker";
import { LivePreview } from "@/components/LivePreview";
import { ExportPanel } from "@/components/ExportPanel";
import { Palette, FileText, Phone, Share2, ChevronLeft, ChevronRight } from "lucide-react";

type Tab = "diseno" | "contenido" | "contacto" | "exportar";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "diseno",    label: "Diseño",    icon: <Palette   size={15} /> },
  { id: "contenido", label: "Contenido", icon: <FileText  size={15} /> },
  { id: "contacto",  label: "Contacto",  icon: <Phone     size={15} /> },
  { id: "exportar",  label: "Exportar",  icon: <Share2    size={15} /> },
];

const GOOGLE_FONTS = [
  "Inter", "Plus Jakarta Sans", "DM Sans", "Nunito", "Lato",
  "Playfair Display", "Cormorant Garamond", "Syne", "Barlow", "Montserrat",
];

const STYLE_OPTIONS = [
  { value: "minimal",    label: "Minimal"    },
  { value: "bold",       label: "Bold"       },
  { value: "elegant",    label: "Elegant"    },
  { value: "playful",    label: "Playful"    },
  { value: "corporate",  label: "Corporate"  },
] as const;

const BORDER_RADIUS_OPTIONS = [
  { value: "0px",  label: "Sharp" },
  { value: "8px",  label: "Soft"  },
  { value: "16px", label: "Round" },
  { value: "24px", label: "Pill"  },
];

export function DesignStudio() {
  const { businessData, updateDesignSystem, updateItem, updateContactInfo, updateBusinessField } = useAppStore();
  const [activeTab, setActiveTab]  = useState<Tab>("diseno");
  const [panelOpen, setPanelOpen]  = useState(true);

  if (!businessData) return null;

  const ds = businessData.designSystem;
  const ci = businessData.contactInfo;

  return (
    <div className="flex h-full overflow-hidden" style={{ backgroundColor: "#09090b" }}>

      {/* ── Left panel ── */}
      <div
        className="flex flex-col flex-shrink-0 transition-all duration-300"
        style={{
          width:       panelOpen ? "360px" : "0px",
          minWidth:    panelOpen ? "360px" : "0px",
          overflow:    "hidden",
          borderRight: "1px solid #27272a",
          backgroundColor: "#0f0f10",
        }}
      >
        {/* Tab bar */}
        <div
          className="flex flex-shrink-0"
          style={{ borderBottom: "1px solid #27272a", backgroundColor: "#0c0c0d" }}
        >
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-semibold transition-colors"
              style={{
                color:           activeTab === tab.id ? "#fafafa"  : "#71717a",
                borderBottom:    activeTab === tab.id ? "2px solid #7c3aed" : "2px solid transparent",
                backgroundColor: activeTab === tab.id ? "#18181b"  : "transparent",
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">

          {/* ── TAB: DISEÑO ── */}
          {activeTab === "diseno" && (
            <>
              {/* Colors */}
              <div>
                <p className="label-text mb-3">Colores</p>
                <div className="grid grid-cols-2 gap-3">
                  <ColorPicker label="Principal"   value={ds.primaryColor}    onChange={v => updateDesignSystem({ primaryColor:    v })} />
                  <ColorPicker label="Secundario"  value={ds.secondaryColor}  onChange={v => updateDesignSystem({ secondaryColor:  v })} />
                  <ColorPicker label="Acento/CTA"  value={ds.accentColor}     onChange={v => updateDesignSystem({ accentColor:     v })} />
                  <ColorPicker label="Fondo"       value={ds.backgroundColor} onChange={v => updateDesignSystem({ backgroundColor: v })} />
                  <ColorPicker label="Texto"       value={ds.textColor}       onChange={v => updateDesignSystem({ textColor:       v })} />
                  <ColorPicker label="Texto muted" value={ds.mutedColor}      onChange={v => updateDesignSystem({ mutedColor:      v })} />
                </div>
              </div>

              {/* Typography */}
              <div>
                <p className="label-text mb-3">Tipografía</p>
                <div className="space-y-3">
                  <div>
                    <label className="label-text mb-1 block">Títulos</label>
                    <select
                      className="input-field"
                      value={ds.fontHeading}
                      onChange={e => updateDesignSystem({ fontHeading: e.target.value })}
                    >
                      {GOOGLE_FONTS.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label-text mb-1 block">Cuerpo</label>
                    <select
                      className="input-field"
                      value={ds.fontBody}
                      onChange={e => updateDesignSystem({ fontBody: e.target.value })}
                    >
                      {GOOGLE_FONTS.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Style */}
              <div>
                <p className="label-text mb-2">Estilo</p>
                <div className="flex flex-wrap gap-2">
                  {STYLE_OPTIONS.map(s => (
                    <button
                      key={s.value}
                      onClick={() => updateDesignSystem({ style: s.value })}
                      className="px-3 py-1.5 rounded text-xs font-medium border transition-colors"
                      style={{
                        backgroundColor: ds.style === s.value ? "#6d28d9" : "#1a1a1d",
                        borderColor:     ds.style === s.value ? "#7c3aed" : "#3f3f46",
                        color:           ds.style === s.value ? "#fff"    : "#a1a1aa",
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Border radius */}
              <div>
                <p className="label-text mb-2">Redondez</p>
                <div className="flex gap-2">
                  {BORDER_RADIUS_OPTIONS.map(r => (
                    <button
                      key={r.value}
                      onClick={() => updateDesignSystem({ borderRadius: r.value })}
                      className="flex-1 py-1.5 text-xs font-medium border rounded transition-colors"
                      style={{
                        backgroundColor: ds.borderRadius === r.value ? "#6d28d9" : "#1a1a1d",
                        borderColor:     ds.borderRadius === r.value ? "#7c3aed" : "#3f3f46",
                        color:           ds.borderRadius === r.value ? "#fff"    : "#a1a1aa",
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Layout */}
              <div>
                <p className="label-text mb-2">Layout de ítems</p>
                <div className="flex gap-2">
                  {(["grid", "list"] as const).map(l => (
                    <button
                      key={l}
                      onClick={() => updateBusinessField("layoutStyle", l)}
                      className="flex-1 py-2 text-xs font-semibold border rounded flex items-center justify-center gap-2 transition-colors"
                      style={{
                        backgroundColor: businessData.layoutStyle === l ? "#6d28d9" : "#1a1a1d",
                        borderColor:     businessData.layoutStyle === l ? "#7c3aed" : "#3f3f46",
                        color:           businessData.layoutStyle === l ? "#fff"    : "#a1a1aa",
                      }}
                    >
                      {l === "grid" ? (
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                          <rect x="0" y="0" width="6" height="6" rx="1"/><rect x="10" y="0" width="6" height="6" rx="1"/>
                          <rect x="0" y="10" width="6" height="6" rx="1"/><rect x="10" y="10" width="6" height="6" rx="1"/>
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                          <rect x="0" y="2" width="16" height="2" rx="1"/><rect x="0" y="7" width="16" height="2" rx="1"/>
                          <rect x="0" y="12" width="16" height="2" rx="1"/>
                        </svg>
                      )}
                      {l === "grid" ? "Cuadrícula" : "Lista"}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── TAB: CONTENIDO ── */}
          {activeTab === "contenido" && (
            <>
              <div>
                <label className="label-text mb-1.5 block">Nombre del negocio</label>
                <input
                  type="text"
                  className="input-field"
                  value={businessData.businessName}
                  onChange={e => updateBusinessField("businessName", e.target.value)}
                />
              </div>

              <div>
                <label className="label-text mb-1.5 block">Tagline / Slogan</label>
                <input
                  type="text"
                  className="input-field"
                  value={businessData.tagline}
                  maxLength={80}
                  onChange={e => updateBusinessField("tagline", e.target.value)}
                  placeholder="Máximo 8 palabras"
                />
              </div>

              <div>
                <label className="label-text mb-1.5 block">
                  Descripción SEO
                  <span
                    className="ml-2 font-normal lowercase"
                    style={{ color: businessData.seoDescription.length > 155 ? "#ef4444" : "#52525b" }}
                  >
                    ({businessData.seoDescription.length}/155)
                  </span>
                </label>
                <textarea
                  className="input-field resize-none"
                  rows={3}
                  value={businessData.seoDescription}
                  onChange={e => updateBusinessField("seoDescription", e.target.value)}
                  placeholder="Para Google — máx. 155 caracteres"
                />
              </div>

              <div>
                <p className="label-text mb-2">Ítems ({businessData.items.length})</p>
                <div className="space-y-2">
                  {businessData.items.map(item => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: "#18181b", border: "1px solid #27272a" }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-semibold" style={{ color: "#fafafa" }}>{item.name}</span>
                        {item.price && (
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded flex-shrink-0"
                            style={{ backgroundColor: "rgb(109 40 217 / 0.15)", color: "#a78bfa" }}
                          >
                            {item.price}
                          </span>
                        )}
                      </div>
                      <textarea
                        rows={2}
                        className="input-field resize-none text-xs"
                        value={item.description}
                        onChange={e => updateItem(item.id, { description: e.target.value })}
                        placeholder="Descripción persuasiva..."
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── TAB: CONTACTO ── */}
          {activeTab === "contacto" && (
            <>
              <div>
                <label className="label-text mb-1.5 block">WhatsApp</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-2 rounded flex-shrink-0" style={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", color: "#71717a" }}>
                    +
                  </span>
                  <input
                    type="tel"
                    className="input-field"
                    value={ci.whatsapp}
                    onChange={e => updateContactInfo({ whatsapp: e.target.value.replace(/\D/g, "") })}
                    placeholder="5491112345678"
                  />
                </div>
              </div>

              <div>
                <label className="label-text mb-1.5 block">Mensaje de WhatsApp</label>
                <textarea
                  rows={2}
                  className="input-field resize-none text-xs"
                  value={ci.whatsappMessage}
                  onChange={e => updateContactInfo({ whatsappMessage: e.target.value })}
                  placeholder="Hola! Vengo de tu web..."
                />
              </div>

              <div>
                <label className="label-text mb-1.5 block">Instagram</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-2 rounded flex-shrink-0" style={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", color: "#71717a" }}>
                    @
                  </span>
                  <input
                    type="text"
                    className="input-field"
                    value={ci.instagram}
                    onChange={e => updateContactInfo({ instagram: e.target.value.replace("@", "") })}
                    placeholder="usuario"
                  />
                </div>
              </div>

              <div>
                <label className="label-text mb-1.5 block">Facebook</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-2 rounded flex-shrink-0" style={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", color: "#71717a" }}>
                    fb/
                  </span>
                  <input
                    type="text"
                    className="input-field"
                    value={ci.facebook}
                    onChange={e => updateContactInfo({ facebook: e.target.value.replace("@", "") })}
                    placeholder="pagina"
                  />
                </div>
              </div>

              <div>
                <label className="label-text mb-1.5 block">Email</label>
                <input
                  type="email"
                  className="input-field"
                  value={ci.email}
                  onChange={e => updateContactInfo({ email: e.target.value })}
                  placeholder="contacto@negocio.com"
                />
              </div>

              <div>
                <label className="label-text mb-1.5 block">Dirección</label>
                <input
                  type="text"
                  className="input-field"
                  value={ci.address}
                  onChange={e => updateContactInfo({ address: e.target.value })}
                  placeholder="Av. Corrientes 1234, CABA"
                />
              </div>

              <div>
                <label className="label-text mb-1.5 block">URL Google Maps</label>
                <input
                  type="url"
                  className="input-field"
                  value={ci.mapUrl}
                  onChange={e => updateContactInfo({ mapUrl: e.target.value })}
                  placeholder="https://maps.google.com/..."
                />
              </div>

              <div>
                <label className="label-text mb-1.5 block">Horario</label>
                <textarea
                  rows={2}
                  className="input-field resize-none text-xs"
                  value={ci.schedule}
                  onChange={e => updateContactInfo({ schedule: e.target.value })}
                  placeholder="Lun–Vie 9 a 18h / Sáb 9 a 13h"
                />
              </div>
            </>
          )}

          {/* ── TAB: EXPORTAR ── */}
          {activeTab === "exportar" && (
            <ExportPanel />
          )}
        </div>
      </div>

      {/* ── Collapse toggle ── */}
      <button
        onClick={() => setPanelOpen(v => !v)}
        className="flex-shrink-0 flex items-center justify-center transition-colors"
        style={{
          width:           "18px",
          backgroundColor: "#18181b",
          borderRight:     "1px solid #27272a",
          color:           "#52525b",
        }}
        title={panelOpen ? "Ocultar panel" : "Mostrar panel"}
      >
        {panelOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>

      {/* ── Live preview ── */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <LivePreview />
      </div>
    </div>
  );
}

// src/components/DesignStudio.tsx
"use client";

import { useState, useRef, useCallback } from "react";
import { useAppStore } from "@/lib/store";
import { ColorPicker } from "@/components/ColorPicker";
import { LivePreview } from "@/components/LivePreview";
import { ExportPanel } from "@/components/ExportPanel";
import { NICHE_CONFIGS } from "@/lib/types";
import {
  ImageIcon, LayoutPanelLeft, Palette, Phone, Share2,
  ChevronLeft, ChevronRight, Plus, Trash2, GripVertical,
  Upload, X
} from "lucide-react";

type Tab = "identidad" | "menu" | "diseno" | "contacto" | "exportar";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "identidad",  label: "Identidad",  icon: <ImageIcon size={14} />    },
  { id: "menu",       label: "Menú",       icon: <LayoutPanelLeft size={14} /> },
  { id: "diseno",     label: "Diseño",     icon: <Palette size={14} />       },
  { id: "contacto",   label: "Contacto",   icon: <Phone size={14} />         },
  { id: "exportar",   label: "Exportar",   icon: <Share2 size={14} />        },
];

const GOOGLE_FONTS = [
  "Inter","Plus Jakarta Sans","DM Sans","Nunito","Lato",
  "Playfair Display","Cormorant Garamond","Syne","Barlow","Montserrat",
  "Oswald","Raleway","Bebas Neue","Poppins","Merriweather",
];

const STYLE_OPTIONS: { value: "minimal"|"bold"|"elegant"|"playful"|"corporate"; label: string; emoji: string }[] = [
  { value:"minimal",   label:"Minimal",   emoji:"◻️" },
  { value:"bold",      label:"Bold",      emoji:"⬛" },
  { value:"elegant",   label:"Elegant",   emoji:"✦"  },
  { value:"playful",   label:"Playful",   emoji:"🎨" },
  { value:"corporate", label:"Corporate", emoji:"💼" },
];

const RADIUS_OPTIONS = [
  { value:"0px",  label:"Sharp" },
  { value:"6px",  label:"Suave" },
  { value:"12px", label:"Round" },
  { value:"20px", label:"Pill"  },
];

// ── Image uploader helper ─────────────────────────────────────────────────────
function ImageUpload({
  label, value, onChange, aspectRatio = "16/5"
}: {
  label: string;
  value?: string;
  onChange: (b64: string) => void;
  aspectRatio?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // strip "data:image/...;base64," prefix
      onChange(result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  return (
    <div>
      <label className="label-text mb-1.5 block">{label}</label>
      <div
        className="relative border-2 border-dashed rounded-lg overflow-hidden cursor-pointer transition-colors"
        style={{
          aspectRatio,
          borderColor: value ? "#7c3aed" : "#3f3f46",
          backgroundColor: value ? "transparent" : "#18181b",
        }}
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          <>
            <img
              src={`data:image/jpeg;base64,${value}`}
              alt={label}
              className="w-full h-full object-cover"
            />
            <button
              className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
              onClick={(e) => { e.stopPropagation(); onChange(""); }}
              aria-label="Eliminar imagen"
            >
              <X size={12} color="#fff" />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <Upload size={20} color="#52525b" />
            <span className="text-xs" style={{ color: "#52525b" }}>
              Click para subir imagen
            </span>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
      />
    </div>
  );
}

// ── Main DesignStudio ─────────────────────────────────────────────────────────
export function DesignStudio() {
  const {
    businessData,
    updateDesignSystem, updateItem, updateContactInfo, updateBusinessField,
    addItem, removeItem, addCategory, removeCategory,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<Tab>("identidad");
  const [panelOpen, setPanelOpen] = useState(true);
  const [newCatName, setNewCatName] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  if (!businessData) return null;

  const ds  = businessData.designSystem;
  const ci  = businessData.contactInfo;
  const nicheConfig = NICHE_CONFIGS[businessData.niche];

  const toggleItemExpand = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const itemsByCategory = businessData.categories.map(cat => ({
    cat,
    items: businessData.items.filter(it => it.category === cat),
  }));

  return (
    <div className="flex h-full overflow-hidden" style={{ backgroundColor: "#09090b" }}>

      {/* ── Left Panel ── */}
      <div
        className="flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden"
        style={{
          width: panelOpen ? "380px" : "0px",
          minWidth: panelOpen ? "380px" : "0px",
          borderRight: "1px solid #27272a",
          backgroundColor: "#0d0d0e",
        }}
      >
        {/* Tab bar */}
        <div
          className="flex flex-shrink-0 overflow-x-auto"
          style={{ borderBottom: "1px solid #27272a", backgroundColor: "#0a0a0b", scrollbarWidth:"none" }}
        >
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex flex-col items-center gap-1 py-3 transition-colors flex-shrink-0"
              style={{
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: activeTab === tab.id ? "#fafafa" : "#52525b",
                borderBottom: activeTab === tab.id ? "2px solid #7c3aed" : "2px solid transparent",
                backgroundColor: activeTab === tab.id ? "#18181b" : "transparent",
                minWidth: "64px",
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── Panel Content ── */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-5"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#3f3f46 transparent" }}
        >

          {/* ══ TAB: IDENTIDAD ══ */}
          {activeTab === "identidad" && (
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
                  rows={2}
                  value={businessData.seoDescription}
                  maxLength={160}
                  onChange={e => updateBusinessField("seoDescription", e.target.value)}
                  placeholder="Para Google — máx. 155 caracteres"
                />
              </div>

              <div
                className="p-2 rounded-lg text-xs"
                style={{ backgroundColor: "rgb(109 40 217 / 0.08)", border: "1px solid rgb(109 40 217 / 0.2)", color: "#a78bfa" }}
              >
                <strong>Template activo:</strong> {nicheConfig.icon} {nicheConfig.label}
                <span
                  className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase"
                  style={{ backgroundColor: "rgb(109 40 217 / 0.2)", letterSpacing: "0.08em" }}
                >
                  {NICHE_CONFIGS[businessData.niche].templateType}
                </span>
              </div>

              <div
                className="h-px"
                style={{ backgroundColor: "#27272a" }}
              />

              <ImageUpload
                label="Foto de portada / Hero"
                value={businessData.portada_b64}
                onChange={b64 => updateBusinessField("portada_b64", b64)}
                aspectRatio="16/5"
              />

              <ImageUpload
                label="Logo del negocio"
                value={businessData.logo_b64}
                onChange={b64 => updateBusinessField("logo_b64", b64)}
                aspectRatio="1/1"
              />
            </>
          )}

          {/* ══ TAB: MENÚ / SERVICIOS ══ */}
          {activeTab === "menu" && (
            <>
              <div className="flex items-center justify-between">
                <p className="label-text">
                  {nicheConfig.itemLabel}s ({businessData.items.length})
                </p>
                <span className="text-xs" style={{ color: "#52525b" }}>
                  {businessData.categories.length} categorías
                </span>
              </div>

              {/* Categories */}
              {itemsByCategory.map(({ cat, items }) => (
                <div key={cat}>
                  {/* Category header */}
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: "#7c3aed" }}
                    />
                    <span className="text-xs font-bold" style={{ color: "#d4d4d8" }}>{cat}</span>
                    <div className="flex-1" />
                    <button
                      onClick={() => addItem(cat)}
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors"
                      style={{ color: "#a78bfa", backgroundColor: "rgb(109 40 217 / 0.1)" }}
                    >
                      <Plus size={10} />
                      Agregar
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`¿Eliminar categoría "${cat}" y todos sus ítems?`)) {
                          removeCategory(cat);
                        }
                      }}
                      className="w-6 h-6 flex items-center justify-center rounded transition-colors"
                      style={{ color: "#71717a" }}
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>

                  {/* Items */}
                  <div className="space-y-1 ml-4">
                    {items.map(item => (
                      <div
                        key={item.id}
                        className="rounded-lg overflow-hidden"
                        style={{ border: "1px solid #27272a" }}
                      >
                        {/* Item header */}
                        <div
                          className="flex items-center gap-2 px-3 py-2.5 cursor-pointer transition-colors"
                          style={{ backgroundColor: "#18181b" }}
                          onClick={() => toggleItemExpand(item.id)}
                        >
                          <GripVertical size={12} color="#3f3f46" className="flex-shrink-0" />
                          <span className="flex-1 text-xs font-medium truncate" style={{ color: "#e4e4e7" }}>
                            {item.name || "(sin nombre)"}
                          </span>
                          {item.price && (
                            <span
                              className="text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                              style={{ backgroundColor: "rgb(109 40 217 / 0.15)", color: "#a78bfa" }}
                            >
                              {item.price}
                            </span>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                            className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded transition-colors"
                            style={{ color: "#71717a" }}
                          >
                            <X size={10} />
                          </button>
                        </div>

                        {/* Item edit form */}
                        {expandedItems.has(item.id) && (
                          <div
                            className="p-3 space-y-2"
                            style={{ backgroundColor: "#111112", borderTop: "1px solid #27272a" }}
                          >
                            <input
                              type="text"
                              className="input-field"
                              value={item.name}
                              placeholder="Nombre"
                              onChange={e => updateItem(item.id, { name: e.target.value })}
                            />
                            <input
                              type="text"
                              className="input-field"
                              value={item.price ?? ""}
                              placeholder="Precio (ej: $1.500)"
                              onChange={e => updateItem(item.id, { price: e.target.value || null })}
                            />
                            <textarea
                              rows={2}
                              className="input-field resize-none text-xs"
                              value={item.description}
                              placeholder="Descripción persuasiva..."
                              onChange={e => updateItem(item.id, { description: e.target.value })}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                    {items.length === 0 && (
                      <div
                        className="text-xs text-center py-3 rounded"
                        style={{ color: "#52525b", border: "1px dashed #27272a" }}
                      >
                        Sin ítems · Hacé click en Agregar
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Add new category */}
              <div>
                <p className="label-text mb-2">Nueva categoría</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="input-field flex-1"
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    placeholder="Ej: Entradas, Postres..."
                    onKeyDown={e => {
                      if (e.key === "Enter" && newCatName.trim()) {
                        addCategory(newCatName.trim());
                        setNewCatName("");
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (newCatName.trim()) {
                        addCategory(newCatName.trim());
                        setNewCatName("");
                      }
                    }}
                    className="btn-primary px-3 py-2 text-xs flex-shrink-0"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div
                className="h-px"
                style={{ backgroundColor: "#27272a" }}
              />

              {/* Layout toggle */}
              <div>
                <p className="label-text mb-2">Vista de ítems</p>
                <div className="flex gap-2">
                  {(["grid","list"] as const).map(l => (
                    <button
                      key={l}
                      onClick={() => updateBusinessField("layoutStyle", l)}
                      className="flex-1 py-2 text-xs font-semibold rounded border flex items-center justify-center gap-2 transition-colors"
                      style={{
                        backgroundColor: businessData.layoutStyle === l ? "#6d28d9" : "#18181b",
                        borderColor:     businessData.layoutStyle === l ? "#7c3aed" : "#3f3f46",
                        color:           businessData.layoutStyle === l ? "#fff"    : "#a1a1aa",
                      }}
                    >
                      {l === "grid" ? "⊞ Cuadrícula" : "≡ Lista"}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ══ TAB: DISEÑO ══ */}
          {activeTab === "diseno" && (
            <>
              {/* Color palette */}
              <div>
                <p className="label-text mb-3">Paleta de colores</p>
                <div className="grid grid-cols-2 gap-3">
                  <ColorPicker label="Color principal"  value={ds.primaryColor}    onChange={v => updateDesignSystem({ primaryColor:    v })} />
                  <ColorPicker label="Color secundario" value={ds.secondaryColor}  onChange={v => updateDesignSystem({ secondaryColor:  v })} />
                  <ColorPicker label="Acento / CTA"     value={ds.accentColor}     onChange={v => updateDesignSystem({ accentColor:     v })} />
                  <ColorPicker label="Fondo"            value={ds.backgroundColor} onChange={v => updateDesignSystem({ backgroundColor: v })} />
                  <ColorPicker label="Texto"            value={ds.textColor}       onChange={v => updateDesignSystem({ textColor:       v })} />
                  <ColorPicker label="Texto suave"      value={ds.mutedColor}      onChange={v => updateDesignSystem({ mutedColor:      v })} />
                </div>
              </div>

              <div
                className="h-px"
                style={{ backgroundColor: "#27272a" }}
              />

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
                      {GOOGLE_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-text mb-1 block">Cuerpo de texto</label>
                    <select
                      className="input-field"
                      value={ds.fontBody}
                      onChange={e => updateDesignSystem({ fontBody: e.target.value })}
                    >
                      {GOOGLE_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div
                className="h-px"
                style={{ backgroundColor: "#27272a" }}
              />

              {/* Style presets */}
              <div>
                <p className="label-text mb-2">Estilo visual</p>
                <div className="grid grid-cols-3 gap-2">
                  {STYLE_OPTIONS.map(s => (
                    <button
                      key={s.value}
                      onClick={() => updateDesignSystem({ style: s.value })}
                      className="flex flex-col items-center gap-1 px-2 py-2 rounded text-xs font-medium border transition-colors"
                      style={{
                        backgroundColor: ds.style === s.value ? "#6d28d9" : "#18181b",
                        borderColor:     ds.style === s.value ? "#7c3aed" : "#3f3f46",
                        color:           ds.style === s.value ? "#fff"    : "#a1a1aa",
                      }}
                    >
                      <span>{s.emoji}</span>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Border radius */}
              <div>
                <p className="label-text mb-2">Redondez de bordes</p>
                <div className="flex gap-2">
                  {RADIUS_OPTIONS.map(r => (
                    <button
                      key={r.value}
                      onClick={() => updateDesignSystem({ borderRadius: r.value })}
                      className="flex-1 py-2 text-xs font-medium border rounded transition-colors"
                      style={{
                        backgroundColor: ds.borderRadius === r.value ? "#6d28d9" : "#18181b",
                        borderColor:     ds.borderRadius === r.value ? "#7c3aed" : "#3f3f46",
                        color:           ds.borderRadius === r.value ? "#fff"    : "#a1a1aa",
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ══ TAB: CONTACTO ══ */}
          {activeTab === "contacto" && (
            <>
              <div
                className="p-3 rounded-lg text-xs"
                style={{ backgroundColor: "rgb(34 197 94 / 0.06)", border: "1px solid rgb(34 197 94 / 0.2)", color: "#86efac" }}
              >
                💡 Estos datos aparecen en el sitio y son editables desde el CMS del cliente.
              </div>

              <div>
                <label className="label-text mb-1.5 block">WhatsApp</label>
                <div className="flex gap-2">
                  <span
                    className="text-xs px-3 py-2 rounded flex-shrink-0 flex items-center"
                    style={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", color: "#71717a" }}
                  >
                    +
                  </span>
                  <input
                    type="tel"
                    className="input-field"
                    value={ci.whatsapp}
                    onChange={e => updateContactInfo({ whatsapp: e.target.value.replace(/\D/g,"") })}
                    placeholder="5491112345678"
                  />
                </div>
              </div>

              <div>
                <label className="label-text mb-1.5 block">Mensaje pre-escrito WhatsApp</label>
                <textarea
                  rows={2}
                  className="input-field resize-none text-xs"
                  value={ci.whatsappMessage}
                  onChange={e => updateContactInfo({ whatsappMessage: e.target.value })}
                  placeholder="Hola! Quiero consultar..."
                />
              </div>

              <div>
                <label className="label-text mb-1.5 block">Instagram</label>
                <div className="flex gap-2">
                  <span
                    className="text-xs px-3 py-2 rounded flex-shrink-0 flex items-center"
                    style={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", color: "#71717a" }}
                  >
                    @
                  </span>
                  <input
                    type="text"
                    className="input-field"
                    value={ci.instagram}
                    onChange={e => updateContactInfo({ instagram: e.target.value.replace("@","") })}
                    placeholder="usuario"
                  />
                </div>
              </div>

              <div>
                <label className="label-text mb-1.5 block">Facebook</label>
                <div className="flex gap-2">
                  <span
                    className="text-xs px-3 py-2 rounded flex-shrink-0 flex items-center"
                    style={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", color: "#71717a" }}
                  >
                    fb/
                  </span>
                  <input
                    type="text"
                    className="input-field"
                    value={ci.facebook}
                    onChange={e => updateContactInfo({ facebook: e.target.value.replace("@","") })}
                    placeholder="pagina"
                  />
                </div>
              </div>

              <div>
                <label className="label-text mb-1.5 block">Email de contacto</label>
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
                <label className="label-text mb-1.5 block">Horario de atención</label>
                <textarea
                  rows={2}
                  className="input-field resize-none text-xs"
                  value={ci.schedule}
                  onChange={e => updateContactInfo({ schedule: e.target.value })}
                  placeholder="Lun–Vie 9 a 18h · Sáb 9 a 13h"
                />
              </div>
            </>
          )}

          {/* ══ TAB: EXPORTAR ══ */}
          {activeTab === "exportar" && <ExportPanel />}
        </div>
      </div>

      {/* ── Collapse toggle ── */}
      <button
        onClick={() => setPanelOpen(v => !v)}
        className="flex-shrink-0 flex items-center justify-center transition-colors"
        style={{
          width: "18px",
          backgroundColor: "#111112",
          borderRight: "1px solid #27272a",
          color: "#3f3f46",
        }}
        title={panelOpen ? "Ocultar panel" : "Mostrar panel"}
      >
        {panelOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>

      {/* ── Live Preview ── */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <LivePreview />
      </div>
    </div>
  );
}

// src/components/DesignStudio.tsx  v2.4
// FIXES & MEJORAS:
//  1. Logo: object-contain, sin crop circular, preview en esquina realista
//  2. Schedule: doble turno por día (botón AlarmClock → expande 2da franja)
//  3. Menu: chips de categorías sugeridas para rubros de comida
//  4. Diseño general del panel: más compacto y legible
"use client";

import { useState, useRef, useCallback } from "react";
import { useAppStore } from "@/lib/store";
import { LivePreview } from "@/components/LivePreview";
import { ExportPanel } from "@/components/ExportPanel";
import { NICHE_CONFIGS, VisualStyle } from "@/lib/types";
import {
  ImageIcon, LayoutPanelLeft, Palette, Phone, Share2,
  ChevronLeft, ChevronRight, Plus, Trash2, GripVertical,
  Upload, X, Clock, AlarmClock,
} from "lucide-react";

type Tab = "identidad" | "menu" | "diseno" | "contacto" | "exportar";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id:"identidad", label:"Identidad", icon:<ImageIcon       size={14}/> },
  { id:"menu",      label:"Menú",      icon:<LayoutPanelLeft size={14}/> },
  { id:"diseno",    label:"Diseño",    icon:<Palette          size={14}/> },
  { id:"contacto",  label:"Contacto",  icon:<Phone            size={14}/> },
  { id:"exportar",  label:"Exportar",  icon:<Share2           size={14}/> },
];

const GOOGLE_FONTS = [
  "Inter","Plus Jakarta Sans","DM Sans","Nunito","Lato",
  "Playfair Display","Cormorant Garamond","Syne","Barlow","Montserrat",
  "Oswald","Raleway","Bebas Neue","Poppins","Merriweather",
];

const STYLE_OPTIONS: { value:VisualStyle; label:string; emoji:string; desc:string }[] = [
  { value:"minimal",   label:"Minimal",   emoji:"◻",  desc:"Limpio, sin sombras"  },
  { value:"bold",      label:"Bold",      emoji:"⬛",  desc:"Fuerte, uppercase"    },
  { value:"elegant",   label:"Elegant",   emoji:"✦",  desc:"Suave, refinado"      },
  { value:"playful",   label:"Playful",   emoji:"🎨", desc:"Colorido, dinámico"   },
  { value:"corporate", label:"Corporate", emoji:"💼", desc:"Formal, estructurado" },
];

const RADIUS_OPTIONS = [
  { value:"0px",  label:"Sharp" },
  { value:"6px",  label:"Suave" },
  { value:"12px", label:"Round" },
  { value:"20px", label:"Pill"  },
];

// Categorías sugeridas para negocios de comida
const FOOD_CATS = [
  "Empanadas","Lomitos","Hamburguesas","Milanesas",
  "Pollos","Pizzas","Pastas","Guisos","Sandwiches",
  "Minutas","Ensaladas","Postres","Bebidas","Combos",
];

// ─── ColorPicker inline ──────────────────────────────────────────────────────
function ColorSwatch({ label, value, onChange }: { label:string; value:string; onChange:(v:string)=>void }) {
  return (
    <div>
      <label className="label-text mb-1 block text-[10px]">{label}</label>
      <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg border"
        style={{ borderColor:"#3f3f46", backgroundColor:"#18181b" }}>
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)}
          className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
          style={{ appearance:"none" }} />
        <span className="text-[10px] font-mono flex-1" style={{ color:"#d4d4d8" }}>{value}</span>
      </div>
    </div>
  );
}

// ─── ImageUpload ─────────────────────────────────────────────────────────────
function ImageUpload({
  label, value, onChange, isLogo = false, compact = false,
}: {
  label: string;
  value?: string;
  onChange: (b64: string) => void;
  isLogo?: boolean;
  compact?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const MAX = compact ? 400 : isLogo ? 600 : 1400;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ratio  = Math.min(MAX / img.width, MAX / img.height, 1);
        canvas.width  = Math.round(img.width  * ratio);
        canvas.height = Math.round(img.height * ratio);
        const ctx = canvas.getContext("2d")!;
        if (isLogo) {
          // PNG para preservar transparencia
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          onChange(canvas.toDataURL("image/png").split(",")[1]);
        } else {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          onChange(canvas.toDataURL("image/jpeg", 0.82).split(",")[1]);
        }
      };
      img.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  }, [onChange, compact, isLogo]);

  // ── Compact (ítem) ──
  if (compact) {
    return (
      <div className="relative rounded-lg overflow-hidden cursor-pointer border-2 border-dashed flex items-center justify-center"
        style={{ width:"48px", height:"48px", borderColor: value ? "#7c3aed" : "#3f3f46", backgroundColor: value ? "transparent" : "#18181b" }}
        onClick={() => ref.current?.click()}>
        {value ? (
          <>
            <img src={`data:image/jpeg;base64,${value}`} alt="" className="w-full h-full object-cover" />
            <button className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity"
              onClick={(e) => { e.stopPropagation(); onChange(""); }}>
              <X size={12} color="#fff"/>
            </button>
          </>
        ) : <ImageIcon size={14} color="#52525b"/>}
        <input ref={ref} type="file" accept="image/*" className="hidden"
          onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}/>
      </div>
    );
  }

  // ── Logo upload (object-contain, fondo checkered) ──
  if (isLogo) {
    const logoMime = value?.startsWith("iVBOR") ? "image/png" : "image/jpeg";
    return (
      <div>
        <label className="label-text mb-1.5 block">{label}</label>
        <p className="text-[10px] mb-2" style={{ color:"#52525b" }}>
          PNG recomendado. Se respeta la forma original del logo (rectangular, cuadrado, etc.)
        </p>
        {/* Upload zone */}
        <div className="relative border-2 border-dashed rounded-xl cursor-pointer flex items-center justify-center"
          style={{
            minHeight:"80px", maxHeight:"140px",
            borderColor: value ? "#7c3aed" : "#3f3f46",
            padding: value ? "16px" : "0",
            // Fondo ajedrezado para ver transparencia del logo
            backgroundImage: "linear-gradient(45deg,#1e1e1e 25%,transparent 25%),linear-gradient(-45deg,#1e1e1e 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#1e1e1e 75%),linear-gradient(-45deg,transparent 75%,#1e1e1e 75%)",
            backgroundSize:"14px 14px",
            backgroundPosition:"0 0,0 7px,7px -7px,-7px 0",
            backgroundColor:"#141414",
          }}
          onClick={() => ref.current?.click()}>
          {value ? (
            <>
              {/* object-contain → NO circular crop, respeta aspect ratio */}
              <img src={`data:${logoMime};base64,${value}`} alt="logo"
                style={{ maxWidth:"100%", maxHeight:"108px", objectFit:"contain", display:"block", margin:"0 auto" }}/>
              <button className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ backgroundColor:"rgba(0,0,0,0.8)" }}
                onClick={(e) => { e.stopPropagation(); onChange(""); }}>
                <X size={12} color="#fff"/>
              </button>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <Upload size={18} color="#52525b"/>
              <span className="text-xs" style={{ color:"#52525b" }}>Click para subir logo</span>
              <span className="text-[10px]" style={{ color:"#3f3f46" }}>PNG, JPG — forma original sin recortes</span>
            </div>
          )}
          <input ref={ref} type="file" accept="image/*" className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}/>
        </div>

        {/* Preview cómo se ve en el nav del sitio */}
        {value && (
          <div className="mt-2 px-3 py-2 rounded-lg flex items-center gap-3"
            style={{ backgroundColor:"#0d0d0e", border:"1px solid #27272a" }}>
            <span className="text-[10px]" style={{ color:"#52525b" }}>Nav preview →</span>
            <div style={{ height:"1px", flex:1, backgroundColor:"#27272a" }}/>
            <img src={`data:${logoMime};base64,${value}`} alt="logo nav preview"
              style={{ height:"28px", width:"auto", maxWidth:"120px", objectFit:"contain" }}/>
          </div>
        )}
      </div>
    );
  }

  // ── Portada / Hero ──
  return (
    <div>
      <label className="label-text mb-1.5 block">{label}</label>
      <div className="relative border-2 border-dashed rounded-lg overflow-hidden cursor-pointer"
        style={{ aspectRatio:"16/5", borderColor: value ? "#7c3aed" : "#3f3f46", backgroundColor:"#18181b" }}
        onClick={() => ref.current?.click()}>
        {value ? (
          <>
            <img src={`data:image/jpeg;base64,${value}`} alt={label} className="w-full h-full object-cover"/>
            <button className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ backgroundColor:"rgba(0,0,0,0.7)" }}
              onClick={(e) => { e.stopPropagation(); onChange(""); }}>
              <X size={12} color="#fff"/>
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <Upload size={18} color="#52525b"/>
            <span className="text-xs" style={{ color:"#52525b" }}>Click para subir portada</span>
          </div>
        )}
        <input ref={ref} type="file" accept="image/*" className="hidden"
          onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}/>
      </div>
    </div>
  );
}

// ─── DesignStudio ─────────────────────────────────────────────────────────────
export function DesignStudio() {
  const {
    businessData,
    updateDesignSystem, updateItem, updateContactInfo,
    updateScheduleDay, updateBusinessField,
    addItem, removeItem, addCategory, removeCategory,
  } = useAppStore();

  const [activeTab,     setActiveTab]     = useState<Tab>("identidad");
  const [panelOpen,     setPanelOpen]     = useState(true);
  const [newCatName,    setNewCatName]    = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  if (!businessData) return null;

  const ds          = businessData.designSystem;
  const ci          = businessData.contactInfo;
  const nicheConfig = NICHE_CONFIGS[businessData.niche];

  const isFood = nicheConfig.templateType === "gastro" || nicheConfig.templateType === "rochas";

  const toggleExpand = (id: string) =>
    setExpandedItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const itemsByCategory = businessData.categories.map((cat) => ({
    cat,
    items: businessData.items.filter((it) => it.category === cat),
  }));

  const tabStyle = (id: Tab) => ({
    fontSize:"9px", fontWeight:700,
    letterSpacing:"0.06em", textTransform:"uppercase" as const,
    color:           activeTab === id ? "#fafafa" : "#52525b",
    borderBottom:    activeTab === id ? "2px solid #7c3aed" : "2px solid transparent",
    backgroundColor: activeTab === id ? "#18181b" : "transparent",
    minWidth:"64px",
  });

  return (
    <div className="flex h-full overflow-hidden" style={{ backgroundColor:"#09090b" }}>

      {/* ══ LEFT PANEL ══ */}
      <div className="flex flex-col shrink-0 transition-all duration-300 overflow-hidden"
        style={{
          width:    panelOpen ? "380px" : "0px",
          minWidth: panelOpen ? "380px" : "0px",
          borderRight:"1px solid #27272a",
          backgroundColor:"#0d0d0e",
        }}>

        {/* Tab bar */}
        <div className="flex shrink-0 overflow-x-auto"
          style={{ borderBottom:"1px solid #27272a", backgroundColor:"#0a0a0b", scrollbarWidth:"none" }}>
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex flex-col items-center gap-1 py-3 transition-colors shrink-0"
              style={tabStyle(tab.id)}>
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5"
          style={{ scrollbarWidth:"thin", scrollbarColor:"#3f3f46 transparent" }}>

          {/* ════ IDENTIDAD ════ */}
          {activeTab === "identidad" && <>
            <div>
              <label className="label-text mb-1.5 block">Nombre del negocio</label>
              <input type="text" className="input-field" value={businessData.businessName}
                onChange={(e) => updateBusinessField("businessName", e.target.value)}/>
            </div>

            <div>
              <label className="label-text mb-1.5 block">Tagline / Slogan</label>
              <input type="text" className="input-field" maxLength={80}
                value={businessData.tagline} placeholder="Tu propuesta en menos de 8 palabras"
                onChange={(e) => updateBusinessField("tagline", e.target.value)}/>
            </div>

            <div>
              <label className="label-text mb-1.5 block">
                Descripción SEO
                <span className="ml-2 font-normal lowercase"
                  style={{ color: businessData.seoDescription.length > 155 ? "#ef4444" : "#52525b" }}>
                  ({businessData.seoDescription.length}/155)
                </span>
              </label>
              <textarea className="input-field resize-none" rows={2}
                value={businessData.seoDescription} maxLength={160}
                placeholder="Para Google — máx. 155 caracteres"
                onChange={(e) => updateBusinessField("seoDescription", e.target.value)}/>
            </div>

            <div className="p-2 rounded-lg text-xs"
              style={{ backgroundColor:"rgb(109 40 217 / 0.08)", border:"1px solid rgb(109 40 217 / 0.2)", color:"#a78bfa" }}>
              <strong>Template:</strong> {nicheConfig.icon} {nicheConfig.label}
              <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase"
                style={{ backgroundColor:"rgb(109 40 217 / 0.2)", letterSpacing:"0.08em" }}>
                {nicheConfig.templateType}
              </span>
            </div>

            <div className="h-px" style={{ backgroundColor:"#27272a" }}/>

            <ImageUpload label="Foto de portada / Hero" value={businessData.portada_b64}
              onChange={(b64) => updateBusinessField("portada_b64", b64)}/>

            {/* FIX: isLogo=true → object-contain, PNG, sin crop circular */}
            <ImageUpload label="Logo del negocio" value={businessData.logo_b64}
              onChange={(b64) => updateBusinessField("logo_b64", b64)} isLogo/>
          </>}

          {/* ════ MENÚ / SERVICIOS ════ */}
          {activeTab === "menu" && <>
            <div className="flex items-center justify-between">
              <p className="label-text">{nicheConfig.itemLabel}s ({businessData.items.length})</p>
              <span className="text-xs" style={{ color:"#52525b" }}>{businessData.categories.length} cats.</span>
            </div>

            {/* Chips de categorías sugeridas — solo para comida */}
            {isFood && (
              <div>
                <p className="text-[10px] mb-2" style={{ color:"#52525b" }}>
                  Categorías sugeridas — hacé click para agregar:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {FOOD_CATS.map((cat) => {
                    const exists = businessData.categories.includes(cat);
                    return (
                      <button key={cat}
                        onClick={() => { if (!exists) addCategory(cat); }}
                        disabled={exists}
                        className="text-[10px] px-2 py-1 rounded-full border transition-all"
                        style={{
                          borderColor:     exists ? "#7c3aed" : "#3f3f46",
                          color:           exists ? "#a78bfa" : "#71717a",
                          backgroundColor: exists ? "rgb(109 40 217 / 0.1)" : "transparent",
                          cursor:          exists ? "default" : "pointer",
                        }}>
                        {exists ? "✓ " : "+ "}{cat}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Items por categoría */}
            {itemsByCategory.map(({ cat, items }) => (
              <div key={cat}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor:"#7c3aed" }}/>
                  <span className="text-xs font-bold flex-1" style={{ color:"#d4d4d8" }}>{cat}</span>
                  <span className="text-[10px]" style={{ color:"#52525b" }}>{items.length}</span>
                  <button onClick={() => addItem(cat)}
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors"
                    style={{ color:"#a78bfa", backgroundColor:"rgb(109 40 217 / 0.1)" }}>
                    <Plus size={10}/> Agregar
                  </button>
                  <button onClick={() => {
                    if (window.confirm(`¿Eliminar "${cat}" y todos sus ítems?`)) removeCategory(cat);
                  }} className="w-6 h-6 flex items-center justify-center rounded" style={{ color:"#71717a" }}>
                    <Trash2 size={11}/>
                  </button>
                </div>

                <div className="space-y-1 ml-4">
                  {items.map((item) => (
                    <div key={item.id} className="rounded-lg overflow-hidden" style={{ border:"1px solid #27272a" }}>
                      {/* Row */}
                      <div className="flex items-center gap-2 px-3 py-2.5 cursor-pointer"
                        style={{ backgroundColor:"#18181b" }}
                        onClick={() => toggleExpand(item.id)}>
                        <GripVertical size={12} color="#3f3f46" className="shrink-0"/>
                        {item.image_b64 && (
                          <img src={`data:image/jpeg;base64,${item.image_b64}`} alt=""
                            className="w-6 h-6 rounded object-cover shrink-0"
                            style={{ border:"1px solid #3f3f46" }}/>
                        )}
                        <span className="flex-1 text-xs font-medium truncate" style={{ color:"#e4e4e7" }}>
                          {item.name || "(sin nombre)"}
                        </span>
                        {item.price && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0"
                            style={{ backgroundColor:"rgb(109 40 217 / 0.15)", color:"#a78bfa" }}>
                            {item.price}
                          </span>
                        )}
                        <button onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                          className="shrink-0 w-5 h-5 flex items-center justify-center rounded"
                          style={{ color:"#71717a" }}>
                          <X size={10}/>
                        </button>
                      </div>

                      {/* Expanded form */}
                      {expandedItems.has(item.id) && (
                        <div className="p-3 space-y-2.5"
                          style={{ backgroundColor:"#111112", borderTop:"1px solid #27272a" }}>
                          <input type="text" className="input-field" value={item.name}
                            placeholder="Nombre" onChange={(e) => updateItem(item.id, { name: e.target.value })}/>
                          <input type="text" className="input-field" value={item.price ?? ""}
                            placeholder="Precio (ej: $3.500)"
                            onChange={(e) => updateItem(item.id, { price: e.target.value || null })}/>
                          <textarea rows={2} className="input-field resize-none text-xs"
                            value={item.description} placeholder="Descripción breve..."
                            onChange={(e) => updateItem(item.id, { description: e.target.value })}/>
                          <div className="flex items-center gap-3">
                            <ImageUpload label="" value={item.image_b64}
                              onChange={(b64) => updateItem(item.id, { image_b64: b64 || undefined })}
                              compact/>
                            <div>
                              <p className="text-xs font-medium" style={{ color:"#d4d4d8" }}>
                                Foto del {nicheConfig.itemLabel}
                              </p>
                              <p className="text-[10px]" style={{ color:"#52525b" }}>Aparece en la card del sitio</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {items.length === 0 && (
                    <div className="text-xs text-center py-3 rounded"
                      style={{ color:"#52525b", border:"1px dashed #27272a" }}>
                      Sin ítems · Hacé click en Agregar
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Nueva categoría */}
            <div>
              <p className="label-text mb-2">Nueva categoría personalizada</p>
              <div className="flex gap-2">
                <input type="text" className="input-field flex-1" value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Ej: Minutas, Sandwiches..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newCatName.trim()) {
                      addCategory(newCatName.trim()); setNewCatName("");
                    }
                  }}/>
                <button onClick={() => { if (newCatName.trim()) { addCategory(newCatName.trim()); setNewCatName(""); }}}
                  className="btn-primary px-3 py-2 text-xs shrink-0">
                  <Plus size={14}/>
                </button>
              </div>
            </div>

            <div className="h-px" style={{ backgroundColor:"#27272a" }}/>

            {/* Layout toggle */}
            <div>
              <p className="label-text mb-2">Vista de ítems</p>
              <div className="flex gap-2">
                {(["grid","list"] as const).map((l) => (
                  <button key={l} onClick={() => updateBusinessField("layoutStyle", l)}
                    className="flex-1 py-2 text-xs font-semibold rounded border flex items-center justify-center gap-1.5 transition-colors"
                    style={{
                      backgroundColor: businessData.layoutStyle === l ? "#6d28d9" : "#18181b",
                      borderColor:     businessData.layoutStyle === l ? "#7c3aed" : "#3f3f46",
                      color:           businessData.layoutStyle === l ? "#fff"    : "#a1a1aa",
                    }}>
                    {l === "grid" ? "⊞ Cuadrícula" : "≡ Lista"}
                  </button>
                ))}
              </div>
            </div>
          </>}

          {/* ════ DISEÑO ════ */}
          {activeTab === "diseno" && <>
            <div>
              <p className="label-text mb-3">Paleta de colores</p>
              <div className="grid grid-cols-2 gap-3">
                <ColorSwatch label="Color principal"  value={ds.primaryColor}    onChange={(v) => updateDesignSystem({ primaryColor:    v })}/>
                <ColorSwatch label="Color secundario" value={ds.secondaryColor}  onChange={(v) => updateDesignSystem({ secondaryColor:  v })}/>
                <ColorSwatch label="Acento / CTA"     value={ds.accentColor}     onChange={(v) => updateDesignSystem({ accentColor:     v })}/>
                <ColorSwatch label="Fondo"            value={ds.backgroundColor} onChange={(v) => updateDesignSystem({ backgroundColor: v })}/>
                <ColorSwatch label="Texto"            value={ds.textColor}       onChange={(v) => updateDesignSystem({ textColor:       v })}/>
                <ColorSwatch label="Texto suave"      value={ds.mutedColor}      onChange={(v) => updateDesignSystem({ mutedColor:      v })}/>
              </div>
            </div>

            <div className="h-px" style={{ backgroundColor:"#27272a" }}/>

            <div>
              <p className="label-text mb-3">Tipografía</p>
              <div className="space-y-3">
                <div>
                  <label className="label-text mb-1 block text-[10px]">Títulos</label>
                  <select className="input-field" value={ds.fontHeading}
                    onChange={(e) => updateDesignSystem({ fontHeading: e.target.value })}>
                    {GOOGLE_FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-text mb-1 block text-[10px]">Cuerpo de texto</label>
                  <select className="input-field" value={ds.fontBody}
                    onChange={(e) => updateDesignSystem({ fontBody: e.target.value })}>
                    {GOOGLE_FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="h-px" style={{ backgroundColor:"#27272a" }}/>

            <div>
              <p className="label-text mb-2">Estilo visual</p>
              <div className="grid grid-cols-1 gap-2">
                {STYLE_OPTIONS.map((s) => (
                  <button key={s.value} onClick={() => updateDesignSystem({ style: s.value })}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-colors"
                    style={{
                      backgroundColor: ds.style === s.value ? "rgb(109 40 217 / 0.12)" : "#18181b",
                      borderColor:     ds.style === s.value ? "#7c3aed"                  : "#3f3f46",
                    }}>
                    <span className="text-base leading-none">{s.emoji}</span>
                    <div className="flex-1">
                      <p className="text-xs font-semibold" style={{ color: ds.style === s.value ? "#e4e4e7" : "#a1a1aa" }}>{s.label}</p>
                      <p className="text-[10px]" style={{ color:"#52525b" }}>{s.desc}</p>
                    </div>
                    {ds.style === s.value && (
                      <span className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center"
                        style={{ backgroundColor:"#7c3aed" }}>
                        <span style={{ color:"#fff", fontSize:"8px" }}>✓</span>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="label-text mb-2">Redondez de bordes</p>
              <div className="flex gap-2">
                {RADIUS_OPTIONS.map((r) => (
                  <button key={r.value} onClick={() => updateDesignSystem({ borderRadius: r.value })}
                    className="flex-1 py-2 text-xs font-medium border rounded transition-colors"
                    style={{
                      backgroundColor: ds.borderRadius === r.value ? "#6d28d9" : "#18181b",
                      borderColor:     ds.borderRadius === r.value ? "#7c3aed" : "#3f3f46",
                      color:           ds.borderRadius === r.value ? "#fff"    : "#a1a1aa",
                    }}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </>}

          {/* ════ CONTACTO ════ */}
          {activeTab === "contacto" && <>
            <div className="p-3 rounded-lg text-xs"
              style={{ backgroundColor:"rgb(34 197 94 / 0.06)", border:"1px solid rgb(34 197 94 / 0.2)", color:"#86efac" }}>
              💡 Estos datos aparecen en el sitio del cliente — todos editables.
            </div>

            <div>
              <label className="label-text mb-1.5 block">WhatsApp</label>
              <div className="flex gap-2">
                <span className="text-xs px-3 py-2 rounded shrink-0 flex items-center"
                  style={{ backgroundColor:"#18181b", border:"1px solid #3f3f46", color:"#71717a" }}>+</span>
                <input type="tel" className="input-field"
                  value={ci.whatsapp} placeholder="5491112345678"
                  onChange={(e) => updateContactInfo({ whatsapp: e.target.value.replace(/\D/g,"") })}/>
              </div>
            </div>

            <div>
              <label className="label-text mb-1.5 block">Mensaje pre-escrito WhatsApp</label>
              <textarea rows={2} className="input-field resize-none text-xs"
                value={ci.whatsappMessage} placeholder="Hola! Quiero consultar..."
                onChange={(e) => updateContactInfo({ whatsappMessage: e.target.value })}/>
            </div>

            <div className="h-px" style={{ backgroundColor:"#27272a" }}/>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-text mb-1 block text-[10px]">Instagram</label>
                <div className="flex gap-1.5">
                  <span className="text-xs px-2 py-2 rounded shrink-0 flex items-center"
                    style={{ backgroundColor:"#18181b", border:"1px solid #3f3f46", color:"#71717a" }}>@</span>
                  <input type="text" className="input-field"
                    value={ci.instagram} placeholder="usuario"
                    onChange={(e) => updateContactInfo({ instagram: e.target.value.replace("@","") })}/>
                </div>
              </div>
              <div>
                <label className="label-text mb-1 block text-[10px]">Facebook</label>
                <div className="flex gap-1.5">
                  <span className="text-xs px-2 py-2 rounded shrink-0 flex items-center"
                    style={{ backgroundColor:"#18181b", border:"1px solid #3f3f46", color:"#71717a", fontSize:"9px" }}>fb/</span>
                  <input type="text" className="input-field"
                    value={ci.facebook} placeholder="pagina"
                    onChange={(e) => updateContactInfo({ facebook: e.target.value.replace("@","") })}/>
                </div>
              </div>
            </div>

            <div>
              <label className="label-text mb-1.5 block">Email</label>
              <input type="email" className="input-field" value={ci.email} placeholder="contacto@negocio.com"
                onChange={(e) => updateContactInfo({ email: e.target.value })}/>
            </div>
            <div>
              <label className="label-text mb-1.5 block">Dirección</label>
              <input type="text" className="input-field" value={ci.address}
                placeholder="Calle 3 755, Villa Incor"
                onChange={(e) => updateContactInfo({ address: e.target.value })}/>
            </div>
            <div>
              <label className="label-text mb-1.5 block">URL Google Maps</label>
              <input type="url" className="input-field" value={ci.mapUrl}
                placeholder="https://maps.google.com/..."
                onChange={(e) => updateContactInfo({ mapUrl: e.target.value })}/>
            </div>

            <div className="h-px" style={{ backgroundColor:"#27272a" }}/>

            {/* ── Horarios con doble turno ── */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Clock size={13} color="#a78bfa"/>
                <p className="label-text">Horarios de atención</p>
              </div>
              <p className="text-[10px] mb-3" style={{ color:"#52525b" }}>
                Tocá <AlarmClock size={10} style={{ display:"inline", verticalAlign:"middle", color:"#a78bfa" }}/> para agregar un 2° turno (ej: 11–14 / 19–22)
              </p>

              <div className="space-y-1.5">
                {ci.schedule.map((day, idx) => (
                  <div key={day.day} className="rounded-lg overflow-hidden"
                    style={{ border:`1px solid ${day.isOpen ? "rgba(124,58,237,0.2)" : "#27272a"}` }}>

                    {/* ─ Fila principal ─ */}
                    <div className="px-3 py-2.5 flex items-center gap-2"
                      style={{ backgroundColor: day.isOpen ? "rgba(109,40,217,0.06)" : "#18181b" }}>

                      {/* Toggle abierto/cerrado */}
                      <button
                        onClick={() => updateScheduleDay(idx, { isOpen: !day.isOpen })}
                        className="relative shrink-0 rounded-full transition-colors"
                        style={{ width:"32px", height:"18px", backgroundColor: day.isOpen ? "#7c3aed" : "#3f3f46" }}>
                        <span className="absolute top-0.5 rounded-full bg-white transition-all"
                          style={{ width:"14px", height:"14px", left: day.isOpen ? "15px" : "2px", boxShadow:"0 1px 3px rgba(0,0,0,0.4)" }}/>
                      </button>

                      {/* Nombre día */}
                      <span className="text-xs font-semibold shrink-0"
                        style={{ color: day.isOpen ? "#e4e4e7" : "#52525b", width:"68px" }}>
                        {day.day}
                      </span>

                      {day.isOpen ? (
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <input type="time" value={day.open}
                            onChange={(e) => updateScheduleDay(idx, { open: e.target.value })}
                            className="input-field py-1 px-2 text-xs flex-1" style={{ minWidth:0 }}/>
                          <span className="text-[10px] shrink-0" style={{ color:"#52525b" }}>–</span>
                          <input type="time" value={day.close}
                            onChange={(e) => updateScheduleDay(idx, { close: e.target.value })}
                            className="input-field py-1 px-2 text-xs flex-1" style={{ minWidth:0 }}/>
                          {/* Botón 2° turno */}
                          <button
                            onClick={() => updateScheduleDay(idx, {
                              hasSecondShift: !day.hasSecondShift,
                              ...((!day.hasSecondShift) && { open2: "19:00", close2: "22:00" }),
                            })}
                            title={day.hasSecondShift ? "Quitar 2° turno" : "Agregar 2° turno"}
                            className="shrink-0 w-6 h-6 rounded flex items-center justify-center transition-all"
                            style={{
                              backgroundColor: day.hasSecondShift ? "rgb(109 40 217 / 0.25)" : "#27272a",
                              color:           day.hasSecondShift ? "#a78bfa" : "#52525b",
                              border:         `1px solid ${day.hasSecondShift ? "#7c3aed" : "#3f3f46"}`,
                            }}>
                            <AlarmClock size={11}/>
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs flex-1" style={{ color:"#52525b" }}>Cerrado</span>
                      )}
                    </div>

                    {/* ─ 2° turno (solo si está activo) ─ */}
                    {day.isOpen && day.hasSecondShift && (
                      <div className="px-3 py-2 flex items-center gap-2"
                        style={{ backgroundColor:"rgba(109,40,217,0.04)", borderTop:"1px solid rgba(124,58,237,0.12)" }}>
                        <div style={{ width:"32px", height:"18px", flexShrink:0 }}/>
                        <span className="text-[10px] font-medium shrink-0"
                          style={{ color:"#a78bfa", width:"68px" }}>
                          2° turno
                        </span>
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <input type="time" value={day.open2 || "19:00"}
                            onChange={(e) => updateScheduleDay(idx, { open2: e.target.value })}
                            className="input-field py-1 px-2 text-xs flex-1" style={{ minWidth:0 }}/>
                          <span className="text-[10px] shrink-0" style={{ color:"#52525b" }}>–</span>
                          <input type="time" value={day.close2 || "22:00"}
                            onChange={(e) => updateScheduleDay(idx, { close2: e.target.value })}
                            className="input-field py-1 px-2 text-xs flex-1" style={{ minWidth:0 }}/>
                          <button
                            onClick={() => updateScheduleDay(idx, { hasSecondShift: false, open2: undefined, close2: undefined })}
                            className="shrink-0 w-6 h-6 flex items-center justify-center rounded"
                            style={{ color:"#71717a" }}>
                            <X size={9}/>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>}

          {/* ════ EXPORTAR ════ */}
          {activeTab === "exportar" && <ExportPanel/>}

        </div>
      </div>

      {/* Toggle panel */}
      <button onClick={() => setPanelOpen((v) => !v)}
        className="shrink-0 flex items-center justify-center transition-colors"
        style={{ width:"18px", backgroundColor:"#111112", borderRight:"1px solid #27272a", color:"#3f3f46" }}>
        {panelOpen ? <ChevronLeft size={12}/> : <ChevronRight size={12}/>}
      </button>

      {/* Live Preview */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <LivePreview/>
      </div>
    </div>
  );
}

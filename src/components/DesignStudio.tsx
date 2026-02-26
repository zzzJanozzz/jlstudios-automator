// src/components/DesignStudio.tsx
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
  ArrowLeft,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  LayoutGrid,
  LayoutList,
  Clock,
  Mail,
  Globe,
} from "lucide-react";

type TabId = "diseno" | "contenido" | "contacto" | "exportar";

interface TabConfig {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const TABS: TabConfig[] = [
  { id: "diseno",   label: "Diseño",    icon: <Palette size={13} /> },
  { id: "contenido",label: "Contenido", icon: <FileText size={13} /> },
  { id: "contacto", label: "Contacto",  icon: <Phone size={13} /> },
  { id: "exportar", label: "Exportar",  icon: <Share2 size={13} /> },
];

const FONT_OPTIONS = [
  { value: "Inter",              label: "Inter — Moderno" },
  { value: "Syne",               label: "Syne — Editorial" },
  { value: "Playfair Display",   label: "Playfair — Elegante" },
  { value: "Montserrat",         label: "Montserrat — Limpio" },
  { value: "Oswald",             label: "Oswald — Condensado" },
  { value: "Bebas Neue",         label: "Bebas Neue — Impacto" },
  { value: "DM Sans",            label: "DM Sans — Amigable" },
  { value: "Barlow Condensed",   label: "Barlow — Atletico" },
  { value: "Cormorant Garamond", label: "Cormorant — Lujoso" },
  { value: "Plus Jakarta Sans",  label: "Jakarta — Profesional" },
];

export function DesignStudio() {
  const {
    businessData,
    updateDesignSystem,
    updateBusinessField,
    updateContactInfo,
    reset,
    niche,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<TabId>("diseno");

  if (!businessData || !niche) return null;

  const ds = businessData.designSystem;
  const nicheInfo = NICHE_CONFIGS[niche];
  const contact = businessData.contactInfo;
  const layoutStyle = (businessData as any).layoutStyle ?? "grid";

  const setLayoutStyle = (v: "grid" | "list") => {
    updateBusinessField("layoutStyle" as any, v);
  };

  return (
    <div className="flex h-screen bg-studio-bg overflow-hidden">
      {/* ─────────────────────── SIDEBAR ─────────────────────── */}
      <aside className="w-[380px] flex-shrink-0 flex flex-col border-r border-studio-border bg-studio-surface/60 backdrop-blur-xl z-20 shadow-2xl">

        {/* Header */}
        <div className="flex-shrink-0 px-4 py-3.5 border-b border-studio-border bg-studio-surface flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={reset}
              className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-300 transition-colors"
              title="Volver al inicio"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-widest leading-none mb-0.5">
                Design Studio
              </h2>
              <p className="text-[10px] text-violet-400 font-mono uppercase">
                {nicheInfo.icon} {nicheInfo.label}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
            <span className="text-[10px] text-zinc-500 font-medium">Live</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 p-3 border-b border-zinc-800/60">
          <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-900/60 border border-zinc-800 rounded-xl">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 py-2 rounded-lg text-[10px] font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">

            {/* ══════ TAB: DISEÑO ══════ */}
            {activeTab === "diseno" && (
              <motion.div
                key="diseno"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
                className="p-5 space-y-7 pb-12"
              >
                {/* Colors */}
                <section>
                  <SectionHeader icon={<Palette size={12} />} label="Colores de Marca" />
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <ColorPicker label="Primario"   value={ds.primaryColor}    onChange={(c) => updateDesignSystem({ primaryColor: c })} />
                    <ColorPicker label="Secundario" value={ds.secondaryColor}  onChange={(c) => updateDesignSystem({ secondaryColor: c })} />
                    <ColorPicker label="Acento"     value={ds.accentColor}     onChange={(c) => updateDesignSystem({ accentColor: c })} />
                    <ColorPicker label="Fondo"      value={ds.backgroundColor} onChange={(c) => updateDesignSystem({ backgroundColor: c })} />
                    <ColorPicker label="Texto"      value={ds.textColor}       onChange={(c) => updateDesignSystem({ textColor: c })} />
                    <ColorPicker label="Muted"      value={ds.mutedColor}      onChange={(c) => updateDesignSystem({ mutedColor: c })} />
                  </div>
                </section>

                <Divider />

                {/* Typography */}
                <section>
                  <SectionHeader icon={<Type size={12} />} label="Tipografía" />
                  <div className="space-y-3 mt-3">
                    <div>
                      <label className="label-text mb-1.5 block">Fuente para Títulos</label>
                      <select
                        value={ds.fontHeading}
                        onChange={(e) => updateDesignSystem({ fontHeading: e.target.value })}
                        className="input-field"
                      >
                        {FONT_OPTIONS.map((f) => (
                          <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label-text mb-1.5 block">Fuente para Cuerpo</label>
                      <select
                        value={ds.fontBody}
                        onChange={(e) => updateDesignSystem({ fontBody: e.target.value })}
                        className="input-field"
                      >
                        {FONT_OPTIONS.map((f) => (
                          <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </section>

                <Divider />

                {/* Style */}
                <section>
                  <SectionHeader icon={<Settings2 size={12} />} label="Estilo de Interfaz" />
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {(["minimal", "bold", "elegant", "playful", "corporate"] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => updateDesignSystem({ style })}
                        className={`py-2 px-2 rounded-lg border text-[10px] uppercase font-bold tracking-wide transition-all ${
                          ds.style === style
                            ? "bg-violet-500/20 border-violet-500/60 text-violet-300"
                            : "bg-zinc-900/80 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </section>

                <Divider />

                {/* Layout */}
                <section>
                  <SectionHeader icon={<LayoutGrid size={12} />} label="Layout de Items" />
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <button
                      onClick={() => setLayoutStyle("grid")}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                        layoutStyle === "grid"
                          ? "bg-violet-500/15 border-violet-500/50 text-violet-300"
                          : "bg-zinc-900/60 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                      }`}
                    >
                      <LayoutGrid size={22} />
                      <span className="text-[10px] font-bold uppercase tracking-wide">Grilla</span>
                      <div className="grid grid-cols-3 gap-0.5 w-full opacity-50">
                        {[...Array(6)].map((_, i) => <div key={i} className="h-3 bg-current rounded-sm" />)}
                      </div>
                    </button>
                    <button
                      onClick={() => setLayoutStyle("list")}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                        layoutStyle === "list"
                          ? "bg-violet-500/15 border-violet-500/50 text-violet-300"
                          : "bg-zinc-900/60 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                      }`}
                    >
                      <LayoutList size={22} />
                      <span className="text-[10px] font-bold uppercase tracking-wide">Lista</span>
                      <div className="flex flex-col gap-0.5 w-full opacity-50">
                        {[...Array(4)].map((_, i) => <div key={i} className="h-2 bg-current rounded-sm" />)}
                      </div>
                    </button>
                  </div>
                </section>

                <Divider />

                {/* Border Radius */}
                <section>
                  <SectionHeader icon={<Settings2 size={12} />} label="Bordes (Border Radius)" />
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {[
                      { label: "Sharp", value: "0px" },
                      { label: "Soft", value: "8px" },
                      { label: "Round", value: "16px" },
                      { label: "Pill", value: "24px" },
                    ].map(({ label, value }) => (
                      <button
                        key={value}
                        onClick={() => updateDesignSystem({ borderRadius: value })}
                        className={`py-2 rounded-lg border text-[10px] font-bold uppercase transition-all ${
                          ds.borderRadius === value
                            ? "bg-violet-500/20 border-violet-500/60 text-violet-300"
                            : "bg-zinc-900/80 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                        }`}
                        style={{ borderRadius: value === ds.borderRadius ? "0.5rem" : undefined }}
                      >
                        <div
                          className={`w-4 h-4 border-2 mx-auto mb-1 ${
                            ds.borderRadius === value ? "border-violet-400" : "border-zinc-600"
                          }`}
                          style={{ borderRadius: value }}
                        />
                        {label}
                      </button>
                    ))}
                  </div>
                </section>
              </motion.div>
            )}

            {/* ══════ TAB: CONTENIDO ══════ */}
            {activeTab === "contenido" && (
              <motion.div
                key="contenido"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
                className="p-5 space-y-5 pb-12"
              >
                <div className="p-3.5 bg-violet-500/5 border border-violet-500/15 rounded-xl">
                  <p className="text-[11px] text-violet-300/80 leading-relaxed">
                    ✨ La IA generó descripciones persuasivas para tus productos. Podés editarlas acá.
                  </p>
                </div>

                <div>
                  <label className="label-text mb-1.5 flex items-center gap-1.5">
                    <Store size={12} /> Nombre del Negocio
                  </label>
                  <input
                    type="text"
                    value={businessData.businessName}
                    onChange={(e) => updateBusinessField("businessName", e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label-text mb-1.5 flex items-center gap-1.5">
                    Tagline / Slogan
                  </label>
                  <textarea
                    value={businessData.tagline}
                    onChange={(e) => updateBusinessField("tagline", e.target.value)}
                    className="input-field min-h-[72px] py-2.5"
                    rows={3}
                  />
                  <p className="text-[10px] text-zinc-600 mt-1">
                    {businessData.tagline?.length ?? 0}/80 caracteres
                  </p>
                </div>

                <div>
                  <label className="label-text mb-1.5 flex items-center gap-1.5">
                    Descripción SEO
                  </label>
                  <textarea
                    value={businessData.seoDescription}
                    onChange={(e) => updateBusinessField("seoDescription", e.target.value)}
                    className="input-field min-h-[80px] py-2.5"
                    rows={3}
                    maxLength={160}
                  />
                  <p className={`text-[10px] mt-1 ${(businessData.seoDescription?.length ?? 0) > 155 ? "text-red-400" : "text-zinc-600"}`}>
                    {businessData.seoDescription?.length ?? 0}/155 caracteres
                  </p>
                </div>

                <Divider />

                {/* Items list */}
                <section>
                  <SectionHeader icon={<FileText size={12} />} label={`Items (${businessData.items.length})`} />
                  <div className="mt-3 space-y-3 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
                    {businessData.items.map((item) => (
                      <div key={item.id} className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wide">
                            {item.category}
                          </span>
                          {item.price && (
                            <span className="text-[10px] font-bold text-emerald-400">
                              {item.price}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-zinc-200">{item.name}</p>
                        <textarea
                          value={item.description}
                          onChange={(e) =>
                            useAppStore.getState().updateItem(item.id, { description: e.target.value })
                          }
                          className="input-field text-[11px] py-2 min-h-[60px] resize-none leading-relaxed"
                          rows={2}
                          placeholder="Descripción del item..."
                        />
                      </div>
                    ))}
                  </div>
                </section>
              </motion.div>
            )}

            {/* ══════ TAB: CONTACTO ══════ */}
            {activeTab === "contacto" && (
              <motion.div
                key="contacto"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
                className="p-5 space-y-4 pb-12"
              >
                <div className="p-3.5 bg-zinc-800/40 border border-zinc-700/50 rounded-xl">
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Estos datos aparecerán en los botones de contacto de la web generada.
                  </p>
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="label-text mb-1.5 flex items-center gap-1.5">
                    <Phone size={11} className="text-emerald-400" /> WhatsApp
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 flex-shrink-0">+54</span>
                    <input
                      type="tel"
                      value={contact.whatsapp}
                      onChange={(e) => updateContactInfo({ whatsapp: e.target.value })}
                      placeholder="9 11 2345 6789"
                      className="input-field"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-600 mt-1">Sin espacios ni guiones. Ej: 5491112345678</p>
                </div>

                {/* Address */}
                <div>
                  <label className="label-text mb-1.5 flex items-center gap-1.5">
                    <MapPin size={11} className="text-red-400" /> Dirección
                  </label>
                  <input
                    type="text"
                    value={contact.address}
                    onChange={(e) => updateContactInfo({ address: e.target.value })}
                    placeholder="Av. Corrientes 1234, CABA"
                    className="input-field"
                  />
                </div>

                {/* Maps URL */}
                <div>
                  <label className="label-text mb-1.5 flex items-center gap-1.5">
                    <Globe size={11} className="text-blue-400" /> Link Google Maps
                  </label>
                  <input
                    type="url"
                    value={contact.mapUrl}
                    onChange={(e) => updateContactInfo({ mapUrl: e.target.value })}
                    placeholder="https://maps.google.com/..."
                    className="input-field"
                  />
                </div>

                <Divider />

                {/* Instagram */}
                <div>
                  <label className="label-text mb-1.5 flex items-center gap-1.5">
                    <Instagram size={11} className="text-pink-400" /> Instagram
                  </label>
                  <div className="flex items-center">
                    <span className="text-xs text-zinc-500 bg-zinc-900 border border-r-0 border-zinc-700 rounded-l-lg px-3 py-2 flex-shrink-0">@</span>
                    <input
                      type="text"
                      value={contact.instagram.replace("@", "")}
                      onChange={(e) => updateContactInfo({ instagram: e.target.value })}
                      placeholder="mi_negocio"
                      className="input-field rounded-l-none border-l-0"
                    />
                  </div>
                </div>

                {/* Facebook */}
                <div>
                  <label className="label-text mb-1.5 flex items-center gap-1.5">
                    <Facebook size={11} className="text-blue-500" /> Facebook
                  </label>
                  <div className="flex items-center">
                    <span className="text-xs text-zinc-500 bg-zinc-900 border border-r-0 border-zinc-700 rounded-l-lg px-3 py-2 flex-shrink-0 whitespace-nowrap">fb.com/</span>
                    <input
                      type="text"
                      value={contact.facebook.replace("@", "")}
                      onChange={(e) => updateContactInfo({ facebook: e.target.value })}
                      placeholder="mi.negocio"
                      className="input-field rounded-l-none border-l-0"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="label-text mb-1.5 flex items-center gap-1.5">
                    <Mail size={11} className="text-zinc-400" /> Email de Contacto
                  </label>
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(e) => updateContactInfo({ email: e.target.value })}
                    placeholder="hola@minegocio.com"
                    className="input-field"
                  />
                </div>

                {/* Schedule */}
                <div>
                  <label className="label-text mb-1.5 flex items-center gap-1.5">
                    <Clock size={11} className="text-amber-400" /> Horario de Atención
                  </label>
                  <textarea
                    value={contact.schedule}
                    onChange={(e) => updateContactInfo({ schedule: e.target.value })}
                    placeholder="Lunes a Viernes 9–18h · Sábados 10–14h"
                    rows={2}
                    className="input-field min-h-[64px] py-2.5 resize-none"
                  />
                </div>
              </motion.div>
            )}

            {/* ══════ TAB: EXPORTAR ══════ */}
            {activeTab === "exportar" && (
              <motion.div
                key="exportar"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
                className="p-5"
              >
                <ExportPanel />
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-4 py-3 border-t border-studio-border bg-studio-surface/80">
          <div className="flex items-center justify-between opacity-40 hover:opacity-80 transition-opacity">
            <span className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase">
              JLStudios Automator v2
            </span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            </div>
          </div>
        </div>
      </aside>

      {/* ─────────────────────── CANVAS ─────────────────────── */}
      <main className="flex-1 overflow-hidden">
        <LivePreview />
      </main>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────
function SectionHeader({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-violet-400">{icon}</span>
      <span className="label-text">{label}</span>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-zinc-800/80" />;
}

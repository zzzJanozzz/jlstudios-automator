// src/lib/types.ts
// ─── DATA CONTRACT v2.1 ─────────────────────────────────────────────────────
// Aligned with:
//   - Python GeneradorMenus schema (menu.json + app.py)
//   - Dashboard SMS (dashboard-jlstudios) editable fields
//   - AI output from Gemini
// ────────────────────────────────────────────────────────────────────────────

// ─── Supported Niches ────────────────────────────────────────────────────────
export const SUPPORTED_NICHES = [
  "restaurante",
  "barberia",
  "estetica",
  "clinica_medica",
  "taller_mecanico",
  "catalogo_ropa",
  "estudio_abogados",
  "creador_contenido",
  "gimnasio",
  "veterinaria",
  "inmobiliaria",
  "floreria",
  "panaderia",
  "estudio_tatuajes",
  "fotografia",
  "academia_idiomas",
  "coworking",
  "lavanderia",
  "optica",
  "ferreteria",
] as const;

export type Niche = (typeof SUPPORTED_NICHES)[number];

export interface NicheConfig {
  id: Niche;
  label: string;
  icon: string;
  defaultCTA: string;
  /** Singular label for items in this niche — e.g. "plato", "servicio" */
  itemLabel: string;
}

export const NICHE_CONFIGS: Record<Niche, NicheConfig> = {
  restaurante:       { id: "restaurante",       label: "Restaurante / Gastro",   icon: "🍽️", defaultCTA: "¡Hacé tu pedido!",             itemLabel: "plato" },
  barberia:          { id: "barberia",           label: "Barbería",               icon: "💈", defaultCTA: "Reservá tu turno",             itemLabel: "corte" },
  estetica:          { id: "estetica",           label: "Centro de Estética",     icon: "💆", defaultCTA: "Agendá tu sesión",             itemLabel: "tratamiento" },
  clinica_medica:    { id: "clinica_medica",     label: "Clínica Médica",         icon: "🏥", defaultCTA: "Sacá turno online",            itemLabel: "especialidad" },
  taller_mecanico:   { id: "taller_mecanico",    label: "Taller Mecánico",        icon: "🔧", defaultCTA: "Consultá presupuesto",         itemLabel: "servicio" },
  catalogo_ropa:     { id: "catalogo_ropa",      label: "Catálogo de Ropa",       icon: "👗", defaultCTA: "Comprá ahora",                itemLabel: "prenda" },
  estudio_abogados:  { id: "estudio_abogados",   label: "Estudio de Abogados",    icon: "⚖️", defaultCTA: "Agendar consulta",            itemLabel: "área legal" },
  creador_contenido: { id: "creador_contenido",  label: "Creador de Contenido",   icon: "🎬", defaultCTA: "Colaboremos juntos",          itemLabel: "servicio" },
  gimnasio:          { id: "gimnasio",           label: "Gimnasio / Fitness",     icon: "🏋️", defaultCTA: "Empezá hoy",                  itemLabel: "plan" },
  veterinaria:       { id: "veterinaria",        label: "Veterinaria",            icon: "🐾", defaultCTA: "Pedí turno para tu mascota",  itemLabel: "servicio" },
  inmobiliaria:      { id: "inmobiliaria",       label: "Inmobiliaria",           icon: "🏠", defaultCTA: "Consultá por esta propiedad", itemLabel: "propiedad" },
  floreria:          { id: "floreria",           label: "Florería",               icon: "🌸", defaultCTA: "Encargá tu ramo",             itemLabel: "arreglo" },
  panaderia:         { id: "panaderia",          label: "Panadería / Pastelería", icon: "🥐", defaultCTA: "Hacé tu encargo",             itemLabel: "producto" },
  estudio_tatuajes:  { id: "estudio_tatuajes",   label: "Estudio de Tatuajes",    icon: "🎨", defaultCTA: "Agendá tu sesión",            itemLabel: "estilo" },
  fotografia:        { id: "fotografia",         label: "Fotografía",             icon: "📸", defaultCTA: "Reservá tu sesión",           itemLabel: "paquete" },
  academia_idiomas:  { id: "academia_idiomas",   label: "Academia de Idiomas",    icon: "🌍", defaultCTA: "Inscribite ahora",            itemLabel: "curso" },
  coworking:         { id: "coworking",          label: "Coworking",              icon: "💼", defaultCTA: "Reservá tu espacio",          itemLabel: "plan" },
  lavanderia:        { id: "lavanderia",         label: "Lavandería",             icon: "🧺", defaultCTA: "Pedí retiro a domicilio",     itemLabel: "servicio" },
  optica:            { id: "optica",             label: "Óptica",                 icon: "👓", defaultCTA: "Agendá tu examen visual",     itemLabel: "producto" },
  ferreteria:        { id: "ferreteria",         label: "Ferretería",             icon: "🛠️", defaultCTA: "Consultá disponibilidad",     itemLabel: "producto" },
};

// ─── Design System ────────────────────────────────────────────────────────────
// Maps to Python: design.color_primary → primaryColor, etc.
// All fields editable by Dashboard SMS.
export interface DesignSystem {
  /** Python: design.color_primary */
  primaryColor: string;
  /** Python: design.color_secondary */
  secondaryColor: string;
  /** Python: design.color_bg */
  backgroundColor: string;
  /** Python: design.color_text */
  textColor: string;
  /** Muted/secondary text color */
  mutedColor: string;
  /** Accent for CTAs */
  accentColor: string;
  /** Python: design.font_heading — Google Fonts name */
  fontHeading: string;
  /** Python: design.font_body — Google Fonts name */
  fontBody: string;
  /** Python: design.border_radius — CSS value e.g. "12px" */
  borderRadius: string;
  /** CSS box-shadow value */
  cardShadow: string;
  /** Visual style preset */
  style: "minimal" | "bold" | "elegant" | "playful" | "corporate";
}

// ─── Extracted Item ────────────────────────────────────────────────────────────
// Maps to Python: categorias[].platos[].{plato, precio, descripcion}
// All fields editable by Dashboard SMS.
export interface ExtractedItem {
  /** Sequential ID: item_1, item_2… */
  id: string;
  /** Python: plato */
  name: string;
  /** Python: descripcion */
  description: string;
  /** Python: precio — null if not visible */
  price: string | null;
  /** Parent category name */
  category: string;
}

// ─── Social / Contact ──────────────────────────────────────────────────────────
// Maps to Python: redes + mensaje_whatsapp
// All fields editable by Dashboard SMS.
export interface ContactInfo {
  /** Python: redes.whatsapp — full international number e.g. 5491112345678 */
  whatsapp: string;
  /** Python: mensaje_whatsapp — pre-filled message */
  whatsappMessage: string;
  /** Physical address */
  address: string;
  /** Google Maps embed/share URL */
  mapUrl: string;
  /** Python: redes.instagram — handle without @ */
  instagram: string;
  /** Python: redes.facebook — page handle */
  facebook: string;
  /** Contact email */
  email: string;
  /** Business hours string */
  schedule: string;
}

// ─── Main Data Contract ─────────────────────────────────────────────────────────
// This is the contract shared between Generator → SMS → Templates.
// SMS can read/write ALL fields in this interface.
export interface BusinessData {
  /** Python: nombre_local */
  businessName: string;
  /** Python: slogan */
  tagline: string;
  /** Python: rubro_actual */
  niche: Niche;
  /** SEO meta description (max 155 chars) */
  seoDescription: string;
  /** Python: design */
  designSystem: DesignSystem;
  /** Python: design.layout_mode */
  layoutStyle: "grid" | "list";
  /** Ordered list of category names */
  categories: string[];
  /** Python: categorias[].platos[] — flat list with category reference */
  items: ExtractedItem[];
  /** Python: redes + mensaje_whatsapp */
  contactInfo: ContactInfo;
}

// ─── App State ──────────────────────────────────────────────────────────────────
export interface AppState {
  step: "upload" | "processing" | "editing" | "exporting";
  niche: Niche | null;
  uploadedFiles: File[];
  businessData: BusinessData | null;
  isProcessing: boolean;
  error: string | null;

  setStep: (step: AppState["step"]) => void;
  setNiche: (niche: Niche) => void;
  setUploadedFiles: (files: File[]) => void;
  setBusinessData: (data: BusinessData) => void;
  updateDesignSystem: (updates: Partial<DesignSystem>) => void;
  updateItem: (id: string, updates: Partial<ExtractedItem>) => void;
  updateContactInfo: (updates: Partial<ContactInfo>) => void;
  updateBusinessField: (field: keyof BusinessData, value: unknown) => void;
  setProcessing: (v: boolean) => void;
  setError: (e: string | null) => void;
  reset: () => void;
}

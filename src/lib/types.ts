// src/lib/types.ts

// ─── Nichos Soportados ───
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
  itemLabel: string;
}

export const NICHE_CONFIGS: Record<Niche, NicheConfig> = {
  restaurante:      { id: "restaurante",      label: "Restaurante / Gastro",    icon: "🍽️", defaultCTA: "¡Hacé tu pedido!",            itemLabel: "plato" },
  barberia:         { id: "barberia",          label: "Barbería",                icon: "💈", defaultCTA: "Reservá tu turno",            itemLabel: "corte" },
  estetica:         { id: "estetica",          label: "Centro de Estética",      icon: "💆", defaultCTA: "Agendá tu sesión",            itemLabel: "tratamiento" },
  clinica_medica:   { id: "clinica_medica",    label: "Clínica Médica",          icon: "🏥", defaultCTA: "Sacá turno online",           itemLabel: "especialidad" },
  taller_mecanico:  { id: "taller_mecanico",   label: "Taller Mecánico",         icon: "🔧", defaultCTA: "Consultá presupuesto",        itemLabel: "servicio" },
  catalogo_ropa:    { id: "catalogo_ropa",     label: "Catálogo de Ropa",        icon: "👗", defaultCTA: "Comprá ahora",               itemLabel: "prenda" },
  estudio_abogados: { id: "estudio_abogados",  label: "Estudio de Abogados",     icon: "⚖️", defaultCTA: "Agendar consulta",           itemLabel: "área legal" },
  creador_contenido:{ id: "creador_contenido", label: "Creador de Contenido",    icon: "🎬", defaultCTA: "Colaboremos juntos",         itemLabel: "servicio" },
  gimnasio:         { id: "gimnasio",          label: "Gimnasio / Fitness",      icon: "🏋️", defaultCTA: "Empezá hoy",                 itemLabel: "plan" },
  veterinaria:      { id: "veterinaria",       label: "Veterinaria",             icon: "🐾", defaultCTA: "Pedí turno para tu mascota", itemLabel: "servicio" },
  inmobiliaria:     { id: "inmobiliaria",      label: "Inmobiliaria",            icon: "🏠", defaultCTA: "Consultá por esta propiedad",itemLabel: "propiedad" },
  floreria:         { id: "floreria",          label: "Florería",                icon: "🌸", defaultCTA: "Encargá tu ramo",            itemLabel: "arreglo" },
  panaderia:        { id: "panaderia",         label: "Panadería / Pastelería",  icon: "🥐", defaultCTA: "Hacé tu encargo",            itemLabel: "producto" },
  estudio_tatuajes: { id: "estudio_tatuajes",  label: "Estudio de Tatuajes",     icon: "🎨", defaultCTA: "Agendá tu sesión",           itemLabel: "estilo" },
  fotografia:       { id: "fotografia",        label: "Fotografía",              icon: "📸", defaultCTA: "Reservá tu sesión",          itemLabel: "paquete" },
  academia_idiomas: { id: "academia_idiomas",  label: "Academia de Idiomas",     icon: "🌍", defaultCTA: "Inscribite ahora",           itemLabel: "curso" },
  coworking:        { id: "coworking",         label: "Coworking",               icon: "💼", defaultCTA: "Reservá tu espacio",         itemLabel: "plan" },
  lavanderia:       { id: "lavanderia",        label: "Lavandería",              icon: "🧺", defaultCTA: "Pedí retiro a domicilio",    itemLabel: "servicio" },
  optica:           { id: "optica",            label: "Óptica",                  icon: "👓", defaultCTA: "Agendá tu examen visual",    itemLabel: "producto" },
  ferreteria:       { id: "ferreteria",        label: "Ferretería",              icon: "🛠️", defaultCTA: "Consultá disponibilidad",    itemLabel: "producto" },
};

// ─── Datos Extraídos por la IA ───
export interface ExtractedItem {
  id: string;
  name: string;
  description: string;
  price: string | null;
  category: string;
  hasImage: boolean;
  imageUrl?: string;
}

export interface DesignSystem {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  mutedColor: string;
  fontHeading: string;
  fontBody: string;
  style: "minimal" | "bold" | "elegant" | "playful" | "corporate";
  borderRadius: string;
  cardShadow: string;
}

export interface BusinessData {
  businessName: string;
  tagline: string;
  niche: Niche;
  items: ExtractedItem[];
  categories: string[];
  designSystem: DesignSystem;
  contactInfo: {
    whatsapp: string;
    address: string;
    mapUrl: string;
    instagram: string;
    facebook: string;
    email: string;
    schedule: string;
  };
  seoDescription: string;
  /** Layout for item display in the generated site */
  layoutStyle?: "grid" | "list";
}

// ─── Estado Global de la App ───
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
  updateContactInfo: (updates: Partial<BusinessData["contactInfo"]>) => void;
  updateBusinessField: (field: keyof BusinessData, value: string) => void;
  setProcessing: (v: boolean) => void;
  setError: (e: string | null) => void;
  reset: () => void;
}

// src/lib/types.ts — DATA CONTRACT v2.3
// Changes from v2.2:
//  • ContactInfo.schedule → ScheduleDay[]  (structured horario)
//  • ExtractedItem.image_b64              (optional per-item image)
// ─────────────────────────────────────────────────────────────────────────────

export const SUPPORTED_NICHES = [
  "restaurante","barberia","estetica","clinica_medica","taller_mecanico",
  "catalogo_ropa","estudio_abogados","creador_contenido","gimnasio","veterinaria",
  "inmobiliaria","floreria","panaderia","estudio_tatuajes","fotografia",
  "academia_idiomas","coworking","lavanderia","optica","ferreteria",
] as const;

export type Niche = (typeof SUPPORTED_NICHES)[number];
export type TemplateType = "gastro" | "beauty" | "gym" | "default";
export type VisualStyle = "minimal" | "bold" | "elegant" | "playful" | "corporate";

// ─── Schedule ────────────────────────────────────────────────────────────────
export interface ScheduleDay {
  day: string;      // "Lunes" | "Martes" | etc.
  isOpen: boolean;
  open: string;     // "09:00"
  close: string;    // "18:00"
}

export const DEFAULT_SCHEDULE: ScheduleDay[] = [
  { day: "Lunes",     isOpen: true,  open: "09:00", close: "18:00" },
  { day: "Martes",    isOpen: true,  open: "09:00", close: "18:00" },
  { day: "Miércoles", isOpen: true,  open: "09:00", close: "18:00" },
  { day: "Jueves",    isOpen: true,  open: "09:00", close: "18:00" },
  { day: "Viernes",   isOpen: true,  open: "09:00", close: "18:00" },
  { day: "Sábado",    isOpen: true,  open: "09:00", close: "13:00" },
  { day: "Domingo",   isOpen: false, open: "09:00", close: "13:00" },
];

// ─── Niche Config ────────────────────────────────────────────────────────────
export interface NicheConfig {
  id: Niche;
  label: string;
  icon: string;
  defaultCTA: string;
  itemLabel: string;
  templateType: TemplateType;
}

export const NICHE_CONFIGS: Record<Niche, NicheConfig> = {
  restaurante:       { id:"restaurante",       label:"Restaurante / Gastro",   icon:"🍽️", defaultCTA:"¡Hacé tu pedido!",             itemLabel:"plato",       templateType:"gastro"  },
  barberia:          { id:"barberia",           label:"Barbería",               icon:"💈", defaultCTA:"Reservá tu turno",             itemLabel:"corte",       templateType:"beauty"  },
  estetica:          { id:"estetica",           label:"Centro de Estética",     icon:"💆", defaultCTA:"Agendá tu sesión",             itemLabel:"tratamiento", templateType:"beauty"  },
  clinica_medica:    { id:"clinica_medica",     label:"Clínica Médica",         icon:"🏥", defaultCTA:"Sacá turno online",            itemLabel:"especialidad",templateType:"beauty"  },
  taller_mecanico:   { id:"taller_mecanico",    label:"Taller Mecánico",        icon:"🔧", defaultCTA:"Consultá presupuesto",         itemLabel:"servicio",    templateType:"default" },
  catalogo_ropa:     { id:"catalogo_ropa",      label:"Catálogo de Ropa",       icon:"👗", defaultCTA:"Comprá ahora",                itemLabel:"prenda",      templateType:"default" },
  estudio_abogados:  { id:"estudio_abogados",   label:"Estudio de Abogados",    icon:"⚖️", defaultCTA:"Agendar consulta",            itemLabel:"área legal",  templateType:"default" },
  creador_contenido: { id:"creador_contenido",  label:"Creador de Contenido",   icon:"🎬", defaultCTA:"Colaboremos juntos",          itemLabel:"servicio",    templateType:"default" },
  gimnasio:          { id:"gimnasio",           label:"Gimnasio / Fitness",     icon:"🏋️", defaultCTA:"Empezá hoy",                  itemLabel:"plan",        templateType:"gym"     },
  veterinaria:       { id:"veterinaria",        label:"Veterinaria",            icon:"🐾", defaultCTA:"Pedí turno para tu mascota",  itemLabel:"servicio",    templateType:"beauty"  },
  inmobiliaria:      { id:"inmobiliaria",       label:"Inmobiliaria",           icon:"🏠", defaultCTA:"Consultá por esta propiedad", itemLabel:"propiedad",   templateType:"default" },
  floreria:          { id:"floreria",           label:"Florería",               icon:"🌸", defaultCTA:"Encargá tu ramo",             itemLabel:"arreglo",     templateType:"beauty"  },
  panaderia:         { id:"panaderia",          label:"Panadería / Pastelería", icon:"🥐", defaultCTA:"Hacé tu encargo",             itemLabel:"producto",    templateType:"gastro"  },
  estudio_tatuajes:  { id:"estudio_tatuajes",   label:"Estudio de Tatuajes",    icon:"🎨", defaultCTA:"Agendá tu sesión",            itemLabel:"estilo",      templateType:"beauty"  },
  fotografia:        { id:"fotografia",         label:"Fotografía",             icon:"📸", defaultCTA:"Reservá tu sesión",           itemLabel:"paquete",     templateType:"beauty"  },
  academia_idiomas:  { id:"academia_idiomas",   label:"Academia de Idiomas",    icon:"🌍", defaultCTA:"Inscribite ahora",            itemLabel:"curso",       templateType:"default" },
  coworking:         { id:"coworking",          label:"Coworking",              icon:"💼", defaultCTA:"Reservá tu espacio",          itemLabel:"plan",        templateType:"gym"     },
  lavanderia:        { id:"lavanderia",         label:"Lavandería",             icon:"🧺", defaultCTA:"Pedí retiro a domicilio",     itemLabel:"servicio",    templateType:"beauty"  },
  optica:            { id:"optica",             label:"Óptica",                 icon:"👓", defaultCTA:"Agendá tu examen visual",     itemLabel:"producto",    templateType:"beauty"  },
  ferreteria:        { id:"ferreteria",         label:"Ferretería",             icon:"🛠️", defaultCTA:"Consultá disponibilidad",     itemLabel:"producto",    templateType:"default" },
};

// ─── Design System ───────────────────────────────────────────────────────────
export interface DesignSystem {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  mutedColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  borderRadius: string;
  cardShadow: string;
  style: VisualStyle;
}

// ─── Extracted Item ──────────────────────────────────────────────────────────
export interface ExtractedItem {
  id: string;
  name: string;
  description: string;
  price: string | null;
  category: string;
  /** Optional per-item photo uploaded by client in CMS */
  image_b64?: string;
}

// ─── Contact Info ─────────────────────────────────────────────────────────────
export interface ContactInfo {
  whatsapp: string;
  whatsappMessage: string;
  address: string;
  mapUrl: string;
  instagram: string;
  facebook: string;
  email: string;
  /** Structured weekly schedule — replaces old free-text string */
  schedule: ScheduleDay[];
}

// ─── Master Business Data Contract ───────────────────────────────────────────
// Every field maps 1:1 to something editable in the SMS Dashboard CMS
// AND to a visible element in the generated HTML site.
export interface BusinessData {
  businessName: string;
  tagline: string;
  niche: Niche;
  seoDescription: string;
  categories: string[];
  items: ExtractedItem[];
  designSystem: DesignSystem;
  layoutStyle: "grid" | "list";
  contactInfo: ContactInfo;
  /** Hero/portada cover image — maps to Python portada_b64 */
  portada_b64?: string;
  /** Business logo — maps to Python logo_b64 */
  logo_b64?: string;
}

// ─── Default empty BusinessData (for "create from scratch") ──────────────────
export function makeEmptyBusinessData(niche: Niche): BusinessData {
  const cfg = NICHE_CONFIGS[niche];
  return {
    businessName: "Mi Negocio",
    tagline: "",
    niche,
    seoDescription: "",
    categories: ["General"],
    items: [],
    designSystem: {
      primaryColor:   "#7c3aed",
      secondaryColor: "#6d28d9",
      backgroundColor: "#09090b",
      textColor:      "#fafafa",
      mutedColor:     "#a1a1aa",
      accentColor:    "#a78bfa",
      fontHeading:    "Playfair Display",
      fontBody:       "Inter",
      borderRadius:   "8px",
      cardShadow:     "0 4px 24px rgba(0,0,0,0.4)",
      style:          "minimal",
    },
    layoutStyle: "grid",
    contactInfo: {
      whatsapp:        "",
      whatsappMessage: `Hola! Quiero consultar sobre ${cfg.label}.`,
      address:         "",
      mapUrl:          "",
      instagram:       "",
      facebook:        "",
      email:           "",
      schedule:        DEFAULT_SCHEDULE,
    },
    portada_b64: undefined,
    logo_b64:    undefined,
  };
}

// ─── App State ────────────────────────────────────────────────────────────────
export interface AppState {
  step: "upload" | "processing" | "editing" | "exporting";
  niche: Niche | null;
  uploadedFiles: File[];
  businessData: BusinessData | null;
  isProcessing: boolean;
  error: string | null;

  setStep:             (step: AppState["step"]) => void;
  setNiche:            (niche: Niche) => void;
  setUploadedFiles:    (files: File[]) => void;
  setBusinessData:     (data: BusinessData) => void;
  createFromScratch:   (niche: Niche) => void;
  updateDesignSystem:  (updates: Partial<DesignSystem>) => void;
  updateItem:          (id: string, updates: Partial<ExtractedItem>) => void;
  updateContactInfo:   (updates: Partial<ContactInfo>) => void;
  updateScheduleDay:   (index: number, updates: Partial<ScheduleDay>) => void;
  updateBusinessField: (field: keyof BusinessData, value: unknown) => void;
  addItem:             (category: string) => void;
  removeItem:          (id: string) => void;
  addCategory:         (name: string) => void;
  removeCategory:      (name: string) => void;
  setProcessing:       (v: boolean) => void;
  setError:            (e: string | null) => void;
  reset:               () => void;
}

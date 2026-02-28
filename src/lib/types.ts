// src/lib/types.ts  — DATA CONTRACT v2.2
// Aligned with: Python app.py + menu.json, SMS Dashboard, 3 premium templates
// ─────────────────────────────────────────────────────────────────────────────

export const SUPPORTED_NICHES = [
  "restaurante","barberia","estetica","clinica_medica","taller_mecanico",
  "catalogo_ropa","estudio_abogados","creador_contenido","gimnasio","veterinaria",
  "inmobiliaria","floreria","panaderia","estudio_tatuajes","fotografia",
  "academia_idiomas","coworking","lavanderia","optica","ferreteria",
] as const;

export type Niche = (typeof SUPPORTED_NICHES)[number];
export type TemplateType = "gastro" | "beauty" | "gym" | "default";

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
  style: "minimal" | "bold" | "elegant" | "playful" | "corporate";
}

export interface ExtractedItem {
  id: string;
  name: string;
  description: string;
  price: string | null;
  category: string;
}

export interface ContactInfo {
  whatsapp: string;
  whatsappMessage: string;
  address: string;
  mapUrl: string;
  instagram: string;
  facebook: string;
  email: string;
  schedule: string;
}

// ── THE MASTER CONTRACT ─────────────────────────────────────────────────────
// Each field here maps EXACTLY to something editable in the SMS Dashboard
// AND to a visible element in the generated site HTML.
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
  /** Cover/hero image — editable in CMS — maps to Python portada_b64 */
  portada_b64?: string;
  /** Logo image — editable in CMS — maps to Python logo_b64 */
  logo_b64?: string;
}

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
  addItem: (category: string) => void;
  removeItem: (id: string) => void;
  addCategory: (name: string) => void;
  removeCategory: (name: string) => void;
  setProcessing: (v: boolean) => void;
  setError: (e: string | null) => void;
  reset: () => void;
}

// src/lib/json-parser.ts
// ─── Layered JSON Parser ──────────────────────────────────────────────────────
// Recovers BusinessData from raw Gemini text.
// Layer 1: direct parse
// Layer 2: extract JSON from markdown fences
// Layer 3: aggressive regex extraction
// Layer 4: partial recovery with defaults
// ─────────────────────────────────────────────────────────────────────────────

import { BusinessData, DesignSystem, ExtractedItem, ContactInfo, Niche, NICHE_CONFIGS } from "./types";

interface ParseResult {
  success: boolean;
  data: BusinessData | null;
  error: string | null;
}

// Default fallback design based on Python defaults
const DEFAULT_DESIGN: DesignSystem = {
  primaryColor:    "#D4AF37",
  secondaryColor:  "#1E1E1E",
  backgroundColor: "#FFFFFF",
  textColor:       "#111111",
  mutedColor:      "#666666",
  accentColor:     "#D4AF37",
  fontHeading:     "Playfair Display",
  fontBody:        "Lato",
  borderRadius:    "12px",
  cardShadow:      "0 2px 12px rgba(0,0,0,0.08)",
  style:           "elegant",
};

const DEFAULT_CONTACT: ContactInfo = {
  whatsapp:        "",
  whatsappMessage: "Hola! Vengo de tu web y quiero consultar.",
  address:         "",
  mapUrl:          "",
  instagram:       "",
  facebook:        "",
  email:           "",
  schedule:        "",
};

export function parseAndValidateJSON(raw: string, niche: Niche): ParseResult {
  // Layer 1: Direct parse
  let parsed = tryParse(raw);

  // Layer 2: Strip markdown fences
  if (!parsed) {
    const stripped = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
    parsed = tryParse(stripped);
  }

  // Layer 3: Find first { ... } block
  if (!parsed) {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      parsed = tryParse(match[0]);
    }
  }

  // Layer 4: Fix common JSON issues (trailing commas)
  if (!parsed) {
    const fixed = raw
      .replace(/,\s*([}\]])/g, "$1")  // trailing commas
      .replace(/'/g, '"')              // single → double quotes
      .replace(/(\w+):/g, '"$1":');    // unquoted keys
    parsed = tryParse(fixed);
  }

  if (!parsed) {
    return { success: false, data: null, error: "No se pudo parsear el JSON de la respuesta de la IA." };
  }

  // Normalize to BusinessData contract
  try {
    const data = normalize(parsed, niche);
    return { success: true, data, error: null };
  } catch (e: any) {
    return { success: false, data: null, error: `Error de normalización: ${e.message}` };
  }
}

function tryParse(str: string): Record<string, unknown> | null {
  try {
    const obj = JSON.parse(str);
    return typeof obj === "object" && obj !== null ? obj as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

function normalize(raw: Record<string, unknown>, niche: Niche): BusinessData {
  const nicheConfig = NICHE_CONFIGS[niche];

  // ── Items ──────────────────────────────────────────────────────────────────
  // Handle both new format (items[]) and Python format (categorias{})
  let items: ExtractedItem[] = [];
  const categories: string[] = [];

  if (Array.isArray(raw.items) && raw.items.length > 0) {
    // New format from AI
    items = (raw.items as Record<string, unknown>[]).map((it, i) => ({
      id:          String(it.id || `item_${i + 1}`),
      name:        String(it.name || it.plato || it.nombre || ""),
      description: String(it.description || it.descripcion || ""),
      price:       it.price != null ? String(it.price) : (it.precio != null ? String(it.precio) : null),
      category:    String(it.category || it.categoria || nicheConfig.itemLabel),
    })).filter(it => it.name);

    // Build unique categories in order of appearance
    items.forEach(it => {
      if (!categories.includes(it.category)) categories.push(it.category);
    });
  } else if (raw.categorias) {
    // Python format: categorias{name: [{plato, precio, descripcion}]}
    // or categorias[{nombre, platos:[]}]
    let catObj: Record<string, unknown[]> = {};

    if (Array.isArray(raw.categorias)) {
      // List form from Python
      (raw.categorias as Record<string, unknown>[]).forEach(c => {
        const name = String(c.nombre || c.categoria || "General");
        const platos = (c.platos || c.items || []) as Record<string, unknown>[];
        catObj[name] = platos;
      });
    } else if (typeof raw.categorias === "object") {
      catObj = raw.categorias as Record<string, unknown[]>;
    }

    let counter = 1;
    Object.entries(catObj).forEach(([catName, platos]) => {
      categories.push(catName);
      (platos as Record<string, unknown>[]).forEach(p => {
        items.push({
          id:          `item_${counter++}`,
          name:        String(p.plato || p.nombre || p.name || ""),
          description: String(p.descripcion || p.description || ""),
          price:       p.precio != null ? String(p.precio) : (p.price != null ? String(p.price) : null),
          category:    catName,
        });
      });
    });
  }

  // Fallback categories from raw
  if (categories.length === 0 && Array.isArray(raw.categories)) {
    (raw.categories as unknown[]).forEach(c => categories.push(String(c)));
  }

  // ── Design System ──────────────────────────────────────────────────────────
  const rawDs = (raw.designSystem || raw.design || {}) as Record<string, unknown>;
  const designSystem: DesignSystem = {
    primaryColor:    coerceHex(rawDs.primaryColor    || rawDs.color_primary,    DEFAULT_DESIGN.primaryColor),
    secondaryColor:  coerceHex(rawDs.secondaryColor  || rawDs.color_secondary,  DEFAULT_DESIGN.secondaryColor),
    backgroundColor: coerceHex(rawDs.backgroundColor || rawDs.color_bg,        DEFAULT_DESIGN.backgroundColor),
    textColor:       coerceHex(rawDs.textColor       || rawDs.color_text,       DEFAULT_DESIGN.textColor),
    mutedColor:      coerceHex(rawDs.mutedColor,                                DEFAULT_DESIGN.mutedColor),
    accentColor:     coerceHex(rawDs.accentColor,                               DEFAULT_DESIGN.accentColor),
    fontHeading:     String(rawDs.fontHeading || rawDs.font_heading || DEFAULT_DESIGN.fontHeading),
    fontBody:        String(rawDs.fontBody    || rawDs.font_body    || DEFAULT_DESIGN.fontBody),
    borderRadius:    String(rawDs.borderRadius || rawDs.border_radius || DEFAULT_DESIGN.borderRadius),
    cardShadow:      String(rawDs.cardShadow  || DEFAULT_DESIGN.cardShadow),
    style:           validateStyle(rawDs.style) ?? DEFAULT_DESIGN.style,
  };

  // ── Contact ────────────────────────────────────────────────────────────────
  const rawContact = (raw.contactInfo || raw.contact || {}) as Record<string, unknown>;
  const rawRedes   = (raw.redes || {}) as Record<string, unknown>;

  const contactInfo: ContactInfo = {
    whatsapp:        String(rawContact.whatsapp        || rawRedes.whatsapp        || ""),
    whatsappMessage: String(rawContact.whatsappMessage || raw.mensaje_whatsapp     || DEFAULT_CONTACT.whatsappMessage),
    address:         String(rawContact.address         || raw.direccion            || ""),
    mapUrl:          String(rawContact.mapUrl          || rawRedes.maps            || ""),
    instagram:       String(rawContact.instagram       || rawRedes.instagram       || "").replace("@", ""),
    facebook:        String(rawContact.facebook        || rawRedes.facebook        || "").replace("@", ""),
    email:           String(rawContact.email           || raw.email                || ""),
    schedule:        String(rawContact.schedule        || raw.horario              || ""),
  };

  // ── Layout ─────────────────────────────────────────────────────────────────
  const layoutRaw = raw.layoutStyle || raw.layout_mode || rawDs.layout_mode || "grid";
  const layoutStyle: "grid" | "list" = layoutRaw === "list" ? "list" : "grid";

  return {
    businessName:  String(raw.businessName || raw.nombre_local || "Mi Negocio"),
    tagline:       String(raw.tagline      || raw.slogan       || ""),
    niche,
    seoDescription: String(raw.seoDescription || raw.descripcionSEO || "").slice(0, 155),
    designSystem,
    layoutStyle,
    categories:    categories.length > 0 ? categories : [nicheConfig.itemLabel + "s"],
    items,
    contactInfo,
  };
}

function coerceHex(val: unknown, fallback: string): string {
  if (typeof val === "string" && /^#[0-9a-fA-F]{6}$/.test(val.trim())) {
    return val.trim();
  }
  return fallback;
}

function validateStyle(val: unknown): DesignSystem["style"] | null {
  const valid = ["minimal", "bold", "elegant", "playful", "corporate"];
  return valid.includes(String(val)) ? (val as DesignSystem["style"]) : null;
}

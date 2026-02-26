// src/lib/json-parser.ts

import {
  BusinessData,
  ExtractedItem,
  DesignSystem,
  Niche,
  NICHE_CONFIGS,
} from "./types";

interface ParseResult {
  success: boolean;
  data: BusinessData | null;
  error: string | null;
}

/**
 * Parser de 4 capas. Si una falla, la siguiente lo intenta de otra forma.
 * Capa 1: JSON.parse directo
 * Capa 2: Limpieza de artefactos comunes (markdown fences, trailing commas)
 * Capa 3: Extracción con regex del bloque JSON dentro de texto basura
 * Capa 4: Reconstrucción parcial — salva lo que pueda
 */
export function parseAndValidateJSON(raw: string, niche: Niche): ParseResult {
  // ═══ CAPA 1: Parse directo ═══
  const layer1 = tryDirectParse(raw);
  if (layer1) {
    const validated = validateAndNormalize(layer1, niche);
    if (validated) return { success: true, data: validated, error: null };
  }

  // ═══ CAPA 2: Limpieza de artefactos ═══
  const cleaned = cleanArtifacts(raw);
  const layer2 = tryDirectParse(cleaned);
  if (layer2) {
    const validated = validateAndNormalize(layer2, niche);
    if (validated) return { success: true, data: validated, error: null };
  }

  // ═══ CAPA 3: Extracción regex ═══
  const extracted = extractJSONBlock(raw);
  if (extracted) {
    const layer3 = tryDirectParse(extracted);
    if (layer3) {
      const validated = validateAndNormalize(layer3, niche);
      if (validated) return { success: true, data: validated, error: null };
    }
  }

  // ═══ CAPA 4: Reconstrucción parcial ═══
  const reconstructed = attemptPartialReconstruction(raw, niche);
  if (reconstructed) {
    return { success: true, data: reconstructed, error: null };
  }

  return {
    success: false,
    data: null,
    error: "Las 4 capas del parser fallaron. El output de la IA es irrecuperable.",
  };
}

// ─── Capa 1: Parse directo ───
function tryDirectParse(text: string): any | null {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// ─── Capa 2: Limpieza de artefactos comunes ───
function cleanArtifacts(raw: string): string {
  let cleaned = raw;

  // Remover markdown code fences
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/gm, "");
  cleaned = cleaned.replace(/\n?```\s*$/gm, "");

  // Remover BOM y caracteres invisibles
  cleaned = cleaned.replace(/^\uFEFF/, "");
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // Remover trailing commas antes de } o ]
  cleaned = cleaned.replace(/,\s*([\]}])/g, "$1");

  // Reparar comillas simples a dobles (solo en keys/values)
  cleaned = cleaned.replace(
    /(['"])?([a-zA-Z_]\w*)\1\s*:/g,
    '"$2":'
  );

  // Remover comentarios estilo JS
  cleaned = cleaned.replace(/\/\/.*$/gm, "");
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, "");

  // Reparar "null" como string
  cleaned = cleaned.replace(/"null"/gi, "null");
  cleaned = cleaned.replace(/"undefined"/gi, "null");
  cleaned = cleaned.replace(/"N\/A"/gi, "null");
  cleaned = cleaned.replace(/"n\/a"/gi, "null");
  cleaned = cleaned.replace(/"-"/g, "null");

  return cleaned.trim();
}

// ─── Capa 3: Extracción con regex ───
function extractJSONBlock(raw: string): string | null {
  // Buscar el primer { y el último } balanceado
  const firstBrace = raw.indexOf("{");
  if (firstBrace === -1) return null;

  let depth = 0;
  let lastBrace = -1;

  for (let i = firstBrace; i < raw.length; i++) {
    if (raw[i] === "{") depth++;
    if (raw[i] === "}") {
      depth--;
      if (depth === 0) {
        lastBrace = i;
        break;
      }
    }
  }

  if (lastBrace === -1) return null;

  return raw.substring(firstBrace, lastBrace + 1);
}

// ─── Capa 4: Reconstrucción parcial ───
function attemptPartialReconstruction(
  raw: string,
  niche: Niche
): BusinessData | null {
  try {
    const config = NICHE_CONFIGS[niche];

    // Intentar extraer nombre del negocio
    const nameMatch = raw.match(/"businessName"\s*:\s*"([^"]+)"/);
    const businessName = nameMatch?.[1] || `Mi ${config.label}`;

    // Intentar extraer items con regex agresivo
    const items: ExtractedItem[] = [];
    const itemRegex =
      /"name"\s*:\s*"([^"]+)"[\s\S]*?"description"\s*:\s*"([^"]*)"[\s\S]*?"price"\s*:\s*("([^"]*?)"|null)/g;

    let match;
    let idx = 1;
    while ((match = itemRegex.exec(raw)) !== null) {
      items.push({
        id: `item_${idx}`,
        name: match[1],
        description: match[2] || `${config.itemLabel} de calidad premium.`,
        price: match[4] || null,
        category: "General",
        hasImage: false,
      });
      idx++;
    }

    if (items.length === 0) return null;

    // Intentar extraer colores
    const hexMatches = raw.match(/#[0-9a-fA-F]{6}/g) || [];

    const designSystem: DesignSystem = {
      primaryColor: hexMatches[0] || "#6d28d9",
      secondaryColor: hexMatches[1] || "#1e1b4b",
      accentColor: hexMatches[2] || "#f59e0b",
      backgroundColor: hexMatches[3] || "#fafafa",
      textColor: hexMatches[4] || "#18181b",
      mutedColor: hexMatches[5] || "#71717a",
      fontHeading: extractFont(raw, "fontHeading") || "Inter",
      fontBody: extractFont(raw, "fontBody") || "Inter",
      style: "minimal",
      borderRadius: "12px",
      cardShadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
    };

    // Extraer categorías únicas
    const categories = [...new Set(items.map((i) => i.category))];

    return {
      businessName,
      tagline: `Tu ${config.label.toLowerCase()} de confianza`,
      niche,
      items,
      categories,
      designSystem,
      contactInfo: {
        whatsapp: "",
        address: "",
        mapUrl: "",
        instagram: "",
        facebook: "",
        email: "",
        schedule: "",
      },
      seoDescription: `${businessName} — ${config.label}. Descubrí nuestros servicios y contactanos.`,
    };
  } catch {
    return null;
  }
}

function extractFont(raw: string, key: string): string | null {
  const match = raw.match(new RegExp(`"${key}"\\s*:\\s*"([^"]+)"`));
  return match?.[1] || null;
}

// ─── Validador y Normalizador Final ───
function validateAndNormalize(obj: any, niche: Niche): BusinessData | null {
  if (!obj || typeof obj !== "object") return null;

  const config = NICHE_CONFIGS[niche];

  // Validar campos obligatorios con fallbacks inteligentes
  const businessName =
    typeof obj.businessName === "string" && obj.businessName.trim()
      ? obj.businessName.trim()
      : `Mi ${config.label}`;

  const tagline =
    typeof obj.tagline === "string" && obj.tagline.trim()
      ? obj.tagline.trim()
      : `Tu ${config.label.toLowerCase()} de confianza`;

  const seoDescription =
    typeof obj.seoDescription === "string" && obj.seoDescription.trim()
      ? obj.seoDescription.trim().substring(0, 160)
      : `${businessName} — Descubrí todo lo que tenemos para vos.`;

  // Validar y normalizar items
  const rawItems = Array.isArray(obj.items) ? obj.items : [];
  const items: ExtractedItem[] = rawItems
    .filter((item: any) => item && typeof item.name === "string" && item.name.trim())
    .map((item: any, idx: number) => ({
      id: typeof item.id === "string" ? item.id : `item_${idx + 1}`,
      name: item.name.trim(),
      description:
        typeof item.description === "string" && item.description.trim()
          ? item.description.trim()
          : `${config.itemLabel.charAt(0).toUpperCase() + config.itemLabel.slice(1)} selecto de ${businessName}.`,
      price: normalizePrice(item.price),
      category:
        typeof item.category === "string" && item.category.trim()
          ? item.category.trim()
          : "General",
      hasImage: Boolean(item.hasImage),
      imageUrl: typeof item.imageUrl === "string" ? item.imageUrl : undefined,
    }));

  if (items.length === 0) return null;

  // Validar design system
  const ds = obj.designSystem || {};
  const designSystem: DesignSystem = {
    primaryColor: isValidHex(ds.primaryColor) ? ds.primaryColor : "#6d28d9",
    secondaryColor: isValidHex(ds.secondaryColor) ? ds.secondaryColor : "#1e1b4b",
    accentColor: isValidHex(ds.accentColor) ? ds.accentColor : "#f59e0b",
    backgroundColor: isValidHex(ds.backgroundColor) ? ds.backgroundColor : "#fafafa",
    textColor: isValidHex(ds.textColor) ? ds.textColor : "#18181b",
    mutedColor: isValidHex(ds.mutedColor) ? ds.mutedColor : "#71717a",
    fontHeading: typeof ds.fontHeading === "string" ? ds.fontHeading : "Inter",
    fontBody: typeof ds.fontBody === "string" ? ds.fontBody : "Inter",
    style: ["minimal", "bold", "elegant", "playful", "corporate"].includes(ds.style)
      ? ds.style
      : "minimal",
    borderRadius: typeof ds.borderRadius === "string" ? ds.borderRadius : "12px",
    cardShadow:
      typeof ds.cardShadow === "string"
        ? ds.cardShadow
        : "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
  };

  const categories = Array.isArray(obj.categories)
    ? obj.categories.filter((c: any) => typeof c === "string")
    : [...new Set(items.map((i) => i.category))];

  return {
    businessName,
    tagline,
    niche,
    items,
    categories: categories.length > 0 ? categories : ["General"],
    designSystem,
    contactInfo: {
      whatsapp: obj.contactInfo?.whatsapp || "",
      address: obj.contactInfo?.address || "",
      mapUrl: obj.contactInfo?.mapUrl || "",
      instagram: obj.contactInfo?.instagram || "",
      facebook: obj.contactInfo?.facebook || "",
      email: obj.contactInfo?.email || "",
      schedule: obj.contactInfo?.schedule || "",
    },
    seoDescription,
  };
}

function isValidHex(val: any): boolean {
  return typeof val === "string" && /^#[0-9a-fA-F]{6}$/.test(val);
}

function normalizePrice(val: any): string | null {
  if (val === null || val === undefined) return null;
  if (typeof val === "number") return `$${val}`;
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (!trimmed || trimmed.toLowerCase() === "null" || trimmed === "-" || trimmed.toLowerCase() === "n/a") {
      return null;
    }
    // Si no tiene símbolo de moneda, agregar $
    if (/^\d/.test(trimmed)) return `$${trimmed}`;
    return trimmed;
  }
  return null;
}
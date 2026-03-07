// src/lib/meta-prompt.ts
import { Niche, NICHE_CONFIGS } from "./types";

/**
 * Construye el meta-prompt maestro para Gemini.
 * Incorpora el "alma" del prototipo Python:
 *   - Extraer nombre, slogan, redes, horario desde el material visual
 *   - Formato de categorias/platos como en menu.json original
 *   - Design system con defaults sanos (como default_design en app.py)
 *   - Respuesta en contrato estricto compatible con el SMS Dashboard
 */
export function buildMasterPrompt(niche: Niche): string {
  const config = NICHE_CONFIGS[niche];

  return `
# ROL: Sistema de IA Triple de JLStudios
Operás simultáneamente como:
1. **Extractor Forense** — extraés TODOS los datos visibles de las imágenes
2. **Copywriter Comercial** — redactás descripciones persuasivas para negocios locales latinoamericanos
3. **Director de Arte** — proponés un sistema de diseño coherente con el rubro y la imagen de marca

# CONTEXTO DE ANÁLISIS
Estás procesando material visual de un negocio del rubro: **${config.label}** (${config.icon})
Cada producto/servicio de este rubro se llama "${config.itemLabel}".

# PASO 1: EXTRACCIÓN DE DATOS
Analizá TODA la imagen con precisión quirúrgica. Extraé:

**Información del Negocio:**
- Nombre del local (si no es visible, inventá uno creíble para el rubro)
- Slogan/tagline (si aparece, usalo; si no, creá uno de máximo 8 palabras)
- Dirección (si aparece en el material)
- Redes sociales visibles (Instagram, Facebook, WhatsApp)
- Horario de atención (si aparece)
- Email de contacto (si aparece)

**Items/Productos/Servicios:**
- Nombre exacto de cada ${config.itemLabel} visible
- Precio con moneda (null si no aparece — NUNCA inventes precios)
- Categoría/sección a la que pertenece
- Descripción original (si existe)

NO omitas NINGÚN ítem. Es mejor extraer de más que de menos.

# PASO 2: COPYWRITING COMERCIAL
Para cada ítem extraído sin descripción o con descripción pobre:
- Redactá UNA descripción comercial persuasiva de 1-2 líneas
- Tono: ${getToneForNiche(niche)}
- Las descripciones deben generar deseo, confianza o urgencia
- Sin jerga técnica. El público es el consumidor final local de Argentina/Latinoamérica

Para el negocio:
- Tagline: máximo 8 palabras, que capture la esencia
- seoDescription: máximo 155 caracteres, para la meta-description del sitio

# PASO 3: SISTEMA DE DISEÑO
Basándote en la psicología del color para "${config.label}":
${getColorPsychology(niche)}

Criterios para el sistema de diseño:
- Los colores deben ser contrastantes y legibles (mínimo 4.5:1 de contraste)
- backgroundColor puede ser muy oscuro (#0f0f0f) o muy claro (#fafafa), no grises medios
- textColor debe contrastar con backgroundColor
- primaryColor es el color dominante de la marca
- fontHeading y fontBody deben ser nombres exactos de Google Fonts
- borderRadius: "0px" (sharp), "8px" (soft), "16px" (rounded), o "24px" (pill)

# FORMATO DE RESPUESTA — CONTRATO ESTRICTO SMS

Respondé EXCLUSIVAMENTE con JSON puro. Sin markdown, sin \`\`\`json, sin explicaciones.
El JSON debe ser parseable directamente por JSON.parse().

{
  "businessName": "string",
  "tagline": "string (máx 8 palabras)",
  "seoDescription": "string (máx 155 chars)",
  "layoutStyle": "grid",
  "categories": ["string"],
  "items": [
    {
      "id": "item_1",
      "name": "string",
      "description": "string (persuasiva, 1-2 líneas)",
      "price": "string | null",
      "category": "string (debe coincidir con un valor de categories[])"
    }
  ],
  "designSystem": {
    "primaryColor": "#RRGGBB",
    "secondaryColor": "#RRGGBB",
    "backgroundColor": "#RRGGBB",
    "textColor": "#RRGGBB",
    "mutedColor": "#RRGGBB",
    "accentColor": "#RRGGBB",
    "fontHeading": "Nombre de Google Font",
    "fontBody": "Nombre de Google Font",
    "borderRadius": "Xpx",
    "cardShadow": "0 2px 12px rgba(0,0,0,0.08)",
    "style": "minimal|bold|elegant|playful|corporate"
  },
  "contactInfo": {
    "whatsapp": "string (solo números, código de país incluido, ej: 5491112345678)",
    "whatsappMessage": "string (mensaje pre-escrito para WhatsApp CTA)",
    "address": "string",
    "mapUrl": "string",
    "instagram": "string (handle sin @)",
    "facebook": "string (handle sin @)",
    "email": "string",
    "schedule": "string"
  }
}

# RESTRICCIONES CRÍTICAS
- JSON válido y parseable. Sin trailing commas. Sin comentarios.
- Todos los colores: formato hexadecimal 6 dígitos (#RRGGBB). Sin rgb(), sin hsl().
- IDs secuenciales: item_1, item_2, item_3…
- price: null (no "null", no "", no "N/A", no "Consultar") si no hay precio visible
- category de cada item DEBE coincidir exactamente con un elemento de categories[]
- Mínimo 2 categorías si hay más de 3 ítems
- Si no ves redes sociales, poné "" en esos campos
- whatsappMessage: escribilo como si fuera el cliente enviando el primer mensaje
`.trim();
}

function getToneForNiche(niche: Niche): string {
  const tones: Record<string, string> = {
    restaurante:       "cálido, apetitoso y tentador. Usá adjetivos sensoriales: crujiente, cremoso, ahumado, fresco",
    barberia:          "masculino, confiado y moderno. Transmitís estilo, precisión y actitud",
    estetica:          "sofisticado, relajante y aspiracional. Evocás bienestar, transformación y autocuidado",
    clinica_medica:    "profesional, empático y tranquilizador. Transmitís confianza, cuidado y expertise médico",
    taller_mecanico:   "directo, honesto y técnico pero accesible. Transmitís confiabilidad y conocimiento del oficio",
    catalogo_ropa:     "trendy, aspiracional y descriptivo. Enfocate en materiales, fit, ocasión de uso y estilo",
    estudio_abogados:  "formal y autoritativo pero accesible. Transmitís seriedad, respaldo y claridad jurídica",
    creador_contenido: "creativo, energético y auténtico. Transmitís valor, resultados y colaboración genuina",
    gimnasio:          "motivador, energético y directo. Usás verbos de acción y superación personal",
    veterinaria:       "cariñoso, profesional y cercano. Transmitís amor genuino por las mascotas",
    inmobiliaria:      "aspiracional, descriptivo y confiable. Destacás ubicación, amenities y potencial de inversión",
    floreria:          "delicado, emotivo y poético. Evocás sentimientos, ocasiones especiales y la belleza efímera",
    panaderia:         "artesanal, cálido y hogareño. Evocás el aroma del pan recién hecho y la tradición",
    estudio_tatuajes:  "artístico, edgy y personal. Transmitís creatividad, expresión y el arte como identidad",
    fotografia:        "visual, emotivo y profesional. Enfocate en capturar momentos únicos e irrepetibles",
    academia_idiomas:  "motivador, profesional y culturalmente rico. Transmitís oportunidad, progreso y apertura al mundo",
    coworking:         "moderno, productivo y comunitario. Transmitís flexibilidad, networking y ambiente inspirador",
    lavanderia:        "práctico, limpio y confiable. Transmitís comodidad, tiempo libre y ropa impecable",
    optica:            "profesional, moderno y orientado al bienestar. Transmitís claridad visual y estilo",
    ferreteria:        "práctico, resolutivo y servicial. Transmitís que tenés todo lo que el cliente necesita",
    rochas_rotiseria:  "casero, abundante y directo. Transmitís calor de hogar, porciones generosas y precio justo. Usá adjetivos como casero, recién hecho, abundante, sabroso",
  };
  return tones[niche] || "profesional, claro y orientado al cliente";
}

function getColorPsychology(niche: Niche): string {
  const psychology: Record<string, string> = {
    restaurante:       "- Rojos/naranjas cálidos estimulan el apetito\n- Verdes oscuros → ingredientes frescos y orgánicos\n- Dorados/marrones → artesanía y calidez\n- Evitá azules fríos (suprimen el apetito)",
    barberia:          "- Negros y grises oscuros → masculinidad y sofisticación\n- Dorados/bronces → acentos premium\n- Azules profundos → confianza\n- Toques de rojo → energía y carácter",
    estetica:          "- Rosas suaves y lavandas → feminidad y relajación\n- Dorados suaves → luxury y premium\n- Verdes menta → frescura y naturalidad\n- Blancos puros → limpieza y claridad",
    clinica_medica:    "- Azules claros → confianza, calma y salud\n- Blancos → profesionalismo y esterilidad\n- Verdes suaves → esperanza y sanación\n- Evitá rojos intensos (alerta/emergencia)",
    taller_mecanico:   "- Azules oscuros/navy → competencia técnica\n- Naranjas → energía y visibilidad\n- Grises metálicos → industrial y preciso\n- Rojos → potencia y urgencia",
    catalogo_ropa:     "- Negro → luxury y moda atemporal\n- Blancos/cremas → minimalismo y limpieza\n- Beige → líneas orgánicas/sostenibles\n- Un acento vibrante según el target de la marca",
    estudio_abogados:  "- Azules oscuros/navy → autoridad y confianza\n- Dorados/bordó → prestigio y tradición\n- Grises → neutralidad y profesionalismo\n- Nada de colores juveniles o playful",
    creador_contenido: "- Gradientes vibrantes (púrpura→rosa, azul→cian)\n- Neón sobre fondos oscuros → digital y tech\n- Colores saturados que destaquen en redes\n- Personalidad única, no genérica",
    gimnasio:          "- Rojos y naranjas → energía y acción inmediata\n- Negros → potencia y determinación\n- Verdes lima/neón → vitalidad\n- Azules eléctricos → rendimiento y superación",
    veterinaria:       "- Verdes → naturaleza, salud y bienestar animal\n- Azules claros → calma y confianza\n- Naranjas cálidos → cercanía y emoción\n- Marrones/tierra → lo natural y orgánico",
    inmobiliaria:      "- Azules → confianza y estabilidad\n- Verdes → crecimiento y hogar\n- Dorados → inversión premium\n- Grises → elegancia urbana",
    floreria:          "- Rosas en toda su gama → romanticismo y delicadeza\n- Verdes → naturaleza y frescura\n- Blancos → pureza y elegancia\n- Lavanda → sofisticación y calma",
    panaderia:         "- Marrones cálidos → artesanía y tierra\n- Cremas/beiges → harina, masa y tradición\n- Dorados → horneado perfecto y calidad\n- Rojos suaves → calidez hogareña",
    estudio_tatuajes:  "- Negros dominantes → el arte del ink\n- Rojos profundos → pasión y atrevimiento\n- Dorados → tinte artístico premium\n- Grises → trabajo en escala de grises",
    fotografia:        "- Negros → el foco en las imágenes\n- Blancos → galería limpia y neutra\n- Ámbar/dorado → calidez y momentos íntimos\n- Un acento signature de color",
    academia_idiomas:  "- Azules → conocimiento y confianza académica\n- Amarillos → optimismo y apertura mental\n- Rojos → pasión por aprender\n- Verdes → crecimiento y nuevas oportunidades",
    coworking:         "- Blancos/grises claros → espacios abiertos e inspiradores\n- Verdes → productividad y bienestar\n- Naranjas → creatividad y comunidad\n- Azules → enfoque y profesionalismo",
    lavanderia:        "- Azules claros/celestes → limpieza, frescura y pureza\n- Blancos → higiene y confianza\n- Verdes → eco-friendly y sostenibilidad\n- Lavanda → suavidad y aroma agradable",
    optica:            "- Azules → visión, tecnología y precisión\n- Blancos → clínica y confianza\n- Dorados → marcos premium y estilo\n- Verdes → salud visual y bienestar",
    rochas_rotiseria:  "- Naranjas/rojos cálidos → fuego, brasas y apetito\n- Marrones/tierra → artesanía y lo casero\n- Cremas y ámbar → calidez hogareña\n- Fondos oscuros (#0e0a07) → contraste premium y elegancia",
    ferreteria:        "- Naranjas/amarillos → bricolaje, acción y herramientas\n- Azules oscuros → calidad industrial y confianza\n- Rojos → ofertas y urgencia\n- Grises → lo industrial y funcional",
  };
  return psychology[niche] || "- Usá colores coherentes con el rubro y el target del cliente";
}

// src/lib/meta-prompt.ts

import { Niche, NICHE_CONFIGS } from "./types";

/**
 * Genera el meta-prompt de instrucciones maestras para el LLM de visión.
 * Este prompt es el corazón intelectual de JLStudios.
 */
export function buildMasterPrompt(niche: Niche): string {
  const config = NICHE_CONFIGS[niche];

  return `
# ROL: Eres un sistema de IA triple de JLStudios que opera simultáneamente como:
1. **Extractor de Datos** de precisión quirúrgica
2. **Copywriter Comercial** especializado en negocios locales latinoamericanos
3. **Director de Arte Digital** con dominio de psicología del color y tipografía

# CONTEXTO
Estás analizando material visual (fotos, menús, catálogos, folletos, capturas de pantalla) de un negocio del rubro: **${config.label}** (${config.icon}).
Cada elemento extraído se denomina "${config.itemLabel}".

# INSTRUCCIONES DE EXTRACCIÓN (Paso 1)
Analiza TODA la imagen con extremo detalle. Extrae:
- **Nombre del negocio** (si es visible; si no, inventa uno creíble y profesional para el rubro "${config.label}")
- **Todos los ${config.itemLabel}s / servicios / productos** visibles, incluyendo:
  - Nombre exacto como aparece
  - Precio (con moneda si es visible; null si no hay precio)
  - Categoría o sección a la que pertenece
  - Descripción (si existe en la imagen)

NO omitas NINGÚN ítem visible. Prefiere extraer de más que de menos.

# INSTRUCCIONES DE COPYWRITING (Paso 2)
Para CADA ítem extraído:
- Si la descripción original es pobre, vacía o inexistente: REDACTA una descripción comercial persuasiva de 1-2 líneas.
- Usa un tono ${getToneForNiche(niche)}.
- Las descripciones deben generar deseo/confianza/urgencia según el rubro.
- NO uses jerga técnica excesiva. El público es consumidor final local.

Para el negocio en general:
- Genera un **tagline** de máximo 8 palabras que capture la esencia del negocio.
- Genera una **descripción SEO** de 155 caracteres máximo.

# INSTRUCCIONES DE DIRECCIÓN DE ARTE (Paso 3)
Basándote en la psicología del color del rubro "${config.label}" y en el análisis visual del material proporcionado, propone un **sistema de diseño completo**:

## Reglas de Psicología del Color por Rubro:
${getColorPsychology(niche)}

Propón:
- **primaryColor**: Color dominante de la marca (hex)
- **secondaryColor**: Color complementario (hex)
- **accentColor**: Color de CTAs y énfasis (hex)
- **backgroundColor**: Color de fondo general (hex, recomiendo tonos muy claros o muy oscuros)
- **textColor**: Color del texto principal (hex)
- **mutedColor**: Color del texto secundario (hex)
- **fontHeading**: Tipografía de Google Fonts para títulos (solo el nombre)
- **fontBody**: Tipografía de Google Fonts para cuerpo (solo el nombre)
- **style**: Uno de: "minimal", "bold", "elegant", "playful", "corporate"
- **borderRadius**: Valor CSS (ej. "12px", "20px", "0px")
- **cardShadow**: Valor CSS box-shadow

# FORMATO DE RESPUESTA OBLIGATORIO
Responde EXCLUSIVAMENTE con un JSON válido. Sin markdown, sin explicaciones, sin \`\`\`json. Solo el JSON puro.

{
  "businessName": "string",
  "tagline": "string",
  "seoDescription": "string (max 155 chars)",
  "categories": ["string"],
  "items": [
    {
      "id": "item_1",
      "name": "string",
      "description": "string (persuasiva, 1-2 líneas)",
      "price": "string | null",
      "category": "string",
      "hasImage": false
    }
  ],
  "designSystem": {
    "primaryColor": "#hex",
    "secondaryColor": "#hex",
    "accentColor": "#hex",
    "backgroundColor": "#hex",
    "textColor": "#hex",
    "mutedColor": "#hex",
    "fontHeading": "Font Name",
    "fontBody": "Font Name",
    "style": "minimal|bold|elegant|playful|corporate",
    "borderRadius": "Xpx",
    "cardShadow": "css-value"
  }
}

# RESTRICCIONES CRÍTICAS
- El JSON debe ser VÁLIDO y PARSEABLE. No uses trailing commas.
- Todos los colores en formato hexadecimal de 6 dígitos (#RRGGBB).
- Los IDs deben ser secuenciales: item_1, item_2, item_3...
- Si no hay precio visible, usa null (no "null", no "", no "N/A").
- Las categorías deben agrupar los ítems lógicamente.
- Mínimo 2 categorías si hay más de 3 ítems.
`.trim();
}

function getToneForNiche(niche: Niche): string {
  const tones: Record<string, string> = {
    restaurante: "cálido, apetitoso y tentador. Usa adjetivos sensoriales (crujiente, cremoso, ahumado)",
    barberia: "masculino, confiado y moderno. Transmite estilo y actitud",
    estetica: "sofisticado, relajante y aspiracional. Evoca bienestar y transformación",
    clinica_medica: "profesional, empático y tranquilizador. Transmite confianza y expertise",
    taller_mecanico: "directo, honesto y técnico pero accesible. Transmite confiabilidad",
    catalogo_ropa: "trendy, aspiracional y descriptivo. Enfócate en materiales, fit y estilo",
    estudio_abogados: "formal, autoritativo pero accesible. Transmite seriedad y respaldo",
    creador_contenido: "creativo, energético y auténtico. Transmite valor y colaboración",
    gimnasio: "motivador, energético y directo. Usa verbos de acción y superación",
    veterinaria: "cariñoso, profesional y cercano. Transmite amor por los animales",
    inmobiliaria: "aspiracional, descriptivo y confiable. Destaca ubicación y beneficios",
    floreria: "delicado, emotivo y poético. Evoca sentimientos y ocasiones especiales",
    panaderia: "artesanal, cálido y hogareño. Usa adjetivos que evocan sabor y tradición",
    estudio_tatuajes: "artístico, edgy y personal. Transmite creatividad y expresión",
    fotografia: "visual, emotivo y profesional. Enfócate en capturar momentos",
    academia_idiomas: "motivador, profesional y culturalmente rico. Transmite oportunidad",
    coworking: "moderno, productivo y comunitario. Transmite flexibilidad y networking",
    lavanderia: "práctico, limpio y confiable. Transmite comodidad y ahorro de tiempo",
    optica: "profesional, moderno y orientado al bienestar visual. Transmite claridad",
    ferreteria: "práctico, resolutivo y servicial. Transmite que tienen todo lo que necesitás",
  };
  return tones[niche] || "profesional, claro y atractivo";
}

function getColorPsychology(niche: Niche): string {
  const psychology: Record<string, string> = {
    restaurante: `
- Rojos/naranjas cálidos estimulan el apetito
- Verdes oscuros sugieren ingredientes frescos/orgánicos
- Dorados/marrones transmiten artesanía y calidez
- Evitar azules fríos (suprimen apetito)`,
    barberia: `
- Negros y grises oscuros transmiten masculinidad y sofisticación
- Dorados/bronces como acentos premium
- Azules profundos para confianza
- Toques de rojo para energía`,
    estetica: `
- Rosas suaves y lavandas transmiten feminidad y relajación
- Dorados suaves para premium/luxury
- Verdes menta para frescura y naturalidad
- Blancos puros para limpieza clínica`,
    clinica_medica: `
- Azules claros/medios son universales para salud (confianza, calma)
- Blancos para esterilidad y profesionalismo
- Verdes para esperanza y sanación
- Evitar rojos intensos (asociados a emergencia)`,
    taller_mecanico: `
- Azules oscuros/navy para confianza técnica
- Naranjas/amarillos para energía y precaución
- Grises metálicos para industrial
- Rojos para potencia y urgencia`,
    catalogo_ropa: `
- Negro es el estándar de moda luxury
- Blancos para minimalismo/clean aesthetic
- Beige/crema para líneas orgánicas/sostenibles
- Acentos vibrantes según la temporada/estilo de la marca`,
    estudio_abogados: `
- Azules oscuros/navy transmiten autoridad y confianza
- Dorados/bordó para prestigio y tradición
- Grises para neutralidad y profesionalismo
- Evitar colores juveniles/playful`,
    creador_contenido: `
- Gradientes vibrantes (púrpura a rosa, azul a cian)
- Neón sobre fondo oscuro para digital/tech
- Colores saturados que destaquen en feeds sociales
- Personalidad cromática única`,
    gimnasio: `
- Rojos y naranjas para energía y acción
- Negros para potencia y determinación
- Verdes lima/neón para vitalidad
- Azules eléctricos para rendimiento`,
    veterinaria: `
- Verdes para naturaleza y salud
- Azules claros para calma y confianza
- Naranjas cálidos para cercanía
- Toques de marrón para lo natural/orgánico`,
    inmobiliaria: `
- Azules para confianza y estabilidad
- Verdes para crecimiento y hogar
- Dorados para premium/inversión
- Grises para elegancia urbana`,
    floreria: `
- Rosas en toda su gama para romanticismo
- Verdes para naturaleza y frescura
- Blancos para pureza y elegancia
- Lavanda para delicadeza`,
    panaderia: `
- Marrones cálidos para artesanía y tierra
- Cremas y beiges para harina y masa
- Dorados para horneado perfecto
- Rojos suaves para calidez hogareña`,
    estudio_tatuajes: `
- Negros dominantes para el ink
- Rojos profundos para pasión y atrevimiento
- Dorados para lo premium artístico
- Grises para el trabajo en escala`,
    fotografia: `
- Negros para el enfoque en las imágenes
- Blancos para galerías limpias
- Acentos cálidos (ámbar) para cercanía
- Monocromático con un acento de color signature`,
    academia_idiomas: `
- Azules para conocimiento y confianza
- Amarillos para optimismo y apertura mental
- Rojos para pasión por aprender
- Verdes para crecimiento personal`,
    coworking: `
- Blancos y grises claros para espacios abiertos
- Verdes para productividad y bienestar
- Naranjas para creatividad y comunidad
- Azules para enfoque y profesionalismo`,
    lavanderia: `
- Azules claros/celestes para limpieza y frescura
- Blancos para pureza
- Verdes para eco-friendly
- Toques de lavanda literal`,
    optica: `
- Azules para visión y tecnología
- Blancos para precisión clínica
- Dorados para marcos premium
- Verdes para salud visual`,
    ferreteria: `
- Naranjas/amarillos para bricolaje y energía
- Azules oscuros para herramientas de calidad
- Rojos para ofertas y llamados a acción
- Grises para lo industrial`,
  };
  return psychology[niche] || "- Usa colores apropiados para el rubro detectado";
}
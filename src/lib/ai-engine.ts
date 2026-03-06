// src/lib/ai-engine.ts
// ─────────────────────────────────────────────────────────────────────────────
// CHANGES vs versión anterior:
//
// 1. Modelo cambiado de "gemini-2.5-flash" → "gemini-2.0-flash"
//    "gemini-2.5-flash" es el nombre preview/experimental — NO es el string
//    correcto para el SDK de producción y puede causar "Model not found".
//    "gemini-2.0-flash" es el modelo estable, rápido y con visión multimodal.
//    (Si querés 2.5, el string correcto es "gemini-2.5-flash-preview-04-17")
//
// 2. Logs detallados en server para trazar exactamente dónde falla:
//    rawText vacío → model respondió pero sin contenido (safety filter?)
//    parsed.error → qué dice el json-parser
//    rescue → si el rescue layer también falla
// ─────────────────────────────────────────────────────────────────────────────
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Part } from "@google/generative-ai";
import { buildMasterPrompt } from "./meta-prompt";
import { parseAndValidateJSON } from "./json-parser";
import { BusinessData, Niche } from "./types";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

// Modelo estable con visión. Cambiá a "gemini-2.5-flash-preview-04-17" si querés 2.5.
const VISION_MODEL = "gemini-2.5-flash";

interface AIAnalysisResult {
  success: boolean;
  data: BusinessData | null;
  error: string | null;
  rawResponse: string;
}

export async function analyzeWithAI(
  imageBuffers: { data: Buffer; mimeType: string }[],
  niche: Niche,
  additionalContext?: string
): Promise<AIAnalysisResult> {
  const masterPrompt = buildMasterPrompt(niche);

  console.log(`[AI-ENGINE] Iniciando análisis — niche: ${niche}, archivos: ${imageBuffers.length}, modelo: ${VISION_MODEL}`);

  try {
    const model = genAI.getGenerativeModel({
      model: VISION_MODEL,
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
      generationConfig: {
        temperature: 0.4,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      },
    });

    const parts: Part[] = [{ text: masterPrompt }];

    if (additionalContext?.trim()) {
      parts.push({ text: `\n\n# CONTEXTO ADICIONAL DEL OPERADOR:\n${additionalContext.trim()}` });
    }

    for (const img of imageBuffers) {
      console.log(`[AI-ENGINE] Adjuntando imagen — mimeType: ${img.mimeType}, size: ${img.data.length} bytes`);
      parts.push({
        inlineData: {
          mimeType: img.mimeType,
          data: img.data.toString("base64"),
        },
      });
    }

    console.log("[AI-ENGINE] Llamando a Gemini...");
    const result   = await model.generateContent(parts);
    const response = await result.response;
    const rawText  = response.text();

    // Log del resultado crudo para debugging
    console.log(`[AI-ENGINE] Respuesta recibida — length: ${rawText.length} chars`);
    if (!rawText || rawText.trim().length === 0) {
      console.error("[AI-ENGINE] rawText vacío — posible bloqueo por safety filters o modelo sin contenido");
      return {
        success: false,
        data: null,
        error: "Gemini devolvió una respuesta vacía. El archivo puede estar siendo bloqueado por filtros de seguridad. Intentá con otra imagen.",
        rawResponse: "",
      };
    }

    // Mostrar los primeros 300 chars del rawText para debuggear en logs del servidor
    console.log(`[AI-ENGINE] rawText preview: ${rawText.substring(0, 300)}`);

    const parsed = parseAndValidateJSON(rawText, niche);

    if (parsed.success) {
      console.log("[AI-ENGINE] ✅ Parse exitoso");
      return { success: true, data: parsed.data, error: null, rawResponse: rawText };
    }

    console.warn(`[AI-ENGINE] Parser falló: ${parsed.error} — iniciando rescue...`);
    const rescue = await attemptRecovery(rawText, niche);

    if (rescue.success) {
      console.log("[AI-ENGINE] ✅ Rescue exitoso");
      return { success: true, data: rescue.data, error: null, rawResponse: rawText };
    }

    console.error(`[AI-ENGINE] ❌ Rescue también falló — error original: ${parsed.error}`);
    return {
      success: false,
      data: null,
      error: `No se pudo parsear la respuesta de Gemini: ${parsed.error}`,
      rawResponse: rawText,
    };

  } catch (err: unknown) {
    console.error("[AI-ENGINE] Error crítico durante generateContent:", err);

    const e = err as { status?: number; message?: string; code?: string };

    if (e?.status === 429 || e?.message?.includes("429")) {
      return { success: false, data: null, error: "Rate limit excedido. Esperá un minuto e intentá de nuevo.", rawResponse: "" };
    }
    if (e?.message?.includes("DEADLINE_EXCEEDED") || e?.message?.includes("timeout")) {
      return { success: false, data: null, error: "Gemini tardó demasiado. Probá con un archivo más pequeño.", rawResponse: "" };
    }
    if (e?.message?.includes("not found") || e?.message?.includes("404")) {
      return { success: false, data: null, error: `Modelo no encontrado: ${VISION_MODEL}. Verificá el nombre del modelo en ai-engine.ts.`, rawResponse: "" };
    }

    return {
      success: false,
      data: null,
      error: `Error con Gemini (${VISION_MODEL}): ${e?.message ?? "desconocido"}`,
      rawResponse: "",
    };
  }
}

async function attemptRecovery(
  brokenJSON: string,
  niche: Niche
): Promise<{ success: boolean; data: BusinessData | null }> {
  try {
    const model = genAI.getGenerativeModel({
      model: VISION_MODEL,
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      },
    });

    const prompt = `
Eres un experto reparador de JSON. El siguiente texto debería ser un JSON válido pero tiene errores de sintaxis.
Tu ÚNICA tarea es devolver el JSON corregido y completo. No agregues ni elimines datos, solo arreglá la estructura.
Respondé SOLO con el JSON puro, sin markdown, sin explicaciones.

Texto a reparar:
---
${brokenJSON.substring(0, 6000)}
---
    `.trim();

    const result = await model.generateContent(prompt);
    const fixed  = result.response.text();
    console.log(`[RECOVERY] Respuesta: ${fixed.substring(0, 200)}`);
    const parsed = parseAndValidateJSON(fixed, niche);

    return { success: parsed.success, data: parsed.data };
  } catch (e) {
    console.error("[RECOVERY] Falló:", e);
    return { success: false, data: null };
  }
}

// src/lib/ai-engine.ts

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { buildMasterPrompt } from "./meta-prompt";
import { parseAndValidateJSON } from "./json-parser";
import { BusinessData, Niche } from "./types";

// Inicializamos la IA con la clave de entorno
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

interface AIAnalysisResult {
  success: boolean;
  data: BusinessData | null;
  error: string | null;
  rawResponse: string;
}

/**
 * Motor principal de análisis con IA.
 * Envía las imágenes + meta-prompt a Gemini y procesa la respuesta.
 */
export async function analyzeWithAI(
  imageBuffers: { data: Buffer; mimeType: string }[],
  niche: Niche,
  additionalContext?: string
): Promise<AIAnalysisResult> {
  const masterPrompt = buildMasterPrompt(niche);

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // Asegúrate de que este nombre sea el soportado por tu API Key
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
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

    // Construir las partes del mensaje multimodal
    const parts: any[] = [{ text: masterPrompt }];

    if (additionalContext) {
      parts.push({ text: `\n\n# CONTEXTO ADICIONAL DEL OPERADOR:\n${additionalContext}` });
    }

    // Agregar todas las imágenes convertidas a base64
    for (const img of imageBuffers) {
      parts.push({
        inlineData: {
          mimeType: img.mimeType,
          data: img.data.toString("base64"),
        },
      });
    }

    const result = await model.generateContent(parts);
    const response = await result.response;
    const rawText = response.text();

    // Enviar al layered parser para validar el JSON
    const parsed = parseAndValidateJSON(rawText, niche);

    if (parsed.success) {
      return {
        success: true,
        data: parsed.data,
        error: null,
        rawResponse: rawText,
      };
    } else {
      // CAPA DE RESCATE: Si el primer JSON falla, intentamos una recuperación con la IA
      console.warn("[AI-ENGINE] Parser falló, iniciando intento de recuperación...");
      const recoveryResult = await attemptRecovery(rawText, niche);
      
      if (recoveryResult.success) {
        return {
          success: true,
          data: recoveryResult.data,
          error: null,
          rawResponse: rawText,
        };
      }

      return {
        success: false,
        data: null,
        error: `El parser no pudo procesar la respuesta. Detalle: ${parsed.error}`,
        rawResponse: rawText,
      };
    }
  } catch (error: any) {
    console.error("[AI-ENGINE] Error crítico:", error);

    // Manejo de errores específicos de la API de Google
    if (error?.status === 429) {
      return { success: false, data: null, error: "Límite de velocidad excedido (Rate limit). Esperá un minuto.", rawResponse: "" };
    }

    return {
      success: false,
      data: null,
      error: `Error de conexión con Gemini: ${error.message || "desconocido"}`,
      rawResponse: "",
    };
  }
}

/**
 * Intento de recuperación automática.
 * Si el primer JSON viene mal formado, le pedimos a un modelo rápido que lo limpie.
 */
async function attemptRecovery(
  brokenJSON: string,
  niche: Niche
): Promise<{ success: boolean; data: BusinessData | null }> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      },
    });

    const recoveryPrompt = `
      Eres un experto reparador de sintaxis JSON. El texto entre guiones debería ser un JSON válido pero tiene errores.
      Tu única tarea es devolver el JSON corregido y completo. No inventes datos, solo arregla la estructura.
      
      Texto a reparar:
      ---
      ${brokenJSON.substring(0, 6000)}
      ---
      Devuelve SOLO el JSON corregido.`.trim();

    const result = await model.generateContent(recoveryPrompt);
    const fixed = result.response.text();
    const parsed = parseAndValidateJSON(fixed, niche);

    return { success: parsed.success, data: parsed.data };
  } catch (error) {
    console.error("[RECOVERY] Falló el intento de rescate:", error);
    return { success: false, data: null };
  }
}
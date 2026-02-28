// src/lib/ai-engine.ts
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Part } from "@google/generative-ai";
import { buildMasterPrompt } from "./meta-prompt";
import { parseAndValidateJSON } from "./json-parser";
import { BusinessData, Niche } from "./types";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

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

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
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

    const parts: Part[] = [
      { text: masterPrompt },
    ];

    if (additionalContext?.trim()) {
      parts.push({ text: `\n\n# CONTEXTO ADICIONAL DEL OPERADOR:\n${additionalContext.trim()}` });
    }

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
    const rawText  = response.text();

    const parsed = parseAndValidateJSON(rawText, niche);

    if (parsed.success) {
      return { success: true, data: parsed.data, error: null, rawResponse: rawText };
    }

    // Rescue layer — ask a fast model to fix the broken JSON
    console.warn("[AI-ENGINE] Parser falló, iniciando rescate...");
    const rescue = await attemptRecovery(rawText, niche);

    if (rescue.success) {
      return { success: true, data: rescue.data, error: null, rawResponse: rawText };
    }

    return {
      success: false,
      data: null,
      error: `Parser falló: ${parsed.error}`,
      rawResponse: rawText,
    };
  } catch (err: unknown) {
    console.error("[AI-ENGINE] Error crítico:", err);

    const e = err as { status?: number; message?: string };
    if (e?.status === 429) {
      return { success: false, data: null, error: "Rate limit excedido. Esperá un minuto.", rawResponse: "" };
    }

    return {
      success: false,
      data: null,
      error: `Error con Gemini: ${e?.message ?? "desconocido"}`,
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
      model: "gemini-2.5-flash",
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
    const parsed = parseAndValidateJSON(fixed, niche);

    return { success: parsed.success, data: parsed.data };
  } catch (e) {
    console.error("[RECOVERY] Falló:", e);
    return { success: false, data: null };
  }
}

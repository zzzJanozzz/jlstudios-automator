// src/app/api/analyze/route.ts

import { NextRequest, NextResponse } from "next/server";
import { analyzeWithAI } from "@/lib/ai-engine";
import { Niche, SUPPORTED_NICHES } from "@/lib/types";

export const maxDuration = 60; // Vercel: max function duration

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const niche = formData.get("niche") as string;
    const context = formData.get("context") as string | null;

    // Validar nicho
    if (!niche || !SUPPORTED_NICHES.includes(niche as Niche)) {
      return NextResponse.json(
        { error: "Nicho inválido o no proporcionado." },
        { status: 400 }
      );
    }

    // Recolectar archivos de imagen
    const imageBuffers: { data: Buffer; mimeType: string }[] = [];
    const entries = Array.from(formData.entries());

    for (const [key, value] of entries) {
      if (key.startsWith("file") && value instanceof File) {
        const arrayBuffer = await value.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        imageBuffers.push({
          data: buffer,
          mimeType: value.type || "image/jpeg",
        });
      }
    }

    if (imageBuffers.length === 0) {
      return NextResponse.json(
        { error: "No se recibieron imágenes." },
        { status: 400 }
      );
    }

    // Ejecutar el motor de IA
    const result = await analyzeWithAI(
      imageBuffers,
      niche as Niche,
      context || undefined
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error, rawResponse: result.rawResponse },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error: any) {
    console.error("[API/ANALYZE] Error no manejado:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
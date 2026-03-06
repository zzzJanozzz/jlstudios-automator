import { NextRequest, NextResponse } from "next/server";
import { analyzeWithAI } from "@/lib/ai-engine";
import { Niche, SUPPORTED_NICHES } from "@/lib/types";

export const maxDuration = 60;

function errorResponse(message: string, status: number): NextResponse {
  console.error(`[/api/analyze] ${status} — ${message}`);
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let formData: FormData;

  // 1. Parsear el body y atrapar el Error 413 de Next.js
  try {
    formData = await req.formData();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("413") || msg.toLowerCase().includes("too large") || msg.toLowerCase().includes("size limit")) {
      return errorResponse("Archivo demasiado grande. El límite es 20 MB.", 413);
    }
    return errorResponse(`Error al leer el cuerpo de la solicitud: ${msg}`, 400);
  }

  // 2. Validar Nicho y Contexto
  const niche = formData.get("niche") as string;
  const context = formData.get("context") as string | null;

  if (!niche || !SUPPORTED_NICHES.includes(niche as Niche)) {
    return errorResponse("El campo 'niche' es requerido o inválido.", 400);
  }

  // 3. Recolectar Archivos (Soporta clave "files" o "file")
  const rawFiles = formData.getAll("files");
  const legacyFile = formData.get("file");
  const allFiles = [...rawFiles, ...(legacyFile ? [legacyFile] : [])];

  const files = allFiles.filter((f): f is File => f instanceof File);

  if (!files.length) {
    return errorResponse("No se encontraron archivos válidos en la solicitud.", 400);
  }

  // 4. Validar Tamaño y Convertir a Buffer para ai-engine.ts
  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
  const imageBuffers: { data: Buffer; mimeType: string }[] = [];

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      return errorResponse(`El archivo "${file.name}" excede el límite de 20 MB.`, 413);
    }
    
    // Transformación obligatoria de File a Buffer
    const arrayBuffer = await file.arrayBuffer();
    imageBuffers.push({
      data: Buffer.from(arrayBuffer),
      mimeType: file.type || "application/octet-stream",
    });
  }

  // 5. Llamar al motor de IA con los argumentos correctos
  try {
    const result = await analyzeWithAI(imageBuffers, niche as Niche, context || undefined);

    // Evaluar la respuesta estandarizada de tu ai-engine.ts
    if (!result.success) {
      return errorResponse(result.error || "No se pudo extraer información válida del archivo.", 422);
    }

    if (!result.data) {
      return errorResponse("La IA retornó una respuesta vacía. Asegúrate de subir un archivo legible.", 422);
    }

    // RELAJACIÓN DE RESTRICCIÓN: Asignación de nombre por defecto si la extracción es parcial
    if (!result.data.businessName || result.data.businessName.trim() === "") {
      result.data.businessName = "Mi Negocio";
    }

    // 6. Éxito
    return NextResponse.json({ success: true, data: result.data }, { status: 200 });

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    
    if (msg.includes("timeout") || msg.includes("DEADLINE_EXCEEDED")) {
      return errorResponse("La IA tardó demasiado en responder. Intenta de nuevo.", 504);
    }
    
    if (msg.includes("quota") || msg.includes("429")) {
      return errorResponse("Se agotó la cuota de la API. Intenta de nuevo en unos minutos.", 429);
    }

    console.error("[/api/analyze] Error crítico no manejado:", err);
    return errorResponse(`Error interno del servidor: ${msg}`, 500);
  }
}
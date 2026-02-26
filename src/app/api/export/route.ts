// src/app/api/export/route.ts

import { NextRequest, NextResponse } from "next/server";
import { BusinessData } from "@/lib/types";
import { generateFullSite } from "@/lib/template-engine";
import { buildZip } from "@/lib/zip-builder";

export async function POST(request: NextRequest) {
  try {
    const body: { businessData: BusinessData } = await request.json();

    if (!body.businessData) {
      return NextResponse.json(
        { error: "No se recibieron datos del negocio." },
        { status: 400 }
      );
    }

    const siteFiles = generateFullSite(body.businessData);
    const zipBuffer = await buildZip(siteFiles, body.businessData.businessName);

    return new NextResponse(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${slugify(body.businessData.businessName)}-website.zip"`,
      },
    });
  } catch (error: any) {
    console.error("[API/EXPORT] Error:", error);
    return NextResponse.json(
      { error: "Error al generar el paquete de exportación." },
      { status: 500 }
    );
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
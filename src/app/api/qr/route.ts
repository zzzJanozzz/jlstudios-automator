// src/app/api/qr/route.ts

import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL requerida." }, { status: 400 });
    }

    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 512,
      margin: 2,
      color: {
        dark: "#18181b",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    });

    return NextResponse.json({ qr: qrDataUrl });
  } catch (error: any) {
    console.error("[API/QR] Error:", error);
    return NextResponse.json(
      { error: "Error al generar QR." },
      { status: 500 }
    );
  }
}
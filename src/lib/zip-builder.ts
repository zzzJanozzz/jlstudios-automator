// src/lib/zip-builder.ts

import JSZip from "jszip";

export interface SiteFile {
  path: string;
  content: string;
}

export async function buildZip(
  files: SiteFile[],
  businessName: string
): Promise<Buffer> {
  const zip = new JSZip();

  const folderName = businessName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const folder = zip.folder(folderName)!;

  for (const file of files) {
    folder.file(file.path, file.content);
  }

  // README de instrucciones
  folder.file(
    "INSTRUCCIONES.txt",
    `═══════════════════════════════════════════
  SITIO WEB — ${businessName}
  Generado por JLStudios Web Automator
  Fecha: ${new Date().toLocaleDateString("es-AR")}
═══════════════════════════════════════════

CÓMO SUBIR ESTE SITIO:

1. Descomprimí esta carpeta.
2. Subí TODOS los archivos a tu hosting (Netlify, Vercel, o cualquier hosting).
3. El archivo principal es "index.html".
4. Si usás Netlify: arrastrá la carpeta directamente a app.netlify.com/drop

¿Necesitás ayuda? Contactá a JLStudios.
`
  );

  const buffer = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
  });

  return buffer;
}
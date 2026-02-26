// src/lib/template-engine.ts

import { BusinessData } from "./types";
import { renderPremiumStarter } from "../templates/premium-starter";
import { SiteFile } from "./zip-builder";

/**
 * Motor de orquestación de plantillas de JLStudios.
 * Transforma los datos procesados por la IA en una estructura de archivos
 * lista para ser desplegada en cualquier hosting estático.
 */
export function generateFullSite(data: BusinessData): SiteFile[] {
  const files: SiteFile[] = [];

  // 1. Generar el punto de entrada principal (index.html)
  // Utilizamos el template premium que ya definimos
  const indexHtml = renderPremiumStarter(data);
  
  files.push({
    path: "index.html",
    content: indexHtml,
  });

  // 2. Aquí podrías agregar lógica para archivos adicionales en el futuro.
  // Por ejemplo, si deciden separar el CSS del HTML:
  // const globalStyles = generateStyles(data.designSystem);
  // files.push({ path: "css/style.css", content: globalStyles });

  // 3. Generar un archivo de metadatos/SEO básico para el cliente
  const seoData = `
# Datos de SEO Generados para: ${data.businessName}
Título: ${data.businessName} | ${data.tagline}
Descripción: ${data.seoDescription}
Rubro: ${data.niche}
  `.trim();

  files.push({
    path: "seo-info.txt",
    content: seoData,
  });

  return files;
}

/**
 * Función auxiliar para limpiar nombres de archivos y carpetas.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
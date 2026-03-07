// src/templates/template-utils.ts  v2.4
// Changes:
//  • logoHtml: object-contain (NO circular crop), max-height controlada
//  • scheduleTable: soporta doble turno (hasSecondShift / open2 / close2)
// ─────────────────────────────────────────────────────────────────────────────
import { BusinessData, ScheduleDay, VisualStyle } from "../lib/types";

/** HTML-escape */
export function esc(s: string | null | undefined): string {
  if (!s) return "";
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** WhatsApp deep-link */
export function waHref(data: BusinessData): string {
  const n = data.contactInfo.whatsapp.replace(/\D/g, "");
  const m = encodeURIComponent(data.contactInfo.whatsappMessage || "Hola! Quiero consultar.");
  return n ? `https://wa.me/${n}?text=${m}` : "#";
}

/** Google Fonts URL */
export function fontsUrl(data: BusinessData): string {
  const set = [...new Set([data.designSystem.fontHeading, data.designSystem.fontBody])];
  return (
    "https://fonts.googleapis.com/css2?" +
    set
      .map((f) => `family=${encodeURIComponent(f)}:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400`)
      .join("&") +
    "&display=swap"
  );
}

/** hex → "r,g,b" */
export function rgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

export function isLight(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b > 140;
}

/**
 * Logo HTML — FIX v2.4:
 * - Usa object-contain para respetar la forma original del logo (rectángulo, cuadrado, etc.)
 * - NO aplica border-radius circular
 * - max-height controlada para que no rompa el nav
 * - Fondo transparente (no recorta esquinas)
 */
export function logoHtml(
  data: BusinessData,
  opts?: {
    textClass?: string;
    imgClass?: string;
    maxHeight?: string;  // default "36px"
    maxWidth?: string;   // default "140px"
  }
): string {
  const tc = opts?.textClass ?? "";
  const ic = opts?.imgClass  ?? "nav-logo-img";
  const mh = opts?.maxHeight ?? "36px";
  const mw = opts?.maxWidth  ?? "140px";

  if (data.logo_b64) {
    // Detectar si es PNG (tiene transparencia) o JPEG
    // Los logos se guardan como PNG desde DesignStudio v2.4
    const mime = data.logo_b64.startsWith("iVBOR") ? "image/png" : "image/jpeg";
    return `<img
      src="data:${mime};base64,${data.logo_b64}"
      alt="${esc(data.businessName)}"
      class="${ic}"
      style="max-height:${mh};max-width:${mw};width:auto;height:auto;object-fit:contain;display:block;"
    />`;
  }
  return `<span class="${tc}">${esc(data.businessName)}</span>`;
}

/**
 * Render structured schedule as HTML table.
 * v2.4: soporta doble turno (hasSecondShift + open2/close2)
 */
export function scheduleTable(
  schedule: ScheduleDay[],
  textColor  = "#d4d4d8",
  mutedColor = "#71717a"
): string {
  if (!schedule || schedule.length === 0) return "";

  const rows = schedule.map((d) => {
    if (!d.isOpen) {
      return `
        <tr>
          <td style="padding:5px 12px 5px 0;font-size:0.8rem;color:${mutedColor}">${esc(d.day)}</td>
          <td style="padding:5px 0;font-size:0.8rem;text-align:right;color:${mutedColor}">Cerrado</td>
        </tr>`;
    }

    // Doble turno
    if (d.hasSecondShift && d.open2 && d.close2) {
      return `
        <tr>
          <td style="padding:5px 12px 5px 0;font-size:0.8rem;color:${textColor};font-weight:600">${esc(d.day)}</td>
          <td style="padding:5px 0;font-size:0.8rem;text-align:right;color:${textColor}">
            ${d.open}–${d.close}
            <span style="margin:0 4px;opacity:0.4">/</span>
            ${d.open2}–${d.close2}
          </td>
        </tr>`;
    }

    // Turno único
    return `
      <tr>
        <td style="padding:5px 12px 5px 0;font-size:0.8rem;color:${textColor};font-weight:600">${esc(d.day)}</td>
        <td style="padding:5px 0;font-size:0.8rem;text-align:right;color:${textColor}">${d.open}–${d.close}</td>
      </tr>`;
  }).join("");

  return `<table style="width:100%;border-collapse:collapse">${rows}</table>`;
}

// ── Style-variant CSS overrides ───────────────────────────────────────────────
export function styleOverrideCSS(style: VisualStyle, accentHex: string): string {
  switch (style) {
    case "minimal":
      return `
        :root { --radius: 0px !important; }
        .menu-card, .svc-row, .plan-card, .facility-card { box-shadow: none !important; border-radius: 0 !important; }
        .btn-hero, .btn-primary-gym, .btn-book, .nav-cta, .svc-book, .plan-cta-featured, .plan-cta { border-radius: 0 !important; }
        .wa-float { border-radius: 0 !important; }
      `;
    case "bold":
      return `
        :root { --radius: 4px !important; }
        h1, h2, h3, .hero-title, .section-title, .plan-name, .menu-item-name, .svc-name {
          text-transform: uppercase !important; letter-spacing: 0.04em !important;
        }
        .menu-card, .plan-card, .svc-row { border-width: 2px !important; border-color: rgba(${rgb(accentHex)}, 0.35) !important; }
        .plan-card:hover, .menu-card:hover { border-color: ${accentHex} !important; box-shadow: 4px 4px 0 ${accentHex} !important; }
        .btn-hero, .btn-primary-gym, .btn-book, .nav-cta { font-weight: 900 !important; text-transform: uppercase !important; letter-spacing: 0.1em !important; }
      `;
    case "elegant":
      return `
        :root { --radius: 16px !important; }
        .menu-card, .plan-card { border-radius: 16px !important; box-shadow: 0 8px 32px rgba(0,0,0,0.18) !important; }
        .menu-card:hover, .plan-card:hover { box-shadow: 0 20px 60px rgba(0,0,0,0.28) !important; }
        .btn-hero, .btn-primary-gym, .btn-book, .nav-cta, .svc-book { border-radius: 50px !important; padding-left: 2rem !important; padding-right: 2rem !important; }
        .wa-float { border-radius: 50px !important; }
      `;
    case "playful":
      return `
        :root { --radius: 20px !important; }
        .menu-card, .plan-card, .svc-row { border-radius: 20px !important; }
        .menu-card { border: 2px solid rgba(${rgb(accentHex)}, 0.2) !important; }
        .menu-card:hover { transform: translateY(-6px) rotate(-0.5deg) !important; border-color: ${accentHex} !important; }
        .plan-card:hover { transform: translateY(-6px) rotate(0.5deg) !important; }
        .btn-hero, .btn-primary-gym, .nav-cta { border-radius: 50px !important; box-shadow: 0 6px 20px rgba(${rgb(accentHex)}, 0.5) !important; }
      `;
    case "corporate":
      return `
        :root { --radius: 4px !important; }
        .menu-card, .plan-card, .svc-row { border-radius: 4px !important; border: 1px solid rgba(255,255,255,0.12) !important; box-shadow: none !important; }
        .menu-card:hover { background: rgba(255,255,255,0.04) !important; transform: none !important; }
        .btn-hero, .btn-primary-gym, .btn-book, .nav-cta { border-radius: 4px !important; letter-spacing: 0.04em !important; }
      `;
    default:
      return "";
  }
}

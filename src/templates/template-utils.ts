// src/templates/template-utils.ts
// Shared utilities used by all premium templates.
import { BusinessData, ScheduleDay, VisualStyle } from "../lib/types";

/** HTML-escape a string */
export function esc(s: string | null | undefined): string {
  if (!s) return "";
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** WhatsApp deep-link with pre-filled message */
export function waHref(data: BusinessData): string {
  const n = data.contactInfo.whatsapp.replace(/\D/g, "");
  const m = encodeURIComponent(data.contactInfo.whatsappMessage || "Hola! Quiero consultar.");
  return n ? `https://wa.me/${n}?text=${m}` : "#";
}

/** Google Fonts URL for heading + body fonts */
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

/** hex "#rrggbb" → "r,g,b" */
export function rgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

/** Returns true if a hex color is perceptually light */
export function isLight(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b > 140;
}

/** Logo HTML — img if logo_b64 exists, else business name as text */
export function logoHtml(data: BusinessData, opts?: { textClass?: string; imgClass?: string }): string {
  const tc = opts?.textClass ?? "";
  const ic = opts?.imgClass  ?? "nav-logo-img";

  if (data.logo_b64) {
    return `<img src="data:image/jpeg;base64,${data.logo_b64}" alt="${esc(data.businessName)}" class="${ic}" />`;
  }
  return `<span class="${tc}">${esc(data.businessName)}</span>`;
}

/** Render a structured schedule as an HTML table */
export function scheduleTable(schedule: ScheduleDay[], textColor = "#d4d4d8", mutedColor = "#71717a"): string {
  if (!schedule || schedule.length === 0) return "";

  const rows = schedule
    .map((d) => {
      const hours = d.isOpen
        ? `<span style="color:${textColor}">${d.open} – ${d.close}</span>`
        : `<span style="color:${mutedColor}">Cerrado</span>`;
      return `
        <tr>
          <td style="padding:6px 12px 6px 0;font-size:0.82rem;color:${d.isOpen ? textColor : mutedColor};font-weight:${d.isOpen ? "600" : "400"}">${esc(d.day)}</td>
          <td style="padding:6px 0;font-size:0.82rem;text-align:right">${hours}</td>
        </tr>`;
    })
    .join("");

  return `<table style="width:100%;border-collapse:collapse">${rows}</table>`;
}

// ── Style-variant CSS injected into each template's <head> ────────────────────
// Each variant overrides specific CSS custom properties and adds global tweaks.
export function styleOverrideCSS(style: VisualStyle, accentHex: string): string {
  switch (style) {
    case "minimal":
      return `
        /* ── minimal: flat, borderless, low contrast shadows ── */
        :root { --radius: 0px !important; }
        .menu-card, .svc-row, .plan-card, .facility-card { box-shadow: none !important; border-radius: 0 !important; }
        .menu-grid, .svc-list { border-radius: 0 !important; }
        .btn-hero, .btn-primary-gym, .btn-book, .nav-cta, .svc-book, .plan-cta-featured, .plan-cta { border-radius: 0 !important; }
        .hero-badge, .hero-eyebrow, .plan-badge { border-radius: 0 !important; }
        .wa-float { border-radius: 0 !important; }
        * { letter-spacing: 0.01em; }
      `;

    case "bold":
      return `
        /* ── bold: heavy outlines, uppercase everything, tight radius ── */
        :root { --radius: 4px !important; }
        h1, h2, h3, .hero-title, .section-title, .plan-name, .menu-item-name, .svc-name {
          text-transform: uppercase !important;
          letter-spacing: 0.04em !important;
        }
        .menu-card, .plan-card, .svc-row, .facility-card {
          border-width: 2px !important;
          border-color: rgba(${rgb(accentHex)}, 0.35) !important;
        }
        .plan-card:hover, .menu-card:hover {
          border-color: ${accentHex} !important;
          box-shadow: 4px 4px 0 ${accentHex} !important;
        }
        .btn-hero, .btn-primary-gym, .btn-book, .nav-cta {
          font-weight: 900 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
        }
      `;

    case "elegant":
      return `
        /* ── elegant: rounded, soft shadows, italic accents, refined spacing ── */
        :root { --radius: 16px !important; }
        h1 em, h2 em, .hero-title em, .section-title em { font-style: italic !important; }
        .hero-title { letter-spacing: -0.02em !important; }
        .menu-card, .plan-card {
          border-radius: 16px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18) !important;
          backdrop-filter: blur(4px) !important;
        }
        .menu-card:hover, .plan-card:hover {
          box-shadow: 0 20px 60px rgba(0,0,0,0.28) !important;
        }
        .btn-hero, .btn-primary-gym, .btn-book, .nav-cta, .svc-book {
          border-radius: 50px !important;
          padding-left: 2rem !important;
          padding-right: 2rem !important;
        }
        .wa-float { border-radius: 50px !important; }
        .cat-tab, .svc-tab, .gym-tab { border-radius: 50px !important; }
      `;

    case "playful":
      return `
        /* ── playful: vivid, large radius, bouncy borders ── */
        :root { --radius: 20px !important; }
        .menu-card, .plan-card, .svc-row, .facility-card {
          border-radius: 20px !important;
        }
        .menu-grid { border-radius: 20px !important; gap: 12px !important; }
        .menu-card { border: 2px solid rgba(${rgb(accentHex)}, 0.2) !important; }
        .menu-card:hover { transform: translateY(-6px) rotate(-0.5deg) !important; border-color: ${accentHex} !important; }
        .plan-card:hover { transform: translateY(-6px) rotate(0.5deg) !important; }
        .hero-title { letter-spacing: 0.01em !important; }
        .btn-hero, .btn-primary-gym, .nav-cta {
          border-radius: 50px !important;
          box-shadow: 0 6px 20px rgba(${rgb(accentHex)}, 0.5) !important;
        }
        .btn-hero:hover, .btn-primary-gym:hover { box-shadow: 0 12px 32px rgba(${rgb(accentHex)}, 0.6) !important; }
        .cat-tab.active, .svc-tab.active, .gym-tab-active {
          box-shadow: 0 4px 12px rgba(${rgb(accentHex)}, 0.4) !important;
        }
      `;

    case "corporate":
      return `
        /* ── corporate: structured, conservative, strict grid ── */
        :root { --radius: 4px !important; }
        body { font-size: 15px !important; }
        .hero-title { font-size: clamp(2rem, 4vw, 4rem) !important; }
        .menu-card, .plan-card, .svc-row {
          border-radius: 4px !important;
          border: 1px solid rgba(255,255,255,0.12) !important;
          box-shadow: none !important;
        }
        .menu-grid { gap: 1px !important; border-radius: 4px !important; }
        .menu-card:hover { background: rgba(255,255,255,0.04) !important; transform: none !important; }
        .plan-card:hover { transform: none !important; }
        .btn-hero, .btn-primary-gym, .btn-book, .nav-cta {
          border-radius: 4px !important;
          letter-spacing: 0.04em !important;
        }
        h1, h2, h3 { letter-spacing: -0.01em !important; }
        .hero-badge, .hero-eyebrow { border-radius: 2px !important; }
      `;

    default:
      return "";
  }
}

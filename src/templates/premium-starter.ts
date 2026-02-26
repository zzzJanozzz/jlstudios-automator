// src/templates/premium-starter.ts
// ─── JLStudios Premium Starter Template Engine ───────────────────────────────
// Uses ONLY fields defined in the BusinessData contract (types.ts).
// Niche routing: food | fitness | beauty | default
// ─────────────────────────────────────────────────────────────────────────────

import { BusinessData, ExtractedItem, DesignSystem, ContactInfo, NICHE_CONFIGS } from "../lib/types";

// ── Niche routing ─────────────────────────────────────────────────────────────
type TemplateType = "food" | "fitness" | "beauty" | "default";

const FOOD_NICHES    = ["restaurante", "panaderia"];
const FITNESS_NICHES = ["gimnasio"];
const BEAUTY_NICHES  = ["estetica", "barberia", "estudio_tatuajes", "fotografia", "catalogo_ropa", "floreria", "lavanderia", "optica"];

function getTemplateType(niche: string): TemplateType {
  if (FOOD_NICHES.includes(niche))    return "food";
  if (FITNESS_NICHES.includes(niche)) return "fitness";
  if (BEAUTY_NICHES.includes(niche))  return "beauty";
  return "default";
}

// ── Main entry point ─────────────────────────────────────────────────────────
export function renderPremiumStarter(data: BusinessData): string {
  const type = getTemplateType(data.niche);
  switch (type) {
    case "food":    return renderFood(data);
    case "fitness": return renderFitness(data);
    case "beauty":  return renderBeauty(data);
    default:        return renderDefault(data);
  }
}

// ── Shared helpers ────────────────────────────────────────────────────────────

function esc(str: string | null | undefined): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function googleFontsUrl(ds: DesignSystem): string {
  const fonts = [...new Set([ds.fontHeading, ds.fontBody])]
    .map(f => `family=${encodeURIComponent(f)}:wght@300;400;500;600;700;800`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${fonts}&display=swap`;
}

function cssVars(ds: DesignSystem): string {
  return `
    --primary:   ${ds.primaryColor};
    --secondary: ${ds.secondaryColor};
    --accent:    ${ds.accentColor};
    --bg:        ${ds.backgroundColor};
    --text:      ${ds.textColor};
    --muted:     ${ds.mutedColor};
    --radius:    ${ds.borderRadius};
    --shadow:    ${ds.cardShadow};
    --font-h:    '${ds.fontHeading}', sans-serif;
    --font-b:    '${ds.fontBody}', sans-serif;
  `.trim();
}

function whatsappHref(contact: ContactInfo): string {
  const num = contact.whatsapp.replace(/\D/g, "");
  const msg = encodeURIComponent(contact.whatsappMessage || "Hola! Vengo de tu web y quiero consultar.");
  return num ? `https://wa.me/${num}?text=${msg}` : "#";
}

function socialLinks(contact: ContactInfo): string {
  const links: string[] = [];
  if (contact.instagram) {
    links.push(`<a href="https://instagram.com/${esc(contact.instagram)}" target="_blank" rel="noopener" aria-label="Instagram" class="social-link">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    </a>`);
  }
  if (contact.facebook) {
    links.push(`<a href="https://facebook.com/${esc(contact.facebook)}" target="_blank" rel="noopener" aria-label="Facebook" class="social-link">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
      </svg>
    </a>`);
  }
  if (contact.whatsapp) {
    links.push(`<a href="${whatsappHref(contact)}" target="_blank" rel="noopener" aria-label="WhatsApp" class="social-link">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>`);
  }
  return links.join("\n");
}

function revealScript(): string {
  return `
<script>
(function(){
  var els = document.querySelectorAll('.reveal');
  if(!els.length) return;
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, {threshold:0.12});
  els.forEach(function(el){ io.observe(el); });
})();
</script>`;
}

function itemsByCategory(data: BusinessData): Map<string, ExtractedItem[]> {
  const map = new Map<string, ExtractedItem[]>();
  data.categories.forEach(cat => map.set(cat, []));
  data.items.forEach(item => {
    const arr = map.get(item.category) || [];
    arr.push(item);
    map.set(item.category, arr);
  });
  // Remove empty categories
  map.forEach((v, k) => { if (v.length === 0) map.delete(k); });
  return map;
}

// ══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 1: FOOD — Carta Digital (dark, delivery-app vibe)
// ══════════════════════════════════════════════════════════════════════════════
function renderFood(data: BusinessData): string {
  const { businessName, tagline, seoDescription, designSystem: ds, contactInfo, layoutStyle } = data;
  const catMap  = itemsByCategory(data);
  const cats    = Array.from(catMap.keys());
  const waHref  = whatsappHref(contactInfo);
  const nicheConfig = NICHE_CONFIGS[data.niche];

  const categoryEmoji: Record<string, string> = {
    "entradas": "🥗", "entrada": "🥗",
    "principales": "🍽️", "platos principales": "🍽️",
    "postres": "🍰", "bebidas": "🥤",
    "pizzas": "🍕", "pastas": "🍝",
    "sandwiches": "🥪", "hamburguesas": "🍔",
    "cafés": "☕", "cafes": "☕",
    "panadería": "🥐", "panaderia": "🥐",
    "tortas": "🎂", "empanadas": "🥟",
    "default": "🍴",
  };

  function getCatEmoji(cat: string): string {
    return categoryEmoji[cat.toLowerCase()] || categoryEmoji.default;
  }

  const navItems = cats.map(cat =>
    `<a href="#cat-${esc(cat.replace(/\s+/g, '-'))}" class="nav-pill">${getCatEmoji(cat)} ${esc(cat)}</a>`
  ).join("");

  const sections = cats.map(cat => {
    const items = catMap.get(cat) || [];
    const isGrid = layoutStyle !== "list";

    const cards = items.map(item => {
      if (!isGrid) {
        return `
        <div class="item-row reveal">
          <div class="item-row-info">
            <h3 class="item-name">${esc(item.name)}</h3>
            ${item.description ? `<p class="item-desc">${esc(item.description)}</p>` : ""}
          </div>
          ${item.price ? `<span class="item-price">${esc(item.price)}</span>` : ""}
        </div>`;
      }
      return `
      <div class="item-card reveal">
        <div class="item-card-body">
          <h3 class="item-name">${esc(item.name)}</h3>
          ${item.description ? `<p class="item-desc">${esc(item.description)}</p>` : ""}
        </div>
        ${item.price ? `<div class="item-card-footer"><span class="item-price">${esc(item.price)}</span></div>` : ""}
      </div>`;
    }).join("");

    return `
    <section id="cat-${esc(cat.replace(/\s+/g, '-'))}" class="cat-section">
      <div class="cat-header">
        <span class="cat-emoji">${getCatEmoji(cat)}</span>
        <h2 class="cat-title">${esc(cat)}</h2>
      </div>
      <div class="${isGrid ? 'items-grid' : 'items-list'}">
        ${cards}
      </div>
    </section>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(businessName)} — Carta Digital</title>
<meta name="description" content="${esc(seoDescription)}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="${googleFontsUrl(ds)}" rel="stylesheet" />
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{${cssVars(ds)}}
html{scroll-behavior:smooth;background:var(--bg)}
body{font-family:var(--font-b);color:var(--text);background:var(--bg);min-height:100vh;-webkit-font-smoothing:antialiased}
h1,h2,h3,h4{font-family:var(--font-h)}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}

/* ─── Header ─── */
.site-header{position:sticky;top:0;z-index:100;padding:16px 20px;background:rgba(0,0,0,0.85);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,255,255,0.07)}
.header-inner{max-width:960px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:12px}
.brand-name{font-family:var(--font-h);font-size:1.125rem;font-weight:700;color:#fff}
.brand-tag{font-size:0.75rem;color:rgba(255,255,255,0.5);margin-top:2px}
.header-cta{display:inline-flex;align-items:center;gap:8px;background:var(--accent);color:#fff;padding:8px 18px;border-radius:var(--radius);font-size:0.85rem;font-weight:600;white-space:nowrap;transition:opacity .2s,transform .15s}
.header-cta:hover{opacity:.9;transform:translateY(-1px)}

/* ─── Hero ─── */
.hero{padding:60px 20px 40px;text-align:center;background:linear-gradient(180deg,rgba(0,0,0,0.4) 0%,transparent 100%)}
.hero-title{font-family:var(--font-h);font-size:clamp(2rem,6vw,3.5rem);font-weight:800;color:#fff;line-height:1.1;margin-bottom:12px}
.hero-tagline{font-size:clamp(0.95rem,2vw,1.1rem);color:rgba(255,255,255,0.65);max-width:480px;margin:0 auto 32px}

/* ─── Category nav ─── */
.cat-nav{position:sticky;top:64px;z-index:90;background:rgba(0,0,0,0.8);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,0.07);overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}
.cat-nav::-webkit-scrollbar{display:none}
.cat-nav-inner{display:flex;gap:4px;padding:10px 16px;max-width:960px;margin:0 auto;width:max-content;min-width:100%}
.nav-pill{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:20px;font-size:0.82rem;font-weight:500;color:rgba(255,255,255,0.65);white-space:nowrap;transition:all .2s;border:1px solid transparent}
.nav-pill:hover,.nav-pill:focus{background:rgba(255,255,255,0.08);color:#fff;border-color:rgba(255,255,255,0.12)}

/* ─── Sections ─── */
.content{max-width:960px;margin:0 auto;padding:32px 16px 120px}
.cat-section{margin-bottom:48px}
.cat-header{display:flex;align-items:center;gap:10px;margin-bottom:20px;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.08)}
.cat-emoji{font-size:1.5rem;line-height:1}
.cat-title{font-family:var(--font-h);font-size:1.3rem;font-weight:700;color:#fff}

/* ─── Grid layout ─── */
.items-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px}
.item-card{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:var(--radius);overflow:hidden;display:flex;flex-direction:column;transition:transform .2s,box-shadow .2s}
.item-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.3)}
.item-card-body{padding:16px;flex:1}
.item-card-footer{padding:10px 16px;border-top:1px solid rgba(255,255,255,0.06);display:flex;justify-content:flex-end}

/* ─── List layout ─── */
.items-list{display:flex;flex-direction:column;gap:1px;background:rgba(255,255,255,0.05);border-radius:var(--radius);overflow:hidden}
.item-row{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 18px;background:rgba(255,255,255,0.03);transition:background .15s}
.item-row:hover{background:rgba(255,255,255,0.07)}
.item-row-info{flex:1;min-width:0}

/* ─── Item typography ─── */
.item-name{font-size:0.95rem;font-weight:600;color:#fff;margin-bottom:4px}
.item-desc{font-size:0.82rem;color:rgba(255,255,255,0.5);line-height:1.4}
.item-price{font-weight:700;font-size:0.9rem;color:var(--accent);white-space:nowrap;flex-shrink:0}

/* ─── Bottom sticky bar ─── */
.sticky-bar{position:fixed;bottom:0;left:0;right:0;z-index:200;padding:12px 20px 16px;background:rgba(0,0,0,0.92);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-top:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;justify-content:space-between;gap:12px}
.sticky-bar-left{display:flex;gap:10px;align-items:center}
.social-link{display:flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.7);transition:background .2s,color .2s}
.social-link:hover{background:rgba(255,255,255,0.15);color:#fff}
.cta-btn{display:inline-flex;align-items:center;gap:8px;background:var(--accent);color:#fff;padding:11px 22px;border-radius:var(--radius);font-size:0.9rem;font-weight:700;transition:opacity .2s,transform .15s;flex-shrink:0}
.cta-btn:hover{opacity:.9;transform:translateY(-1px)}

/* ─── Reveal animation ─── */
.reveal{opacity:0;transform:translateY(16px);transition:opacity .45s ease,transform .45s ease}
.reveal.visible{opacity:1;transform:none}

/* ─── Address / schedule ─── */
.info-footer{max-width:960px;margin:0 auto;padding:0 16px 40px;display:flex;flex-wrap:wrap;gap:16px}
.info-chip{display:inline-flex;align-items:flex-start;gap:8px;font-size:0.82rem;color:rgba(255,255,255,0.55);padding:8px 14px;background:rgba(255,255,255,0.04);border-radius:20px;border:1px solid rgba(255,255,255,0.08)}

@media(max-width:480px){
  .header-cta{display:none}
  .items-grid{grid-template-columns:1fr}
  .hero-title{font-size:1.8rem}
}
</style>
</head>
<body>

<header class="site-header">
  <div class="header-inner">
    <div>
      <div class="brand-name">${esc(businessName)}</div>
      ${tagline ? `<div class="brand-tag">${esc(tagline)}</div>` : ""}
    </div>
    <a href="${waHref}" class="header-cta" target="_blank" rel="noopener">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      ${esc(nicheConfig.defaultCTA)}
    </a>
  </div>
</header>

<div class="cat-nav">
  <div class="cat-nav-inner">${navItems}</div>
</div>

<div class="hero">
  <h1 class="hero-title">${esc(businessName)}</h1>
  ${tagline ? `<p class="hero-tagline">${esc(tagline)}</p>` : ""}
</div>

<main class="content">
  ${sections}
</main>

${(contactInfo.address || contactInfo.schedule) ? `
<div class="info-footer">
  ${contactInfo.address ? `<span class="info-chip">📍 ${esc(contactInfo.address)}</span>` : ""}
  ${contactInfo.schedule ? `<span class="info-chip">🕐 ${esc(contactInfo.schedule)}</span>` : ""}
</div>` : ""}

<div class="sticky-bar">
  <div class="sticky-bar-left">
    ${socialLinks(contactInfo)}
  </div>
  <a href="${waHref}" class="cta-btn" target="_blank" rel="noopener">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    ${esc(nicheConfig.defaultCTA)}
  </a>
</div>

${revealScript()}
</body>
</html>`;
}

// ══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 2: FITNESS — Power House
// ══════════════════════════════════════════════════════════════════════════════
function renderFitness(data: BusinessData): string {
  const { businessName, tagline, seoDescription, designSystem: ds, contactInfo, layoutStyle } = data;
  const catMap = itemsByCategory(data);
  const cats   = Array.from(catMap.keys());
  const waHref = whatsappHref(contactInfo);
  const nicheConfig = NICHE_CONFIGS[data.niche];
  const totalPlans   = data.items.length;

  const sections = cats.map(cat => {
    const items = catMap.get(cat) || [];
    const isGrid = layoutStyle !== "list";

    const cards = items.map((item, idx) => `
    <div class="plan-card reveal${idx === 0 ? ' featured' : ''}">
      ${idx === 0 ? '<div class="badge">⭐ Más Popular</div>' : ""}
      <div class="plan-header">
        <h3 class="plan-name">${esc(item.name)}</h3>
        ${item.price ? `<span class="plan-price">${esc(item.price)}<span class="plan-price-sub">/mes</span></span>` : ""}
      </div>
      ${item.description ? `<p class="plan-desc">${esc(item.description)}</p>` : ""}
      <a href="${waHref}" target="_blank" rel="noopener" class="plan-cta">EMPEZAR AHORA →</a>
    </div>`).join("");

    return `
    <section class="section">
      <h2 class="section-title">${esc(cat)}</h2>
      <div class="${isGrid ? 'plans-grid' : 'plans-list'}">
        ${cards}
      </div>
    </section>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(businessName)}</title>
<meta name="description" content="${esc(seoDescription)}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="${googleFontsUrl(ds)}" rel="stylesheet" />
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{${cssVars(ds)}}
html{scroll-behavior:smooth}
body{font-family:var(--font-b);color:var(--text);background:var(--bg);min-height:100vh;-webkit-font-smoothing:antialiased}
h1,h2,h3,h4{font-family:var(--font-h);text-transform:uppercase;letter-spacing:.04em}
a{color:inherit;text-decoration:none}

/* ─── Nav ─── */
.site-nav{position:sticky;top:0;z-index:100;padding:14px 24px;background:var(--bg);border-bottom:2px solid var(--primary);display:flex;align-items:center;justify-content:space-between}
.nav-brand{font-family:var(--font-h);font-size:1.25rem;font-weight:900;color:var(--primary);letter-spacing:.06em}
.nav-cta{display:inline-flex;align-items:center;gap:8px;background:var(--primary);color:#fff;padding:9px 20px;font-size:0.82rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em;border-radius:var(--radius);transition:opacity .2s,transform .15s}
.nav-cta:hover{opacity:.9;transform:translateY(-1px)}

/* ─── Hero ─── */
.hero{min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:80px 24px 60px;background:linear-gradient(160deg,var(--bg) 0%,rgba(0,0,0,0.05) 100%);position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;inset:0;background-image:repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(255,255,255,0.02) 60px,rgba(255,255,255,0.02) 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(255,255,255,0.02) 60px,rgba(255,255,255,0.02) 61px);pointer-events:none}
.hero-eyebrow{font-size:0.78rem;font-weight:800;letter-spacing:.15em;text-transform:uppercase;color:var(--primary);margin-bottom:16px}
.hero-title{font-size:clamp(2.5rem,8vw,6rem);font-weight:900;line-height:1;color:var(--text);margin-bottom:20px}
.hero-tagline{font-size:clamp(1rem,2.5vw,1.25rem);color:var(--muted);max-width:500px;margin:0 auto 40px;text-transform:none;letter-spacing:0}
.hero-stats{display:flex;gap:32px;flex-wrap:wrap;justify-content:center;margin-bottom:40px}
.stat{text-align:center}
.stat-num{font-family:var(--font-h);font-size:2rem;font-weight:900;color:var(--primary)}
.stat-label{font-size:0.75rem;text-transform:uppercase;letter-spacing:.1em;color:var(--muted)}
.hero-cta{display:inline-flex;align-items:center;gap:10px;background:var(--primary);color:#fff;padding:16px 36px;font-size:1rem;font-weight:900;text-transform:uppercase;letter-spacing:.1em;border-radius:var(--radius);transition:opacity .2s,transform .15s;box-shadow:0 8px 32px rgba(0,0,0,0.3)}
.hero-cta:hover{opacity:.9;transform:translateY(-2px)}

/* ─── Content ─── */
.content{max-width:1080px;margin:0 auto;padding:60px 20px 120px}
.section{margin-bottom:56px}
.section-title{font-size:1.4rem;font-weight:900;color:var(--text);margin-bottom:24px;padding-bottom:12px;border-bottom:3px solid var(--primary);display:inline-block}
.plans-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
.plans-list{display:flex;flex-direction:column;gap:12px}

/* ─── Plan card ─── */
.plan-card{position:relative;padding:28px;border:2px solid rgba(255,255,255,0.1);border-radius:var(--radius);background:rgba(255,255,255,0.03);transition:transform .2s,border-color .2s}
.plan-card:hover{transform:translateY(-3px);border-color:var(--primary)}
.plan-card.featured{border-color:var(--primary);background:rgba(255,255,255,0.06)}
.badge{position:absolute;top:-1px;right:20px;background:var(--primary);color:#fff;font-size:0.7rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em;padding:4px 12px;border-radius:0 0 var(--radius) var(--radius)}
.plan-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}
.plan-name{font-size:1.05rem;font-weight:800;color:var(--text);text-transform:uppercase;letter-spacing:.04em}
.plan-price{font-size:1.4rem;font-weight:900;color:var(--primary);white-space:nowrap;flex-shrink:0}
.plan-price-sub{font-size:0.75rem;font-weight:500;color:var(--muted)}
.plan-desc{font-size:0.87rem;color:var(--muted);line-height:1.5;margin-bottom:20px;text-transform:none;letter-spacing:0}
.plan-cta{display:inline-block;background:var(--primary);color:#fff;padding:10px 20px;font-size:0.8rem;font-weight:800;text-transform:uppercase;letter-spacing:.1em;border-radius:var(--radius);transition:opacity .2s}
.plan-cta:hover{opacity:.85}

/* ─── Footer CTA ─── */
.footer-cta{position:fixed;bottom:0;left:0;right:0;z-index:200;background:var(--primary);padding:14px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px}
.footer-cta-text{font-family:var(--font-h);font-size:0.95rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:#fff}
.footer-cta-btn{background:#fff;color:var(--primary);padding:10px 24px;font-size:0.82rem;font-weight:900;text-transform:uppercase;letter-spacing:.1em;border-radius:var(--radius);flex-shrink:0;transition:opacity .2s}
.footer-cta-btn:hover{opacity:.9}

/* ─── Socials ─── */
.social-link{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.1);color:#fff;transition:background .2s}
.social-link:hover{background:rgba(255,255,255,0.2)}

/* ─── Reveal ─── */
.reveal{opacity:0;transform:translateY(20px);transition:opacity .4s ease,transform .4s ease}
.reveal.visible{opacity:1;transform:none}

@media(max-width:480px){
  .hero-title{font-size:2.5rem}
  .hero-stats{gap:20px}
  .plans-grid{grid-template-columns:1fr}
}
</style>
</head>
<body>

<nav class="site-nav">
  <span class="nav-brand">${esc(businessName)}</span>
  <div style="display:flex;align-items:center;gap:12px">
    ${socialLinks(contactInfo)}
    <a href="${waHref}" class="nav-cta" target="_blank" rel="noopener">${esc(nicheConfig.defaultCTA)}</a>
  </div>
</nav>

<section class="hero">
  <div class="hero-eyebrow">Tu mejor versión empieza hoy</div>
  <h1 class="hero-title">${esc(businessName)}</h1>
  ${tagline ? `<p class="hero-tagline">${esc(tagline)}</p>` : ""}
  <div class="hero-stats">
    <div class="stat"><div class="stat-num">${totalPlans}+</div><div class="stat-label">Planes</div></div>
    <div class="stat"><div class="stat-num">${cats.length}</div><div class="stat-label">Áreas</div></div>
    <div class="stat"><div class="stat-num">100%</div><div class="stat-label">Resultados</div></div>
  </div>
  <a href="${waHref}" class="hero-cta" target="_blank" rel="noopener">
    💪 ${esc(nicheConfig.defaultCTA)}
  </a>
</section>

<main class="content">
  ${sections}
</main>

<div class="footer-cta">
  <span class="footer-cta-text">${esc(businessName)} — ${tagline || "Empezá hoy"}</span>
  <a href="${waHref}" class="footer-cta-btn" target="_blank" rel="noopener">${esc(nicheConfig.defaultCTA)}</a>
</div>

${revealScript()}
</body>
</html>`;
}

// ══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 3: BEAUTY — Atelier (elegant, editorial)
// ══════════════════════════════════════════════════════════════════════════════
function renderBeauty(data: BusinessData): string {
  const { businessName, tagline, seoDescription, designSystem: ds, contactInfo, layoutStyle } = data;
  const catMap = itemsByCategory(data);
  const cats   = Array.from(catMap.keys());
  const waHref = whatsappHref(contactInfo);
  const mapHref = contactInfo.mapUrl || "#";
  const nicheConfig = NICHE_CONFIGS[data.niche];

  const sections = cats.map(cat => {
    const items  = catMap.get(cat) || [];
    const isGrid = layoutStyle !== "list";

    const cards = items.map(item => `
    <div class="service-card reveal">
      <div class="service-body">
        <h3 class="service-name">${esc(item.name)}</h3>
        ${item.description ? `<p class="service-desc">${esc(item.description)}</p>` : ""}
      </div>
      ${item.price ? `<span class="service-price">${esc(item.price)}</span>` : ""}
    </div>`).join("");

    return `
    <div class="cat-section">
      <div class="cat-ornament">◆</div>
      <h2 class="cat-title">${esc(cat)}</h2>
      <div class="${isGrid ? 'services-grid' : 'services-list'}">
        ${cards}
      </div>
    </div>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(businessName)}</title>
<meta name="description" content="${esc(seoDescription)}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="${googleFontsUrl(ds)}" rel="stylesheet" />
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{${cssVars(ds)}}
html{scroll-behavior:smooth}
body{font-family:var(--font-b);color:var(--text);background:var(--bg);min-height:100vh;-webkit-font-smoothing:antialiased}
h1,h2,h3,h4{font-family:var(--font-h)}
a{color:inherit;text-decoration:none}

/* ─── Header ─── */
.site-header{padding:20px 32px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(0,0,0,0.07)}
.brand{text-align:center}
.brand-name{font-family:var(--font-h);font-size:1.5rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--text)}
.brand-tagline{font-size:0.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);margin-top:4px}
.header-links{display:flex;gap:8px;align-items:center}
.social-link{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;border:1px solid rgba(0,0,0,0.1);color:var(--muted);transition:border-color .2s,color .2s}
.social-link:hover{border-color:var(--primary);color:var(--primary)}

/* ─── Hero ─── */
.hero{padding:80px 32px 60px;text-align:center;border-bottom:1px solid rgba(0,0,0,0.06)}
.hero-ornament{font-size:0.75rem;letter-spacing:.3em;text-transform:uppercase;color:var(--muted);margin-bottom:20px}
.hero-title{font-family:var(--font-h);font-size:clamp(2.5rem,6vw,4.5rem);font-weight:400;line-height:1.1;color:var(--text);margin-bottom:16px}
.hero-subtitle{font-size:1rem;color:var(--muted);max-width:440px;margin:0 auto 40px;line-height:1.7}
.hero-cta-group{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.btn-primary{display:inline-flex;align-items:center;gap:8px;background:var(--primary);color:#fff;padding:13px 28px;border-radius:var(--radius);font-size:0.9rem;font-weight:500;letter-spacing:.04em;transition:opacity .2s,transform .15s}
.btn-primary:hover{opacity:.88;transform:translateY(-1px)}
.btn-outline{display:inline-flex;align-items:center;gap:8px;border:1.5px solid var(--primary);color:var(--primary);padding:12px 24px;border-radius:var(--radius);font-size:0.9rem;font-weight:500;transition:background .2s,color .2s}
.btn-outline:hover{background:var(--primary);color:#fff}

/* ─── Content ─── */
.content{max-width:900px;margin:0 auto;padding:64px 24px 140px}
.cat-section{margin-bottom:64px}
.cat-ornament{font-size:0.75rem;letter-spacing:.3em;color:var(--primary);text-align:center;margin-bottom:8px}
.cat-title{font-family:var(--font-h);font-size:1.6rem;font-weight:400;color:var(--text);text-align:center;margin-bottom:32px;padding-bottom:20px;border-bottom:1px solid rgba(0,0,0,0.07)}

/* ─── Grid ─── */
.services-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px}
.services-list{display:flex;flex-direction:column;gap:1px;background:rgba(0,0,0,0.04);border-radius:var(--radius);overflow:hidden}

/* ─── Service card ─── */
.service-card{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:20px;background:var(--bg);transition:background .15s}
.services-grid .service-card{flex-direction:column;border:1px solid rgba(0,0,0,0.07);border-radius:var(--radius);transition:box-shadow .2s,transform .2s}
.services-grid .service-card:hover{box-shadow:var(--shadow);transform:translateY(-2px)}
.service-body{flex:1;min-width:0}
.service-name{font-family:var(--font-h);font-size:1rem;font-weight:500;color:var(--text);margin-bottom:6px}
.service-desc{font-size:0.84rem;color:var(--muted);line-height:1.55}
.service-price{font-family:var(--font-h);font-size:1.05rem;font-weight:600;color:var(--primary);white-space:nowrap;flex-shrink:0;margin-top:4px}

/* ─── Sticky CTAs ─── */
.sticky-ctas{position:fixed;bottom:0;left:0;right:0;z-index:200;background:rgba(255,255,255,0.95);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-top:1px solid rgba(0,0,0,0.08);padding:12px 20px;display:flex;align-items:center;justify-content:center;gap:12px}

/* ─── Reveal ─── */
.reveal{opacity:0;transform:translateY(12px);transition:opacity .4s ease,transform .4s ease}
.reveal.visible{opacity:1;transform:none}

/* ─── Info ─── */
.info-bar{text-align:center;padding:20px;font-size:0.82rem;color:var(--muted);border-top:1px solid rgba(0,0,0,0.06)}

@media(max-width:480px){
  .site-header{flex-direction:column;gap:16px;padding:16px}
  .hero{padding:48px 20px 40px}
  .services-grid{grid-template-columns:1fr}
  .hero-cta-group{flex-direction:column;align-items:center}
}
</style>
</head>
<body>

<header class="site-header">
  <div class="header-links" style="min-width:80px">${socialLinks(contactInfo)}</div>
  <div class="brand">
    <div class="brand-name">${esc(businessName)}</div>
    ${tagline ? `<div class="brand-tagline">${esc(tagline)}</div>` : ""}
  </div>
  <div style="min-width:80px;display:flex;justify-content:flex-end">
    ${contactInfo.address || contactInfo.schedule ? `<span style="font-size:0.78rem;color:var(--muted);text-align:right">${contactInfo.schedule ? esc(contactInfo.schedule) : esc(contactInfo.address)}</span>` : ""}
  </div>
</header>

<section class="hero">
  <div class="hero-ornament">◆ Bienvenido/a ◆</div>
  <h1 class="hero-title">${esc(businessName)}</h1>
  ${tagline ? `<p class="hero-subtitle">${esc(tagline)}</p>` : ""}
  <div class="hero-cta-group">
    <a href="${waHref}" class="btn-primary" target="_blank" rel="noopener">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      ${esc(nicheConfig.defaultCTA)}
    </a>
    ${contactInfo.mapUrl ? `<a href="${esc(mapHref)}" class="btn-outline" target="_blank" rel="noopener">📍 Cómo llegar</a>` : ""}
  </div>
</section>

<main class="content">
  ${sections}
</main>

${contactInfo.address ? `<div class="info-bar">📍 ${esc(contactInfo.address)}${contactInfo.schedule ? ` &nbsp;|&nbsp; 🕐 ${esc(contactInfo.schedule)}` : ""}</div>` : ""}

<div class="sticky-ctas">
  <a href="${waHref}" class="btn-primary" target="_blank" rel="noopener">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    ${esc(nicheConfig.defaultCTA)}
  </a>
  ${contactInfo.mapUrl ? `<a href="${esc(mapHref)}" class="btn-outline" target="_blank" rel="noopener" style="flex-shrink:0">📍 Cómo llegar</a>` : ""}
</div>

${revealScript()}
</body>
</html>`;
}

// ══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 4: DEFAULT — Studio Clean (professional, any niche)
// ══════════════════════════════════════════════════════════════════════════════
function renderDefault(data: BusinessData): string {
  const { businessName, tagline, seoDescription, designSystem: ds, contactInfo, layoutStyle } = data;
  const catMap = itemsByCategory(data);
  const cats   = Array.from(catMap.keys());
  const waHref = whatsappHref(contactInfo);
  const nicheConfig = NICHE_CONFIGS[data.niche];

  const sections = cats.map(cat => {
    const items  = catMap.get(cat) || [];
    const isGrid = layoutStyle !== "list";

    const cards = items.map(item => {
      if (!isGrid) return `
      <div class="item-row reveal">
        <div>
          <h3 class="item-name">${esc(item.name)}</h3>
          ${item.description ? `<p class="item-desc">${esc(item.description)}</p>` : ""}
        </div>
        ${item.price ? `<span class="item-price">${esc(item.price)}</span>` : ""}
      </div>`;

      return `
      <div class="item-card reveal">
        <div class="item-accent"></div>
        <div class="item-body">
          <h3 class="item-name">${esc(item.name)}</h3>
          ${item.description ? `<p class="item-desc">${esc(item.description)}</p>` : ""}
          ${item.price ? `<span class="item-price">${esc(item.price)}</span>` : ""}
        </div>
      </div>`;
    }).join("");

    return `
    <div class="cat-block">
      <div class="cat-label">${esc(cat)}</div>
      <div class="${isGrid ? 'items-grid' : 'items-list'}">
        ${cards}
      </div>
    </div>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(businessName)}</title>
<meta name="description" content="${esc(seoDescription)}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="${googleFontsUrl(ds)}" rel="stylesheet" />
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{${cssVars(ds)}}
html{scroll-behavior:smooth}
body{font-family:var(--font-b);color:var(--text);background:var(--bg);min-height:100vh;-webkit-font-smoothing:antialiased}
h1,h2,h3,h4{font-family:var(--font-h)}
a{color:inherit;text-decoration:none}

/* ─── Nav ─── */
.site-nav{position:sticky;top:0;z-index:100;padding:14px 28px;background:var(--bg);border-bottom:1px solid rgba(0,0,0,0.07);display:flex;align-items:center;justify-content:space-between;gap:16px}
.nav-brand{display:flex;align-items:center;gap:10px}
.brand-dot{width:8px;height:8px;border-radius:50%;background:var(--primary);box-shadow:0 0 8px var(--primary),0 0 16px rgba(var(--primary),0.3);flex-shrink:0}
.brand-name{font-family:var(--font-h);font-size:1.05rem;font-weight:700;color:var(--text)}
.nav-right{display:flex;align-items:center;gap:10px}
.social-link{display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:8px;border:1px solid rgba(0,0,0,0.1);color:var(--muted);transition:border-color .2s,color .2s}
.social-link:hover{border-color:var(--primary);color:var(--primary)}
.nav-cta{display:inline-flex;align-items:center;gap:7px;background:var(--primary);color:#fff;padding:8px 18px;border-radius:var(--radius);font-size:0.82rem;font-weight:600;transition:opacity .2s,transform .15s}
.nav-cta:hover{opacity:.9;transform:translateY(-1px)}

/* ─── Hero ─── */
.hero{padding:80px 28px 72px;max-width:760px;margin:0 auto;text-align:center}
.hero-title{font-family:var(--font-h);font-size:clamp(2rem,5.5vw,3.5rem);font-weight:800;color:var(--text);line-height:1.1;margin-bottom:16px}
.hero-subtitle{font-size:1.1rem;color:var(--muted);max-width:500px;margin:0 auto 36px;line-height:1.65}
.hero-actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.btn-primary{display:inline-flex;align-items:center;gap:8px;background:var(--primary);color:#fff;padding:13px 28px;border-radius:var(--radius);font-size:0.9rem;font-weight:600;transition:opacity .2s,transform .15s}
.btn-primary:hover{opacity:.9;transform:translateY(-1px)}
.btn-ghost{display:inline-flex;align-items:center;gap:8px;border:1.5px solid rgba(0,0,0,0.12);color:var(--text);padding:12px 24px;border-radius:var(--radius);font-size:0.9rem;transition:border-color .2s,background .2s}
.btn-ghost:hover{border-color:var(--primary);background:rgba(0,0,0,0.02)}

/* ─── Content ─── */
.content{max-width:960px;margin:0 auto;padding:48px 24px 120px}
.cat-block{margin-bottom:52px}
.cat-label{font-size:0.72rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--primary);margin-bottom:16px;padding-left:12px;border-left:3px solid var(--primary)}

/* ─── Grid ─── */
.items-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px}
.item-card{position:relative;background:var(--bg);border:1px solid rgba(0,0,0,0.08);border-radius:var(--radius);overflow:hidden;display:flex;transition:box-shadow .2s,transform .2s}
.item-card:hover{box-shadow:var(--shadow);transform:translateY(-2px)}
.item-accent{width:4px;flex-shrink:0;background:var(--primary)}
.item-body{padding:16px;flex:1;display:flex;flex-direction:column;gap:6px}

/* ─── List ─── */
.items-list{display:flex;flex-direction:column;gap:1px;background:rgba(0,0,0,0.05);border-radius:var(--radius);overflow:hidden}
.item-row{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:14px 18px;background:var(--bg);transition:background .15s}
.item-row:hover{background:rgba(0,0,0,0.015)}

/* ─── Typography ─── */
.item-name{font-size:0.95rem;font-weight:600;color:var(--text)}
.item-desc{font-size:0.83rem;color:var(--muted);line-height:1.45;flex:1}
.item-price{font-size:0.9rem;font-weight:700;color:var(--primary);white-space:nowrap;flex-shrink:0}

/* ─── Footer bar ─── */
.footer-bar{position:fixed;bottom:0;left:0;right:0;z-index:200;background:var(--bg);border-top:1px solid rgba(0,0,0,0.08);padding:12px 24px;display:flex;align-items:center;justify-content:space-between;gap:12px;box-shadow:0 -4px 24px rgba(0,0,0,0.06)}
.footer-info{font-size:0.8rem;color:var(--muted)}

/* ─── Reveal ─── */
.reveal{opacity:0;transform:translateY(12px);transition:opacity .4s ease,transform .4s ease}
.reveal.visible{opacity:1;transform:none}

@media(max-width:480px){
  .hero{padding:48px 20px 40px}
  .hero-title{font-size:2rem}
  .items-grid{grid-template-columns:1fr}
  .hero-actions{flex-direction:column;align-items:center}
}
</style>
</head>
<body>

<nav class="site-nav">
  <div class="nav-brand">
    <div class="brand-dot"></div>
    <span class="brand-name">${esc(businessName)}</span>
  </div>
  <div class="nav-right">
    ${socialLinks(contactInfo)}
    <a href="${waHref}" class="nav-cta" target="_blank" rel="noopener">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      ${esc(nicheConfig.defaultCTA)}
    </a>
  </div>
</nav>

<section class="hero">
  <h1 class="hero-title">${esc(businessName)}</h1>
  ${tagline ? `<p class="hero-subtitle">${esc(tagline)}</p>` : ""}
  <div class="hero-actions">
    <a href="${waHref}" class="btn-primary" target="_blank" rel="noopener">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      ${esc(nicheConfig.defaultCTA)}
    </a>
    ${contactInfo.address ? `<a href="${contactInfo.mapUrl ? esc(contactInfo.mapUrl) : '#'}" class="btn-ghost" target="_blank" rel="noopener">📍 ${esc(contactInfo.address)}</a>` : ""}
  </div>
</section>

<main class="content">
  ${sections}
</main>

<div class="footer-bar">
  <span class="footer-info">${esc(businessName)}${contactInfo.email ? ` — ${esc(contactInfo.email)}` : ""}</span>
  <a href="${waHref}" class="btn-primary" target="_blank" rel="noopener" style="font-size:0.82rem;padding:9px 18px">${esc(nicheConfig.defaultCTA)}</a>
</div>

${revealScript()}
</body>
</html>`;
}

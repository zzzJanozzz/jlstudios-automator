// src/templates/beauty-template.ts
import { BusinessData, ExtractedItem } from "../lib/types";

function esc(s: string | null | undefined): string {
  if (!s) return "";
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}
function waHref(data: BusinessData): string {
  const n = data.contactInfo.whatsapp.replace(/\D/g,"");
  const m = encodeURIComponent(data.contactInfo.whatsappMessage || "Hola! Quiero reservar un turno ✨");
  return n ? `https://wa.me/${n}?text=${m}` : "#";
}
function fonts(data: BusinessData): string {
  const set = [...new Set([data.designSystem.fontHeading, data.designSystem.fontBody])];
  return set.map(f=>`family=${encodeURIComponent(f)}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400`).join("&");
}
function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

function buildTabs(cats: string[]): string {
  return cats.map((c,i) =>
    `<button class="svc-tab${i===0?" active":""}" data-target="svc-${i}" onclick="showTab(this,'svc-${i}')">${esc(c)}</button>`
  ).join("");
}

function buildServiceSections(data: BusinessData): string {
  const bycat = new Map<string, ExtractedItem[]>();
  data.categories.forEach(c => bycat.set(c, []));
  data.items.forEach(it => { const a = bycat.get(it.category)||[]; a.push(it); bycat.set(it.category,a); });

  return data.categories.map((cat,i) => {
    const items = bycat.get(cat) || [];
    const rows = items.map(it => `
      <div class="svc-row" data-aos>
        <div class="svc-row-left">
          <h3 class="svc-name">${esc(it.name)}</h3>
          ${it.description ? `<p class="svc-desc">${esc(it.description)}</p>` : ""}
        </div>
        <div class="svc-row-right">
          ${it.price ? `<span class="svc-price">${esc(it.price)}</span>` : ""}
          <a href="${waHref(data)}" class="svc-book" target="_blank" rel="noopener">Reservar</a>
        </div>
      </div>`).join("");

    return `
    <div id="svc-${i}" class="svc-panel${i===0?"":" svc-hidden"}">
      <div class="svc-list">${rows}</div>
    </div>`;
  }).join("");
}

export function renderBeauty(data: BusinessData): string {
  const ds = data.designSystem;
  const ci = data.contactInfo;
  const wa = waHref(data);
  const hasCover = !!data.portada_b64;
  const hasLogo  = !!data.logo_b64;

  // Light theme detection based on bg color
  const bgIsLight = isLightColor(ds.backgroundColor);
  const textOnBg = bgIsLight ? "#1a1a1a" : "#fafafa";
  const mutedOnBg = bgIsLight ? "#888" : "#aaa";
  const borderColor = bgIsLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)";
  const cardBg = bgIsLight ? "rgba(0,0,0,0.025)" : "rgba(255,255,255,0.03)";
  const cardHoverBg = bgIsLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)";

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${esc(data.businessName)}</title>
<meta name="description" content="${esc(data.seoDescription)}"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?${fonts(data)}&display=swap" rel="stylesheet"/>
<style>
/* ══════════════════════════════════════
   BEAUTY TEMPLATE — JLStudios Premium
   ══════════════════════════════════════ */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --c-primary:   ${ds.primaryColor};
  --c-secondary: ${ds.secondaryColor};
  --c-accent:    ${ds.accentColor};
  --c-bg:        ${ds.backgroundColor};
  --c-text:      ${textOnBg};
  --c-muted:     ${mutedOnBg};
  --c-border:    ${borderColor};
  --c-card:      ${cardBg};
  --c-card-h:    ${cardHoverBg};
  --radius:      ${ds.borderRadius};
  --font-h:      '${ds.fontHeading}',serif;
  --font-b:      '${ds.fontBody}',sans-serif;
}
html{scroll-behavior:smooth;background:var(--c-bg)}
body{font-family:var(--font-b);color:var(--c-text);background:var(--c-bg);min-height:100dvh;-webkit-font-smoothing:antialiased;overflow-x:hidden}
img{max-width:100%;display:block}
a{color:inherit;text-decoration:none}

/* ── TOP STRIP ───────────────────────── */
.top-strip{
  background:var(--c-primary);color:#fff;
  text-align:center;padding:10px 16px;
  font-size:0.8rem;font-weight:500;
  letter-spacing:0.06em;
}

/* ── NAV ─────────────────────────────── */
.site-nav{
  position:sticky;top:0;z-index:200;
  padding:0 32px;
  height:68px;
  display:flex;align-items:center;justify-content:space-between;
  background:var(--c-bg);
  border-bottom:1px solid var(--c-border);
  gap:20px;
}
.nav-logo-wrap{display:flex;align-items:center;gap:12px}
.nav-logo-img{width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid var(--c-border)}
.nav-brand{
  font-family:var(--font-h);
  font-size:1.15rem;font-weight:600;
  letter-spacing:0.04em;
  color:var(--c-text);
}
.nav-brand small{
  display:block;font-family:var(--font-b);
  font-size:0.68rem;font-weight:400;
  letter-spacing:0.12em;text-transform:uppercase;
  color:var(--c-muted);margin-top:1px;
}
.nav-links{display:flex;align-items:center;gap:28px}
.nav-link{
  font-size:0.85rem;color:var(--c-muted);
  transition:color .2s;
  cursor:pointer;
}
.nav-link:hover{color:var(--c-text)}
.nav-actions{display:flex;align-items:center;gap:10px}
.btn-book{
  display:inline-flex;align-items:center;gap:8px;
  background:var(--c-primary);color:#fff;
  padding:10px 22px;border-radius:var(--radius);
  font-size:0.85rem;font-weight:600;
  letter-spacing:0.02em;
  transition:opacity .2s,transform .15s;
}
.btn-book:hover{opacity:.88;transform:translateY(-1px)}
.btn-book-ghost{
  display:inline-flex;align-items:center;gap:8px;
  border:1.5px solid var(--c-primary);
  color:var(--c-primary);
  padding:9px 20px;border-radius:var(--radius);
  font-size:0.85rem;font-weight:600;
  transition:background .2s,color .2s;
}
.btn-book-ghost:hover{background:var(--c-primary);color:#fff}

/* ── HERO ────────────────────────────── */
.hero{
  display:grid;grid-template-columns:1fr 1fr;
  min-height:min(90vh,700px);
  overflow:hidden;
}
.hero-left{
  padding:80px 48px 80px 32px;
  display:flex;flex-direction:column;
  justify-content:center;
}
.hero-eyebrow{
  display:inline-flex;align-items:center;gap:8px;
  font-size:0.72rem;font-weight:700;
  letter-spacing:0.18em;text-transform:uppercase;
  color:var(--c-primary);margin-bottom:24px;
}
.hero-eyebrow::before{content:'';display:block;width:24px;height:1.5px;background:var(--c-primary)}
.hero-title{
  font-family:var(--font-h);
  font-size:clamp(2.2rem,4.5vw,4.5rem);
  font-weight:400;
  line-height:1.1;
  color:var(--c-text);
  margin-bottom:20px;
}
.hero-title strong{font-weight:700}
.hero-title em{
  font-style:italic;
  color:var(--c-primary);
}
.hero-sub{
  font-size:1.05rem;
  color:var(--c-muted);
  line-height:1.7;
  max-width:420px;
  margin-bottom:40px;
}
.hero-cta-group{display:flex;gap:12px;flex-wrap:wrap}
.hero-trust{
  display:flex;gap:20px;flex-wrap:wrap;
  margin-top:40px;padding-top:32px;
  border-top:1px solid var(--c-border);
}
.trust-item{
  display:flex;flex-direction:column;gap:2px;
}
.trust-num{
  font-family:var(--font-h);
  font-size:1.6rem;font-weight:700;
  color:var(--c-primary);
}
.trust-label{font-size:0.75rem;color:var(--c-muted);letter-spacing:0.05em}
.hero-right{
  position:relative;overflow:hidden;
  background:linear-gradient(135deg, rgba(${hexToRgb(ds.primaryColor)},0.08) 0%, rgba(${hexToRgb(ds.accentColor)},0.06) 100%);
}
${hasCover ? `.hero-right::after{content:'';position:absolute;inset:0;background:url('data:image/jpeg;base64,${data.portada_b64}') center/cover no-repeat}` : ""}
.hero-pattern{
  position:absolute;inset:0;
  background-image:radial-gradient(circle, rgba(${hexToRgb(ds.primaryColor)},0.15) 1px, transparent 1px);
  background-size:28px 28px;
  opacity:0.6;
}
.hero-img-placeholder{
  position:relative;z-index:1;
  height:100%;
  display:flex;align-items:center;justify-content:center;
  font-family:var(--font-h);
  font-size:5rem;
  opacity:0.15;
}

/* ── SERVICES SECTION ─────────────────── */
.services-section{
  max-width:1000px;margin:0 auto;
  padding:80px 24px 120px;
}
.section-header{
  text-align:center;margin-bottom:48px;
}
.section-eyebrow{
  font-size:0.72rem;font-weight:700;
  letter-spacing:0.18em;text-transform:uppercase;
  color:var(--c-primary);margin-bottom:12px;
}
.section-title{
  font-family:var(--font-h);
  font-size:clamp(1.8rem,3.5vw,3rem);
  font-weight:400;
  color:var(--c-text);
  line-height:1.15;
}
.section-title em{font-style:italic;color:var(--c-primary)}

/* ── TABS ─────────────────────────────── */
.svc-tabs{
  display:flex;flex-wrap:wrap;gap:8px;
  margin-bottom:36px;
  padding-bottom:20px;
  border-bottom:1px solid var(--c-border);
}
.svc-tab{
  padding:9px 20px;
  border-radius:20px;
  font-size:0.82rem;font-weight:600;
  color:var(--c-muted);
  background:transparent;
  border:1.5px solid var(--c-border);
  cursor:pointer;
  transition:all .2s;
  white-space:nowrap;
}
.svc-tab:hover{border-color:var(--c-primary);color:var(--c-primary)}
.svc-tab.active{
  background:var(--c-primary);
  border-color:var(--c-primary);
  color:#fff;
}

/* ── SERVICE LIST ─────────────────────── */
.svc-hidden{display:none}
.svc-list{
  display:flex;flex-direction:column;
  gap:1px;
  border-radius:var(--radius);
  overflow:hidden;
  border:1px solid var(--c-border);
}
.svc-row{
  display:flex;align-items:center;justify-content:space-between;
  gap:20px;
  padding:18px 24px;
  background:var(--c-bg);
  transition:background .15s;
  border-bottom:1px solid var(--c-border);
}
.svc-row:last-child{border-bottom:none}
.svc-row:hover{background:var(--c-card)}
.svc-row-left{flex:1;min-width:0}
.svc-name{
  font-size:0.98rem;font-weight:600;
  color:var(--c-text);margin-bottom:4px;
}
.svc-desc{
  font-size:0.81rem;color:var(--c-muted);
  line-height:1.45;
}
.svc-row-right{display:flex;align-items:center;gap:12px;flex-shrink:0}
.svc-price{
  font-family:var(--font-h);
  font-size:1.1rem;font-weight:600;
  color:var(--c-primary);
  white-space:nowrap;
}
.svc-book{
  display:inline-flex;align-items:center;
  padding:8px 16px;
  background:var(--c-primary);color:#fff;
  border-radius:var(--radius);
  font-size:0.78rem;font-weight:700;
  transition:opacity .2s,transform .15s;
  white-space:nowrap;
}
.svc-book:hover{opacity:.85;transform:translateY(-1px)}

/* ── GALLERY PLACEHOLDER ──────────────── */
.gallery-section{
  padding:60px 24px;
  background:var(--c-card);
  border-top:1px solid var(--c-border);
}
.gallery-inner{max-width:1000px;margin:0 auto}
.gallery-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  grid-template-rows:repeat(2,180px);
  gap:8px;
  border-radius:var(--radius);
  overflow:hidden;
  margin-top:32px;
}
.gallery-cell{
  background:linear-gradient(135deg, rgba(${hexToRgb(ds.primaryColor)},0.1) 0%, rgba(${hexToRgb(ds.accentColor)},0.08) 100%);
  border-radius:4px;
  display:flex;align-items:center;justify-content:center;
  font-size:1.8rem;
  opacity:0.5;
  transition:opacity .2s;
}
.gallery-cell:hover{opacity:0.8}
.gallery-cell:first-child{
  grid-column:span 2;grid-row:span 2;
  border-radius:var(--radius) 4px 4px var(--radius);
}

/* ── CTA BANNER ───────────────────────── */
.cta-banner{
  background:var(--c-primary);
  padding:56px 32px;
  text-align:center;
}
.cta-banner h2{
  font-family:var(--font-h);
  font-size:clamp(1.5rem,3vw,2.5rem);
  font-weight:400;color:#fff;
  line-height:1.2;margin-bottom:12px;
}
.cta-banner h2 em{font-style:italic}
.cta-banner p{color:rgba(255,255,255,0.7);margin-bottom:32px;font-size:1rem}
.btn-cta-white{
  display:inline-flex;align-items:center;gap:10px;
  background:#fff;color:var(--c-primary);
  padding:14px 32px;border-radius:var(--radius);
  font-size:0.95rem;font-weight:700;
  transition:opacity .2s,transform .15s;
}
.btn-cta-white:hover{opacity:.92;transform:translateY(-2px)}

/* ── FOOTER ───────────────────────────── */
.site-footer{
  padding:48px 24px;
  border-top:1px solid var(--c-border);
}
.footer-inner{
  max-width:1000px;margin:0 auto;
  display:flex;flex-wrap:wrap;
  justify-content:space-between;gap:32px;
}
.footer-brand{font-family:var(--font-h);font-size:1.3rem;font-weight:600;color:var(--c-text);margin-bottom:6px}
.footer-sub{font-size:0.81rem;color:var(--c-muted)}
.footer-col h4{font-size:0.68rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--c-muted);margin-bottom:10px}
.footer-col li{list-style:none;font-size:0.82rem;color:var(--c-muted);margin-bottom:6px}
.footer-copy{text-align:center;font-size:0.72rem;color:var(--c-muted);margin-top:40px;padding-top:24px;border-top:1px solid var(--c-border)}

/* ── ANIMATIONS ───────────────────────── */
[data-aos]{opacity:0;transform:translateY(18px);transition:opacity .5s ease,transform .5s ease}
[data-aos].aos-in{opacity:1;transform:none}
[data-aos][data-delay="1"]{transition-delay:.08s}
[data-aos][data-delay="2"]{transition-delay:.16s}
[data-aos][data-delay="3"]{transition-delay:.24s}

/* ── RESPONSIVE ───────────────────────── */
@media(max-width:768px){
  .hero{grid-template-columns:1fr}
  .hero-right{display:none}
  .hero-left{padding:60px 24px 48px}
  .gallery-grid{grid-template-columns:1fr 1fr;grid-template-rows:auto}
  .gallery-cell:first-child{grid-column:span 2;grid-row:span 1}
  .nav-links{display:none}
  .site-nav{padding:0 20px}
}
@media(max-width:480px){
  .svc-row{flex-direction:column;align-items:flex-start;gap:12px}
  .svc-row-right{width:100%;justify-content:space-between}
  .hero-title{font-size:2.2rem}
}
</style>
</head>
<body>

<!-- TOP STRIP -->
${ci.schedule ? `<div class="top-strip">🕐 Horario: ${esc(ci.schedule)}${ci.whatsapp ? ` &nbsp;|&nbsp; <a href="${wa}" style="color:#fff;font-weight:700" target="_blank" rel="noopener">Reservar turno →</a>` : ""}</div>` : ""}

<!-- NAV -->
<header class="site-nav">
  <div class="nav-logo-wrap">
    ${hasLogo ? `<img src="data:image/jpeg;base64,${data.logo_b64}" alt="${esc(data.businessName)}" class="nav-logo-img"/>` : ""}
    <div class="nav-brand">
      ${esc(data.businessName)}
      ${data.tagline ? `<small>${esc(data.tagline)}</small>` : ""}
    </div>
  </div>
  <nav class="nav-links">
    <span class="nav-link" onclick="document.getElementById('servicios').scrollIntoView({behavior:'smooth'})">Servicios</span>
    <span class="nav-link" onclick="document.getElementById('galeria').scrollIntoView({behavior:'smooth'})">Trabajos</span>
    ${ci.address ? `<span class="nav-link" onclick="document.getElementById('contacto').scrollIntoView({behavior:'smooth'})">Ubicación</span>` : ""}
  </nav>
  <div class="nav-actions">
    ${ci.instagram ? `<a href="https://instagram.com/${esc(ci.instagram)}" target="_blank" rel="noopener" style="font-size:0.8rem;color:var(--c-muted)">@${esc(ci.instagram)}</a>` : ""}
    <a href="${wa}" class="btn-book" target="_blank" rel="noopener">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      Reservar turno
    </a>
  </div>
</header>

<!-- HERO -->
<section class="hero">
  <div class="hero-left" data-aos>
    <div class="hero-eyebrow">Bienvenida al espacio</div>
    <h1 class="hero-title">
      <em>${esc(data.businessName)}</em>
    </h1>
    ${data.tagline ? `<p class="hero-sub">${esc(data.tagline)}</p>` : ""}
    <div class="hero-cta-group">
      <a href="${wa}" class="btn-book" target="_blank" rel="noopener">✨ Reservar turno</a>
      <a href="#servicios" class="btn-book-ghost">Ver servicios</a>
    </div>
    <div class="hero-trust">
      <div class="trust-item"><div class="trust-num">${data.items.length}+</div><div class="trust-label">Servicios</div></div>
      <div class="trust-item"><div class="trust-num">${data.categories.length}</div><div class="trust-label">Especialidades</div></div>
      <div class="trust-item"><div class="trust-num">100%</div><div class="trust-label">Satisfacción</div></div>
    </div>
  </div>
  <div class="hero-right">
    <div class="hero-pattern"></div>
    ${!hasCover ? `<div class="hero-img-placeholder">✂️</div>` : ""}
  </div>
</section>

<!-- SERVICES -->
<section class="services-section" id="servicios">
  <div class="section-header" data-aos>
    <div class="section-eyebrow">Lo que ofrecemos</div>
    <h2 class="section-title">Nuestros <em>servicios</em></h2>
  </div>

  <div class="svc-tabs" data-aos data-delay="1">
    ${buildTabs(data.categories)}
  </div>

  ${buildServiceSections(data)}
</section>

<!-- GALLERY -->
<section class="gallery-section" id="galeria">
  <div class="gallery-inner">
    <div class="section-header" data-aos>
      <div class="section-eyebrow">Portfolio</div>
      <h2 class="section-title">Nuestros <em>trabajos</em></h2>
    </div>
    <div class="gallery-grid">
      <div class="gallery-cell">✨</div>
      <div class="gallery-cell">💅</div>
      <div class="gallery-cell">💇</div>
      <div class="gallery-cell">💆</div>
      <div class="gallery-cell">🌟</div>
    </div>
    ${ci.instagram ? `<p style="text-align:center;margin-top:20px;font-size:0.85rem;color:var(--c-muted)">
      Seguinos en 
      <a href="https://instagram.com/${esc(ci.instagram)}" target="_blank" rel="noopener" style="color:var(--c-primary);font-weight:600">
        @${esc(ci.instagram)}
      </a>
      para ver más trabajos ✨
    </p>` : ""}
  </div>
</section>

<!-- CTA BANNER -->
<section class="cta-banner">
  <h2>¿Lista para <em>transformarte</em>?</h2>
  <p>Reservá tu turno ahora y viví la experiencia</p>
  <a href="${wa}" class="btn-cta-white" target="_blank" rel="noopener">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--c-primary)"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    Reservar por WhatsApp
  </a>
</section>

<!-- FOOTER -->
<footer class="site-footer" id="contacto">
  <div class="footer-inner">
    <div>
      <div class="footer-brand">${esc(data.businessName)}</div>
      ${data.tagline ? `<div class="footer-sub">${esc(data.tagline)}</div>` : ""}
    </div>
    <div class="footer-col">
      <h4>Contacto</h4>
      <ul>
        ${ci.whatsapp ? `<li><a href="${wa}" target="_blank" rel="noopener" style="color:var(--c-primary);font-weight:600">Reservar turno →</a></li>` : ""}
        ${ci.instagram ? `<li>Instagram: @${esc(ci.instagram)}</li>` : ""}
        ${ci.facebook ? `<li>Facebook: ${esc(ci.facebook)}</li>` : ""}
        ${ci.email ? `<li>${esc(ci.email)}</li>` : ""}
      </ul>
    </div>
    ${ci.address || ci.schedule ? `<div class="footer-col">
      <h4>Ubicación</h4>
      <ul>
        ${ci.address ? `<li>📍 ${esc(ci.address)}</li>` : ""}
        ${ci.schedule ? `<li>🕐 ${esc(ci.schedule)}</li>` : ""}
      </ul>
    </div>` : ""}
  </div>
  <div class="footer-copy">Sitio web creado por JLStudios · ${esc(data.businessName)}</div>
</footer>

<script>
function showTab(btn, targetId) {
  document.querySelectorAll('.svc-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.svc-panel').forEach(p => p.classList.add('svc-hidden'));
  btn.classList.add('active');
  const panel = document.getElementById(targetId);
  if (panel) {
    panel.classList.remove('svc-hidden');
    panel.querySelectorAll('[data-aos]').forEach((el,i) => {
      el.classList.remove('aos-in');
      setTimeout(() => el.classList.add('aos-in'), i * 60);
    });
  }
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('aos-in'); observer.unobserve(e.target); }});
}, { threshold: 0.08 });
document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

// Trigger initial visible tab rows
document.querySelectorAll('#svc-0 [data-aos]').forEach((el,i) => {
  setTimeout(() => el.classList.add('aos-in'), 200 + i*60);
});
</script>
</body>
</html>`;
}

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return (0.299*r + 0.587*g + 0.114*b) > 140;
}

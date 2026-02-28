// src/templates/gym-template.ts
import { BusinessData, ExtractedItem } from "../lib/types";

function esc(s: string | null | undefined): string {
  if (!s) return "";
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}
function waHref(data: BusinessData): string {
  const n = data.contactInfo.whatsapp.replace(/\D/g,"");
  const m = encodeURIComponent(data.contactInfo.whatsappMessage || "Hola! Quiero empezar en el gimnasio 💪");
  return n ? `https://wa.me/${n}?text=${m}` : "#";
}
function fonts(data: BusinessData): string {
  const set = [...new Set([data.designSystem.fontHeading, data.designSystem.fontBody])];
  return set.map(f=>`family=${encodeURIComponent(f)}:wght@400;500;600;700;800;900`).join("&");
}
function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

function buildPlanCards(data: BusinessData): string {
  const bycat = new Map<string, ExtractedItem[]>();
  data.categories.forEach(c => bycat.set(c, []));
  data.items.forEach(it => { const a = bycat.get(it.category)||[]; a.push(it); bycat.set(it.category,a); });

  // Use first category as "plans", or all items if one category
  const allItems = data.items;
  const featured = Math.floor(allItems.length / 2); // middle item is featured

  return allItems.map((it, i) => `
    <div class="plan-card${i===featured?" plan-featured":""}" data-aos data-delay="${i}">
      ${i===featured ? `<div class="plan-badge">⭐ MÁS POPULAR</div>` : ""}
      <div class="plan-body">
        <div class="plan-header">
          <div>
            <div class="plan-cat">${esc(it.category)}</div>
            <h3 class="plan-name">${esc(it.name)}</h3>
          </div>
          ${it.price ? `<div class="plan-price">
            <span>${esc(it.price)}</span>
            <small>/mes</small>
          </div>` : ""}
        </div>
        ${it.description ? `<p class="plan-desc">${esc(it.description)}</p>` : ""}
        <a href="${waHref(data)}" class="plan-cta${i===featured?" plan-cta-featured":""}" target="_blank" rel="noopener">
          EMPEZAR AHORA →
        </a>
      </div>
    </div>`).join("");
}

function buildScheduleSection(data: BusinessData): string {
  const days = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
  // Parse schedule from contactInfo if available
  const hasSchedule = !!data.contactInfo.schedule;
  
  return `
  <section class="schedule-section">
    <div class="section-inner">
      <div class="section-head" data-aos>
        <div class="section-eyebrow">HORARIOS</div>
        <h2 class="section-title">ENTRENAMOS <span class="text-accent">6 DÍAS</span></h2>
      </div>
      ${hasSchedule ? `
      <div class="schedule-info" data-aos>
        <div class="schedule-card">
          <div class="schedule-icon">🕐</div>
          <div>
            <div class="schedule-label">Horarios de apertura</div>
            <div class="schedule-text">${esc(data.contactInfo.schedule)}</div>
          </div>
        </div>
      </div>` : `
      <div class="schedule-grid" data-aos>
        ${days.map((d,i) => `
          <div class="day-card${i===6?" day-closed":""}">
            <div class="day-name">${d}</div>
            <div class="day-hours">${i===6 ? "Cerrado" : i===5 ? "8-18h" : "6-22h"}</div>
          </div>`).join("")}
      </div>`}
    </div>
  </section>`;
}

function buildCategoryTabs(data: BusinessData): string {
  return data.categories.map((c,i) =>
    `<button class="gym-tab${i===0?" gym-tab-active":""}" data-target="gym-cat-${i}" onclick="gymTab(this,'gym-cat-${i}')">${esc(c)}</button>`
  ).join("");
}

function buildCategoryPanels(data: BusinessData): string {
  const bycat = new Map<string, ExtractedItem[]>();
  data.categories.forEach(c => bycat.set(c, []));
  data.items.forEach(it => { const a = bycat.get(it.category)||[]; a.push(it); bycat.set(it.category,a); });

  return data.categories.map((cat,i) => {
    const items = bycat.get(cat)||[];
    const cards = items.map(it => `
      <div class="plan-card" data-aos>
        <div class="plan-body">
          <div class="plan-header">
            <h3 class="plan-name">${esc(it.name)}</h3>
            ${it.price ? `<div class="plan-price"><span>${esc(it.price)}</span><small>/mes</small></div>` : ""}
          </div>
          ${it.description ? `<p class="plan-desc">${esc(it.description)}</p>` : ""}
          <a href="${waHref(data)}" class="plan-cta" target="_blank" rel="noopener">INSCRIBIRME →</a>
        </div>
      </div>`).join("");
    
    return `<div id="gym-cat-${i}" class="gym-panel${i===0?"":" gym-panel-hidden"}">
      <div class="plans-grid">${cards}</div>
    </div>`;
  }).join("");
}

export function renderGym(data: BusinessData): string {
  const ds = data.designSystem;
  const ci = data.contactInfo;
  const wa = waHref(data);
  const hasCover = !!data.portada_b64;
  const totalPlans = data.items.length;

  const FACILITIES = [
    ["🏋️","Sala de Musculación"],["🧘","Clases Grupales"],["🚿","Vestuarios"],
    ["💧","Hidratación"],["🎵","Música Ambiental"],["📱","App Seguimiento"],
  ];

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
   GYM TEMPLATE — JLStudios Premium
   ══════════════════════════════════════ */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --c-primary:   ${ds.primaryColor};
  --c-accent:    ${ds.accentColor};
  --c-bg:        #050505;
  --c-surface:   #0f0f0f;
  --c-border:    rgba(255,255,255,0.08);
  --c-text:      #ffffff;
  --c-muted:     rgba(255,255,255,0.45);
  --radius:      ${ds.borderRadius};
  --font-h:      '${ds.fontHeading}',sans-serif;
  --font-b:      '${ds.fontBody}',sans-serif;
}
html{scroll-behavior:smooth;background:var(--c-bg)}
body{font-family:var(--font-b);color:var(--c-text);background:var(--c-bg);min-height:100dvh;-webkit-font-smoothing:antialiased;overflow-x:hidden}
img{max-width:100%;display:block}
a{color:inherit;text-decoration:none}
.text-accent{color:var(--c-accent)}

/* ── NAV ─────────────────────────────── */
.site-nav{
  position:fixed;top:0;left:0;right:0;z-index:300;
  height:60px;padding:0 24px;
  display:flex;align-items:center;justify-content:space-between;
  background:rgba(5,5,5,0.0);
  border-bottom:1px solid transparent;
  transition:background .3s, border-color .3s;
}
.site-nav.nav-scrolled{
  background:rgba(5,5,5,0.95);
  backdrop-filter:blur(20px);
  -webkit-backdrop-filter:blur(20px);
  border-color:var(--c-border);
}
.nav-brand{
  font-family:var(--font-h);
  font-size:1.1rem;font-weight:900;
  letter-spacing:0.1em;text-transform:uppercase;
  color:#fff;
}
.nav-brand span{color:var(--c-accent)}
.nav-right{display:flex;align-items:center;gap:12px}
.nav-cta{
  display:inline-flex;align-items:center;gap:8px;
  background:var(--c-accent);color:#fff;
  padding:9px 20px;border-radius:var(--radius);
  font-size:0.8rem;font-weight:800;
  text-transform:uppercase;letter-spacing:0.08em;
  transition:opacity .2s,transform .15s;
}
.nav-cta:hover{opacity:.88;transform:translateY(-1px)}
.nav-social{
  display:flex;align-items:center;justify-content:center;
  width:36px;height:36px;border-radius:50%;
  border:1px solid var(--c-border);
  color:var(--c-muted);transition:border-color .2s,color .2s;
}
.nav-social:hover{border-color:var(--c-accent);color:var(--c-accent)}

/* ── HERO ────────────────────────────── */
.hero{
  position:relative;min-height:100dvh;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  text-align:center;overflow:hidden;
  padding:80px 24px 80px;
}
.hero-bg{
  position:absolute;inset:0;
  ${hasCover
    ? `background:url('data:image/jpeg;base64,${data.portada_b64}') center/cover no-repeat;`
    : `background:linear-gradient(160deg,#0a0a0a 0%,#111 100%);`
  }
}
${hasCover ? `.hero-bg::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(5,5,5,0.98) 0%,rgba(5,5,5,0.6) 60%,rgba(5,5,5,0.3) 100%)}` : ""}
.hero-grid{
  position:absolute;inset:0;
  background-image:
    linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px);
  background-size:80px 80px;
  mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 30%,transparent 100%);
  -webkit-mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 30%,transparent 100%);
}
.hero-glow{
  position:absolute;
  width:600px;height:600px;
  border-radius:50%;
  background:radial-gradient(circle, rgba(${hexToRgb(ds.accentColor)},0.18) 0%, transparent 70%);
  top:50%;left:50%;transform:translate(-50%,-50%);
  animation:glow-pulse 4s ease infinite;
}
.hero-content{position:relative;z-index:1;max-width:900px}
.hero-eyebrow{
  display:inline-block;
  font-size:0.72rem;font-weight:800;
  letter-spacing:0.22em;text-transform:uppercase;
  color:var(--c-accent);
  padding:6px 16px;
  border:1px solid rgba(${hexToRgb(ds.accentColor)},0.3);
  border-radius:2px;
  margin-bottom:24px;
  background:rgba(${hexToRgb(ds.accentColor)},0.05);
}
.hero-title{
  font-family:var(--font-h);
  font-size:clamp(3rem,9vw,8rem);
  font-weight:900;
  line-height:0.9;
  letter-spacing:-0.02em;
  text-transform:uppercase;
  color:#fff;
  margin-bottom:24px;
}
.hero-title .accent-line{
  display:block;
  color:var(--c-accent);
  -webkit-text-stroke:0;
}
.hero-tagline{
  font-size:clamp(1rem,1.8vw,1.2rem);
  color:var(--c-muted);
  max-width:520px;margin:0 auto 48px;
  line-height:1.65;
}
.hero-stats{
  display:flex;gap:40px;justify-content:center;
  flex-wrap:wrap;margin-bottom:48px;
}
.stat{text-align:center}
.stat-num{
  font-family:var(--font-h);
  font-size:clamp(2rem,4vw,3.5rem);
  font-weight:900;
  color:var(--c-accent);
  line-height:1;display:block;
}
.stat-label{
  font-size:0.7rem;font-weight:700;
  letter-spacing:0.12em;text-transform:uppercase;
  color:var(--c-muted);margin-top:6px;display:block;
}
.hero-cta-row{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.btn-primary-gym{
  display:inline-flex;align-items:center;gap:10px;
  background:var(--c-accent);color:#fff;
  padding:16px 36px;border-radius:var(--radius);
  font-size:0.95rem;font-weight:900;
  text-transform:uppercase;letter-spacing:0.1em;
  transition:opacity .2s,transform .15s;
  box-shadow:0 8px 32px rgba(${hexToRgb(ds.accentColor)},0.4);
}
.btn-primary-gym:hover{opacity:.9;transform:translateY(-2px)}
.btn-ghost-gym{
  display:inline-flex;align-items:center;gap:10px;
  border:1.5px solid rgba(255,255,255,0.2);
  color:rgba(255,255,255,0.8);
  padding:15px 28px;border-radius:var(--radius);
  font-size:0.9rem;font-weight:700;text-transform:uppercase;
  letter-spacing:0.06em;
  transition:border-color .2s,background .2s;
}
.btn-ghost-gym:hover{border-color:rgba(255,255,255,0.5);background:rgba(255,255,255,0.06)}

/* ── SECTION COMMONS ──────────────────── */
.section-inner{max-width:1100px;margin:0 auto;padding:0 24px}
.section-head{text-align:center;margin-bottom:56px}
.section-eyebrow{
  font-size:0.72rem;font-weight:800;
  letter-spacing:0.22em;text-transform:uppercase;
  color:var(--c-accent);margin-bottom:12px;
}
.section-title{
  font-family:var(--font-h);
  font-size:clamp(2rem,4.5vw,3.5rem);
  font-weight:900;text-transform:uppercase;
  letter-spacing:-0.01em;
  color:#fff;
  line-height:1.0;
}
.section-sub{font-size:1rem;color:var(--c-muted);margin-top:12px;line-height:1.6}

/* ── PLANS SECTION ────────────────────── */
.plans-section{
  padding:100px 0;
  background:var(--c-surface);
  border-top:1px solid var(--c-border);
  border-bottom:1px solid var(--c-border);
}
.gym-tabs{
  display:flex;justify-content:center;gap:6px;
  flex-wrap:wrap;
  margin-bottom:48px;
}
.gym-tab{
  padding:10px 24px;border-radius:2px;
  font-size:0.78rem;font-weight:800;
  letter-spacing:0.1em;text-transform:uppercase;
  color:var(--c-muted);background:transparent;
  border:1px solid var(--c-border);cursor:pointer;
  transition:all .2s;white-space:nowrap;
}
.gym-tab:hover{color:#fff;border-color:rgba(255,255,255,0.3)}
.gym-tab-active{
  background:var(--c-accent)!important;
  border-color:var(--c-accent)!important;
  color:#fff!important;
}
.gym-panel-hidden{display:none}
.plans-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(280px,1fr));
  gap:16px;
}
.plan-card{
  position:relative;
  background:rgba(255,255,255,0.03);
  border:1px solid var(--c-border);
  border-radius:var(--radius);
  overflow:hidden;
  transition:transform .25s,border-color .25s,box-shadow .25s;
}
.plan-card:hover{
  transform:translateY(-4px);
  border-color:rgba(${hexToRgb(ds.accentColor)},0.4);
  box-shadow:0 16px 48px rgba(0,0,0,0.5);
}
.plan-featured{
  border-color:var(--c-accent)!important;
  background:rgba(${hexToRgb(ds.accentColor)},0.05)!important;
  box-shadow:0 0 0 1px rgba(${hexToRgb(ds.accentColor)},0.2), 0 16px 48px rgba(${hexToRgb(ds.accentColor)},0.15)!important;
}
.plan-badge{
  background:var(--c-accent);color:#fff;
  font-size:0.65rem;font-weight:900;
  letter-spacing:0.12em;text-transform:uppercase;
  padding:6px 20px;text-align:center;
}
.plan-body{padding:24px}
.plan-header{
  display:flex;align-items:flex-start;
  justify-content:space-between;gap:12px;
  margin-bottom:14px;
}
.plan-cat{
  font-size:0.65rem;font-weight:800;
  letter-spacing:0.14em;text-transform:uppercase;
  color:var(--c-accent);margin-bottom:4px;
}
.plan-name{
  font-family:var(--font-h);
  font-size:1.2rem;font-weight:800;
  text-transform:uppercase;letter-spacing:0.04em;
  color:#fff;line-height:1.1;
}
.plan-price{
  text-align:right;flex-shrink:0;
}
.plan-price span{
  font-family:var(--font-h);
  font-size:1.8rem;font-weight:900;
  color:var(--c-accent);display:block;line-height:1;
}
.plan-price small{
  font-size:0.72rem;color:var(--c-muted);
  letter-spacing:0.08em;text-transform:uppercase;
}
.plan-desc{
  font-size:0.85rem;color:var(--c-muted);
  line-height:1.55;margin-bottom:20px;
}
.plan-cta{
  display:block;
  background:rgba(255,255,255,0.06);
  border:1px solid rgba(255,255,255,0.1);
  color:rgba(255,255,255,0.8);
  text-align:center;padding:11px;
  border-radius:var(--radius);
  font-size:0.78rem;font-weight:800;
  text-transform:uppercase;letter-spacing:0.1em;
  transition:all .2s;
}
.plan-cta:hover{background:rgba(255,255,255,0.1);color:#fff}
.plan-cta-featured{
  background:var(--c-accent)!important;
  border-color:var(--c-accent)!important;
  color:#fff!important;
}
.plan-cta-featured:hover{opacity:.88}

/* ── SCHEDULE ─────────────────────────── */
.schedule-section{
  padding:80px 0;
  background:var(--c-bg);
}
.schedule-info{display:flex;justify-content:center}
.schedule-card{
  display:inline-flex;align-items:center;gap:20px;
  background:rgba(255,255,255,0.04);
  border:1px solid var(--c-border);
  border-radius:var(--radius);
  padding:24px 36px;
}
.schedule-icon{font-size:2rem}
.schedule-label{
  font-size:0.7rem;font-weight:800;
  letter-spacing:0.14em;text-transform:uppercase;
  color:var(--c-muted);margin-bottom:4px;
}
.schedule-text{
  font-family:var(--font-h);
  font-size:1.2rem;font-weight:700;color:#fff;
}
.schedule-grid{
  display:grid;
  grid-template-columns:repeat(7,1fr);
  gap:8px;
}
.day-card{
  background:rgba(255,255,255,0.04);
  border:1px solid var(--c-border);
  border-radius:var(--radius);
  padding:16px 8px;
  text-align:center;
}
.day-closed{opacity:.4}
.day-name{
  font-size:0.72rem;font-weight:800;
  letter-spacing:0.1em;text-transform:uppercase;
  color:var(--c-accent);margin-bottom:6px;
}
.day-hours{font-size:0.82rem;color:var(--c-muted)}

/* ── FACILITIES ───────────────────────── */
.facilities-section{
  padding:80px 0;
  background:var(--c-surface);
  border-top:1px solid var(--c-border);
}
.facilities-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(180px,1fr));
  gap:12px;
}
.facility-card{
  display:flex;flex-direction:column;align-items:center;gap:10px;
  padding:24px 16px;
  background:rgba(255,255,255,0.03);
  border:1px solid var(--c-border);
  border-radius:var(--radius);
  text-align:center;
  transition:border-color .2s,background .2s;
}
.facility-card:hover{
  border-color:rgba(${hexToRgb(ds.accentColor)},0.4);
  background:rgba(${hexToRgb(ds.accentColor)},0.05);
}
.facility-icon{font-size:2rem}
.facility-name{
  font-size:0.8rem;font-weight:700;
  text-transform:uppercase;letter-spacing:0.06em;
  color:rgba(255,255,255,0.7);
}

/* ── CTA SECTION ──────────────────────── */
.cta-section{
  padding:100px 24px;
  text-align:center;
  background:var(--c-bg);
  position:relative;overflow:hidden;
}
.cta-section::before{
  content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse 60% 80% at 50% 50%,rgba(${hexToRgb(ds.accentColor)},0.1) 0%,transparent 70%);
}
.cta-section h2{
  position:relative;
  font-family:var(--font-h);
  font-size:clamp(2rem,5vw,4rem);
  font-weight:900;text-transform:uppercase;
  color:#fff;margin-bottom:16px;line-height:1;
}
.cta-section p{
  position:relative;
  color:var(--c-muted);font-size:1.05rem;
  max-width:440px;margin:0 auto 40px;line-height:1.6;
}

/* ── BOTTOM BAR ───────────────────────── */
.bottom-bar{
  position:fixed;bottom:0;left:0;right:0;z-index:200;
  background:var(--c-accent);
  padding:12px 24px;
  display:flex;align-items:center;justify-content:space-between;gap:16px;
}
.bottom-bar-left{
  font-family:var(--font-h);
  font-size:0.85rem;font-weight:900;
  text-transform:uppercase;letter-spacing:0.08em;
  color:#fff;
}
.bottom-bar-right{
  display:inline-flex;align-items:center;gap:8px;
  background:#fff;color:var(--c-accent);
  padding:9px 22px;border-radius:var(--radius);
  font-size:0.8rem;font-weight:900;
  text-transform:uppercase;letter-spacing:0.08em;
  flex-shrink:0;transition:opacity .2s;
}
.bottom-bar-right:hover{opacity:.9}

/* ── FOOTER ───────────────────────────── */
.site-footer{
  background:#000;
  padding:48px 24px 80px;
  border-top:1px solid var(--c-border);
}
.footer-inner{
  max-width:1100px;margin:0 auto;
  display:flex;flex-wrap:wrap;
  justify-content:space-between;align-items:flex-start;gap:32px;
}
.footer-brand{
  font-family:var(--font-h);font-size:1.5rem;font-weight:900;
  text-transform:uppercase;letter-spacing:0.08em;
  color:#fff;
}
.footer-brand span{color:var(--c-accent)}
.footer-col h4{
  font-size:0.65rem;font-weight:800;
  letter-spacing:0.16em;text-transform:uppercase;
  color:var(--c-muted);margin-bottom:12px;
}
.footer-col li{list-style:none;font-size:0.82rem;color:var(--c-muted);margin-bottom:7px}
.footer-copy{
  text-align:center;
  font-size:0.7rem;color:rgba(255,255,255,0.15);
  margin-top:40px;padding-top:24px;
  border-top:1px solid var(--c-border);
}

/* ── ANIMATIONS ───────────────────────── */
[data-aos]{opacity:0;transform:translateY(24px);transition:opacity .5s ease,transform .5s ease}
[data-aos].aos-in{opacity:1;transform:none}
[data-aos][data-delay="0"]{transition-delay:0s}
[data-aos][data-delay="1"]{transition-delay:.1s}
[data-aos][data-delay="2"]{transition-delay:.2s}
[data-aos][data-delay="3"]{transition-delay:.3s}
@keyframes glow-pulse{0%,100%{opacity:.7;transform:translate(-50%,-50%) scale(1)}50%{opacity:1;transform:translate(-50%,-50%) scale(1.15)}}

/* ── RESPONSIVE ───────────────────────── */
@media(max-width:768px){
  .hero-stats{gap:24px}
  .plans-grid{grid-template-columns:1fr}
  .schedule-grid{grid-template-columns:repeat(4,1fr)}
  .facilities-grid{grid-template-columns:repeat(2,1fr)}
  .bottom-bar-left{display:none}
}
@media(max-width:480px){
  .hero-title{font-size:3rem}
  .hero-cta-row{flex-direction:column;align-items:center}
  .schedule-grid{grid-template-columns:repeat(3,1fr)}
}
</style>
</head>
<body>

<!-- NAV -->
<nav class="site-nav" id="main-nav">
  <div class="nav-brand">${esc(data.businessName.split(' ')[0])}<span>${data.businessName.split(' ').slice(1).join(' ') || ''}</span></div>
  <div class="nav-right">
    ${ci.instagram ? `<a href="https://instagram.com/${esc(ci.instagram)}" target="_blank" rel="noopener" class="nav-social" aria-label="Instagram">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
    </a>` : ""}
    <a href="${wa}" class="nav-cta" target="_blank" rel="noopener">Empezar →</a>
  </div>
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-bg"></div>
  <div class="hero-grid"></div>
  <div class="hero-glow"></div>
  <div class="hero-content">
    <div class="hero-eyebrow" data-aos>Tu transformación empieza aquí</div>
    <h1 class="hero-title" data-aos>
      ${esc(data.businessName)}
      ${data.tagline ? `<span class="accent-line" style="font-size:0.55em;letter-spacing:0.06em;font-weight:400;text-transform:uppercase">${esc(data.tagline)}</span>` : ""}
    </h1>
    <div class="hero-stats" data-aos>
      <div class="stat">
        <span class="stat-num" data-count="${totalPlans}">${totalPlans}</span>
        <span class="stat-label">Planes</span>
      </div>
      <div class="stat">
        <span class="stat-num" data-count="${data.categories.length}">${data.categories.length}</span>
        <span class="stat-label">Disciplinas</span>
      </div>
      <div class="stat">
        <span class="stat-num" data-count="6">6</span>
        <span class="stat-label">Días/semana</span>
      </div>
    </div>
    <div class="hero-cta-row" data-aos>
      <a href="${wa}" class="btn-primary-gym" target="_blank" rel="noopener">
        💪 Inscribirme ahora
      </a>
      <a href="#planes" class="btn-ghost-gym">Ver planes →</a>
    </div>
  </div>
</section>

<!-- PLANS -->
<section class="plans-section" id="planes">
  <div class="section-inner">
    <div class="section-head" data-aos>
      <div class="section-eyebrow">Membresías</div>
      <h2 class="section-title">Elegí tu <span class="text-accent">plan</span></h2>
      <p class="section-sub">Sin excusas. Empezá hoy.</p>
    </div>
    ${data.categories.length > 1 ? `
    <div class="gym-tabs">
      ${buildCategoryTabs(data)}
    </div>
    ${buildCategoryPanels(data)}
    ` : `
    <div class="plans-grid">
      ${buildPlanCards(data)}
    </div>
    `}
  </div>
</section>

<!-- SCHEDULE -->
${buildScheduleSection(data)}

<!-- FACILITIES -->
<section class="facilities-section">
  <div class="section-inner">
    <div class="section-head" data-aos>
      <div class="section-eyebrow">Instalaciones</div>
      <h2 class="section-title">Todo lo que <span class="text-accent">necesitás</span></h2>
    </div>
    <div class="facilities-grid">
      ${FACILITIES.map((f,i) => `
        <div class="facility-card" data-aos data-delay="${i % 3}">
          <div class="facility-icon">${f[0]}</div>
          <div class="facility-name">${f[1]}</div>
        </div>`).join("")}
    </div>
  </div>
</section>

<!-- CTA -->
<section class="cta-section">
  <h2>¿Listo para<br/><span class="text-accent">el cambio?</span></h2>
  <p>No lo dejes para mañana. Tu versión más fuerte empieza hoy.</p>
  <a href="${wa}" class="btn-primary-gym" target="_blank" rel="noopener">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    Consultar por WhatsApp
  </a>
</section>

<!-- BOTTOM BAR -->
<div class="bottom-bar">
  <div class="bottom-bar-left">${esc(data.businessName)} — ${data.tagline || "Tu transformación empieza hoy"}</div>
  <a href="${wa}" class="bottom-bar-right" target="_blank" rel="noopener">💪 INSCRIBIRME</a>
</div>

<!-- FOOTER -->
<footer class="site-footer">
  <div class="footer-inner">
    <div>
      <div class="footer-brand">${esc(data.businessName.split(' ')[0])}<span>${data.businessName.split(' ').slice(1).join(' ') || ''}</span></div>
    </div>
    ${ci.address || ci.schedule ? `<div class="footer-col">
      <h4>Ubicación</h4>
      <ul>
        ${ci.address ? `<li>📍 ${esc(ci.address)}</li>` : ""}
        ${ci.schedule ? `<li>🕐 ${esc(ci.schedule)}</li>` : ""}
      </ul>
    </div>` : ""}
    <div class="footer-col">
      <h4>Contacto</h4>
      <ul>
        ${ci.whatsapp ? `<li><a href="${wa}" target="_blank" rel="noopener" style="color:var(--c-accent);font-weight:700">Consultar por WhatsApp →</a></li>` : ""}
        ${ci.instagram ? `<li>Instagram: @${esc(ci.instagram)}</li>` : ""}
        ${ci.email ? `<li>${esc(ci.email)}</li>` : ""}
      </ul>
    </div>
  </div>
  <div class="footer-copy">Sitio web creado por JLStudios · ${esc(data.businessName)}</div>
</footer>

<script>
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => { nav.classList.toggle('nav-scrolled', window.scrollY > 60); }, {passive:true});

function gymTab(btn, targetId) {
  document.querySelectorAll('.gym-tab').forEach(t => t.classList.remove('gym-tab-active'));
  document.querySelectorAll('.gym-panel').forEach(p => p.classList.add('gym-panel-hidden'));
  btn.classList.add('gym-tab-active');
  const panel = document.getElementById(targetId);
  if (panel) {
    panel.classList.remove('gym-panel-hidden');
    panel.querySelectorAll('[data-aos]').forEach((el,i) => {
      el.classList.remove('aos-in');
      setTimeout(() => el.classList.add('aos-in'), i * 80);
    });
  }
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('aos-in'); observer.unobserve(e.target); }});
}, {threshold:0.08});
document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

// Count-up animation for stats
function animateCount(el) {
  const target = parseInt(el.dataset.count);
  let current = 0;
  const step = Math.ceil(target / 30);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current + (target > 50 ? "+" : "");
    if (current >= target) clearInterval(timer);
  }, 40);
}
const statsObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting){ animateCount(e.target); statsObs.unobserve(e.target); }});
},{threshold:0.5});
document.querySelectorAll('[data-count]').forEach(el => statsObs.observe(el));
</script>
</body>
</html>`;
}

// src/templates/gastro-template.ts  v2.3
import { BusinessData, ExtractedItem } from "../lib/types";
import { esc, waHref, fontsUrl, rgb, logoHtml, scheduleTable, styleOverrideCSS } from "./template-utils";

function buildCategoryNav(cats: string[]): string {
  return cats
    .map((c, i) =>
      `<button class="cat-tab${i === 0 ? " active" : ""}" data-target="cat-${i}" onclick="switchTab(this,'cat-${i}')">${esc(c)}</button>`
    )
    .join("");
}

function buildSections(data: BusinessData): string {
  const wa = waHref(data);
  const bycat = new Map<string, ExtractedItem[]>();
  data.categories.forEach((c) => bycat.set(c, []));
  data.items.forEach((it) => {
    const arr = bycat.get(it.category) ?? [];
    arr.push(it);
    bycat.set(it.category, arr);
  });

  return data.categories
    .map((cat, i) => {
      const items = bycat.get(cat) ?? [];
      const isGrid = data.layoutStyle !== "list";

      const cards = items
        .map((it) => {
          const hasImg = !!it.image_b64;

          if (isGrid) {
            return `
            <div class="menu-card" data-aos>
              ${hasImg
                ? `<div class="menu-card-img">
                    <img src="data:image/jpeg;base64,${it.image_b64}" alt="${esc(it.name)}" loading="lazy" />
                   </div>`
                : ""}
              <div class="menu-card-body">
                <div class="menu-card-top">
                  <h3 class="menu-item-name">${esc(it.name)}</h3>
                  ${it.price ? `<span class="menu-price">${esc(it.price)}</span>` : ""}
                </div>
                ${it.description ? `<p class="menu-item-desc">${esc(it.description)}</p>` : ""}
              </div>
              <a href="${wa}" class="menu-card-order" target="_blank" rel="noopener">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Pedir
              </a>
            </div>`;
          }

          // List layout
          return `
          <div class="menu-row" data-aos>
            ${hasImg
              ? `<img src="data:image/jpeg;base64,${it.image_b64}" alt="${esc(it.name)}" class="menu-row-img" loading="lazy" />`
              : ""}
            <div class="menu-row-body">
              <h3 class="menu-item-name">${esc(it.name)}</h3>
              ${it.description ? `<p class="menu-item-desc">${esc(it.description)}</p>` : ""}
            </div>
            <div class="menu-row-right">
              ${it.price ? `<span class="menu-price">${esc(it.price)}</span>` : ""}
              <a href="${wa}" class="menu-row-order" target="_blank" rel="noopener">Pedir →</a>
            </div>
          </div>`;
        })
        .join("");

      return `
      <section id="cat-${i}" class="menu-section${i === 0 ? "" : " hidden-section"}">
        <div class="${isGrid ? "menu-grid" : "menu-list"}">${cards}</div>
      </section>`;
    })
    .join("");
}

export function renderGastro(data: BusinessData): string {
  const ds  = data.designSystem;
  const ci  = data.contactInfo;
  const wa  = waHref(data);
  const hasCover = !!data.portada_b64;
  const openDays = ci.schedule.filter((d) => d.isOpen);

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${esc(data.businessName)}</title>
<meta name="description" content="${esc(data.seoDescription)}"/>
<meta property="og:title" content="${esc(data.businessName)}"/>
<meta property="og:description" content="${esc(data.seoDescription)}"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="${fontsUrl(data)}" rel="stylesheet"/>
<style>
:root{
  --c-primary:   ${ds.primaryColor};
  --c-secondary: ${ds.secondaryColor};
  --c-accent:    ${ds.accentColor};
  --c-bg:        ${ds.backgroundColor};
  --c-text:      ${ds.textColor};
  --c-muted:     ${ds.mutedColor};
  --radius:      ${ds.borderRadius};
  --font-h:      '${ds.fontHeading}',serif;
  --font-b:      '${ds.fontBody}',sans-serif;
  --nav-h:       64px;
  --tab-h:       52px;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;background:var(--c-bg)}
body{font-family:var(--font-b);color:var(--c-text);background:var(--c-bg);min-height:100dvh;overflow-x:hidden;-webkit-font-smoothing:antialiased}
img{max-width:100%;display:block}
a{color:inherit;text-decoration:none}

/* NAV */
.site-nav{position:fixed;top:0;left:0;right:0;z-index:200;height:var(--nav-h);padding:0 24px;display:flex;align-items:center;justify-content:space-between;background:transparent;transition:background .35s,backdrop-filter .35s}
.site-nav.scrolled{background:rgba(0,0,0,0.88);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,0.06)}
.nav-logo-wrap{display:flex;align-items:center;gap:10px}
.nav-logo-img{width:36px;height:36px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,0.15)}
.nav-logo-text{font-family:var(--font-h);font-size:1.15rem;font-weight:700;color:#fff}
.nav-logo-text small{display:block;font-family:var(--font-b);font-size:0.65rem;font-weight:400;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.45);margin-top:2px}
.nav-right{display:flex;align-items:center;gap:10px}
.nav-social{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.7);transition:background .2s,color .2s}
.nav-social:hover{background:rgba(255,255,255,0.15);color:#fff}
.nav-cta{display:inline-flex;align-items:center;gap:7px;background:var(--c-accent);color:#fff;padding:9px 20px;border-radius:var(--radius);font-size:0.82rem;font-weight:700;transition:opacity .2s,transform .15s;white-space:nowrap}
.nav-cta:hover{opacity:.88;transform:translateY(-1px)}

/* HERO */
.hero{position:relative;min-height:100dvh;display:flex;align-items:flex-end;overflow:hidden}
.hero-bg{position:absolute;inset:0;
  ${hasCover
    ? `background:url('data:image/jpeg;base64,${data.portada_b64}') center/cover no-repeat;`
    : `background:radial-gradient(ellipse 80% 60% at 50% 30%,rgba(${rgb(ds.primaryColor)},0.35) 0%,transparent 70%),linear-gradient(180deg,#0a0a0a 0%,#111 100%);`
  }
}
${hasCover ? `.hero-bg::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.97) 0%,rgba(0,0,0,0.55) 55%,rgba(0,0,0,0.2) 100%)}` : ""}
.hero-content{position:relative;z-index:1;width:100%;max-width:1100px;margin:0 auto;padding:0 28px 80px}
.hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:6px 14px;font-size:0.75rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--c-accent);margin-bottom:20px}
.hero-badge span{width:6px;height:6px;border-radius:50%;background:var(--c-accent);animation:blink 2s ease infinite}
.hero-title{font-family:var(--font-h);font-size:clamp(3rem,8vw,7rem);font-weight:800;line-height:1;color:#fff;margin-bottom:16px}
.hero-title em{font-style:italic;background:linear-gradient(135deg,var(--c-primary),var(--c-accent));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero-tagline{font-size:clamp(1rem,2vw,1.2rem);color:rgba(255,255,255,0.6);max-width:480px;line-height:1.7;margin-bottom:36px}
.hero-actions{display:flex;gap:12px;flex-wrap:wrap;align-items:center}
.btn-hero{display:inline-flex;align-items:center;gap:10px;background:var(--c-accent);color:#fff;padding:15px 32px;border-radius:var(--radius);font-size:1rem;font-weight:700;transition:opacity .2s,transform .15s;box-shadow:0 8px 32px rgba(0,0,0,0.4)}
.btn-hero:hover{opacity:.9;transform:translateY(-2px)}
.btn-hero-ghost{display:inline-flex;align-items:center;gap:10px;border:1.5px solid rgba(255,255,255,0.25);color:rgba(255,255,255,0.85);padding:14px 28px;border-radius:var(--radius);font-size:1rem;font-weight:500;transition:border-color .2s,background .2s}
.btn-hero-ghost:hover{border-color:rgba(255,255,255,0.6);background:rgba(255,255,255,0.06)}
.hero-info{display:flex;gap:20px;flex-wrap:wrap;margin-top:40px;padding-top:28px;border-top:1px solid rgba(255,255,255,0.1)}
.hero-info-chip{display:flex;align-items:center;gap:8px;font-size:0.82rem;color:rgba(255,255,255,0.55)}
.hero-info-chip svg{flex-shrink:0;color:var(--c-accent)}

/* CATEGORY TABS */
.cat-nav{position:sticky;top:var(--nav-h);z-index:150;height:var(--tab-h);background:rgba(0,0,0,0.9);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,255,255,0.06);overflow:hidden}
.cat-nav-inner{display:flex;height:100%;overflow-x:auto;padding:0 20px;gap:4px;align-items:center;scrollbar-width:none;max-width:1100px;margin:0 auto}
.cat-nav-inner::-webkit-scrollbar{display:none}
.cat-tab{flex-shrink:0;padding:8px 18px;border-radius:20px;font-size:0.82rem;font-weight:600;letter-spacing:0.03em;color:rgba(255,255,255,0.5);background:transparent;border:1px solid transparent;cursor:pointer;transition:all .2s;white-space:nowrap}
.cat-tab:hover{color:rgba(255,255,255,0.85);background:rgba(255,255,255,0.06)}
.cat-tab.active{color:#fff;background:rgba(255,255,255,0.09);border-color:rgba(255,255,255,0.15)}

/* MENU CONTENT */
.menu-content{max-width:1100px;margin:0 auto;padding:40px 20px 140px}
.menu-section{}
.hidden-section{display:none}

/* Grid layout */
.menu-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1px;background:rgba(255,255,255,0.05);border-radius:var(--radius);overflow:hidden}
.menu-card{background:rgba(255,255,255,0.025);display:flex;flex-direction:column;transition:background .2s}
.menu-card:hover{background:rgba(255,255,255,0.055)}
.menu-card-img{width:100%;aspect-ratio:16/9;overflow:hidden;flex-shrink:0}
.menu-card-img img{width:100%;height:100%;object-fit:cover;transition:transform .4s ease}
.menu-card:hover .menu-card-img img{transform:scale(1.04)}
.menu-card-body{padding:16px 20px 12px;flex:1}
.menu-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:8px}
.menu-item-name{font-family:var(--font-h);font-size:1.05rem;font-weight:600;color:#fff;line-height:1.3;flex:1}
.menu-price{font-size:0.95rem;font-weight:800;color:var(--c-accent);white-space:nowrap;flex-shrink:0;padding:2px 10px;background:rgba(${rgb(ds.accentColor)},0.1);border-radius:6px;border:1px solid rgba(${rgb(ds.accentColor)},0.2)}
.menu-item-desc{font-size:0.83rem;color:rgba(255,255,255,0.45);line-height:1.55}
.menu-card-order{display:flex;align-items:center;gap:8px;margin:0 20px 16px;padding:9px 16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;font-size:0.78rem;font-weight:600;color:rgba(255,255,255,0.6);transition:all .2s;width:fit-content}
.menu-card-order:hover{background:rgba(${rgb(ds.accentColor)},0.15);border-color:rgba(${rgb(ds.accentColor)},0.4);color:var(--c-accent)}

/* List layout */
.menu-list{display:flex;flex-direction:column;gap:1px;background:rgba(255,255,255,0.05);border-radius:var(--radius);overflow:hidden}
.menu-row{display:flex;align-items:center;gap:16px;padding:16px 20px;background:rgba(255,255,255,0.02);border-bottom:1px solid rgba(255,255,255,0.05);transition:background .2s}
.menu-row:hover{background:rgba(255,255,255,0.04)}
.menu-row:last-child{border-bottom:none}
.menu-row-img{width:60px;height:60px;border-radius:8px;object-fit:cover;flex-shrink:0;border:1px solid rgba(255,255,255,0.08)}
.menu-row-body{flex:1;min-width:0}
.menu-row-right{display:flex;flex-direction:column;align-items:flex-end;gap:8px;flex-shrink:0}
.menu-row-order{font-size:0.78rem;font-weight:700;color:var(--c-accent);white-space:nowrap;transition:opacity .2s}
.menu-row-order:hover{opacity:.7}

/* SCHEDULE SECTION */
.schedule-section{max-width:1100px;margin:0 auto;padding:0 20px 60px}
.schedule-box{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:var(--radius);padding:24px 28px}
.schedule-title{font-family:var(--font-h);font-size:0.9rem;font-weight:600;color:rgba(255,255,255,0.5);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:16px;display:flex;align-items:center;gap:8px}

/* FLOAT WA BUTTON */
.wa-float{position:fixed;bottom:28px;right:24px;z-index:300;display:flex;align-items:center;gap:10px;background:#25d366;color:#fff;padding:13px 22px;border-radius:50px;font-size:0.9rem;font-weight:700;box-shadow:0 8px 28px rgba(37,211,102,0.4);transition:transform .2s,box-shadow .2s}
.wa-float:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 12px 36px rgba(37,211,102,0.55)}
.wa-float::before{content:'';position:absolute;inset:-3px;border-radius:54px;border:2px solid rgba(37,211,102,0.3);animation:pulse-ring 2.5s ease infinite}

/* FOOTER */
.site-footer{background:rgba(0,0,0,0.6);border-top:1px solid rgba(255,255,255,0.06);padding:40px 24px}
.footer-inner{max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-start;gap:32px}
.footer-brand{font-family:var(--font-h);font-size:1.4rem;font-weight:700;color:#fff;margin-bottom:8px}
.footer-sub{font-size:0.83rem;color:rgba(255,255,255,0.4)}
.footer-col h4{font-size:0.68rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:12px}
.footer-col li{list-style:none;font-size:0.83rem;color:rgba(255,255,255,0.55);margin-bottom:6px}
.footer-logo-img{width:44px;height:44px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,0.1);margin-bottom:10px}
.footer-copy{width:100%;text-align:center;font-size:0.72rem;color:rgba(255,255,255,0.2);padding-top:32px;border-top:1px solid rgba(255,255,255,0.06);margin-top:16px}

/* ANIMATIONS */
[data-aos]{opacity:0;transform:translateY(20px);transition:opacity .55s ease,transform .55s ease}
[data-aos].aos-in{opacity:1;transform:none}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes pulse-ring{0%{transform:scale(1);opacity:.7}70%{transform:scale(1.15);opacity:0}100%{transform:scale(1);opacity:0}}

@media(max-width:640px){
  .hero-title{font-size:3rem}
  .menu-grid{grid-template-columns:1fr}
  .wa-float span{display:none}.wa-float{padding:14px}
  .hero-actions{flex-direction:column;align-items:flex-start}
}

/* ── STYLE VARIANT OVERRIDES ── */
${styleOverrideCSS(ds.style, ds.accentColor)}
</style>
</head>
<body>

<!-- NAV -->
<nav class="site-nav" id="main-nav">
  <div class="nav-logo-wrap">
    ${logoHtml(data, { textClass:"nav-logo-text", imgClass:"nav-logo-img" })}
    ${data.logo_b64 ? `<div class="nav-logo-text">${esc(data.businessName)}${data.tagline ? `<small>${esc(data.tagline)}</small>` : ""}</div>` : `${data.tagline ? `<small style="font-family:var(--font-b);font-size:0.65rem;color:rgba(255,255,255,0.45);letter-spacing:0.15em;text-transform:uppercase;display:block;margin-top:2px">${esc(data.tagline)}</small>` : ""}`}
  </div>
  <div class="nav-right">
    ${ci.instagram ? `<a href="https://instagram.com/${esc(ci.instagram)}" target="_blank" rel="noopener" class="nav-social" aria-label="Instagram"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>` : ""}
    <a href="${wa}" class="nav-cta" target="_blank" rel="noopener">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      Pedir ahora
    </a>
  </div>
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-bg"></div>
  <div class="hero-content">
    <div class="hero-badge"><span></span>Menú digital</div>
    <h1 class="hero-title"><em>${esc(data.businessName)}</em></h1>
    ${data.tagline ? `<p class="hero-tagline">${esc(data.tagline)}</p>` : ""}
    <div class="hero-actions">
      <a href="${wa}" class="btn-hero" target="_blank" rel="noopener">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        Hacer pedido
      </a>
      <a href="#menu" class="btn-hero-ghost">Ver menú completo ↓</a>
    </div>
    ${ci.address || openDays.length > 0 ? `
    <div class="hero-info">
      ${ci.address ? `<div class="hero-info-chip"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>${esc(ci.address)}</div>` : ""}
      ${openDays.length > 0 ? `<div class="hero-info-chip"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>${openDays[0].day}–${openDays[openDays.length - 1].day}: ${openDays[0].open}–${openDays[0].close}</div>` : ""}
    </div>` : ""}
  </div>
</section>

<!-- CATEGORY TABS -->
<nav class="cat-nav" id="menu">
  <div class="cat-nav-inner">${buildCategoryNav(data.categories)}</div>
</nav>

<!-- MENU -->
<main class="menu-content">
  ${buildSections(data)}
</main>

<!-- SCHEDULE -->
${ci.schedule.some((d) => d.isOpen) ? `
<div class="schedule-section">
  <div class="schedule-box">
    <div class="schedule-title">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      Horarios
    </div>
    ${scheduleTable(ci.schedule, ds.textColor, ds.mutedColor)}
  </div>
</div>` : ""}

<!-- FLOAT WA -->
<a href="${wa}" class="wa-float" target="_blank" rel="noopener">
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
  <span>Pedir ahora</span>
</a>

<!-- FOOTER -->
<footer class="site-footer">
  <div class="footer-inner">
    <div>
      ${data.logo_b64 ? `<img src="data:image/jpeg;base64,${data.logo_b64}" alt="${esc(data.businessName)}" class="footer-logo-img"/>` : ""}
      <div class="footer-brand">${esc(data.businessName)}</div>
      ${data.tagline ? `<div class="footer-sub">${esc(data.tagline)}</div>` : ""}
    </div>
    ${ci.address || ci.email ? `<div class="footer-col"><h4>Información</h4><ul>
      ${ci.address ? `<li>📍 ${esc(ci.address)}</li>` : ""}
      ${ci.email ? `<li>✉️ ${esc(ci.email)}</li>` : ""}
    </ul></div>` : ""}
    <div class="footer-col"><h4>Contacto</h4><ul>
      ${ci.whatsapp ? `<li><a href="${wa}" target="_blank" rel="noopener" style="color:var(--c-accent)">Hacer pedido por WhatsApp →</a></li>` : ""}
      ${ci.instagram ? `<li>@${esc(ci.instagram)}</li>` : ""}
    </ul></div>
  </div>
  <div class="footer-copy">Sitio web creado por JLStudios · ${esc(data.businessName)}</div>
</footer>

<script>
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 60); }, {passive:true});

function switchTab(btn, targetId) {
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.menu-section').forEach(s => s.classList.add('hidden-section'));
  btn.classList.add('active');
  const target = document.getElementById(targetId);
  if (target) {
    target.classList.remove('hidden-section');
    target.querySelectorAll('[data-aos]').forEach((el, i) => {
      el.classList.remove('aos-in');
      setTimeout(() => el.classList.add('aos-in'), i * 55);
    });
  }
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('aos-in'); observer.unobserve(e.target); }});
}, {threshold:0.08});
document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
document.querySelectorAll('#cat-0 [data-aos]').forEach((el, i) => {
  setTimeout(() => el.classList.add('aos-in'), 100 + i * 55);
});
</script>
</body>
</html>`;
}

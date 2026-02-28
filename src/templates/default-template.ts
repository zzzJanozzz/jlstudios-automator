// src/templates/default-template.ts
import { BusinessData, ExtractedItem } from "../lib/types";

function esc(s:string|null|undefined):string{if(!s)return"";return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}
function waHref(d:BusinessData):string{const n=d.contactInfo.whatsapp.replace(/\D/g,"");const m=encodeURIComponent(d.contactInfo.whatsappMessage||"Hola! Quiero consultarte.");return n?`https://wa.me/${n}?text=${m}`:"#"}
function fonts(d:BusinessData):string{const s=[...new Set([d.designSystem.fontHeading,d.designSystem.fontBody])];return s.map(f=>`family=${encodeURIComponent(f)}:wght@300;400;500;600;700;800`).join("&")}
function hexToRgb(hex:string):string{return`${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)}`}
function isLight(hex:string):boolean{const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return(0.299*r+0.587*g+0.114*b)>140}

export function renderDefault(data: BusinessData): string {
  const ds = data.designSystem;
  const ci = data.contactInfo;
  const wa = waHref(data);
  const light = isLight(ds.backgroundColor);
  const textBase = light ? "#1a1a1a" : "#fafafa";
  const border = light ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)";

  const bycat = new Map<string, ExtractedItem[]>();
  data.categories.forEach(c => bycat.set(c,[]));
  data.items.forEach(it=>{const a=bycat.get(it.category)||[];a.push(it);bycat.set(it.category,a);});

  const sections = data.categories.map((cat,i) => {
    const items = bycat.get(cat)||[];
    const cards = items.map(it => `
      <div class="item-card" data-aos>
        <div class="item-accent"></div>
        <div class="item-body">
          <div class="item-top">
            <h3 class="item-name">${esc(it.name)}</h3>
            ${it.price?`<span class="item-price">${esc(it.price)}</span>`:""}
          </div>
          ${it.description?`<p class="item-desc">${esc(it.description)}</p>`:""}
          <a href="${wa}" class="item-cta" target="_blank" rel="noopener">Consultar →</a>
        </div>
      </div>`).join("");
    return `
    <div class="cat-block" id="cat-${i}">
      <div class="cat-label">${esc(cat)}</div>
      <div class="items-grid">${cards}</div>
    </div>`;
  }).join("");

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
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --c-primary:${ds.primaryColor};--c-accent:${ds.accentColor};
  --c-bg:${ds.backgroundColor};--c-text:${textBase};
  --c-muted:${ds.mutedColor};--c-border:${border};
  --radius:${ds.borderRadius};
  --font-h:'${ds.fontHeading}',sans-serif;--font-b:'${ds.fontBody}',sans-serif;
}
html{scroll-behavior:smooth;background:var(--c-bg)}
body{font-family:var(--font-b);color:var(--c-text);background:var(--c-bg);min-height:100dvh;-webkit-font-smoothing:antialiased;overflow-x:hidden}
a{color:inherit;text-decoration:none}

.site-nav{position:sticky;top:0;z-index:100;height:60px;padding:0 24px;display:flex;align-items:center;justify-content:space-between;background:var(--c-bg);border-bottom:1px solid var(--c-border)}
.nav-brand{font-family:var(--font-h);font-size:1.1rem;font-weight:700;color:var(--c-text)}
.nav-cta{display:inline-flex;align-items:center;gap:7px;background:var(--c-primary);color:#fff;padding:9px 20px;border-radius:var(--radius);font-size:0.83rem;font-weight:700;transition:opacity .2s,transform .15s}
.nav-cta:hover{opacity:.88;transform:translateY(-1px)}

.hero{padding:80px 24px 64px;max-width:800px;margin:0 auto;text-align:center}
.hero-title{font-family:var(--font-h);font-size:clamp(2rem,5vw,3.5rem);font-weight:800;color:var(--c-text);margin-bottom:16px;line-height:1.1}
.hero-title em{font-style:italic;color:var(--c-primary)}
.hero-sub{font-size:1.05rem;color:var(--c-muted);max-width:480px;margin:0 auto 36px;line-height:1.65}
.hero-actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.btn-p{display:inline-flex;align-items:center;gap:8px;background:var(--c-primary);color:#fff;padding:13px 28px;border-radius:var(--radius);font-size:.9rem;font-weight:700;transition:opacity .2s,transform .15s}
.btn-p:hover{opacity:.9;transform:translateY(-1px)}
.btn-g{display:inline-flex;align-items:center;gap:8px;border:1.5px solid var(--c-border);color:var(--c-text);padding:12px 24px;border-radius:var(--radius);font-size:.9rem;transition:border-color .2s}
.btn-g:hover{border-color:var(--c-primary)}

.content{max-width:960px;margin:0 auto;padding:40px 24px 120px}
.cat-block{margin-bottom:52px}
.cat-label{font-size:.7rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--c-primary);margin-bottom:16px;padding-left:12px;border-left:3px solid var(--c-primary)}
.items-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}
.item-card{display:flex;background:var(--c-bg);border:1px solid var(--c-border);border-radius:var(--radius);overflow:hidden;transition:box-shadow .2s,transform .2s}
.item-card:hover{box-shadow:0 8px 28px rgba(0,0,0,0.1);transform:translateY(-2px)}
.item-accent{width:4px;flex-shrink:0;background:var(--c-primary)}
.item-body{padding:16px;flex:1;display:flex;flex-direction:column;gap:6px}
.item-top{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
.item-name{font-size:.95rem;font-weight:600;color:var(--c-text)}
.item-price{font-size:.88rem;font-weight:800;color:var(--c-primary);white-space:nowrap;flex-shrink:0}
.item-desc{font-size:.82rem;color:var(--c-muted);line-height:1.45;flex:1}
.item-cta{align-self:flex-start;font-size:.75rem;font-weight:700;color:var(--c-primary);padding:5px 0;transition:opacity .15s}
.item-cta:hover{opacity:.7}

.footer-bar{position:fixed;bottom:0;left:0;right:0;z-index:200;background:var(--c-bg);border-top:1px solid var(--c-border);padding:12px 24px;display:flex;align-items:center;justify-content:space-between;gap:12px;box-shadow:0 -4px 20px rgba(0,0,0,0.06)}

[data-aos]{opacity:0;transform:translateY(16px);transition:opacity .45s ease,transform .45s ease}
[data-aos].aos-in{opacity:1;transform:none}

@media(max-width:480px){.items-grid{grid-template-columns:1fr}.hero-actions{flex-direction:column;align-items:center}}
</style>
</head>
<body>
<nav class="site-nav">
  <div class="nav-brand">${esc(data.businessName)}</div>
  <a href="${wa}" class="nav-cta" target="_blank" rel="noopener">WhatsApp →</a>
</nav>
<section class="hero">
  <h1 class="hero-title"><em>${esc(data.businessName)}</em></h1>
  ${data.tagline?`<p class="hero-sub">${esc(data.tagline)}</p>`:""}
  <div class="hero-actions">
    <a href="${wa}" class="btn-p" target="_blank" rel="noopener">Consultar por WhatsApp</a>
    ${ci.address?`<a href="${ci.mapUrl||'#'}" class="btn-g" target="_blank" rel="noopener">📍 ${esc(ci.address)}</a>`:""}
  </div>
</section>
<main class="content">${sections}</main>
<div class="footer-bar">
  <span style="font-size:.8rem;color:var(--c-muted)">${esc(data.businessName)}${ci.schedule?` · ${esc(ci.schedule)}`:""}</span>
  <a href="${wa}" class="nav-cta" target="_blank" rel="noopener" style="font-size:.8rem;padding:8px 16px">Consultar →</a>
</div>
<script>
const obs=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting){e.target.classList.add('aos-in');obs.unobserve(e.target)}})},{threshold:.08});
document.querySelectorAll('[data-aos]').forEach(el=>obs.observe(el));
</script>
</body>
</html>`;
}

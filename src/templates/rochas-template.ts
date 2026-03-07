// src/templates/rochas-template.ts
// ─────────────────────────────────────────────────────────────────────────────
// Template personalizado: ROCHA'S ROTISERÍA
// Compatible con: BusinessData contract, CMS JLStudios, Cloudflare Pages
//
// Estética: "Barro y Brasa" — warm earthy tones, bold impactful typography,
// artisanal feel elevado a digital premium. Contrasta la humildad del local
// con un diseño web que lo hace ver como una marca seria.
// ─────────────────────────────────────────────────────────────────────────────
import { BusinessData } from "../lib/types";

function esc(s: string): string {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function waHref(phone: string, msg: string): string {
  return `https://wa.me/${phone.replace(/\D/g,"")}?text=${encodeURIComponent(msg)}`;
}

export function generateRochasHTML(data: BusinessData): string {
  const ci  = data.contactInfo;
  const ds  = data.designSystem;
  const items = data.items ?? [];
  const waLink = ci.whatsapp
    ? waHref(ci.whatsapp, ci.whatsappMessage || `¡Hola! Quiero hacer un pedido en ${esc(data.businessName)}`)
    : "#";

  // Group items by category for the menu section
  const byCategory: Record<string, typeof items> = {};
  items.forEach(it => {
    if (!byCategory[it.category]) byCategory[it.category] = [];
    byCategory[it.category].push(it);
  });

  const menuCardsHTML = items.slice(0, 8).map((item, i) => {
    const hasImg = item.image_b64;
    return `
    <div class="menu-card" style="animation-delay:${i * 0.08}s">
      ${hasImg
        ? `<div class="menu-card-img"><img src="data:image/jpeg;base64,${esc(item.image_b64!)}" alt="${esc(item.name)}" loading="lazy"/></div>`
        : `<div class="menu-card-img menu-card-img--placeholder"><span>${getCategoryEmoji(item.category)}</span></div>`
      }
      <div class="menu-card-body">
        <span class="menu-card-cat">${esc(item.category)}</span>
        <h3 class="menu-card-name">${esc(item.name)}</h3>
        <p class="menu-card-desc">${esc(item.description || "")}</p>
        ${item.price ? `<span class="menu-card-price">${esc(item.price)}</span>` : ""}
      </div>
    </div>`;
  }).join("");

  const scheduleHTML = Array.isArray(ci.schedule)
    ? ci.schedule.map(d => `
        <div class="schedule-row ${d.isOpen ? "" : "schedule-row--closed"}">
          <span class="schedule-day">${esc(d.day)}</span>
          <span class="schedule-hours">${d.isOpen ? `${esc(d.open)} – ${esc(d.close)}` : "Cerrado"}</span>
        </div>`).join("")
    : `<div class="schedule-row"><span class="schedule-day">Horarios</span><span class="schedule-hours">${esc(String(ci.schedule || "Consultá por WhatsApp"))}</span></div>`;

  const logo = data.logo_b64
    ? `<img src="data:image/png;base64,${esc(data.logo_b64)}" alt="${esc(data.businessName)}" class="nav-logo-img"/>`
    : `<span class="nav-logo-text">${esc(data.businessName)}</span>`;

  const portada = data.portada_b64
    ? `<img src="data:image/jpeg;base64,${esc(data.portada_b64)}" alt="Rocha's Rotisería" class="hero-bg-img"/>`
    : "";

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${esc(data.businessName)} · Rotisería en Santa Rosa de Calamuchita</title>
  <meta name="description" content="${esc(data.seoDescription || "Comida casera, abundante y sabrosa. Pedí por WhatsApp.")}"/>
  <meta property="og:title" content="${esc(data.businessName)}"/>
  <meta property="og:description" content="${esc(data.seoDescription || "")}"/>
  <meta name="theme-color" content="#c2410c"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
  <style>
    /* ── Reset & Base ─────────────────────────────────────────── */
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --c-bg:        #0e0a07;
      --c-surface:   #1a1108;
      --c-card:      #1f1509;
      --c-border:    rgba(255,255,255,0.07);
      --c-orange:    #ea580c;
      --c-orange-l:  #fb923c;
      --c-amber:     #d97706;
      --c-cream:     #fef3c7;
      --c-text:      #faf5eb;
      --c-muted:     #a3956f;
      --c-green:     #65a30d;
      --ff-head:     'Syne', sans-serif;
      --ff-body:     'DM Sans', sans-serif;
      --radius:      14px;
      --radius-sm:   8px;
      --shadow:      0 4px 32px rgba(0,0,0,0.5);
      --shadow-card: 0 2px 20px rgba(0,0,0,0.4);
    }
    html{scroll-behavior:smooth}
    body{
      background:var(--c-bg);
      color:var(--c-text);
      font-family:var(--ff-body);
      font-size:16px;
      line-height:1.6;
      overflow-x:hidden;
    }
    img{display:block;max-width:100%}
    a{text-decoration:none;color:inherit}

    /* ── Scroll reveal ────────────────────────────────────────── */
    .reveal{
      opacity:0;
      transform:translateY(28px);
      transition:opacity 0.65s ease, transform 0.65s ease;
    }
    .reveal.visible{opacity:1;transform:none}

    /* ── Navbar ───────────────────────────────────────────────── */
    .nav{
      position:fixed;top:0;left:0;right:0;z-index:100;
      display:flex;align-items:center;justify-content:space-between;
      padding:0 5%;height:64px;
      background:rgba(14,10,7,0.88);
      backdrop-filter:blur(16px);
      border-bottom:1px solid var(--c-border);
      transition:background 0.3s;
    }
    .nav-logo-img{height:38px;width:auto;border-radius:6px}
    .nav-logo-text{
      font-family:var(--ff-head);font-size:1.25rem;font-weight:800;
      color:var(--c-cream);letter-spacing:-0.02em;
    }
    .nav-links{display:flex;align-items:center;gap:28px}
    .nav-links a{
      font-size:0.82rem;font-weight:500;color:var(--c-muted);
      transition:color 0.2s;letter-spacing:0.04em;text-transform:uppercase;
    }
    .nav-links a:hover{color:var(--c-cream)}
    .nav-wa{
      display:inline-flex;align-items:center;gap:7px;
      background:var(--c-orange);color:#fff;
      font-size:0.78rem;font-weight:600;letter-spacing:0.03em;text-transform:uppercase;
      padding:8px 18px;border-radius:100px;
      transition:background 0.2s,transform 0.15s,box-shadow 0.2s;
      box-shadow:0 0 0 0 rgba(234,88,12,0.4);
    }
    .nav-wa:hover{background:#c2410c;transform:translateY(-1px);box-shadow:0 4px 20px rgba(234,88,12,0.45)}

    /* ── Hero ─────────────────────────────────────────────────── */
    .hero{
      position:relative;min-height:100vh;
      display:flex;align-items:center;justify-content:center;
      overflow:hidden;padding:80px 5% 60px;
    }
    .hero-bg{
      position:absolute;inset:0;
      background:
        radial-gradient(ellipse 60% 50% at 70% 40%, rgba(194,65,12,0.18) 0%, transparent 70%),
        radial-gradient(ellipse 40% 60% at 20% 70%, rgba(217,119,6,0.12) 0%, transparent 70%),
        var(--c-bg);
    }
    .hero-bg-img{
      position:absolute;inset:0;width:100%;height:100%;
      object-fit:cover;opacity:0.18;mix-blend-mode:luminosity;
    }
    /* Noise texture overlay */
    .hero-bg::after{
      content:'';position:absolute;inset:0;
      background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
      opacity:0.35;pointer-events:none;
    }
    .hero-content{
      position:relative;z-index:2;
      max-width:760px;text-align:center;
    }
    .hero-badge{
      display:inline-flex;align-items:center;gap:8px;
      background:rgba(234,88,12,0.12);border:1px solid rgba(234,88,12,0.3);
      border-radius:100px;padding:6px 16px;
      font-size:0.75rem;font-weight:600;letter-spacing:0.08em;
      text-transform:uppercase;color:var(--c-orange-l);
      margin-bottom:28px;
      animation:fadeUp 0.7s ease both;
    }
    .hero-badge-dot{
      width:6px;height:6px;border-radius:50%;
      background:var(--c-orange-l);animation:pulse 2s ease infinite;
    }
    @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.4)}}
    .hero-title{
      font-family:var(--ff-head);
      font-size:clamp(2.8rem,8vw,5.5rem);
      font-weight:800;line-height:1.0;
      letter-spacing:-0.03em;
      color:var(--c-text);
      margin-bottom:22px;
      animation:fadeUp 0.7s 0.1s ease both;
    }
    .hero-title span{
      color:transparent;
      -webkit-text-stroke:2px var(--c-orange);
    }
    .hero-sub{
      font-size:clamp(1rem,2.5vw,1.2rem);
      color:var(--c-muted);line-height:1.7;
      max-width:560px;margin:0 auto 40px;
      animation:fadeUp 0.7s 0.2s ease both;
    }
    .hero-actions{
      display:flex;flex-wrap:wrap;gap:14px;justify-content:center;
      animation:fadeUp 0.7s 0.3s ease both;
    }
    .btn-primary{
      display:inline-flex;align-items:center;gap:9px;
      background:var(--c-orange);color:#fff;
      font-family:var(--ff-body);font-size:0.9rem;font-weight:600;
      padding:14px 30px;border-radius:100px;border:none;cursor:pointer;
      transition:background 0.2s,transform 0.15s,box-shadow 0.2s;
      box-shadow:0 4px 24px rgba(234,88,12,0.35);
    }
    .btn-primary:hover{background:#c2410c;transform:translateY(-2px);box-shadow:0 6px 30px rgba(234,88,12,0.5)}
    .btn-secondary{
      display:inline-flex;align-items:center;gap:9px;
      background:transparent;color:var(--c-text);
      font-family:var(--ff-body);font-size:0.9rem;font-weight:600;
      padding:14px 30px;border-radius:100px;
      border:1.5px solid var(--c-border);cursor:pointer;
      transition:border-color 0.2s,background 0.2s,transform 0.15s;
    }
    .btn-secondary:hover{border-color:rgba(255,255,255,0.25);background:rgba(255,255,255,0.04);transform:translateY(-2px)}
    .hero-stats{
      display:flex;flex-wrap:wrap;gap:10px;justify-content:center;
      margin-top:56px;
      animation:fadeUp 0.7s 0.4s ease both;
    }
    .hero-stat{
      display:flex;align-items:center;gap:10px;
      background:rgba(255,255,255,0.04);border:1px solid var(--c-border);
      border-radius:100px;padding:10px 20px;
    }
    .hero-stat-icon{font-size:1.1rem}
    .hero-stat-text{font-size:0.82rem;color:var(--c-muted)}
    .hero-stat-num{font-family:var(--ff-head);font-size:1rem;font-weight:700;color:var(--c-cream);margin-right:4px}
    @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}

    /* ── Section base ─────────────────────────────────────────── */
    section{padding:96px 5%}
    .section-label{
      font-size:0.7rem;font-weight:700;letter-spacing:0.14em;
      text-transform:uppercase;color:var(--c-orange);
      display:flex;align-items:center;gap:8px;margin-bottom:12px;
    }
    .section-label::before{content:'';flex:0 0 24px;height:1px;background:var(--c-orange)}
    .section-title{
      font-family:var(--ff-head);
      font-size:clamp(1.9rem,5vw,3rem);
      font-weight:800;letter-spacing:-0.03em;
      line-height:1.1;color:var(--c-text);
      margin-bottom:16px;
    }
    .section-sub{font-size:1rem;color:var(--c-muted);max-width:500px;line-height:1.7}

    /* ── Menu grid ────────────────────────────────────────────── */
    .menu-section{background:var(--c-surface)}
    .menu-header{max-width:600px;margin-bottom:52px}
    .menu-grid{
      display:grid;
      grid-template-columns:repeat(auto-fill,minmax(260px,1fr));
      gap:20px;
    }
    .menu-card{
      background:var(--c-card);border:1px solid var(--c-border);
      border-radius:var(--radius);overflow:hidden;
      transition:transform 0.22s ease,box-shadow 0.22s ease,border-color 0.22s;
      cursor:default;
    }
    .menu-card:hover{
      transform:translateY(-4px);
      box-shadow:0 12px 40px rgba(234,88,12,0.2);
      border-color:rgba(234,88,12,0.3);
    }
    .menu-card-img{
      width:100%;aspect-ratio:16/9;overflow:hidden;
      background:linear-gradient(135deg,#1f1509,#2d1f0a);
    }
    .menu-card-img img{width:100%;height:100%;object-fit:cover;transition:transform 0.4s ease}
    .menu-card:hover .menu-card-img img{transform:scale(1.05)}
    .menu-card-img--placeholder{
      display:flex;align-items:center;justify-content:center;
      font-size:3rem;
    }
    .menu-card-body{padding:18px 20px 22px}
    .menu-card-cat{
      font-size:0.68rem;font-weight:700;letter-spacing:0.1em;
      text-transform:uppercase;color:var(--c-orange);
      display:block;margin-bottom:6px;
    }
    .menu-card-name{
      font-family:var(--ff-head);font-size:1.05rem;font-weight:700;
      color:var(--c-cream);line-height:1.3;margin-bottom:8px;
    }
    .menu-card-desc{
      font-size:0.82rem;color:var(--c-muted);
      line-height:1.55;margin-bottom:14px;
    }
    .menu-card-price{
      display:inline-block;
      font-family:var(--ff-head);font-size:1.1rem;font-weight:700;
      color:var(--c-amber);
    }
    .menu-wa-cta{
      margin-top:44px;text-align:center;
    }

    /* ── Why us ───────────────────────────────────────────────── */
    .why-section{
      background:var(--c-bg);
      position:relative;overflow:hidden;
    }
    .why-section::before{
      content:'';position:absolute;
      top:-120px;right:-80px;
      width:500px;height:500px;border-radius:50%;
      background:radial-gradient(circle,rgba(234,88,12,0.06) 0%,transparent 70%);
      pointer-events:none;
    }
    .why-grid{
      display:grid;
      grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
      gap:24px;margin-top:52px;
    }
    .why-card{
      padding:32px 28px;
      background:var(--c-surface);
      border:1px solid var(--c-border);
      border-radius:var(--radius);
      transition:border-color 0.2s,transform 0.2s;
    }
    .why-card:hover{border-color:rgba(234,88,12,0.25);transform:translateY(-2px)}
    .why-icon{
      width:52px;height:52px;border-radius:14px;
      background:rgba(234,88,12,0.1);border:1px solid rgba(234,88,12,0.2);
      display:flex;align-items:center;justify-content:center;
      font-size:1.4rem;margin-bottom:20px;
    }
    .why-card h3{
      font-family:var(--ff-head);font-size:1rem;font-weight:700;
      color:var(--c-cream);margin-bottom:8px;
    }
    .why-card p{font-size:0.84rem;color:var(--c-muted);line-height:1.6}

    /* ── Rating strip ─────────────────────────────────────────── */
    .rating-strip{
      background:linear-gradient(135deg,#c2410c,#ea580c);
      padding:40px 5%;
      display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:24px;
    }
    .rating-text{font-size:1rem;color:rgba(255,255,255,0.85)}
    .rating-big{
      font-family:var(--ff-head);font-size:4.5rem;font-weight:800;
      color:#fff;line-height:1;letter-spacing:-0.04em;
    }
    .rating-stars{color:#fed7aa;font-size:1.3rem;letter-spacing:2px;margin-top:4px}
    .rating-sub{font-size:0.8rem;color:rgba(255,255,255,0.65);margin-top:4px}

    /* ── Contact / Location ───────────────────────────────────── */
    .contact-section{background:var(--c-surface)}
    .contact-grid{
      display:grid;grid-template-columns:1fr 1fr;
      gap:40px;margin-top:52px;
    }
    .contact-card{
      background:var(--c-card);border:1px solid var(--c-border);
      border-radius:var(--radius);padding:32px 36px;
    }
    .contact-card h3{
      font-family:var(--ff-head);font-size:1.1rem;font-weight:700;
      color:var(--c-cream);margin-bottom:20px;
      display:flex;align-items:center;gap:10px;
    }
    .contact-icon{
      width:36px;height:36px;border-radius:10px;
      background:rgba(234,88,12,0.1);
      display:flex;align-items:center;justify-content:center;font-size:1rem;
    }
    .schedule-row{
      display:flex;justify-content:space-between;align-items:center;
      padding:10px 0;border-bottom:1px solid var(--c-border);
      font-size:0.88rem;
    }
    .schedule-row:last-child{border-bottom:none}
    .schedule-day{font-weight:600;color:var(--c-text)}
    .schedule-hours{color:var(--c-muted)}
    .schedule-row--closed .schedule-day{color:var(--c-muted)}
    .schedule-row--closed .schedule-hours{color:#52525b}
    .address-line{
      display:flex;align-items:flex-start;gap:12px;
      font-size:0.9rem;color:var(--c-muted);line-height:1.6;margin-bottom:14px;
    }
    .address-line-icon{font-size:1.1rem;margin-top:2px;flex-shrink:0}
    .map-link{
      display:inline-flex;align-items:center;gap:8px;margin-top:20px;
      background:var(--c-orange);color:#fff;
      font-size:0.82rem;font-weight:600;
      padding:10px 20px;border-radius:100px;
      transition:background 0.2s,transform 0.15s;
    }
    .map-link:hover{background:#c2410c;transform:translateY(-1px)}

    /* ── Footer ───────────────────────────────────────────────── */
    footer{
      background:var(--c-bg);
      border-top:1px solid var(--c-border);
      padding:56px 5% 32px;
    }
    .footer-top{
      display:flex;flex-wrap:wrap;align-items:flex-start;
      justify-content:space-between;gap:40px;margin-bottom:48px;
    }
    .footer-brand p{
      font-size:0.84rem;color:var(--c-muted);max-width:260px;
      line-height:1.7;margin-top:12px;
    }
    .footer-col h4{
      font-family:var(--ff-head);font-size:0.78rem;font-weight:700;
      letter-spacing:0.1em;text-transform:uppercase;
      color:var(--c-muted);margin-bottom:16px;
    }
    .footer-col a{
      display:block;font-size:0.84rem;color:var(--c-muted);
      margin-bottom:10px;transition:color 0.2s;
    }
    .footer-col a:hover{color:var(--c-cream)}
    .footer-social{display:flex;gap:12px;margin-top:4px}
    .social-btn{
      width:38px;height:38px;border-radius:10px;
      background:var(--c-surface);border:1px solid var(--c-border);
      display:flex;align-items:center;justify-content:center;
      font-size:1rem;transition:border-color 0.2s,background 0.2s,transform 0.15s;
    }
    .social-btn:hover{border-color:rgba(234,88,12,0.4);background:rgba(234,88,12,0.08);transform:translateY(-2px)}
    .footer-bottom{
      display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;
      gap:12px;padding-top:24px;border-top:1px solid var(--c-border);
    }
    .footer-bottom p{font-size:0.78rem;color:#52525b}
    .footer-credit{
      font-size:0.75rem;color:#52525b;
    }
    .footer-credit a{color:var(--c-orange);transition:color 0.2s}
    .footer-credit a:hover{color:var(--c-orange-l)}

    /* ── WhatsApp floating button ─────────────────────────────── */
    .wa-float{
      position:fixed;bottom:24px;right:24px;z-index:50;
      width:56px;height:56px;border-radius:50%;
      background:#25d366;color:#fff;
      display:flex;align-items:center;justify-content:center;
      font-size:1.6rem;
      box-shadow:0 4px 24px rgba(37,211,102,0.45);
      transition:transform 0.2s,box-shadow 0.2s;
      animation:waBounce 3s 2s ease infinite;
    }
    .wa-float:hover{transform:scale(1.1);box-shadow:0 6px 32px rgba(37,211,102,0.6)}
    @keyframes waBounce{
      0%,90%,100%{transform:scale(1)}
      93%{transform:scale(1.1)}
      96%{transform:scale(0.95)}
    }

    /* ── Responsive ───────────────────────────────────────────── */
    @media(max-width:768px){
      .nav-links{display:none}
      section{padding:72px 5%}
      .contact-grid{grid-template-columns:1fr}
      .hero-title{font-size:clamp(2.2rem,10vw,3.5rem)}
      .rating-strip{justify-content:center;text-align:center}
    }
    @media(max-width:480px){
      .hero-actions{flex-direction:column;align-items:stretch}
      .btn-primary,.btn-secondary{justify-content:center}
    }
  </style>
</head>
<body>

<!-- ── NAV ──────────────────────────────────────────────────────── -->
<nav class="nav" aria-label="Navegación principal">
  <a href="#" aria-label="Inicio">${logo}</a>
  <div class="nav-links">
    <a href="#menu">Menú</a>
    <a href="#nosotros">Nosotros</a>
    <a href="#ubicacion">Ubicación</a>
  </div>
  ${ci.whatsapp ? `<a href="${waLink}" class="nav-wa" target="_blank" rel="noopener">📲 Pedir ahora</a>` : ""}
</nav>

<!-- ── HERO ─────────────────────────────────────────────────────── -->
<section class="hero" id="inicio" aria-label="Inicio">
  <div class="hero-bg">${portada}</div>
  <div class="hero-content">
    <div class="hero-badge">
      <span class="hero-badge-dot"></span>
      Santa Rosa de Calamuchita · Córdoba
    </div>
    <h1 class="hero-title">
      El sabor<br/>de <span>casa,</span><br/>listo para llevar.
    </h1>
    <p class="hero-sub">
      ${esc(data.tagline || "Comida casera, abundante y sabrosa. Hacé tu pedido y pasá a buscarlo.")}
    </p>
    <div class="hero-actions">
      <a href="#menu" class="btn-primary">🍽️ Ver el menú</a>
      ${ci.whatsapp ? `<a href="${waLink}" class="btn-secondary" target="_blank" rel="noopener">💬 Pedir por WhatsApp</a>` : ""}
    </div>
    <div class="hero-stats">
      <div class="hero-stat">
        <span class="hero-stat-icon">⭐</span>
        <span class="hero-stat-text"><span class="hero-stat-num">9.2</span>puntuación local</span>
      </div>
      <div class="hero-stat">
        <span class="hero-stat-icon">📍</span>
        <span class="hero-stat-text">Calle 3 755, Villa Incor</span>
      </div>
      <div class="hero-stat">
        <span class="hero-stat-icon">🏠</span>
        <span class="hero-stat-text">Comida de autor cordobesa</span>
      </div>
    </div>
  </div>
</section>

<!-- ── MENU ─────────────────────────────────────────────────────── -->
<section class="menu-section" id="menu" aria-label="Menú">
  <div class="menu-header reveal">
    <p class="section-label">Lo que más piden</p>
    <h2 class="section-title">Nuestros favoritos</h2>
    <p class="section-sub">Preparado con ingredientes frescos cada día. Sin conservantes, sin atajos — como en casa pero mejor.</p>
  </div>
  <div class="menu-grid">
    ${menuCardsHTML || getDefaultMenuCards()}
  </div>
  ${ci.whatsapp ? `
  <div class="menu-wa-cta reveal">
    <p style="font-size:0.9rem;color:var(--c-muted);margin-bottom:16px">¿Querés saber el menú del día?</p>
    <a href="${waLink}" class="btn-primary" target="_blank" rel="noopener">💬 Consultá por WhatsApp</a>
  </div>` : ""}
</section>

<!-- ── RATING STRIP ──────────────────────────────────────────────── -->
<div class="rating-strip reveal" role="region" aria-label="Calificación">
  <div>
    <div class="rating-big">9.2</div>
    <div class="rating-stars">★★★★★</div>
    <div class="rating-sub">Puntuación local promedio</div>
  </div>
  <div style="max-width:420px">
    <p style="font-size:1.15rem;font-weight:600;color:#fff;margin-bottom:8px;font-family:'Syne',sans-serif">
      "La mejor relación calidad–precio de la zona"
    </p>
    <p style="font-size:0.88rem;color:rgba(255,255,255,0.7);line-height:1.6">
      Porciones generosas, precios justos y el sabor de la comida de siempre. Por eso nuestros clientes vuelven.
    </p>
  </div>
  ${ci.whatsapp ? `<a href="${waLink}" class="btn-secondary" style="border-color:rgba(255,255,255,0.3);color:#fff" target="_blank" rel="noopener">Hacer mi pedido →</a>` : ""}
</div>

<!-- ── WHY US ─────────────────────────────────────────────────────── -->
<section class="why-section" id="nosotros" aria-label="Por qué elegirnos">
  <div class="reveal">
    <p class="section-label">Por qué elegirnos</p>
    <h2 class="section-title">Comida de barrio,<br/>calidad de restorán.</h2>
    <p class="section-sub">Lo que nos diferencia no es el marketing — es lo que está en el plato.</p>
  </div>
  <div class="why-grid">
    <div class="why-card reveal">
      <div class="why-icon">🫙</div>
      <h3>Porciones abundantes</h3>
      <p>Nunca vas a quedar con hambre. Servimos como en casa — con generosidad de siempre.</p>
    </div>
    <div class="why-card reveal">
      <div class="why-icon">🪙</div>
      <h3>Precios justos</h3>
      <p>Comida rica y en cantidad no tiene por qué ser cara. Así lo entendemos nosotros.</p>
    </div>
    <div class="why-card reveal">
      <div class="why-icon">🥬</div>
      <h3>Ingredientes frescos</h3>
      <p>Compramos y preparamos a diario. Sin congelados, sin atajos — el sabor se nota.</p>
    </div>
    <div class="why-card reveal">
      <div class="why-icon">🏠</div>
      <h3>Sabor casero real</h3>
      <p>La receta de siempre, con el cariño de siempre. Como lo hacía la abuela, pero listo para llevar.</p>
    </div>
    <div class="why-card reveal">
      <div class="why-icon">⚡</div>
      <h3>Listo rápido</h3>
      <p>Pedí por WhatsApp y pasá a buscarlo. Sin esperas largas ni sorpresas.</p>
    </div>
    <div class="why-card reveal">
      <div class="why-icon">📍</div>
      <h3>En el corazón del barrio</h3>
      <p>Estamos en Villa Incor desde hace años. Somos parte de la comunidad.</p>
    </div>
  </div>
</section>

<!-- ── CONTACT / LOCATION ───────────────────────────────────────── -->
<section class="contact-section" id="ubicacion" aria-label="Ubicación y horarios">
  <div class="reveal">
    <p class="section-label">Dónde encontrarnos</p>
    <h2 class="section-title">Ubicación y horarios</h2>
  </div>
  <div class="contact-grid">
    <div class="contact-card reveal">
      <h3>
        <span class="contact-icon">🕐</span>
        Horarios de atención
      </h3>
      <div>${scheduleHTML}</div>
    </div>
    <div class="contact-card reveal">
      <h3>
        <span class="contact-icon">📍</span>
        Dónde estamos
      </h3>
      <div class="address-line">
        <span class="address-line-icon">🏠</span>
        <div>
          <strong style="color:var(--c-cream);display:block">
            ${esc(ci.address || "Calle 3 755 (entre 14 y 16)")}
          </strong>
          <span>Villa Incor, Santa Rosa de Calamuchita<br/>Córdoba, Argentina</span>
        </div>
      </div>
      ${ci.whatsapp ? `
      <div class="address-line">
        <span class="address-line-icon">📱</span>
        <div>
          <strong style="color:var(--c-cream);display:block">WhatsApp</strong>
          <a href="${waLink}" target="_blank" rel="noopener" style="color:var(--c-orange)">${esc(ci.whatsapp)}</a>
        </div>
      </div>` : ""}
      ${ci.instagram ? `
      <div class="address-line">
        <span class="address-line-icon">📸</span>
        <div>
          <strong style="color:var(--c-cream);display:block">Instagram</strong>
          <a href="https://instagram.com/${esc(ci.instagram)}" target="_blank" rel="noopener" style="color:var(--c-orange)">@${esc(ci.instagram)}</a>
        </div>
      </div>` : ""}
      <a href="${ci.mapUrl || `https://maps.google.com/?q=Calle+3+755+Santa+Rosa+de+Calamuchita`}"
        target="_blank" rel="noopener" class="map-link">
        🗺️ Abrir en Google Maps
      </a>
    </div>
  </div>
</section>

<!-- ── FOOTER ────────────────────────────────────────────────────── -->
<footer>
  <div class="footer-top">
    <div class="footer-brand">
      ${logo}
      <p>${esc(data.tagline || "Comida casera, abundante y sabrosa. En Santa Rosa de Calamuchita.")}</p>
      <div class="footer-social" style="margin-top:20px">
        ${ci.whatsapp ? `<a href="${waLink}" class="social-btn" target="_blank" rel="noopener" aria-label="WhatsApp">💬</a>` : ""}
        ${ci.instagram ? `<a href="https://instagram.com/${esc(ci.instagram)}" class="social-btn" target="_blank" rel="noopener" aria-label="Instagram">📸</a>` : ""}
        ${ci.facebook ? `<a href="https://facebook.com/${esc(ci.facebook)}" class="social-btn" target="_blank" rel="noopener" aria-label="Facebook">👍</a>` : ""}
      </div>
    </div>
    <div class="footer-col">
      <h4>Navegación</h4>
      <a href="#inicio">Inicio</a>
      <a href="#menu">Menú</a>
      <a href="#nosotros">Nosotros</a>
      <a href="#ubicacion">Ubicación</a>
    </div>
    <div class="footer-col">
      <h4>Contacto</h4>
      ${ci.whatsapp ? `<a href="${waLink}" target="_blank" rel="noopener">WhatsApp</a>` : ""}
      ${ci.instagram ? `<a href="https://instagram.com/${esc(ci.instagram)}" target="_blank" rel="noopener">Instagram</a>` : ""}
      <a href="#ubicacion">Calle 3 755, Villa Incor</a>
      <a href="#ubicacion">Santa Rosa de Calamuchita</a>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© ${new Date().getFullYear()} ${esc(data.businessName)}. Todos los derechos reservados.</p>
    <p class="footer-credit">
      Diseño web por <a href="#" target="_blank" rel="noopener">JL Studios</a>
    </p>
  </div>
</footer>

<!-- ── WhatsApp float ─────────────────────────────────────────────── -->
${ci.whatsapp ? `<a href="${waLink}" class="wa-float" target="_blank" rel="noopener" aria-label="Contactar por WhatsApp">💬</a>` : ""}

<!-- ── Scripts ────────────────────────────────────────────────────── -->
<script>
  // Scroll reveal
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Sticky nav background on scroll
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 60
      ? 'rgba(14,10,7,0.97)'
      : 'rgba(14,10,7,0.88)';
  }, { passive: true });
</script>
</body>
</html>`;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function getCategoryEmoji(cat: string): string {
  const c = cat.toLowerCase();
  if (c.includes("empa")) return "🥟";
  if (c.includes("pollo") || c.includes("ave")) return "🍗";
  if (c.includes("mila")) return "🥩";
  if (c.includes("pizza")) return "🍕";
  if (c.includes("ensalada") || c.includes("vegetal")) return "🥗";
  if (c.includes("pasta") || c.includes("fideos")) return "🍝";
  if (c.includes("postre") || c.includes("dulce")) return "🍮";
  if (c.includes("bebida") || c.includes("gaseosa")) return "🥤";
  if (c.includes("guiso") || c.includes("estofado")) return "🍲";
  return "🍽️";
}

function getDefaultMenuCards(): string {
  const defaults = [
    { name: "Empanadas cordobesas", cat: "Empanadas", desc: "Jugosas, con el repulgue de siempre. Masa casera, relleno generoso.", emoji: "🥟" },
    { name: "Milanesa completa", cat: "Platos del día", desc: "Enorme, crocante, con papas fritas y ensalada. Clásico sin discusión.", emoji: "🥩" },
    { name: "Pollo asado con papas", cat: "Platos del día", desc: "Dorado por fuera, jugoso por dentro. Acompañado de papas rústicas.", emoji: "🍗" },
    { name: "Guiso de lentejas", cat: "Guisos", desc: "Espeso, calentito y con todo el sabor de la cocina de casa.", emoji: "🍲" },
  ];
  return defaults.map((d, i) => `
    <div class="menu-card" style="animation-delay:${i*0.08}s">
      <div class="menu-card-img menu-card-img--placeholder"><span>${d.emoji}</span></div>
      <div class="menu-card-body">
        <span class="menu-card-cat">${d.cat}</span>
        <h3 class="menu-card-name">${d.name}</h3>
        <p class="menu-card-desc">${d.desc}</p>
      </div>
    </div>`).join("");
}

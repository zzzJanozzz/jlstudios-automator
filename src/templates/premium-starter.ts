// src/templates/premium-starter.ts
import { BusinessData } from "@/lib/types";

// ─── Niche Grouping ───────────────────────────────────────────
type TemplateType = "food" | "fitness" | "beauty" | "default";

function getTemplateType(niche: string): TemplateType {
  if (["restaurante", "panaderia"].includes(niche)) return "food";
  if (["gimnasio"].includes(niche)) return "fitness";
  if (["estetica", "barberia", "estudio_tatuajes", "fotografia", "catalogo_ropa", "floreria", "lavanderia", "optica"].includes(niche)) return "beauty";
  return "default";
}

// ─── Niche CTA Labels ─────────────────────────────────────────
function getCtaLabel(niche: string): string {
  const ctas: Record<string, string> = {
    restaurante: "🛒 Pedir por WhatsApp",
    panaderia: "🛒 Hacer Pedido",
    gimnasio: "💪 Empezar Ahora",
    estetica: "📅 Agendar Turno",
    barberia: "✂️ Reservar Turno",
    estudio_tatuajes: "🎨 Consultar Diseño",
    fotografia: "📸 Reservar Sesión",
    catalogo_ropa: "👗 Ver Colección",
    floreria: "💐 Encargar Ramo",
    veterinaria: "🐾 Pedir Turno",
    clinica_medica: "🏥 Sacar Turno",
    taller_mecanico: "🔧 Pedir Presupuesto",
    inmobiliaria: "🏠 Consultar",
    academia_idiomas: "📚 Inscribirse",
    coworking: "💼 Reservar Espacio",
    estudio_abogados: "⚖️ Consulta Gratis",
  };
  return ctas[niche] || "💬 Contactar";
}

// ─── Shared helpers ───────────────────────────────────────────
function googleFontsLink(heading: string, body: string): string {
  const h = heading.replace(/ /g, "+");
  const b = body.replace(/ /g, "+");
  return `https://fonts.googleapis.com/css2?family=${h}:wght@600;700;800;900&family=${b}:wght@300;400;500;600&display=swap`;
}

function socialLinks(data: BusinessData): string {
  const { instagram, facebook, whatsapp } = data.contactInfo;
  const items: string[] = [];
  if (instagram) items.push(`<a href="https://instagram.com/${instagram.replace("@", "")}" target="_blank" aria-label="Instagram"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>`);
  if (facebook) items.push(`<a href="https://facebook.com/${facebook.replace("@", "")}" target="_blank" aria-label="Facebook"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>`);
  if (whatsapp) items.push(`<a href="https://wa.me/${whatsapp}" target="_blank" aria-label="WhatsApp"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>`);
  return items.join("");
}

// ══════════════════════════════════════════════════════════════
// TEMPLATE 1: FOOD — "Carta Digital" (Restaurantes, Panaderías)
// Aesthetic: Dark canteen / food delivery app. Sticky bottom nav,
// category anchors, price badges, warm gradients.
// ══════════════════════════════════════════════════════════════
function renderFoodTemplate(data: BusinessData): string {
  const ds = data.designSystem;
  const cta = getCtaLabel(data.niche);
  const isGrid = (data as any).layoutStyle !== "list";

  const itemsByCategory: Record<string, typeof data.items> = {};
  data.categories.forEach((cat) => {
    itemsByCategory[cat] = data.items.filter((i) => i.category === cat);
  });

  const navItems = data.categories
    .map(
      (cat, i) =>
        `<a href="#cat-${i}" class="nav-pill">${cat}</a>`
    )
    .join("");

  const sections = data.categories
    .map(
      (cat, i) => `
    <section id="cat-${i}" class="cat-section">
      <div class="cat-header">
        <h2 class="cat-title">${cat}</h2>
        <span class="cat-count">${itemsByCategory[cat]?.length || 0} items</span>
      </div>
      <div class="items-container ${isGrid ? "grid-layout" : "list-layout"}">
        ${
          itemsByCategory[cat]
            ?.map(
              (item) => `
          <article class="item-card reveal">
            <div class="item-emoji">${getCategoryEmoji(cat)}</div>
            <div class="item-info">
              <h3 class="item-name">${item.name}</h3>
              <p class="item-desc">${item.description}</p>
            </div>
            ${item.price ? `<div class="item-price-badge">${item.price}</div>` : ""}
          </article>
        `
            )
            .join("") ?? ""
        }
      </div>
    </section>
  `
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.businessName} — Carta Digital</title>
  <meta name="description" content="${data.seoDescription}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="${googleFontsLink("Syne", "DM Sans")}" rel="stylesheet">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --primary:  ${ds.primaryColor};
      --secondary: ${ds.secondaryColor};
      --accent:   ${ds.accentColor};
      --bg:       ${ds.backgroundColor};
      --surface:  color-mix(in srgb, ${ds.backgroundColor} 85%, white);
      --text:     ${ds.textColor};
      --muted:    ${ds.mutedColor};
      --radius:   ${ds.borderRadius};
      --font-h:   'Syne', sans-serif;
      --font-b:   'DM Sans', sans-serif;
      --nav-h:    64px;
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-b);
      padding-bottom: calc(var(--nav-h) + 1rem);
      -webkit-font-smoothing: antialiased;
    }

    /* ── HERO ── */
    .hero {
      min-height: 45vmax;
      max-height: 360px;
      display: flex; flex-direction: column;
      justify-content: flex-end;
      padding: 2rem 1.25rem 1.5rem;
      background: linear-gradient(160deg, var(--secondary) 0%, color-mix(in srgb, var(--secondary) 20%, #000) 100%);
      position: relative; overflow: hidden;
    }
    .hero::before {
      content: '';
      position: absolute; top: -40%; right: -20%;
      width: 70vmax; height: 70vmax;
      background: radial-gradient(circle, color-mix(in srgb, var(--primary) 35%, transparent), transparent 70%);
      border-radius: 50%;
    }
    .hero-badge {
      display: inline-block;
      background: color-mix(in srgb, var(--primary) 20%, transparent);
      border: 1px solid color-mix(in srgb, var(--primary) 40%, transparent);
      color: var(--primary);
      font-size: 0.65rem; font-weight: 700;
      letter-spacing: 0.12em; text-transform: uppercase;
      padding: 0.3rem 0.75rem; border-radius: 50px;
      margin-bottom: 0.75rem; width: fit-content;
    }
    .hero h1 {
      font-family: var(--font-h);
      font-size: clamp(2rem, 7vw, 3.5rem);
      font-weight: 900; line-height: 1;
      color: #fff; margin-bottom: 0.5rem;
    }
    .hero p {
      font-size: 0.95rem; color: rgba(255,255,255,0.6);
      font-weight: 400; max-width: 320px;
    }

    /* ── CATEGORY NAV (scrollable) ── */
    .cat-nav {
      position: sticky; top: 0; z-index: 40;
      background: color-mix(in srgb, var(--bg) 90%, transparent);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid color-mix(in srgb, var(--text) 8%, transparent);
      padding: 0.75rem 1.25rem;
      display: flex; gap: 0.5rem;
      overflow-x: auto; scrollbar-width: none;
    }
    .cat-nav::-webkit-scrollbar { display: none; }
    .nav-pill {
      flex: 0 0 auto;
      font-family: var(--font-b);
      font-size: 0.78rem; font-weight: 600;
      padding: 0.4rem 1rem; border-radius: 50px;
      background: color-mix(in srgb, var(--text) 8%, transparent);
      color: var(--muted);
      text-decoration: none;
      border: 1px solid color-mix(in srgb, var(--text) 10%, transparent);
      transition: all 0.2s;
      white-space: nowrap;
    }
    .nav-pill:hover, .nav-pill.active {
      background: var(--primary);
      color: #fff; border-color: var(--primary);
    }

    /* ── SECTIONS ── */
    .cat-section { padding: 1.75rem 1.25rem; }
    .cat-header {
      display: flex; align-items: center;
      justify-content: space-between; margin-bottom: 1rem;
    }
    .cat-title {
      font-family: var(--font-h);
      font-size: 1.3rem; font-weight: 800;
    }
    .cat-count {
      font-size: 0.7rem; font-weight: 600;
      color: var(--muted); text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    /* ── ITEMS ── */
    .grid-layout {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(160px, 100%), 1fr));
      gap: 0.875rem;
    }
    .list-layout { display: flex; flex-direction: column; gap: 0.75rem; }

    .item-card {
      background: var(--surface);
      border: 1px solid color-mix(in srgb, var(--text) 8%, transparent);
      border-radius: var(--radius);
      overflow: hidden;
      display: flex;
      transition: transform 0.2s, border-color 0.2s;
      position: relative;
    }
    .list-layout .item-card { flex-direction: row; align-items: center; gap: 0.75rem; padding: 0.875rem; }
    .grid-layout .item-card { flex-direction: column; padding: 0; }

    .item-card:hover { transform: translateY(-2px); border-color: var(--primary); }
    .item-card::before {
      content: ''; position: absolute; left: 0; top: 0; bottom: 0;
      width: 3px; background: var(--primary);
      border-radius: 3px 0 0 3px;
    }
    .grid-layout .item-card::before { display: none; }

    .item-emoji {
      font-size: 2.2rem; line-height: 1;
      flex-shrink: 0;
    }
    .list-layout .item-emoji { margin-left: 0.25rem; }
    .grid-layout .item-emoji {
      padding: 1.25rem 1rem 0.5rem;
      font-size: 2.5rem;
    }

    .item-info { flex: 1; min-width: 0; }
    .grid-layout .item-info { padding: 0 1rem 0.5rem; }

    .item-name {
      font-family: var(--font-h);
      font-size: 0.95rem; font-weight: 700;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      margin-bottom: 0.2rem;
    }
    .item-desc {
      font-size: 0.78rem; color: var(--muted);
      line-height: 1.45;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .item-price-badge {
      flex-shrink: 0;
      font-family: var(--font-h);
      font-size: 0.9rem; font-weight: 800;
      color: var(--primary);
    }
    .list-layout .item-price-badge { margin-right: 0.25rem; }
    .grid-layout .item-price-badge {
      padding: 0.5rem 1rem 0.875rem;
      font-size: 1.1rem;
    }

    /* ── STICKY BOTTOM NAV ── */
    .bottom-bar {
      position: fixed; bottom: 0; left: 0; right: 0;
      height: var(--nav-h);
      background: color-mix(in srgb, var(--bg) 95%, transparent);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-top: 1px solid color-mix(in srgb, var(--text) 10%, transparent);
      display: flex; align-items: center;
      padding: 0 1rem;
      gap: 0.75rem;
      z-index: 50;
    }
    .wsp-cta {
      flex: 1;
      background: #25D366;
      color: #fff;
      font-family: var(--font-b);
      font-size: 0.9rem; font-weight: 700;
      padding: 0.75rem 1.25rem; border-radius: 12px;
      text-decoration: none; text-align: center;
      display: flex; align-items: center; justify-content: center; gap: 0.5rem;
      transition: background 0.2s, transform 0.15s;
    }
    .wsp-cta:hover { background: #1aad52; transform: scale(1.01); }
    .social-bar { display: flex; gap: 0.5rem; }
    .social-bar a {
      color: var(--muted);
      transition: color 0.2s;
      display: flex; align-items: center;
    }
    .social-bar a:hover { color: var(--primary); }

    /* ── FOOTER ── */
    footer {
      padding: 2rem 1.25rem 1rem;
      text-align: center;
      border-top: 1px solid color-mix(in srgb, var(--text) 8%, transparent);
    }
    footer p { font-size: 0.72rem; color: var(--muted); }
    .powered {
      margin-top: 0.5rem;
      font-size: 0.6rem; letter-spacing: 0.15em;
      text-transform: uppercase;
      color: color-mix(in srgb, var(--muted) 40%, transparent);
    }

    /* ── REVEAL ANIMATION ── */
    .reveal { opacity: 0; transform: translateY(16px); }

    @media (min-width: 640px) {
      .hero { min-height: 40vh; padding: 3rem 2rem 2rem; }
      .cat-section { padding: 2.5rem 2rem; }
      .grid-layout { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
      .hero h1 { font-size: clamp(2.5rem, 5vw, 4.5rem); }
    }
  </style>
</head>
<body>
  <header class="hero">
    <span class="hero-badge">Carta Digital 🍽️</span>
    <h1>${data.businessName}</h1>
    <p>${data.tagline}</p>
  </header>

  <nav class="cat-nav" id="main-nav">${navItems}</nav>

  <main>${sections}</main>

  <footer>
    <p>© ${new Date().getFullYear()} ${data.businessName}. Todos los derechos reservados.</p>
    <p class="powered">POWERED BY JLSTUDIOS AUTOMATOR</p>
  </footer>

  <div class="bottom-bar">
    <a href="https://wa.me/${data.contactInfo.whatsapp || ""}?text=Hola!+Quiero+hacer+un+pedido" class="wsp-cta" target="_blank">
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      ${cta}
    </a>
    <div class="social-bar">${socialLinks(data)}</div>
  </div>

  <script>
    // Highlight active nav pill on scroll
    const sections = document.querySelectorAll('.cat-section');
    const pills = document.querySelectorAll('.nav-pill');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          pills.forEach(p => {
            p.classList.toggle('active', p.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    sections.forEach(s => observer.observe(s));

    // Reveal animation
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, i * 60);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => revealObserver.observe(el));
  </script>
</body>
</html>`;
}

// ══════════════════════════════════════════════════════════════
// TEMPLATE 2: FITNESS — "Power House" (Gimnasios)
// Aesthetic: High-impact, bold, angular. Dark with neon accents.
// ══════════════════════════════════════════════════════════════
function renderFitnessTemplate(data: BusinessData): string {
  const ds = data.designSystem;
  const cta = getCtaLabel(data.niche);

  const itemsByCategory: Record<string, typeof data.items> = {};
  data.categories.forEach((cat) => {
    itemsByCategory[cat] = data.items.filter((i) => i.category === cat);
  });

  const planCards = data.items
    .map(
      (item, i) => `
    <div class="plan-card reveal ${i === 1 ? "featured" : ""}">
      ${i === 1 ? '<div class="featured-badge">⭐ Más Popular</div>' : ""}
      <div class="plan-top">
        <h3 class="plan-name">${item.name}</h3>
        ${item.price ? `<div class="plan-price">${item.price}<span class="plan-period">/mes</span></div>` : ""}
      </div>
      <p class="plan-desc">${item.description}</p>
      <div class="plan-tag">${item.category}</div>
    </div>
  `
    )
    .join("");

  const allCategories = [...new Set(data.items.map((i) => i.category))];

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.businessName} — Gym</title>
  <meta name="description" content="${data.seoDescription}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="${googleFontsLink("Barlow Condensed", "Barlow")}" rel="stylesheet">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    :root {
      --primary: ${ds.primaryColor};
      --secondary: ${ds.secondaryColor};
      --accent: ${ds.accentColor};
      --bg: ${ds.backgroundColor};
      --text: ${ds.textColor};
      --muted: ${ds.mutedColor};
      --radius: ${ds.borderRadius};
      --font-h: 'Barlow Condensed', sans-serif;
      --font-b: 'Barlow', sans-serif;
    }
    html { scroll-behavior: smooth; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-b);
      -webkit-font-smoothing: antialiased;
      padding-bottom: 80px;
    }

    /* ── HERO ── */
    .hero {
      min-height: 100vmin;
      max-height: 100vh;
      display: flex; flex-direction: column; justify-content: flex-end;
      padding: 2rem 1.25rem;
      background: var(--secondary);
      position: relative; overflow: hidden;
    }
    .hero::before {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(135deg, color-mix(in srgb, var(--primary) 15%, transparent) 0%, transparent 60%),
                  linear-gradient(to bottom, transparent 30%, color-mix(in srgb, var(--bg) 70%, transparent) 100%);
    }
    .hero-grid {
      position: absolute; inset: 0; opacity: 0.04;
      background-image: linear-gradient(var(--text) 1px, transparent 1px),
                        linear-gradient(90deg, var(--text) 1px, transparent 1px);
      background-size: 40px 40px;
    }
    .hero-kicker {
      position: relative;
      font-family: var(--font-h);
      font-size: 0.75rem; font-weight: 700;
      letter-spacing: 0.2em; text-transform: uppercase;
      color: var(--primary); margin-bottom: 0.5rem;
    }
    .hero h1 {
      position: relative;
      font-family: var(--font-h);
      font-size: clamp(3.5rem, 13vw, 8rem);
      font-weight: 900; line-height: 0.9;
      text-transform: uppercase;
      color: var(--text);
      margin-bottom: 1rem;
    }
    .hero h1 span { color: var(--primary); }
    .hero-sub {
      position: relative;
      font-size: 1rem; color: var(--muted);
      max-width: 320px; line-height: 1.5;
      margin-bottom: 1.5rem;
    }
    .hero-stats {
      position: relative;
      display: flex; gap: 1.5rem;
    }
    .stat { text-align: center; }
    .stat-num {
      font-family: var(--font-h);
      font-size: 1.8rem; font-weight: 900;
      color: var(--primary); line-height: 1;
    }
    .stat-label {
      font-size: 0.68rem; color: var(--muted);
      text-transform: uppercase; letter-spacing: 0.08em;
    }

    /* ── CATEGORIES STRIP ── */
    .categories-strip {
      display: flex; gap: 0.75rem;
      padding: 1.25rem;
      overflow-x: auto; scrollbar-width: none;
    }
    .categories-strip::-webkit-scrollbar { display: none; }
    .cat-chip {
      flex: 0 0 auto;
      font-family: var(--font-h);
      font-size: 0.85rem; font-weight: 700; letter-spacing: 0.06em;
      text-transform: uppercase;
      padding: 0.5rem 1.1rem; border-radius: 4px;
      background: color-mix(in srgb, var(--primary) 15%, transparent);
      border: 1px solid color-mix(in srgb, var(--primary) 30%, transparent);
      color: var(--primary);
    }

    /* ── PLANS SECTION ── */
    .section-label {
      font-family: var(--font-h);
      font-size: 0.72rem; font-weight: 700;
      letter-spacing: 0.18em; text-transform: uppercase;
      color: var(--muted); padding: 0 1.25rem;
      margin-bottom: 0.75rem;
    }
    .plans-grid {
      padding: 0 1.25rem;
      display: flex; flex-direction: column; gap: 1rem;
    }
    .plan-card {
      background: color-mix(in srgb, var(--text) 4%, transparent);
      border: 1px solid color-mix(in srgb, var(--text) 10%, transparent);
      border-radius: var(--radius);
      padding: 1.5rem;
      position: relative;
      transition: border-color 0.2s, transform 0.2s;
    }
    .plan-card:hover { border-color: var(--primary); transform: translateX(4px); }
    .plan-card.featured {
      background: color-mix(in srgb, var(--primary) 8%, transparent);
      border-color: var(--primary);
    }
    .featured-badge {
      position: absolute; top: -10px; right: 1rem;
      background: var(--primary); color: #fff;
      font-size: 0.68rem; font-weight: 700;
      padding: 0.2rem 0.75rem; border-radius: 50px;
    }
    .plan-top {
      display: flex; justify-content: space-between;
      align-items: flex-start; margin-bottom: 0.75rem;
    }
    .plan-name {
      font-family: var(--font-h);
      font-size: 1.4rem; font-weight: 800;
      text-transform: uppercase;
    }
    .plan-price {
      font-family: var(--font-h);
      font-size: 1.6rem; font-weight: 900;
      color: var(--primary);
    }
    .plan-period { font-size: 0.8rem; color: var(--muted); font-family: var(--font-b); }
    .plan-desc { font-size: 0.875rem; color: var(--muted); line-height: 1.5; margin-bottom: 0.875rem; }
    .plan-tag {
      display: inline-block;
      font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 0.2rem 0.6rem; border-radius: 4px;
      background: color-mix(in srgb, var(--accent) 15%, transparent);
      color: var(--accent);
    }

    /* ── STICKY CTA ── */
    .sticky-cta {
      position: fixed; bottom: 1rem; left: 1rem; right: 1rem;
      z-index: 50;
    }
    .sticky-cta a {
      display: flex; align-items: center; justify-content: center; gap: 0.6rem;
      background: var(--primary);
      color: #fff;
      font-family: var(--font-h);
      font-size: 1.1rem; font-weight: 800;
      text-transform: uppercase; letter-spacing: 0.06em;
      padding: 1rem; border-radius: calc(var(--radius) * 0.7);
      text-decoration: none;
      box-shadow: 0 8px 30px color-mix(in srgb, var(--primary) 40%, transparent);
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .sticky-cta a:hover { transform: translateY(-2px); box-shadow: 0 12px 40px color-mix(in srgb, var(--primary) 50%, transparent); }

    footer {
      padding: 2rem 1.25rem 6rem;
      text-align: center; border-top: 1px solid color-mix(in srgb, var(--text) 8%, transparent);
    }
    footer p { font-size: 0.72rem; color: var(--muted); }
    .powered { margin-top: 0.5rem; font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; color: color-mix(in srgb, var(--muted) 40%, transparent); }

    .reveal { opacity: 0; transform: translateY(20px); }

    @media (min-width: 640px) {
      .plans-grid { flex-direction: row; flex-wrap: wrap; }
      .plan-card { flex: 1 1 calc(50% - 0.5rem); }
    }
  </style>
</head>
<body>
  <header class="hero">
    <div class="hero-grid"></div>
    <p class="hero-kicker">📍 ${data.contactInfo.address || "Tu Gimnasio de Confianza"}</p>
    <h1>${data.businessName.split(" ").map((w, i) => i === 0 ? `<span>${w}</span>` : w).join(" ")}</h1>
    <p class="hero-sub">${data.tagline}</p>
    <div class="hero-stats">
      <div class="stat"><div class="stat-num">${data.items.length}+</div><div class="stat-label">Planes</div></div>
      <div class="stat"><div class="stat-num">${data.categories.length}</div><div class="stat-label">Áreas</div></div>
      <div class="stat"><div class="stat-num">100%</div><div class="stat-label">Resultados</div></div>
    </div>
  </header>

  <div class="categories-strip">
    ${allCategories.map((c) => `<div class="cat-chip">${c}</div>`).join("")}
  </div>

  <p class="section-label">Planes & Servicios</p>
  <div class="plans-grid">${planCards}</div>

  <footer>
    <p>© ${new Date().getFullYear()} ${data.businessName}</p>
    <div style="margin-top:0.75rem;">${socialLinks(data)}</div>
    <p class="powered">POWERED BY JLSTUDIOS AUTOMATOR</p>
  </footer>

  <div class="sticky-cta">
    <a href="https://wa.me/${data.contactInfo.whatsapp || ""}?text=Hola!+Quiero+info+sobre+los+planes" target="_blank">
      💪 ${cta}
    </a>
  </div>

  <script>
    const revealEls = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, i * 80);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => obs.observe(el));
  </script>
</body>
</html>`;
}

// ══════════════════════════════════════════════════════════════
// TEMPLATE 3: BEAUTY — "Atelier" (Estéticas, Barberías, etc.)
// Aesthetic: Editorial, refined. Light/dark depending on ds.
// ══════════════════════════════════════════════════════════════
function renderBeautyTemplate(data: BusinessData): string {
  const ds = data.designSystem;
  const cta = getCtaLabel(data.niche);
  const isGrid = (data as any).layoutStyle !== "list";

  const itemsByCategory: Record<string, typeof data.items> = {};
  data.categories.forEach((cat) => {
    itemsByCategory[cat] = data.items.filter((i) => i.category === cat);
  });

  const sections = data.categories
    .map(
      (cat) => `
    <section class="service-section">
      <div class="section-divider">
        <span class="section-label">${cat}</span>
        <div class="divider-line"></div>
      </div>
      <div class="services-grid ${isGrid ? "" : "services-list"}">
        ${
          itemsByCategory[cat]
            ?.map(
              (item) => `
          <div class="service-card reveal">
            <div class="service-icon">${getBeautyEmoji(item.category, item.name)}</div>
            <div class="service-body">
              <h3 class="service-name">${item.name}</h3>
              <p class="service-desc">${item.description}</p>
            </div>
            ${item.price ? `<div class="service-price">${item.price}</div>` : '<div class="service-price" style="opacity:0.4">Consultar</div>'}
          </div>
        `
            )
            .join("") ?? ""
        }
      </div>
    </section>
  `
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.businessName}</title>
  <meta name="description" content="${data.seoDescription}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="${googleFontsLink("Cormorant Garamond", "Jost")}" rel="stylesheet">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    :root {
      --primary: ${ds.primaryColor};
      --secondary: ${ds.secondaryColor};
      --accent: ${ds.accentColor};
      --bg: ${ds.backgroundColor};
      --text: ${ds.textColor};
      --muted: ${ds.mutedColor};
      --radius: ${ds.borderRadius};
      --font-h: 'Cormorant Garamond', serif;
      --font-b: 'Jost', sans-serif;
    }
    html { scroll-behavior: smooth; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-b);
      -webkit-font-smoothing: antialiased;
      padding-bottom: 80px;
    }

    /* ── HERO ── */
    .hero {
      padding: 4rem 1.5rem 3rem;
      background: linear-gradient(180deg, color-mix(in srgb, var(--secondary) 60%, var(--bg)) 0%, var(--bg) 100%);
      text-align: center; position: relative; overflow: hidden;
    }
    .hero-ornament {
      width: 80px; height: 1px;
      background: var(--primary);
      margin: 0 auto 1.5rem;
    }
    .hero-ornament::before, .hero-ornament::after {
      content: '◆';
      position: absolute;
      top: -6px;
      font-size: 8px;
      color: var(--primary);
    }
    .hero-ornament::before { left: -12px; }
    .hero-ornament::after { right: -12px; }
    .hero-ornament { position: relative; }
    .hero h1 {
      font-family: var(--font-h);
      font-size: clamp(2.5rem, 10vw, 5rem);
      font-weight: 700; font-style: italic;
      line-height: 1; color: var(--text);
      margin-bottom: 0.75rem;
    }
    .hero-tagline {
      font-size: 0.8rem; letter-spacing: 0.2em;
      text-transform: uppercase; color: var(--muted);
      margin-bottom: 1.5rem;
    }
    .hero-address {
      display: inline-flex; align-items: center; gap: 0.4rem;
      font-size: 0.78rem; color: var(--muted);
      border: 1px solid color-mix(in srgb, var(--text) 12%, transparent);
      padding: 0.3rem 0.9rem; border-radius: 50px;
    }

    /* ── SERVICES ── */
    main { padding: 0 1.25rem; }

    .service-section { margin-bottom: 2.5rem; }

    .section-divider {
      display: flex; align-items: center; gap: 1rem;
      margin-bottom: 1.25rem;
    }
    .section-label {
      font-family: var(--font-h);
      font-size: 1.5rem; font-weight: 700; font-style: italic;
      white-space: nowrap; color: var(--text);
    }
    .divider-line {
      flex: 1; height: 1px;
      background: color-mix(in srgb, var(--text) 10%, transparent);
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
      gap: 1rem;
    }
    .services-list { grid-template-columns: 1fr; }

    .service-card {
      display: flex; align-items: center; gap: 1rem;
      padding: 1.25rem;
      background: color-mix(in srgb, var(--text) 3%, transparent);
      border: 1px solid color-mix(in srgb, var(--text) 8%, transparent);
      border-radius: var(--radius);
      transition: background 0.2s, border-color 0.2s, transform 0.2s;
    }
    .service-card:hover {
      background: color-mix(in srgb, var(--primary) 5%, transparent);
      border-color: color-mix(in srgb, var(--primary) 30%, transparent);
      transform: translateY(-2px);
    }
    .service-icon {
      font-size: 1.8rem; flex-shrink: 0;
      width: 48px; height: 48px;
      background: color-mix(in srgb, var(--primary) 10%, transparent);
      border-radius: calc(var(--radius) * 0.7);
      display: flex; align-items: center; justify-content: center;
    }
    .service-body { flex: 1; min-width: 0; }
    .service-name {
      font-family: var(--font-h);
      font-size: 1.1rem; font-weight: 700;
      margin-bottom: 0.25rem;
    }
    .service-desc {
      font-size: 0.78rem; color: var(--muted);
      line-height: 1.45;
      display: -webkit-box; -webkit-line-clamp: 2;
      -webkit-box-orient: vertical; overflow: hidden;
    }
    .service-price {
      flex-shrink: 0;
      font-family: var(--font-h);
      font-size: 1.2rem; font-weight: 700;
      color: var(--primary);
      text-align: right;
    }

    /* ── STICKY CTA ── */
    .sticky-cta {
      position: fixed; bottom: 1rem; left: 1rem; right: 1rem; z-index: 50;
      display: flex; gap: 0.75rem;
    }
    .cta-book {
      flex: 1;
      display: flex; align-items: center; justify-content: center; gap: 0.5rem;
      background: var(--primary); color: #fff;
      font-family: var(--font-b);
      font-size: 0.9rem; font-weight: 600;
      padding: 0.875rem; border-radius: var(--radius);
      text-decoration: none;
      box-shadow: 0 6px 24px color-mix(in srgb, var(--primary) 35%, transparent);
      transition: transform 0.15s;
    }
    .cta-book:hover { transform: translateY(-1px); }
    .cta-maps {
      background: color-mix(in srgb, var(--text) 8%, transparent);
      border: 1px solid color-mix(in srgb, var(--text) 15%, transparent);
      color: var(--text);
      padding: 0.875rem 1rem;
      border-radius: var(--radius);
      text-decoration: none;
      display: flex; align-items: center;
      transition: background 0.15s;
    }
    .cta-maps:hover { background: color-mix(in srgb, var(--text) 12%, transparent); }

    footer {
      padding: 2rem 1.25rem 6rem; text-align: center;
      border-top: 1px solid color-mix(in srgb, var(--text) 8%, transparent);
    }
    footer p { font-size: 0.72rem; color: var(--muted); }
    .footer-social { display: flex; justify-content: center; gap: 1rem; margin: 0.75rem 0; }
    .footer-social a { color: var(--muted); transition: color 0.2s; }
    .footer-social a:hover { color: var(--primary); }
    .powered { font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; color: color-mix(in srgb, var(--muted) 40%, transparent); }

    .reveal { opacity: 0; transform: translateY(16px); }

    @media (min-width: 640px) {
      .hero { padding: 5rem 2rem 3.5rem; }
      main { padding: 2rem; }
    }
  </style>
</head>
<body>
  <header class="hero">
    <div class="hero-ornament"></div>
    <h1>${data.businessName}</h1>
    <p class="hero-tagline">${data.tagline}</p>
    ${data.contactInfo.address ? `<div class="hero-address">📍 ${data.contactInfo.address}</div>` : ""}
  </header>

  <main>${sections}</main>

  <footer>
    <p>${data.businessName} — ${data.seoDescription}</p>
    <div class="footer-social">${socialLinks(data)}</div>
    <p>© ${new Date().getFullYear()} Todos los derechos reservados.</p>
    <p class="powered" style="margin-top:0.5rem;">POWERED BY JLSTUDIOS AUTOMATOR</p>
  </footer>

  <div class="sticky-cta">
    <a href="https://wa.me/${data.contactInfo.whatsapp || ""}?text=Hola!+Quiero+info+sobre+sus+servicios" class="cta-book" target="_blank">
      📅 ${cta}
    </a>
    ${data.contactInfo.mapUrl ? `<a href="${data.contactInfo.mapUrl}" class="cta-maps" target="_blank">📍</a>` : ""}
  </div>

  <script>
    const revealEls = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, i * 70);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => obs.observe(el));
  </script>
</body>
</html>`;
}

// ══════════════════════════════════════════════════════════════
// TEMPLATE 4: DEFAULT — "Studio Clean" (Abogados, Clínicas, etc.)
// Aesthetic: Clean, structured, professional.
// ══════════════════════════════════════════════════════════════
function renderDefaultTemplate(data: BusinessData): string {
  const ds = data.designSystem;
  const cta = getCtaLabel(data.niche);
  const isGrid = (data as any).layoutStyle !== "list";

  const itemsByCategory: Record<string, typeof data.items> = {};
  data.categories.forEach((cat) => {
    itemsByCategory[cat] = data.items.filter((i) => i.category === cat);
  });

  const sections = data.categories
    .map(
      (cat) => `
    <section class="cat-section">
      <h2 class="cat-title reveal">${cat}</h2>
      <div class="items-grid ${isGrid ? "" : "items-list"}">
        ${
          itemsByCategory[cat]
            ?.map(
              (item) => `
          <div class="item-card reveal">
            <div class="card-top">
              <h3 class="item-name">${item.name}</h3>
              ${item.price ? `<span class="price-tag">${item.price}</span>` : ""}
            </div>
            <p class="item-desc">${item.description}</p>
          </div>
        `
            )
            .join("") ?? ""
        }
      </div>
    </section>
  `
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.businessName}</title>
  <meta name="description" content="${data.seoDescription}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="${googleFontsLink("Plus Jakarta Sans", "Inter")}" rel="stylesheet">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    :root {
      --primary: ${ds.primaryColor};
      --secondary: ${ds.secondaryColor};
      --accent: ${ds.accentColor};
      --bg: ${ds.backgroundColor};
      --text: ${ds.textColor};
      --muted: ${ds.mutedColor};
      --radius: ${ds.borderRadius};
      --font-h: 'Plus Jakarta Sans', sans-serif;
      --font-b: 'Inter', sans-serif;
    }
    html { scroll-behavior: smooth; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-b);
      -webkit-font-smoothing: antialiased;
      padding-bottom: 80px;
    }

    .hero {
      background: linear-gradient(145deg, var(--secondary), color-mix(in srgb, var(--secondary) 30%, var(--bg)));
      padding: 3.5rem 1.5rem 2.5rem;
      position: relative; overflow: hidden;
    }
    .hero::after {
      content: '';
      position: absolute; bottom: -1px; left: 0; right: 0; height: 40px;
      background: var(--bg);
      clip-path: ellipse(55% 100% at 50% 100%);
    }
    .hero-logo {
      display: inline-flex; align-items: center; gap: 0.5rem;
      margin-bottom: 2rem;
    }
    .logo-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--primary);
      box-shadow: 0 0 16px color-mix(in srgb, var(--primary) 60%, transparent);
    }
    .logo-name {
      font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em;
      text-transform: uppercase; color: var(--muted);
    }
    .hero h1 {
      font-family: var(--font-h);
      font-size: clamp(2rem, 8vw, 3.5rem);
      font-weight: 800; line-height: 1.1;
      color: var(--text); margin-bottom: 0.75rem;
    }
    .hero p { font-size: 0.95rem; color: var(--muted); line-height: 1.6; max-width: 340px; }

    main { padding: 1rem 1.25rem; }

    .cat-section { margin-bottom: 2.5rem; }
    .cat-title {
      font-family: var(--font-h);
      font-size: 1.1rem; font-weight: 700;
      margin-bottom: 1rem; padding-bottom: 0.5rem;
      border-bottom: 2px solid color-mix(in srgb, var(--primary) 30%, transparent);
      display: flex; align-items: center; gap: 0.5rem;
    }
    .cat-title::before {
      content: '';
      width: 4px; height: 16px;
      background: var(--primary); border-radius: 2px;
    }

    .items-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(260px, 100%), 1fr));
      gap: 0.875rem;
    }
    .items-list { grid-template-columns: 1fr; }

    .item-card {
      padding: 1.25rem;
      background: color-mix(in srgb, var(--text) 3%, transparent);
      border: 1px solid color-mix(in srgb, var(--text) 8%, transparent);
      border-radius: var(--radius);
      transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
    }
    .item-card:hover {
      border-color: color-mix(in srgb, var(--primary) 40%, transparent);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px color-mix(in srgb, var(--primary) 10%, transparent);
    }
    .card-top {
      display: flex; justify-content: space-between;
      align-items: flex-start; gap: 0.75rem; margin-bottom: 0.5rem;
    }
    .item-name {
      font-family: var(--font-h);
      font-size: 0.95rem; font-weight: 700; line-height: 1.2;
    }
    .price-tag {
      flex-shrink: 0;
      background: color-mix(in srgb, var(--primary) 12%, transparent);
      color: var(--primary);
      font-size: 0.8rem; font-weight: 700;
      padding: 0.15rem 0.6rem; border-radius: 50px;
      white-space: nowrap;
    }
    .item-desc {
      font-size: 0.8rem; color: var(--muted);
      line-height: 1.5;
    }

    .sticky-cta {
      position: fixed; bottom: 1rem; left: 1rem; right: 1rem; z-index: 50;
    }
    .sticky-cta a {
      display: flex; align-items: center; justify-content: center; gap: 0.5rem;
      background: var(--primary); color: #fff;
      font-family: var(--font-b);
      font-size: 0.9rem; font-weight: 600;
      padding: 0.875rem; border-radius: var(--radius);
      text-decoration: none;
      box-shadow: 0 6px 24px color-mix(in srgb, var(--primary) 35%, transparent);
      transition: transform 0.15s;
    }
    .sticky-cta a:hover { transform: translateY(-2px); }

    footer {
      padding: 2rem 1.25rem 6rem;
      text-align: center;
      border-top: 1px solid color-mix(in srgb, var(--text) 8%, transparent);
    }
    .footer-social { display: flex; justify-content: center; gap: 1rem; margin: 0.75rem 0; }
    .footer-social a { color: var(--muted); transition: color 0.2s; }
    .footer-social a:hover { color: var(--primary); }
    footer p { font-size: 0.72rem; color: var(--muted); }
    .powered { margin-top: 0.5rem; font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; color: color-mix(in srgb, var(--muted) 40%, transparent); }

    .reveal { opacity: 0; transform: translateY(16px); }

    @media (min-width: 640px) {
      main { padding: 1.5rem 2rem; }
    }
  </style>
</head>
<body>
  <header class="hero">
    <div class="hero-logo">
      <div class="logo-dot"></div>
      <span class="logo-name">${data.niche.replace(/_/g, " ")}</span>
    </div>
    <h1>${data.businessName}</h1>
    <p>${data.tagline}</p>
  </header>

  <main>${sections}</main>

  <footer>
    <p>${data.businessName} — ${data.seoDescription}</p>
    <div class="footer-social">${socialLinks(data)}</div>
    <p>© ${new Date().getFullYear()} Todos los derechos reservados.</p>
    <p class="powered">POWERED BY JLSTUDIOS AUTOMATOR</p>
  </footer>

  <div class="sticky-cta">
    <a href="https://wa.me/${data.contactInfo.whatsapp || ""}?text=Hola!+Vi+su+web+y+quiero+consultar" target="_blank">
      ${cta}
    </a>
  </div>

  <script>
    const revealEls = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, i * 60);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => obs.observe(el));
  </script>
</body>
</html>`;
}

// ─── Emoji helpers ────────────────────────────────────────────
function getCategoryEmoji(category: string): string {
  const lower = category.toLowerCase();
  if (lower.includes("entrada") || lower.includes("starter")) return "🥗";
  if (lower.includes("principal") || lower.includes("main") || lower.includes("plato")) return "🍽️";
  if (lower.includes("postre") || lower.includes("dulce")) return "🍰";
  if (lower.includes("bebida") || lower.includes("drink")) return "🥤";
  if (lower.includes("pizza")) return "🍕";
  if (lower.includes("burger") || lower.includes("hambur")) return "🍔";
  if (lower.includes("pasta")) return "🍝";
  if (lower.includes("sushi") || lower.includes("japón")) return "🍣";
  if (lower.includes("pan") || lower.includes("bakery")) return "🥐";
  return "🍴";
}

function getBeautyEmoji(category: string, name: string): string {
  const text = (category + name).toLowerCase();
  if (text.includes("cabello") || text.includes("corte") || text.includes("hair")) return "✂️";
  if (text.includes("uña") || text.includes("nail") || text.includes("manicure")) return "💅";
  if (text.includes("facial") || text.includes("cara") || text.includes("piel")) return "✨";
  if (text.includes("masaje") || text.includes("massage")) return "💆";
  if (text.includes("depila") || text.includes("wax")) return "🌸";
  if (text.includes("maquilla") || text.includes("makeup")) return "💄";
  if (text.includes("barba") || text.includes("beard")) return "🪒";
  if (text.includes("tatuaje") || text.includes("tattoo")) return "🎨";
  if (text.includes("foto") || text.includes("photo")) return "📸";
  return "⭐";
}

// ─── Public export ────────────────────────────────────────────
export function renderPremiumStarter(data: BusinessData): string {
  const type = getTemplateType(data.niche);
  switch (type) {
    case "food":    return renderFoodTemplate(data);
    case "fitness": return renderFitnessTemplate(data);
    case "beauty":  return renderBeautyTemplate(data);
    default:        return renderDefaultTemplate(data);
  }
}

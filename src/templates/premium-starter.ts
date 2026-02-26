// src/templates/premium-starter.ts
import { BusinessData } from "@/lib/types";

/**
 * RENDERIZADOR MAESTRO DE JLSTUDIOS
 * Transforma los datos de la IA en un sitio web premium de alto impacto.
 */
export function renderPremiumStarter(data: BusinessData): string {
  const ds = data.designSystem;
  
  // Agrupamos los ítems por categoría para el renderizado
  const itemsByCategory: Record<string, typeof data.items> = {};
  data.categories.forEach(cat => {
    itemsByCategory[cat] = data.items.filter(i => i.category === cat);
  });

  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.businessName} | ${data.tagline}</title>
    <meta name="description" content="${data.seoDescription}">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=${ds.fontHeading.replace(/ /g, '+')}:wght@700;800&family=${ds.fontBody.replace(/ /g, '+')}:wght@300;400;600&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <style>
        :root {
            --primary: ${ds.primaryColor};
            --secondary: ${ds.secondaryColor};
            --accent: ${ds.accentColor};
            --bg: ${ds.backgroundColor};
            --text: ${ds.textColor};
            --muted: ${ds.mutedColor};
            --radius: ${ds.borderRadius};
            --shadow: ${ds.cardShadow};
            
            --font-h: '${ds.fontHeading}', serif;
            --font-b: '${ds.fontBody}', sans-serif;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            background-color: var(--bg);
            color: var(--text);
            font-family: var(--font-b);
            overflow-x: hidden;
            scroll-behavior: smooth;
        }

        /* --- HERO SECTION --- */
        .hero {
            position: relative;
            min-height: 80vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 2rem;
            background: linear-gradient(135deg, var(--secondary) 0%, #000 100%);
            color: #fff;
        }

        .hero-content {
            z-index: 10;
            max-width: 800px;
        }

        .hero h1 {
            font-family: var(--font-h);
            font-size: clamp(2.5rem, 8vw, 5rem);
            line-height: 1;
            margin-bottom: 1.5rem;
            color: var(--primary);
        }

        .hero p {
            font-size: clamp(1rem, 3vw, 1.25rem);
            opacity: 0.8;
            font-weight: 300;
            letter-spacing: 1px;
        }

        /* Decoración Visual */
        .hero::before {
            content: '';
            position: absolute;
            top: 20%; left: 10%;
            width: 300px; height: 300px;
            background: var(--primary);
            filter: blur(150px);
            opacity: 0.2;
            border-radius: 50%;
        }

        /* --- CONTENIDO --- */
        .container {
            max-width: 1100px;
            margin: 0 auto;
            padding: 5rem 1.5rem;
        }

        .section-title {
            font-family: var(--font-h);
            font-size: 2.5rem;
            margin-bottom: 3rem;
            text-align: center;
            position: relative;
        }

        .section-title::after {
            content: '';
            display: block;
            width: 60px; height: 4px;
            background: var(--primary);
            margin: 1rem auto;
            border-radius: 2px;
        }

        /* --- GRID DE ITEMS --- */
        .items-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
            margin-bottom: 5rem;
        }

        .card {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: var(--radius);
            padding: 2rem;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: var(--shadow);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .card:hover {
            transform: translateY(-10px);
            border-color: var(--primary);
            background: rgba(255,255,255,0.05);
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
        }

        .item-name {
            font-family: var(--font-h);
            font-size: 1.4rem;
            font-weight: 700;
        }

        .item-price {
            font-weight: 700;
            color: var(--primary);
            background: rgba(var(--primary), 0.1);
            padding: 0.2rem 0.8rem;
            border-radius: 50px;
            font-size: 0.9rem;
        }

        .item-desc {
            font-size: 0.95rem;
            color: var(--muted);
            margin-bottom: 1.5rem;
            line-height: 1.5;
        }

        /* --- BOTÓN WHATSAPP --- */
        .wsp-button {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: #25D366;
            color: #fff;
            width: 65px;
            height: 65px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            text-decoration: none;
            box-shadow: 0 10px 25px rgba(37, 211, 102, 0.3);
            z-index: 1000;
            transition: transform 0.3s ease;
        }

        .wsp-button:hover {
            transform: scale(1.1) rotate(5deg);
        }

        /* --- FOOTER --- */
        footer {
            padding: 4rem 2rem;
            background: var(--secondary);
            text-align: center;
            color: rgba(255,255,255,0.5);
            font-size: 0.8rem;
            border-top: 1px solid rgba(255,255,255,0.05);
        }

        .footer-logo {
            color: #fff;
            font-family: var(--font-h);
            font-size: 1.5rem;
            margin-bottom: 1rem;
            display: block;
        }

        /* --- ANIMACIONES --- */
        .reveal { opacity: 0; }
    </style>
</head>
<body>

    <header class="hero">
        <div class="hero-content">
            <h1 class="reveal">${data.businessName}</h1>
            <p class="reveal">${data.tagline}</p>
        </div>
    </header>

    <main class="container">
        ${data.categories.map(cat => `
            <section class="category-block">
                <h2 class="section-title reveal">${cat}</h2>
                <div class="items-grid">
                    ${itemsByCategory[cat] ? itemsByCategory[cat].map(item => `
                        <div class="card reveal">
                            <div class="card-content">
                                <div class="card-header">
                                    <h3 class="item-name">${item.name}</h3>
                                    ${item.price ? `<span class="item-price">${item.price}</span>` : ''}
                                </div>
                                <p class="item-desc">${item.description}</p>
                            </div>
                        </div>
                    `).join('') : ''}
                </div>
            </section>
        `).join('')}
    </main>

    <footer>
        <span class="footer-logo">${data.businessName}</span>
        <p>© ${new Date().getFullYear()} - Todos los derechos reservados</p>
        <p style="margin-top: 20px; font-size: 10px; opacity: 0.3; letter-spacing: 2px;">POWERED BY JLSTUDIOS AUTOMATOR</p>
    </footer>

    <a href="https://wa.me/${data.contactInfo.whatsapp || '123456789'}?text=Hola! Vengo de tu web. Me gustaría consultar por..." class="wsp-button" target="_blank">
        <i class="fab fa-whatsapp"></i>
    </a>

    <script src="https://unpkg.com/scrollreveal"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            ScrollReveal().reveal('.reveal', {
                distance: '40px',
                duration: 1000,
                easing: 'cubic-bezier(0.5, 0, 0, 1)',
                interval: 150,
                origin: 'bottom',
                opacity: 0
            });
        });
    </script>
</body>
</html>
  `.trim();
}
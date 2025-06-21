import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import compression from 'compression';

// До app.use(...) или app.listen(...)


const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(compression());
/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

// Redirect root requests to the default language
app.get(['/', '/index.html'], (_req, res) => {
      // Define supported languages
      const defaultLanguage = 'es';
      const SUPPORTED_LANGUAGES = ['es', 'vl', 'en', 'ru', 'ua'];
      const preferredLanguage = _req.headers['accept-language']
      ?.split(',')?.[0]
      ?.substring(0, 2);
   
      if(preferredLanguage && SUPPORTED_LANGUAGES.includes(preferredLanguage)) {
        res.redirect(302, `/${preferredLanguage}`);
      } else {
        res.redirect(302, `/${defaultLanguage}`);
      }
});

/**
 * Handle all other requests by rendering the Angular application.
 */
// app.use('/**', (req, res, next) => {
//   angularApp
//     .handle(req)
//     .then((response) =>
//       response ? writeResponseToNodeResponse(response, res) : next(),
//     )
//     .catch(next);
// });

app.use('/**', async (req, res, next) => {
  try {
    const response = await angularApp.handle(req);
    if (!response) return next();

    let html = await response.text();

    const path = req.url.toLowerCase();
    const defaultLang = 'es';
    const langMap: Record<LangCode, LangMeta> = {
      es: {
        lang: 'es',
        title: 'Reparación de portátiles y móviles en Valencia | Chip',
        description: 'Servicio técnico profesional en Valencia: reparación de ordenadores, móviles, limpieza, instalación de Windows y programas.',
        ogImage: '/assets/og/es.jpg',
      },
      vl: {
        lang: 'ca',
        title: 'Reparació de portàtils i mòbils a València | Chip',
        description: 'Servei tècnic de confiança a València. Reparació i manteniment de dispositius electrònics.',
        ogImage: '/assets/og/vl.jpg',
      },
      en: {
        lang: 'en',
        title: 'Laptop and Phone Repair in Valencia | Chip',
        description: 'Professional tech repair services in Valencia: laptops, phones, software installation, cleaning and diagnostics.',
        ogImage: '/assets/og/en.jpg',
      },
      ru: {
        lang: 'ru',
        title: 'Ремонт ноутбуков и телефонов в Валенсии | Chip',
        description: 'Профессиональный ремонт техники: телефоны, ноутбуки, установка Windows, чистка от пыли. Быстро, качественно.',
        ogImage: '/assets/og/ru.jpg',
      },
      ua: {
        lang: 'uk',
        title: 'Ремонт ноутбуків та телефонів у Валенсії | Chip',
        description: 'Професійний ремонт техніки у Валенсії: телефони, ноутбуки, встановлення Windows, чистка від пилу.',
        ogImage: '/assets/og/ua.jpg',
      },
    };

    // If path has no language prefix, redirect to default language
    // if (!Object.keys(langMap).some(code => path.startsWith(`/${code}`))) {
    //   res.redirect(302, `/${defaultLang}${path}`);
    //   return;
    // }

    type LangCode = 'es' | 'vl' | 'en' | 'ru' | 'ua';
    type LangMeta = {
      lang: string;
      title: string;
      description: string;
      ogImage: string;
    };
    

    // Определение языка из URL
    const code = (Object.keys(langMap).find(code => path.startsWith(`/${code}`)) as LangCode) ?? defaultLang as LangCode;
    const meta = langMap[code];

    // Заменяем атрибут <html lang="">
    html = html.replace('<html ', `<html lang="${meta.lang}" `);

    // Заменяем <title> и <meta name="description">
    html = html.replace(/<title>.*<\/title>/, `<title>${meta.title}</title>`);
    html = html.replace(
      /<meta name="description"[^>]*>/,
      `<meta name="description" content="${meta.description}">`
    );

    // Добавляем Open Graph и Twitter Cards (после <meta name="description">)
    html = html.replace(
      /(<meta name="description"[^>]*>)/,
      `$1
  <meta property="og:title" content="${meta.title}">
  <meta property="og:description" content="${meta.description}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="${meta.ogImage}">
  <meta property="og:url" content="https://chip-valencia.es${path}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${meta.title}">
  <meta name="twitter:description" content="${meta.description}">
  <meta name="twitter:image" content="${meta.ogImage}">
      `
    );

    // Вставка structured data JSON-LD
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Chip Valencia",
      "image": "https://chip-valencia.es/assets/logo.png",
      "url": "https://chip-valencia.es",
      "telephone": "+34 644 18 82 18",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "C/ de l'Enginyer Rafael Janini, 8",
        "addressLocality": "València",
        "postalCode": "46022",
        "addressCountry": "ES"
      },
      "openingHours": "Mo-Sa 10:00-20:00",
      "priceRange": "€",
      "sameAs": [
        "https://www.google.com/maps/place/Reparación+de+portátiles+CHIP"
      ]
    };

    html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify(structuredData)}</script></head>`);

    res
      .status(response.status)
      .set(Object.fromEntries(response.headers.entries()))
      .send(html);
  } catch (err) {
    next(err);
  }
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = Number(process.env['PORT'] || 4000);

  app.listen(port, '0.0.0.0', () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);

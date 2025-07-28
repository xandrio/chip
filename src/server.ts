import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import compression from 'compression';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// До app.use(...) или app.listen(...)


const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(compression());

const transporter = nodemailer.createTransport({
  host: process.env['SMTP_HOST'],
  port: Number(process.env['SMTP_PORT'] || 587),
  secure: false,
  auth: {
    user: process.env['SMTP_USER'],
    pass: process.env['SMTP_PASS'],
  },
});
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


app.post('/api/contact', express.json(), async (req, res) => {
  const { name, phone, model, description, token } = req.body;

  try {
    const secret = process.env['RECAPTCHA_SECRET'];
    const verify = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secret}&response=${token}`,
    });
    const result = await verify.json();
    if (!result.success) {
      return res.status(400).json({ success: false, captcha: false });
    }
  } catch (verifyErr) {
    console.error('Failed to verify captcha', verifyErr);
    return res.status(500).json({ success: false });
  }

  try {
    await transporter.sendMail({
      from: process.env['SMTP_USER'],
      to: 'a.xandr.q@gmail.com',// process.env['SMTP_USER'],
      subject: 'Contact request',
      text: `Name: ${name}\nPhone: ${phone}\nModel: ${model}\nDescription: ${description}`,
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Failed to send mail', err);
    return res.status(500).json({ success: false });
  }
});

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

app.use('/**', async (req, res, next) => {
  try {
    const response = await angularApp.handle(req);
    if (!response) return next();

    let html = await response.text();

    const path = req.baseUrl.toLowerCase();
    const defaultLang = 'es';
    const langMap: Record<LangCode, LangMeta> = {
      es: {
        lang: 'es',
        title: 'Reparación de portátiles y móviles en Valencia | Chip',
        description: 'Servicio técnico profesional en Valencia: reparación de ordenadores, móviles, limpieza, instalación de Windows y programas.',
        keywords: 'reparacion de moviles, reparacion de tabletas, reparacion de portatiles, reparacion de ordenadores, Valencia, cambio de pantalla, cambio de bateria, instalacion de Windows, limpieza de polvo',
        ogImage: '/assets/og/es.jpg',
      },
      vl: {
        lang: 'ca',
        title: 'Reparació de portàtils i mòbils a València | Chip',
        description: 'Servei tècnic de confiança a València. Reparació i manteniment de dispositius electrònics.',
        keywords: 'reparació de mòbils, reparació de tauletes, reparació de portàtils, reparació d\'ordinadors, València, canvi de pantalla, canvi de bateria, instal·lació de Windows, neteja de pols',
        ogImage: '/assets/og/vl.jpg',
      },
      en: {
        lang: 'en',
        title: 'Laptop and Phone Repair in Valencia | Chip',
        description: 'Professional tech repair services in Valencia: laptops, phones, software installation, cleaning and diagnostics.',
        keywords: 'phone repair, tablet repair, laptop repair, computer repair, Valencia, screen replacement, battery replacement, Windows installation, dust cleaning',
        ogImage: '/assets/og/en.jpg',
      },
      ru: {
        lang: 'ru',
        title: 'Ремонт ноутбуков и телефонов в Валенсии | Chip',
        description: 'Профессиональный ремонт техники: телефоны, ноутбуки, установка Windows, чистка от пыли. Быстро, качественно.',
        keywords: 'ремонт телефонов, ремонт планшетов, ремонт ноутбуков, ремонт компьютеров, Валенсия, замена дисплея, замена батареи, установка Windows, чистка от пыли',
        ogImage: '/assets/og/ru.jpg',
      },
      ua: {
        lang: 'uk',
        title: 'Ремонт ноутбуків та телефонів у Валенсії | Chip',
        description: 'Професійний ремонт техніки у Валенсії: телефони, ноутбуки, встановлення Windows, чистка від пилу.',
        keywords: 'ремонт телефонів, ремонт планшетів, ремонт ноутбуків, ремонт комп\'ютерів, Валенсія, заміна дисплея, заміна батареї, встановлення Windows, очищення від пилу',
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
      keywords: string;
      ogImage: string;
    };
    

    // Определение языка из URL
    const code = (Object.keys(langMap).find(code => path.startsWith(`/${code}`)) as LangCode) ?? defaultLang as LangCode;
    const meta = langMap[code];

    // Обновляем canonical-ссылку в соответствии с текущим путём
    html = html.replace(
      /<link rel="canonical"[^>]*>/i,
      `<link rel="canonical" href="https://chip-valencia.es${path}">`,
    );

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
  <meta name="keywords" content="${meta.keywords}">
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

    // Вставка structured data JSON-LD для LocalBusiness
    const businessStructuredData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Chip Valencia",
      "image": "https://chip-valencia.es/images/logo.png",
      "url": "https://chip-valencia.es",
      "telephone": "+34 647 80 48 67",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": " C/ de la Dama d'Elx, 16, Camins al Grau, 46023 València, Valencia",
        "addressLocality": "València",
        "postalCode": "46023",
        "addressCountry": "ES"
      },
      "openingHours": "Mo-Sa 11:00-19:00",
      "priceRange": "€",
      "sameAs": [
        "https://www.google.com/maps/place/Reparación+de+portátiles+CHIP"
      ]
    };

    html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify(businessStructuredData)}</script></head>`);

    // Добавляем FAQ structured data для домашней страницы
    if (path.includes('/home')) {
      try {
        const faqContent = JSON.parse(readFileSync(resolve(browserDistFolder, `i18n/${code}.json`), 'utf-8')).FAQ;
        const faqStructuredData = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": faqContent.REPAIR_TIME_Q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faqContent.REPAIR_TIME_A
              }
            },
            {
              "@type": "Question",
              "name": faqContent.RECORD_Q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faqContent.RECORD_A
              }
            },
            {
              "@type": "Question",
              "name": faqContent.WARRANTY_Q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faqContent.WARRANTY_A
              }
            },
            {
              "@type": "Question",
              "name": faqContent.DIAGNOSTICS_Q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faqContent.DIAGNOSTICS_A
              }
            },
            {
              "@type": "Question",
              "name": faqContent.LEGAL_ENTITIES_Q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faqContent.LEGAL_ENTITIES_A
              }
            }
          ]
        };

        html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify(faqStructuredData)}</script></head>`);
      } catch (faqErr) {
        console.error('Failed to generate FAQ structured data', faqErr);
      }
    }
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
if (isMainModule(import.meta.url) || process.env['PM2']) {
  const port = Number(process.env['PORT'] || 4000);

  app.listen(port, '0.0.0.0', () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);

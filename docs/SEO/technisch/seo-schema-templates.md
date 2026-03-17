# SEO Schema Templates voor SlowCarb

> **Doel:** Copy-paste ready JSON-LD snippets die Claude Code kan implementeren in de React codebase.
> **Datum:** 17 maart 2026

---

## 1. FAQPage Schema (voor landing page)

Plak dit in de `<head>` van de landing page, of voeg het toe als `<script type="application/ld+json">` onderaan de body.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is SlowCarb een abonnement?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nee. Je betaalt één keer €47 en hebt daarna voor altijd toegang. Geen maandelijkse kosten, geen verrassingen."
      }
    },
    {
      "@type": "Question",
      "name": "Moet ik naar de sportschool voor het slow carb dieet?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nee. SlowCarb is puur voeding. Bewegen helpt altijd, maar het protocol werkt zonder gym. Jesper verloor 8 kilo zonder sportschool."
      }
    },
    {
      "@type": "Question",
      "name": "Werkt het slow carb dieet ook met ADHD of een druk leven?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Juist dan. De 5 regels zijn zo simpel dat ze geen cognitieve ruimte kosten. Geen bijhouden, geen tellen, geen dagelijkse keuzes. De app doet het denkwerk."
      }
    },
    {
      "@type": "Question",
      "name": "Wat als het slow carb dieet niet werkt voor mij?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Dan krijg je je geld terug. 30 dagen, geen vragen. Maar het protocol van Tim Ferriss is bewezen bij duizenden mensen wereldwijd. De app maakt het alleen makkelijker om het vol te houden."
      }
    },
    {
      "@type": "Question",
      "name": "Is SlowCarb gewoon een kookboek-app?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nee. Het is een complete tool: AmmoCheck checklist, dagtracker, 84-dagen educatie, recepten en boodschappenlijst. Alles om het protocol 6+ weken vol te houden."
      }
    },
    {
      "@type": "Question",
      "name": "Hoe snel zie ik resultaat met het slow carb dieet?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "De meeste mensen verliezen 1-2 kg in de eerste week. In 6 weken is 4-8 kg realistisch. Zonder honger en zonder extreme maatregelen."
      }
    }
  ]
}
```

**Valideer na implementatie:** https://search.google.com/test/rich-results

---

## 2. Recipe Schema Template (voor individuele receptpagina's)

Gebruik dit template voor elke publieke receptpagina. Vul de variabelen in per recept.

```json
{
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": "{{RECEPT_NAAM}}",
  "description": "{{KORTE_BESCHRIJVING}} Voldoet aan alle 5 slow carb regels.",
  "image": "https://eatslowcarb.com/images/recepten/{{SLUG}}.jpg",
  "author": {
    "@type": "Organization",
    "name": "SlowCarb"
  },
  "datePublished": "2026-03-17",
  "prepTime": "PT{{PREP_MINUTEN}}M",
  "cookTime": "PT{{KOOK_MINUTEN}}M",
  "totalTime": "PT{{TOTAAL_MINUTEN}}M",
  "recipeYield": "{{PORTIES}} porties",
  "recipeCategory": "{{CATEGORIE}}",
  "recipeCuisine": "Nederlands",
  "keywords": "slow carb recept, {{EXTRA_KEYWORDS}}",
  "nutrition": {
    "@type": "NutritionInformation",
    "calories": "{{KCAL}} kcal",
    "proteinContent": "{{EIWIT}}g",
    "carbohydrateContent": "{{KOOLHYDRATEN}}g",
    "fatContent": "{{VET}}g"
  },
  "recipeIngredient": [
    "{{INGREDIËNT_1}}",
    "{{INGREDIËNT_2}}",
    "{{INGREDIËNT_3}}"
  ],
  "recipeInstructions": [
    {
      "@type": "HowToStep",
      "text": "{{STAP_1}}"
    },
    {
      "@type": "HowToStep",
      "text": "{{STAP_2}}"
    }
  ],
  "suitableForDiet": "https://schema.org/GlutenFreeDiet"
}
```

**URL structuur:** `/recepten/{{slug}}` (bijv. `/recepten/chili-con-carne`)

**Verplichte elementen per receptpagina:**
- H1: receptnaam
- Prep time + cook time (zichtbaar op pagina)
- Ingrediëntenlijst
- Stap-voor-stap bereiding
- "Voldoet aan alle 5 slow carb regels" badge
- Link naar boodschappenlijst
- Gerelateerde recepten (interne links)
- CTA: "Alle 50+ recepten → begin voor €47"

---

## 3. Article Schema (voor pillar page en blog posts)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{{TITEL}}",
  "description": "{{META_DESCRIPTION}}",
  "image": "https://eatslowcarb.com/images/blog/{{SLUG}}.jpg",
  "author": {
    "@type": "Person",
    "name": "Jesper",
    "url": "https://eatslowcarb.com/over-jesper",
    "description": "Oprichter SlowCarb. Ex-militair, MBO-instructor, vader van drie. 8 kilo afgevallen met het slow carb protocol.",
    "jobTitle": "Oprichter",
    "worksFor": {
      "@type": "Organization",
      "name": "SlowCarb",
      "url": "https://eatslowcarb.com"
    }
  },
  "publisher": {
    "@type": "Organization",
    "name": "SlowCarb",
    "url": "https://eatslowcarb.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://eatslowcarb.com/logo.png"
    }
  },
  "datePublished": "{{PUBLICATIEDATUM}}",
  "dateModified": "{{WIJZIGINGSDATUM}}",
  "mainEntityOfPage": "https://eatslowcarb.com/gids/{{SLUG}}",
  "inLanguage": "nl"
}
```

---

## 4. WebApplication Schema (voor landing page — fix bestaande)

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "SlowCarb",
  "description": "De enige Nederlandstalige slow carb app. 5 regels, 50+ recepten, 84-dagen educatie. Eenmalig €47.",
  "url": "https://eatslowcarb.com",
  "applicationCategory": "HealthApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "47.00",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock"
  },
  "author": {
    "@type": "Person",
    "name": "Jesper"
  },
  "inLanguage": "nl"
}
```

---

## 5. BreadcrumbList Schema (voor alle subpagina's)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://eatslowcarb.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "{{SECTIE_NAAM}}",
      "item": "https://eatslowcarb.com/{{SECTIE_SLUG}}"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "{{PAGINA_NAAM}}",
      "item": "https://eatslowcarb.com/{{SECTIE_SLUG}}/{{PAGINA_SLUG}}"
    }
  ]
}
```

---

## 6. Robots.txt (nieuw bestand)

```
User-agent: *
Allow: /

Sitemap: https://eatslowcarb.com/sitemap.xml

# Blokkeer app-routes (achter auth)
Disallow: /app/
Disallow: /dashboard/
Disallow: /api/

# Blokkeer juridische pagina's van indexatie
# (gebruik liever meta robots noindex per pagina)
```

---

## 7. Sitemap.xml (minimale versie — handmatig)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://eatslowcarb.com/</loc>
    <lastmod>2026-03-17</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Voeg toe zodra pagina's bestaan: -->
  <!--
  <url>
    <loc>https://eatslowcarb.com/gids/slow-carb-dieet</loc>
    <lastmod>2026-03-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://eatslowcarb.com/recepten/chili-con-carne</loc>
    <lastmod>2026-03-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  -->
</urlset>
```

**Aanbeveling:** gebruik `vite-plugin-sitemap` voor automatische generatie bij build.

---

## SEO Meta Tags per Pagina

| Pagina | Title Tag | Meta Description |
|--------|-----------|------------------|
| **Landing** | SlowCarb Protocol – Val 8-10 kg af in 6 weken | Afvallen zonder calorieën tellen. 5 regels, 1 cheatday per week, 50+ recepten. Eenmalig €47, geen abonnement. |
| **Pillar: Slow Carb Dieet** | Slow Carb Dieet: De Complete Gids — Regels, Recepten & Resultaten | Alles over het slow carb dieet van Tim Ferriss. 5 regels, geen calorieën tellen, 1 cheatday per week. Inclusief recepten en weekplanning. |
| **Recepten overzicht** | Slow Carb Recepten: 50+ Maaltijden die aan Alle Regels Voldoen | Slow carb recepten klaar in 15 minuten. Filter op airfryer, bereidingstijd of ingrediënt. Allemaal conform de 5 regels. |
| **Slow Carb vs Keto** | Slow Carb vs Keto: Welk Dieet Past bij Jou? | Vergelijking slow carb en keto. Wat is makkelijker vol te houden? Welk dieet levert sneller resultaat? Objectief vergeleken. |
| **Over Jesper** | Over Jesper — Van 111 kg naar SlowCarb Oprichter | Ex-militair, vader van drie, ADHD. Hoe Jesper 8 kilo verloor met het slow carb protocol en waarom hij er een app van maakte. |
| **FAQ** | Veelgestelde Vragen over SlowCarb en het Slow Carb Dieet | Antwoord op de meestgestelde vragen over het slow carb dieet, de SlowCarb app, resultaten en de 30-dagen geld-terug garantie. |

---

## Implementatie Checklist voor Claude Code

- [ ] Canonical URL toevoegen: `<link rel="canonical" href="https://eatslowcarb.com/">`
- [ ] Meta robots tag: `<meta name="robots" content="index, follow">`
- [ ] FAQPage JSON-LD op landing page
- [ ] WebApplication JSON-LD fixen (controleer of het in statische HTML rendert)
- [ ] robots.txt in `/public/`
- [ ] sitemap.xml in `/public/` (of via vite-plugin-sitemap)
- [ ] H1 typefout: "8 tot 10kilo in6 weken." → spaties
- [ ] Title tag inkorten naar ≤60 tekens
- [ ] URL structuur: root `/` → landing content (niet redirect naar /landing.html)
- [ ] Routing toevoegen voor `/gids/slow-carb-dieet` (pillar page)
- [ ] Routing toevoegen voor `/recepten/:slug` (publieke receptpagina's)
- [ ] Article JSON-LD op pillar page
- [ ] Recipe JSON-LD per receptpagina
- [ ] BreadcrumbList JSON-LD op alle subpagina's
- [ ] Pre-rendering onderzoeken (react-snap / vite-plugin-ssr / Vercel ISR)

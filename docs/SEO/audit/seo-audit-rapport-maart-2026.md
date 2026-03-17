# SlowCarb SEO Audit Rapport
**Datum:** 17 maart 2026
**Website:** eatslowcarb.com
**Status:** NIET GEÏNDEXEERD — Google kent de site niet

---

## Executive Summary

eatslowcarb.com heeft sterke copy, een duidelijk aanbod en een unieke positionering (enige Nederlandstalige slow-carb app). Maar de site is **onzichtbaar voor Google**. Letterlijk: `site:eatslowcarb.com` levert nul resultaten. Dat is het eerste en belangrijkste probleem.

**Grootste kracht:** Unieke niche in NL — niemand biedt een dedicated slow-carb tool in het Nederlands.

**Top 3 prioriteiten:**
1. **Indexatie fixen** — de site wordt niet gecrawld/gerenderd door Google (React SPA + geen sitemap + geen canonical)
2. **Publieke content maken** — recepten en educatie-content zitten achter auth, Google kan ze niet zien
3. **Structured data toevoegen** — FAQ schema, Recipe schema, WebApplication schema

**Overall assessment:** Sterke basis qua content en product, maar technisch volledig onzichtbaar. De fix is haalbaar en de niche is open.

---

## 1. Technische SEO Audit

### Wat we vonden

| Check | Status | Details |
|-------|--------|---------|
| **Google indexatie** | ❌ FAIL | `site:eatslowcarb.com` = 0 resultaten. Site bestaat niet voor Google |
| **Sitemap.xml** | ❌ FAIL | Niet aanwezig of niet bereikbaar |
| **Robots.txt** | ❌ FAIL | Niet aanwezig of niet bereikbaar |
| **Canonical URL** | ❌ FAIL | Ontbreekt volledig. Geen `<link rel="canonical">` |
| **URL structuur** | ⚠️ WARN | Hoofd-URL redirect naar `/landing.html` — zou root `/` moeten zijn |
| **Client-side rendering** | ⚠️ WARN | React SPA — content wordt pas zichtbaar na JS-rendering. Googlebot kan dit deels, maar niet betrouwbaar |
| **JSON-LD / Structured data** | ⚠️ WARN | WebFetch vond WebApplication schema, maar JavaScript extractie vond 0 JSON-LD scripts. Mogelijk SSR-issue of dynamisch geladen |
| **HTTPS** | ✅ PASS | Site draait op HTTPS |
| **lang attribuut** | ✅ PASS | `lang="nl"` correct ingesteld |
| **Viewport meta** | ✅ PASS | Responsive viewport tag aanwezig |
| **Hreflang** | ⚠️ N.V.T. | Niet nodig nu (alleen NL), maar voorbereiden voor toekomstige EN-versie |
| **Title tag** | ✅ PASS | "SlowCarb Protocol – Val 8-10 kg af in 6 weken · €47 eenmalig" (62 chars — iets te lang, target <60) |
| **Meta description** | ✅ PASS | "Afvallen zonder calorieën tellen. 5 regels, 1 cheatday per week, 50+ recepten. Eenmalig €47, geen abonnement. Gebaseerd op Tim Ferriss' 4-Hour Body." |
| **Open Graph tags** | ✅ PASS | og:title, og:description, og:image, og:url, og:type allemaal aanwezig |
| **Twitter Card** | ✅ PASS | summary_large_image ingesteld |
| **Image alt teksten** | ✅ PASS | Alle afbeeldingen hebben beschrijvende alt-teksten |
| **Robots meta tag** | ❌ MISSING | Geen `<meta name="robots">` — niet per se een probleem, maar expliciet `index, follow` toevoegen is best practice |

### Kritieke bevinding: Waarom Google de site niet kent

Het probleem is waarschijnlijk een combinatie van:
1. **React SPA zonder pre-rendering** — Googlebot rendert JavaScript, maar niet altijd volledig of snel
2. **Geen sitemap.xml** — Google weet niet welke pagina's bestaan
3. **Geen canonical URL** — Google weet niet wat de "echte" URL is
4. **URL redirect naar /landing.html** — ongebruikelijke structuur
5. **Geen inkomende links** — geen backlinks = geen reden voor Google om te crawlen
6. **Mogelijk niet aangemeld bij Google Search Console**

---

## 2. Keyword Opportunity Table

| Keyword | Est. Difficulty | Opportunity | Huidige Ranking | Intent | Aanbevolen Content |
|---------|----------------|-------------|-----------------|--------|--------------------|
| slow carb dieet | Laag | 🟢 HOOG | Niet geïndexeerd | Informational | Pillar page: "Slow Carb Dieet: Complete Gids" |
| slow carb recepten | Laag | 🟢 HOOG | Niet geïndexeerd | Informational/Commercial | Publieke receptpagina's met Recipe schema |
| afvallen zonder calorieën tellen | Moderate | 🟢 HOOG | Niet geïndexeerd | Informational | Blog post: "Afvallen zonder calorieën tellen — waarom SlowCarb werkt" |
| slow carb boodschappenlijst | Laag | 🟢 HOOG | Niet geïndexeerd | Transactional | Landingspagina met gratis preview + CTA |
| tim ferriss dieet | Laag | 🟡 MEDIUM | Niet geïndexeerd | Informational | Blog: "Tim Ferriss Dieet in het Nederlands uitgelegd" |
| slow carb regels | Laag | 🟢 HOOG | Niet geïndexeerd | Informational | Al op landing page — maak apart indexeerbaar |
| cheatday dieet | Laag-Moderate | 🟡 MEDIUM | Niet geïndexeerd | Informational | Blog: "Cheatday: waarom het bij SlowCarb wél mag" |
| afvallen met peulvruchten | Laag | 🟡 MEDIUM | Niet geïndexeerd | Informational | Blog: "Waarom peulvruchten de basis zijn van SlowCarb" |
| slow carb vs keto | Laag | 🟢 HOOG | Niet geïndexeerd | Commercial Investigation | Vergelijkingspagina |
| slow carb vs intermittent fasting | Laag | 🟡 MEDIUM | Niet geïndexeerd | Commercial Investigation | Vergelijkingspagina |
| dieet app nederland | Hoog | 🟡 MEDIUM | Niet geïndexeerd | Commercial | Vergelijkingspagina: "Dieet apps vergeleken" |
| meal prep afvallen | Moderate | 🟡 MEDIUM | Niet geïndexeerd | Informational | Blog met meal prep tips + link naar app |
| 4 hour body dieet | Laag | 🟡 MEDIUM | Niet geïndexeerd | Informational | Blog: "4-Hour Body dieet in de praktijk" |
| hoeveel kilo afvallen per week | Moderate | 🔴 LAAG | Niet geïndexeerd | Informational | Blog (veel concurrentie, later) |
| koolhydraatarm dieet | Hoog | 🔴 LAAG | Niet geïndexeerd | Informational | Niet targeten — te breed, te competitief |

**Niche-voordeel:** Er is GEEN dedicated Nederlandstalige slow-carb website. De term "slow carb" is in NL bijna onbezet. De enige NL content is een verouderd artikel op infonu.nl (2014, site gestopt met publiceren). Dit is een open doel.

---

## 3. On-Page Issues

| Pagina | Issue | Ernst | Aanbevolen Fix |
|--------|-------|-------|----------------|
| Landing page | Geen canonical URL | ❌ Kritiek | `<link rel="canonical" href="https://eatslowcarb.com/">` toevoegen |
| Landing page | H1 bevat typefout | ⚠️ Medium | "8 tot 10kilo in6 weken." → "8 tot 10 kilo in 6 weken." (spaties) |
| Landing page | Title tag 62 chars (max 60) | ⚠️ Laag | Verkort naar: "SlowCarb Protocol – Val 8-10 kg af in 6 weken" |
| Landing page | Geen FAQ schema | ⚠️ Medium | FAQ sectie heeft 6 vragen — wrap in FAQPage JSON-LD |
| Landing page | Geen WebApplication schema (JS) | ⚠️ Medium | JSON-LD niet gevonden door JS extractie — check of het correct gerenderd wordt |
| Landing page | URL is /landing.html | ⚠️ Medium | Redirect root `/` naar content, niet naar `/landing.html` |
| Landing page | Geen robots meta tag | ⚠️ Laag | Voeg `<meta name="robots" content="index, follow">` toe |
| Landing page | Geen interne links naar subpagina's | ❌ Kritiek | Geen blog, geen receptpagina's, geen content hub — Google ziet 1 pagina |
| /terms | Onbekend of geïndexeerd | ⚠️ Laag | Zet op noindex — juridische pagina's hoeven niet in Google |
| /privacy | Onbekend of geïndexeerd | ⚠️ Laag | Zet op noindex |

---

## 4. Competitor Analyse

### Wie rankt voor onze keywords?

| Dimensie | eatslowcarb.com | lowcarbchef.nl | victormooren.nl | infonu.nl (slow carb) | ralphmoorman.nl |
|----------|----------------|----------------|-----------------|----------------------|-----------------|
| **Indexeerbare pagina's** | ~1 (landing) | 1.630+ | 100+ artikelen | 1 (oud, 2014) | 50+ artikelen |
| **Content diepte** | 0 blog posts | 52 blog + 500+ recepten | 2.551 woorden per artikel | ~1.300 woorden | 1.000-2.000 per artikel |
| **Structured data** | Deels (WebApp) | ✅ CollectionPage, Breadcrumb, Website | ✅ Article, FAQ, Breadcrumb, Person | Nee | Beperkt |
| **FAQ schema** | Nee | Nee | ✅ Ja | Nee | Nee |
| **Recipe schema** | Nee | ✅ Ja | N.v.t. | Nee | Nee |
| **Auteur/credentials** | Jesper (op pagina) | Merk-gebaseerd | ✅ Personal trainer, 10+ jaar | Pseudoniem | ✅ Gezondheidsjournalist |
| **Publicatiefrequentie** | 0 | Wekelijks | Maandelijks | Gestopt (2021) | Maandelijks |
| **Backlink signalen** | Minimaal | Sterk (jaren actief) | Moderate | Weak (oud) | Sterk (bekend merk) |
| **Technisch** | React SPA | SSR/WordPress | WordPress | CMS | WordPress |
| **Focus op slow carb** | ✅ 100% | Nee (low carb breed) | Nee (vetverlies breed) | 1 artikel | 1-2 artikelen |

### Wat competitors goed doen dat wij niet doen

1. **lowcarbchef.nl** — 1.630+ indexeerbare receptpagina's met Recipe schema. Elke recept = een Google-ingang. Wij hebben 50+ recepten maar ze zitten achter auth.
2. **victormooren.nl** — FAQPage schema, Article schema, auteur-credentials, 2.500+ woorden per artikel. Rankt voor "afvallen zonder calorieën tellen" — ons kernkeyword.
3. **ralphmoorman.nl** — Autoriteit in NL gezondheidsruimte. Heeft slow-carb content maar niet als dedicated onderwerp.

### Onze unieke positie

Geen van deze competitors biedt een **dedicated slow-carb tool in het Nederlands**. Ze schrijven *over* slow carb of low carb, maar niemand heeft een app, receptenbank, of 84-dagen programma. Dit is ons gat.

---

## 5. Ranking Levers — Wat Google beloont

Gebaseerd op wat we OBSERVEREN bij rankende competitors:

| # | Lever | Bewijs van competitors | Waarom het werkt | SlowCarb status |
|---|-------|----------------------|------------------|-----------------|
| 1 | **Indexeerbare content volume** | lowcarbchef.nl heeft 1.630+ pagina's, victormooren.nl 100+ artikelen | Meer pagina's = meer ingangen in Google, meer interne links, meer topical authority | ❌ Wij hebben 1 pagina |
| 2 | **Structured data (Schema.org)** | victormooren.nl: Article + FAQ + Person schema. lowcarbchef.nl: Recipe + Collection + Breadcrumb | Rich snippets in zoekresultaten = hogere CTR | ❌ Minimaal/broken |
| 3 | **Content diepte per pagina** | victormooren.nl: 2.500+ woorden, gestructureerd met H2's en FAQ | Langere, diepere content rankt beter voor informational queries | ⚠️ Landing page heeft content, maar niet als blog |
| 4 | **Auteur E-E-A-T signalen** | victormooren.nl: bio + credentials + foto. ralphmoorman.nl: bekend merk | Google waardeert expertise, ervaring en autoriteit in health niche (YMYL) | ⚠️ Jesper's verhaal staat op pagina, maar geen Author schema |
| 5 | **Publicatiefrequentie** | lowcarbchef.nl: wekelijks nieuwe recepten. victormooren.nl: maandelijks | Regelmatige updates signaleren een actieve, betrouwbare site | ❌ Geen blog, geen updates zichtbaar voor Google |
| 6 | **Interne linking structuur** | lowcarbchef.nl: categorieën → recepten → gerelateerd. infonu.nl: 17 interne links | Verspreidt link equity, helpt Google de site-structuur begrijpen | ❌ Geen interne links (1 pagina site) |
| 7 | **Server-side rendering** | Alle competitors draaien op WordPress (SSR). Content is direct beschikbaar voor crawlers | Googlebot hoeft geen JS te renderen om content te zien | ❌ React SPA, client-side rendered |

---

## 6. Content Gap Analyse

### Wat we missen — per zoekintentie

**Informational (mensen die willen LEREN):**
- ❌ "Wat is het slow carb dieet?" — pillar page
- ❌ "Slow carb regels" — nu alleen op landing page, niet apart indexeerbaar
- ❌ "Slow carb vs keto" — vergelijkingspagina
- ❌ "Cheatday uitleg" — waarom het werkt, wetenschappelijk
- ❌ "Afvallen met peulvruchten" — uniek voor slow carb

**Commercial Investigation (mensen die VERGELIJKEN):**
- ❌ "Slow carb app" — wij ZIJN dit, maar Google weet het niet
- ❌ "Dieet apps vergeleken" — vergelijkingspagina
- ❌ "SlowCarb vs Noom" / "SlowCarb vs WeightWatchers" — staat op landing page maar niet indexeerbaar

**Transactional (mensen die willen KOPEN):**
- ⚠️ Landing page is commercieel maar niet vindbaar

### Content die we SNEL kunnen publiceren (bestaand materiaal)

| Content | Bron | Format | Geschatte SEO-impact | Effort |
|---------|------|--------|---------------------|--------|
| 10-15 recepten publiek maken | 50+ recepten in app | Individuele pagina's met Recipe schema | 🟢 HOOG — elk recept = een Google-ingang | Medium (routing + schema) |
| "Wat is Slow Carb?" pillar page | 5.000-woorden briefing + landing page content | Blog/gids, 2.000+ woorden | 🟢 HOOG — pakt de #1 keyword | Laag (herschrijven bestaand) |
| 84-dagen educatie als blog posts | 84 science cards in app | 10-15 gebundelde artikelen | 🟡 MEDIUM — long-tail keywords | Medium (content herstructureren) |
| FAQ als aparte pagina | 6 FAQ's op landing page | FAQ pagina met schema | 🟡 MEDIUM — featured snippets | Laag (copy-paste + schema) |
| Jesper's verhaal als blog post | "Mijn verhaal" sectie | Auteur/oprichter pagina | 🟡 MEDIUM — E-E-A-T signaal | Laag |

---

## 7. Prioritized Action Plan

### WEEK 1: Technische basis (Kritiek — zonder dit werkt niets)

| # | Taak | Wie | Tijd | Impact |
|---|------|-----|------|--------|
| 1 | **Google Search Console aanmelden** en eigendom verifiëren | Jesper | 15 min | Kritiek — zonder dit geen indexatie-data |
| 2 | **Sitemap.xml genereren** — Vite plugin (vite-plugin-sitemap) of handmatig XML | Developer/AI | 1 uur | Kritiek — Google moet weten welke pagina's bestaan |
| 3 | **robots.txt aanmaken** — `Allow: /` + `Sitemap: https://eatslowcarb.com/sitemap.xml` | Developer/AI | 15 min | Kritiek |
| 4 | **Canonical URL toevoegen** — `<link rel="canonical" href="https://eatslowcarb.com/">` | Developer/AI | 15 min | Kritiek |
| 5 | **H1 typefout fixen** — "8 tot 10kilo in6 weken." → spaties | Developer/AI | 5 min | Laag maar zichtbaar |
| 6 | **Pre-rendering onderzoeken** — `vite-plugin-ssr`, `react-snap`, of Vercel ISR. Doel: HTML output die Google direct kan lezen | Developer | 2-4 uur research | Hoog — lost het SPA-crawl probleem op |
| 7 | **URL structuur fixen** — root `/` moet de landing page serveren, niet redirect naar `/landing.html` | Developer | 1 uur | Medium |

### WEEK 2: Structured Data + On-Page

| # | Taak | Wie | Tijd | Impact |
|---|------|-----|------|--------|
| 8 | **FAQPage schema toevoegen** — 6 bestaande FAQ's als JSON-LD | Developer/AI | 1 uur | Hoog — direct rich snippets |
| 9 | **WebApplication schema fixen** — controleer of JSON-LD correct rendert in HTML source (niet alleen na JS) | Developer | 30 min | Medium |
| 10 | **Person schema voor Jesper** — naam, rol, afbeelding, credentials (ex-militair, oprichter) | Developer/AI | 30 min | Medium — E-E-A-T signaal |
| 11 | **Title tag optimaliseren** — kort naar ≤60 chars: "SlowCarb Protocol – Val 8-10 kg af in 6 weken" | Developer/AI | 5 min | Laag |
| 12 | **Meta robots tag toevoegen** — `<meta name="robots" content="index, follow">` | Developer/AI | 5 min | Laag |
| 13 | **Indexatie aanvragen** via Google Search Console → URL inspection → Request indexing | Jesper | 10 min | Kritiek — trigger eerste crawl |

### WEEK 3: Content publiceren (de grote impact-week)

| # | Taak | Wie | Tijd | Impact |
|---|------|-----|------|--------|
| 14 | **Pillar page schrijven: "Slow Carb Dieet: De Complete Gids"** — 2.000+ woorden, H2-structuur, target keyword "slow carb dieet" | AI + Jesper review | 3-4 uur | 🟢 HOOG — pakt de #1 niche keyword |
| 15 | **10 recepten publiek maken** — individuele URL's (`/recepten/chili-con-carne`), Recipe schema per recept | Developer | 4-6 uur | 🟢 HOOG — 10 nieuwe Google-ingangen |
| 16 | **Vergelijkingspagina: "Slow Carb vs Keto"** — 1.500+ woorden | AI + Jesper review | 2 uur | 🟡 MEDIUM — veel gezocht, lage concurrentie |
| 17 | **"Over Jesper" pagina** — oprichtersverhaal, foto, credentials, link naar landing | AI + Jesper review | 1 uur | 🟡 MEDIUM — E-E-A-T |

### WEEK 4: Meting + Iteratie

| # | Taak | Wie | Tijd | Impact |
|---|------|-----|------|--------|
| 18 | **Google Search Console data checken** — is de site geïndexeerd? Welke pagina's? Errors? | Jesper | 30 min | Kritiek — baseline |
| 19 | **Indexatie status per pagina** — alle nieuwe pagina's via URL Inspection checken | Jesper | 30 min | Medium |
| 20 | **Tweede batch content plannen** — "Tim Ferriss dieet NL", "Cheatday uitleg", "Afvallen zonder calorieën tellen" | Jesper + AI | 1 uur planning | Hoog — volgende content golf |
| 21 | **Interne links toevoegen** — landing page → pillar page → recepten → vergelijkingspagina's | Developer | 1 uur | Hoog — link equity verspreiden |

---

## Quick Wins (deze week, <2 uur per stuk)

1. Google Search Console aanmelden (15 min)
2. robots.txt + sitemap.xml toevoegen (1 uur)
3. Canonical URL toevoegen (15 min)
4. H1 typefout fixen (5 min)
5. FAQPage JSON-LD schema toevoegen (1 uur)
6. Title tag inkorten (5 min)
7. Indexatie aanvragen in GSC (10 min)

## Strategische Investeringen (dit kwartaal)

1. Pre-rendering / SSR oplossing voor React SPA
2. Publieke receptpagina's met Recipe schema (10-15 recepten)
3. Pillar page "Slow Carb Dieet" (2.000+ woorden)
4. Content hub bouwen: 5-10 blog posts rondom slow carb keywords
5. Backlink acquisitie: gastbijdragen op gezondheidsblogs, Ralph Moorman contacten
6. Vergelijkingspagina's: slow carb vs keto, vs IF, vs WW

---

## Wat dit NIET is

- Dit rapport bevat geen exacte zoekvolumes (daarvoor heb je Ahrefs/Semrush nodig — overweeg de gratis tiers)
- De "difficulty" schattingen zijn gebaseerd op observatie van wat er rankt, niet op tool-data
- Backlink analyse is beperkt tot wat publiek zichtbaar is

## Aanbevolen gratis tools

- **Google Search Console** — indexatie, impressies, clicks, errors (GRATIS, verplicht)
- **Google PageSpeed Insights** — Core Web Vitals check
- **Schema.org Markup Validator** — structured data testen
- **Ahrefs Webmaster Tools** — gratis backlink check voor eigen site
- **AnswerThePublic** — keyword ideeën (beperkt gratis)

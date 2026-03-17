# SlowCarb SEO Audit & Optimization Prompt

> **Gebouwd met:** Prompt Architect (Path C — extract methodology from source + Path D — reverse-engineer what ranks)
> **Bron:** 7-staps SEO competitor analysis framework (Sarvesh Shrivastava), vertaald van lokale/GBP SEO naar website SEO voor online producten.
> **Doel:** eatslowcarb.com 100% SEO-ready maken

---

## Het Prompt (kopieer dit in een nieuwe chat)

```
Je bent een technisch SEO-specialist en content strateeg voor niche health/diet websites. Je werkt voor SlowCarb (eatslowcarb.com) — een PWA die het Slow-Carb protocol van Tim Ferriss vertaalt naar een dagelijkse tool met maaltijd-tracking, recepten, boodschappenlijst en 84-dagen fysiologie-educatie.

Je taak: een complete SEO audit en optimalisatieplan maken in 7 stappen. Je voert elke stap uit, deelt je bevindingen, en gaat pas door naar de volgende stap na bevestiging.

---

## CONTEXT (pre-filled — niet opnieuw vragen)

**Website:** https://eatslowcarb.com
**Type:** PWA (Progressive Web App), React 19 + Vite, deployed op Vercel
**Markt:** Nederlands (NL) — Engelstalige markt is bewust geparkeerd
**Status:** Live, 4 betalende klanten, €47 eenmalig (lifetime)
**Huidige SEO:** Geen blog, geen structured data, geen sitemap optimalisatie, organisch verkeer ≈ 0
**Tech stack:** React SPA (client-side rendered), Vercel hosting, geen SSR/SSG
**Doelgroep:** Nederlanders (25-50) die willen afvallen zonder calorieën tellen, ADHD-ers die structuur nodig hebben, meal preppers
**USP:** Enige Nederlandstalige slow-carb app. Persoonlijk verhaal (ex-militair, 30kg afgevallen, vader drieling). Geen abonnement — lifetime toegang.
**Concurrenten om te analyseren:**
  - Competitor 1: noom.com (groot, maar referentiekader voor diet-app SEO)
  - Competitor 2: fitguide.nl of soortgelijke NL dieet-tool
  - Competitor 3: slowcarb.com of 4hourlife.com (EN slow-carb niche)
  - Competitor 4: voedingscentrum.nl (autoriteit, organische benchmark)

**Belangrijke keywords om te onderzoeken:**
  - "slow carb dieet"
  - "afvallen zonder calorieën tellen"
  - "slow carb recepten"
  - "slow carb boodschappenlijst"
  - "tim ferriss dieet nederland"
  - "afvallen met peulvruchten"
  - "dieet app nederland"
  - "meal prep afvallen"

---

## STAP 1: EIGEN WEBSITE AUDIT

Open https://eatslowcarb.com en analyseer:

1. **Technische SEO basis:**
   - Is er een sitemap.xml? robots.txt?
   - Laadt de content server-side of client-side? (React SPA = probleem voor crawlers)
   - Meta titles en descriptions per pagina
   - Open Graph / social sharing tags
   - Canonical URLs
   - Mobile-friendliness (het IS een PWA, maar check rendering)
   - Core Web Vitals inschatting (LCP, CLS, FID)
   - HTTPS status
   - Structured data (Schema.org) — verwacht: afwezig

2. **Content inventaris:**
   - Welke pagina's zijn indexeerbaar?
   - Is er een blog/content sectie? (verwacht: nee)
   - Hoeveel unieke, crawlbare tekst staat er op de landing page?
   - Zijn recepten indexeerbaar of zitten ze achter auth?

3. **Huidige ranking positie:**
   - Check de bovengenoemde keywords — rankt eatslowcarb.com ergens?

**Output:** Tabel met findings per categorie. Rood/oranje/groen status per item.

Deel je bevindingen. Ik bevestig voor we doorgaan naar Stap 2.

---

## STAP 2: COMPETITOR ANALYSE — WAT RANKT ER WEL

Analyseer de top 3-5 websites die WEL ranken voor onze target keywords. Per competitor:

1. **Domein autoriteit & backlink profiel** (inschatting)
2. **Content strategie:**
   - Welk type content rankt? (blog posts, tool pages, recepten, how-to's)
   - Hoeveel content pagina's hebben ze?
   - Gemiddelde woordlengte van rankende pagina's
3. **On-page SEO:**
   - Title tag patronen
   - Header structuur (H1, H2, H3)
   - Internal linking strategie
   - Structured data gebruik (Recipe schema, FAQ schema, HowTo schema)
4. **Technisch:**
   - SSR/SSG of client-side?
   - Laadsnelheid
   - Mobile UX
5. **Trust signals:**
   - Auteur bio's, credentials
   - Testimonials/reviews
   - Externe mentions/backlinks

**Output:** Vergelijkingstabel: SlowCarb vs. elke competitor. Highlight waar wij gaten hebben.

---

## STAP 3: RANKING LEVERS IDENTIFICEREN

Gebaseerd ALLEEN op wat je observeert bij de top-rankende competitors:

**Lijst de top 7 ranking levers die Google beloont voor onze target keywords.**
Rangschik van hoogste naar laagste impact.

Per lever:
| Lever | Bewijs van competitors | Waarom het werkt voor dit keyword | SlowCarb status |
|-------|----------------------|-----------------------------------|-----------------|

**Regels:**
- Geen generiek SEO-advies
- Alleen patronen die je ZIET bij de competitors die daadwerkelijk ranken
- Specifiek voor de Nederlandse markt waar relevant

---

## STAP 4: CONTENT GAP ANALYSE

Vergelijk de content die WEL rankt met wat SlowCarb heeft:

1. **Welke zoekintentie-clusters missen we volledig?**
   - Informational: "wat is slow carb", "slow carb regels", "slow carb vs keto"
   - Transactional: "slow carb app kopen", "meal planning tool"
   - Navigational: "tim ferriss dieet"

2. **Welke content formats missen we?**
   - Blog posts / artikelen
   - Receptpagina's (publiek indexeerbaar, niet achter auth)
   - FAQ pagina
   - Vergelijkingspagina's (slow carb vs keto, vs intermittent fasting)
   - Tool/calculator pagina's

3. **Quick wins:** Content die we SNEL kunnen maken met bestaande kennis
   (we hebben een 5.000-woorden slow carb briefing + 84 dagen fysiologie content + 50+ recepten)

**Output:** Geprioriteerde content roadmap — wat eerst, wat later, geschatte impact.

---

## STAP 5: TECHNISCHE SEO FIXES

Geef een concrete lijst van technische fixes, gerangschikt op impact:

1. **Kritiek (moet eerst):**
   - SSR/SSG oplossing voor React SPA (Vercel pre-rendering? Next.js migratie? react-snap?)
   - Sitemap.xml generatie
   - robots.txt optimalisatie
   - Meta tags per pagina

2. **Belangrijk:**
   - Structured data implementatie (Recipe schema voor recepten, FAQ schema, WebApplication schema)
   - Open Graph tags
   - Canonical URLs
   - Hreflang tags (voor toekomstige EN versie)

3. **Nice to have:**
   - JSON-LD breadcrumbs
   - Pagespeed optimalisatie
   - Image alt-text audit

**Output:** Checklist met geschatte implementatietijd per item.

---

## STAP 6: ON-PAGE OPTIMALISATIE PLAN

Voor de landing page (eatslowcarb.com) en elke nieuwe content pagina:

1. **Landing page herschrijving voor SEO:**
   - Optimale title tag (met primary keyword)
   - Meta description (met CTA)
   - H1 optimalisatie (huidige H1 vs. SEO-optimale H1)
   - Alt-text voor alle afbeeldingen
   - Internal links naar toekomstige content pagina's

2. **Receptpagina SEO template:**
   - URL structuur: /recepten/[slug]
   - Recipe Schema markup
   - Verplichte elementen per recept (prep time, cook time, ingredients, instructions, nutrition)
   - Internal linking naar gerelateerde recepten

3. **Blog post SEO template:**
   - URL structuur: /blog/[slug]
   - Verplichte on-page elementen
   - Ideale woordlengte voor onze niche
   - CTA placement strategie (blog → app conversie)

**Output:** Templates die we direct kunnen gebruiken.

---

## STAP 7: 30-DAGEN SEO ACTIEPLAN

Maak een concreet actieplan voor de eerste 30 dagen:

**Week 1: Technische basis**
- [ ] Specifieke technische fixes
- [ ] Geschatte uren per taak

**Week 2: On-page + Structured Data**
- [ ] Landing page optimalisatie
- [ ] Schema markup implementatie

**Week 3: Content productie**
- [ ] Eerste 3-5 content pagina's (welke, waarom)
- [ ] Receptpagina's publiek maken

**Week 4: Meting + iteratie**
- [ ] Google Search Console setup/check
- [ ] Baseline meting instellen
- [ ] Eerste indexatie check

**Per taak:** wie doet het (Jesper zelf / developer / AI-assisted), geschatte tijd, verwachte impact.

---

## REGELS VOOR DIT HELE PROCES

1. **Nederlands eerst.** Alle content suggesties in het Nederlands. Engelse markt is geparkeerd.
2. **Geen generiek advies.** Alles moet gebaseerd zijn op wat je OBSERVEERT, niet op "best practices" uit een SEO-handboek.
3. **Respecteer de tech stack.** We zitten op React + Vite + Vercel. Suggesties moeten haalbaar zijn zonder volledige rewrite (tenzij de ROI dat rechtvaardigt — onderbouw dan waarom).
4. **Budget = laag.** Jesper is solo-ondernemer. Prioriteer gratis/goedkope oplossingen. Geen "investeer in Ahrefs enterprise" suggesties.
5. **Bestaande content hergebruiken.** We hebben 50+ recepten, 84 dagen educatie-content, en een 5.000-woorden briefing. Zeg welke content we PUBLIEK kunnen maken voor SEO.
6. **Geen placeholder testimonials.** De huidige testimonials zijn nep — nooit refereren als bewijs. Suggereer hoe we echte social proof kunnen opbouwen.
7. **Fasering respecteren.** Geen Meta ads, geen TikTok, geen Engelse markt suggesties.
```

---

## Hoe te gebruiken

1. **Open een nieuwe chat** (Claude, ChatGPT, of welke AI dan ook met web-browse capability)
2. **Plak het volledige prompt** hierboven
3. **De AI voert Stap 1 uit** en deelt bevindingen
4. **Jij bevestigt** (of vraagt om verdieping) voordat de volgende stap start
5. **Na alle 7 stappen:** je hebt een complete SEO audit + 30-dagen actieplan

## Waarom dit werkt

Het originele Twitter-prompt was gebouwd voor **lokale SEO** (Google Business Profile — fysieke winkels, kaartweergave, reviews). Dat is niet relevant voor SlowCarb.

Dit prompt vertaalt dezelfde methodologie naar **website SEO voor online producten:**

| Origineel (lokaal) | SlowCarb versie (online) |
|---|---|
| Google Business Profile analyse | Technische website audit |
| Map ranking levers | Organische ranking levers |
| GBP posts & foto strategie | Content & blog strategie |
| Review analyse | Social proof & trust signals |
| Proximity als factor | Domain authority & content depth |
| Competitor GBP vergelijking | Competitor content gap analyse |
| GBP posting plan | 30-dagen content + tech roadmap |

## Verwacht resultaat

Na het doorlopen van alle 7 stappen heb je:
- Technische SEO checklist (wat is kapot, wat mist)
- Competitor landschap in kaart
- Top ranking levers voor jouw niche
- Content roadmap geprioriteerd op impact
- On-page templates voor recepten + blog
- 30-dagen actieplan met concrete taken

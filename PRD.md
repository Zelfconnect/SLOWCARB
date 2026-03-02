# PRD: SlowCarb Website v3 — Noom-Style Redesign

## Status: DRAFT — Wacht op Jesper review + GO
## Priority: P1
## Assigned: Codex (na GO)

---

## Doel
Rebuild van `LandingPageFinal.tsx` met een Noom-geïnspireerd design system. Geen content wijzigingen — alleen structuur, spacing, en visuele laag. Copy 3.2 blijft 100% verbatim.

## Waarom
Huidige pagina heeft te veel losse witte kaarten achter elkaar → voelt als eindeloos scrollen. Noom's architectuur lost dit op met kleurvlak-afwisseling, meer whitespace, en 1 idee per viewport.

## Scope

### WEL
- Volledige visuele rebuild van `LandingPageFinal.tsx`
- Implementatie van het design system JSON (zie hieronder)
- Sectie-afwisseling met achtergrondkleuren (#FFFFFF / #F8FAFC / #F0FAF5)
- Grotere spacing tussen secties (60px)
- Phone mockup sectie met cascade/overlap layout
- CTA herhaling na elke grote sectie
- Floating mobile CTA (behouden, restylen)
- Responsive: mobile-first (375-428px), desktop graceful

### NIET
- Copy wijzigen (Copy 3.2 uit nl.json is heilig)
- Nieuwe i18n keys toevoegen
- Functionaliteit wijzigen (auth flow, routing, etc.)
- Foto's van Jesper toevoegen (die komen later — placeholder behouden)
- Phone mockup afbeeldingen genereren (komen apart)

## Design System (exacte spec)

```json
{
  "global": {
    "maxWidth": "428px",
    "containerPaddingX": "20px",
    "background": "#FFFFFF",
    "sectionAlternate": "#F8FAFC",
    "border": "#E5E7EB",
    "softShadow": "0 10px 30px -10px rgba(0,0,0,0.08)",
    "mockupShadow": "0 25px 50px -12px rgb(0 0 0 / 0.25)"
  },
  "colors": {
    "primaryGreen": "#1A9A5B",
    "accentGreen": "#00C2A0",
    "textPrimary": "#1F2937",
    "textSecondary": "#4B5563",
    "textLight": "#6B7280",
    "success": "#10B981",
    "lightGreenBg": "#F0FAF5"
  },
  "typography": {
    "fontStack": "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    "h1": { "size": "34px", "weight": "700", "lineHeight": "1.15", "letterSpacing": "-0.02em" },
    "h2": { "size": "26px", "weight": "700", "lineHeight": "1.25" },
    "subheadline": { "size": "21px", "weight": "500", "lineHeight": "1.35" },
    "body": { "size": "17px", "weight": "400", "lineHeight": "1.65" },
    "small": { "size": "15px", "weight": "400", "lineHeight": "1.5" },
    "button": { "size": "18px", "weight": "600", "letterSpacing": "0.01em" }
  },
  "spacing": {
    "sectionY": "60px",
    "sectionTightY": "40px",
    "blockGap": "32px",
    "elementGap": "20px",
    "listItemGap": "24px"
  },
  "components": {
    "primaryButton": {
      "bg": "#1A9A5B",
      "text": "#FFFFFF",
      "radius": "12px",
      "height": "58px",
      "fullWidth": true,
      "shadow": "0 4px 14px 0 rgba(26,154,91,0.3)"
    },
    "ruleCard": {
      "bg": "#FFFFFF",
      "radius": "16px",
      "padding": "24px",
      "border": "1px solid #F1F3F5",
      "checkColor": "#1A9A5B"
    },
    "quoteBox": {
      "borderLeft": "4px solid #1A9A5B",
      "bg": "#F8FAFC",
      "padding": "24px"
    }
  }
}
```

## Paginastructuur (sectievolgorde)

| # | Sectie | Achtergrond | Hoogte | Key Elements |
|---|--------|-------------|--------|-------------|
| 1 | **Hero** | #FFFFFF | ~75vh | H1 (34px bold), subheadline, primaryButton, hero image onder CTA |
| 2 | **Pain Points** | #F8FAFC | auto | "Herken je dit?" — korte statements met 48px icons, links uitgelijnd |
| 3 | **Regels** | #FFFFFF | auto | "De 5 simpele regels" — genummerde witte cards met groen vinkje, cheatday aparte green-bordered box |
| 4 | **Wat je krijgt** | #F8FAFC | auto | "Dit is het programma dat je écht krijgt" — phone mockup cascade (5 stacked, overlapping) |
| 5 | **KISS** | #F0FAF5 | auto | "Het is zó simpel" — centered bold statement + 3 horizontale icons |
| 6 | **Mijn verhaal** | #FFFFFF | auto | Before/after + quote box (placeholder tot foto's er zijn) |
| 7 | **Pricing/Offer** | #F8FAFC | auto | Doorgestreepte €247, grote €47 groen, rode schaarste badge, groen-check bullets |
| 8 | **Testimonials** | #FFFFFF | auto | Full-width quote cards |
| 9 | **Garantie** | #F0FAF5 | auto | Groot groen vinkje + tekst |
| 10 | **Final CTA** | #FFFFFF | auto | Herhaal hero H1 formaat + grote primaryButton |
| 11 | **Footer** | #1F2937 | auto | Badges, links, copyright |

### CTA Herhaling
Na secties 2, 3, 5, en 7 → herhaal primaryButton met `ctaPrimary` tekst.

## Technische Details

### Bestaand
- **File:** `src/components/LandingPageFinal.tsx` (923 regels)
- **Stack:** React + Vite + Tailwind + shadcn
- **i18n:** `src/i18n/nl.json` → alle copy onder `landing.*`
- **Images:** `public/images/landing/` (HERO.webp, CHEATDAY.webp, etc.)
- **Componenten:** shadcn Button component beschikbaar

### Aanpak
1. Rebuild `LandingPageFinal.tsx` — mag volledig herschreven worden
2. Behoud alle imports uit nl.json (geen keys toevoegen/wijzigen)
3. Behoud `useSectionReveal` animatie (intersection observer)
4. Behoud `FloatingMobileCTA` component (restyle met nieuwe design system)
5. Tailwind custom values voor spacing/kleuren — gebruik inline styles of `style={}` waar Tailwind niet matcht

### Font wijziging
- **Verwijder:** Fraunces serif (hero) + Source Sans 3
- **Vervang door:** System font stack (zie design system)
- Check `index.css` en `index.html` voor Google Fonts imports → verwijder

## Context (NIET bouwen — info only, geen taken)
Jesper levert later foto's en mockup screenshots. Codex plaatst placeholders:
- Mijn verhaal sectie: grijs placeholder blok (aspect-ratio 4:3) met tekst Foto komt hier
- Phone mockups: 5 placeholder iPhone frames met grijs scherm en label per scherm (Dashboard, Recepten, Boodschappenlijst, Voortgang, Onboarding)

## Definition of Done
1. `LandingPageFinal.tsx` volledig rebuilt met design system
2. Kleurvlak-afwisseling zichtbaar (niet alles wit)
3. CTA herhaald op 4+ plekken
4. Spacing conform design system (60px secties, 32px blokken)
5. System fonts geladen (geen Google Fonts)
6. Bestaande i18n keys ongewijzigd
7. Visual QA score ≥ 7
8. Builds zonder errors (`npm run build`)

## Risico's
- Phone mockup cascade is visueel complex — kan meerdere iteraties kosten
- Design system wijkt af van bestaand Tailwind theme → kan conflicten geven met shadcn defaults

# PRD: Phase 0 — Trust & Legal Pages

> Voeg privacy, terms en refund pagina's toe + trust bar boven de fold. Fix de 404's en maak de site EU-compliant.

---

## Context

**Waarom bouwen we dit?**
De landing page heeft geen /privacy-policy, /terms-of-service of /refund-policy — alle drie 404. EU-bezoekers bouncen, Stripe kan chargebacks weigeren, en het oogt onbetrouwbaar.

**Huidige situatie:**
- `/privacy-policy` → 404
- `/terms-of-service` → 404  
- `/refund-policy` → 404
- Geen trust bar op de landing page
- Footer linkt nergens naar legal pages

---

## Scope

### ✅ In scope
- Drie statische legal pages: Privacy Policy, Terms of Service, Refund Policy
- Client-side routing (React Router) voor deze pagina's
- Trust bar boven de fold op de landing page
- Footer met links naar alle drie pagina's
- Nederlandse tekst (de site is NL)

### ❌ Out of scope
- Cookie consent banner (later)
- GDPR data deletion flow (later)
- Contact formulier (later)
- Blog/SEO pagina's (Phase 4)

---

## Tasks

> **Instructie voor agent:** Werk taken sequentieel af. Check box pas als taak volledig klaar is. Dit is een React + Vite + React Router project. De app zit in `src/`, de landing page component is `src/components/LandingPageFinal.tsx`. Routing zit in `src/App.tsx`.

- [x] **Route setup:** Voeg routes toe in `src/App.tsx` voor `/privacy-policy`, `/terms-of-service`, en `/refund-policy`. Gebruik lazy loading.
- [x] **Privacy Policy pagina:** Maak `src/components/legal/PrivacyPolicy.tsx`. Nederlandse tekst. Bevat: welke data we verzamelen (naam, email, gewicht via onboarding), Stripe betalingsverwerking, geen cookies tracking, geen data verkoop, contact email. Gebruik dezelfde styling als de rest van de app (Tailwind, stone/sage kleuren).
- [x] **Terms of Service pagina:** Maak `src/components/legal/TermsOfService.tsx`. Nederlandse tekst. Bevat: wat het product is (PWA web-app, lifetime access), eenmalige betaling, intellectueel eigendom, aansprakelijkheid (geen medisch advies), beëindiging.
- [x] **Refund Policy pagina:** Maak `src/components/legal/RefundPolicy.tsx`. Nederlandse tekst. Bevat: 30 dagen geld-terug garantie, geen vragen, hoe aan te vragen (email), verwerkingstijd 5-7 werkdagen.
- [x] **Trust bar:** Voeg een trust bar toe aan `LandingPageFinal.tsx`, direct onder de hero sectie (boven de pain points). Tekst: "Veilig afrekenen • 30 dagen geld-terug • EU-conform • Direct toegang". Subtiel, niet schreeuwerig. Gebruik sage/stone kleuren, kleine iconen (Shield, RefreshCw, Globe, Zap uit lucide-react).
- [x] **Footer update:** Voeg links naar de drie legal pagina's toe in de footer van `LandingPageFinal.tsx`. Plus "© 2026 SlowCarb" en een contact email link.
- [x] **Navigation:** Elke legal pagina heeft een "← Terug naar home" link bovenaan.

---

## Acceptance Criteria

> **Alle criteria moeten ✅ zijn voordat PRD als "done" geldt.**

- [x] `npm run build` slaagt zonder errors
- [x] `npx tsc --noEmit` — geen TypeScript errors
- [x] `/privacy-policy` laadt correct (geen 404)
- [x] `/terms-of-service` laadt correct (geen 404)
- [x] `/refund-policy` laadt correct (geen 404)
- [x] Trust bar is zichtbaar op de landing page
- [x] Footer bevat links naar alle drie pagina's
- [x] Alle tekst is in het Nederlands

---

## Technical Notes

**Stack:** React + Vite + Tailwind + React Router (al geconfigureerd)

**Key files:**
- `src/App.tsx` — routing
- `src/components/LandingPageFinal.tsx` — landing page (trust bar + footer)
- `src/components/legal/` — nieuwe directory voor legal pagina's

**Dependencies:** Geen nieuwe packages nodig. Lucide-react icons zijn al geïnstalleerd.

**Styling:** Gebruik dezelfde design tokens als de rest:
- `font-display` voor headings
- `text-stone-800` voor body text
- `bg-white` achtergrond
- `max-w-3xl mx-auto` voor content width
- `px-6 py-12` voor padding

**Gotchas:**
- De app gebruikt `?app=1` parameter om te switchen tussen landing en app-modus. Legal pagina's moeten ALTIJD zichtbaar zijn, ongeacht de `?app=1` parameter.
- React Router is al geconfigureerd in App.tsx — voeg routes toe aan het bestaande systeem.
- De landing page heeft een sticky CTA bar onderaan (mobile). Legal pagina's hoeven die NIET te hebben.

---

## Completion Checklist

Voordat je "done" claimt:

- [x] Alle Tasks hierboven zijn ✅
- [x] Alle Acceptance Criteria zijn ✅
- [x] Code is gecommit naar feature branch `feat/phase0-trust`
- [x] Geen `// TODO` of `any` types achtergelaten
- [x] Console.logs verwijderd

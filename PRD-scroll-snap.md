# PRD: Scroll Snap voor Landing Page

## Doel
Implementeer CSS scroll snap zodat gebruikers bij het snel scrollen altijd netjes op een sectie landen, niet halverwege.

## Context & Diagnose
- De landing page scrollt via window/document (niet via een inner div)
- useDocumentScroll hook zet body.style.overflow = auto en body.style.height = auto via inline styles
- Browser test toonde: htmlScrollTop verandert bij scrollen, NIET bodyScrollTop
- Conclusie: html element is de scroll container voor de viewport
- Eerdere poging mislukte omdat: wrapper divs om components de hero (absolute inset-0) kapotmaakten

## Vereisten

### 1. Geen wrapper divs
Voeg GEEN extra div-elementen toe rondom de bestaande components in LandingPage.tsx.
De sectie-elementen (section, div) in de losse component bestanden moeten de snap targets zijn.

### 2. Scroll snap via CSS op html
Zet scroll-snap-type op html element:
  html:has(.landing-page) { scroll-snap-type: y mandatory; scroll-behavior: smooth; }

### 3. Snap alignment op de sectie-elementen zelf
Voeg scroll-snap-align: start toe via CSS selectors die de bestaande section/div elementen targeten.
De secties in de landing page zijn:
  - .landing-hero-shell (de outer section in LandingHero)
  - .recognition-section
  - .solution-section
  - section#premium-app-showcase
  - section#method (RulesSection)
  - section#founder
  - section#pricing
  - section#faq
  - .final-cta-section

FAQ en final-cta NIET snappen (te lang/variabel).

### 4. Rules section: per-regel snap
In RulesSection heeft elke rules-stage div scroll-snap-align: start nodig.
Voeg toe via CSS: .landing-page .rules-stage { scroll-snap-align: start; scroll-snap-stop: always; min-height: 100vh; }
Verwijder display:flex NIET — de div heeft al grid via Tailwind className.

### 5. prefers-reduced-motion
Disable snap voor gebruikers met reduced motion:
  @media (prefers-reduced-motion: reduce) { html:has(.landing-page) { scroll-snap-type: none; scroll-behavior: auto; } }

## Bestanden om aan te raken
- src/styles/landing.css: voeg scroll snap CSS toe aan het einde
- src/components/landing/RulesSection.tsx: NIET aanraken (CSS selector doet het werk)
- src/components/landing/LandingPage.tsx: NIET aanraken
- Geen andere bestanden

## Verificatie
Na implementatie:
1. Run: npm run build
2. Controleer dat alle 59 tests nog slagen: npm test -- --run src/components/landing/__tests__/LandingPage.test.tsx
3. Als build en tests slagen: git add src/styles/landing.css && git commit -m "feat: scroll snap via CSS selectors on existing section elements" && git push origin main

## Klaar
Run: openclaw system event --text "Done: scroll snap geimplementeerd" --mode now

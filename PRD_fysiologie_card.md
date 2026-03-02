# PRD: FysiologieCard — Inline 84-dag progress op Dashboard

## Context
De 84-dag fysiologie feature (dayTips, weekTips, getCurrentPhase) is al gebouwd in `src/data/journey.ts` en `src/components/JourneyCard.tsx`. Maar de content is **onzichtbaar** op een actieve journey — de JourneyCard toont alleen pre-journey. Dashboard toont alleen dag/streak teller.

Doel: fysiologie content compact zichtbaar maken op het actieve dashboard.

## Tasks

- [x] Maak `src/components/TipDialog.tsx` — extract de bestaande Dialog JSX uit JourneyCard.tsx (de grote `showTipDialog` Dialog). Zelfde UI, zelfde props (`currentTip`, `progress`). Verwijder de dialog uit JourneyCard daarna (vervang met import van TipDialog).

- [x] Maak `src/components/FysiologieCard.tsx` — compact card met:
  - Fase badge: `🧬 Fase {n} — {currentPhase.title}` links, `Dag {progress.day}` rechts
  - Eerste zin van `currentTip.tip.metabolicState` afgekapt op 2 regels (`line-clamp-2`)
  - Knop: `Meer over dag {progress.day} →` — opent TipDialog
  - Toon component NIET als: `isCheatDay === true` OF `!currentTip?.tip`
  - Styling: `rounded-2xl border border-sage-100 bg-sage-50/60 p-4 shadow-soft`

- [x] Voeg FysiologieCard toe aan `src/components/Dashboard.tsx`:
  - Import FysiologieCard bovenaan
  - Plaats DIRECT na de `<DailyMealTracker ... />` (voor `<WeeklyProgressGrid />`)
  - Props meegeven: `currentTip`, `progress`, `isCheatDay`

- [x] Zorg dat `npm run build` slaagt (geen TypeScript errors)

- [x] Zorg dat bestaande tests nog groen zijn: `npm test -- --run`

## Done criteria
- FysiologieCard zichtbaar op dashboard als journey loopt en het geen cheat day is
- Tap op "Meer over dag X →" opent de volledige tip dialog
- Fase badge klopt met dag (getCurrentPhase wordt correct aangeroepen)
- Build groen, tests groen

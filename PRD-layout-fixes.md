# PRD: Layout Fixes Dashboard

## Bug 1: Avondeten card kleiner dan Ontbijt/Lunch
**Probleem:** In `DailyMealTracker.tsx` gebruiken de maaltijdkaarten een Carousel met `basis-[33.333%]` en `pl-1.5` gap. Door afrondingsfouten en de gap-berekening is de derde kaart (Avondeten) iets smaller.

**Fix:**
- [x] Vervang de Carousel door een simpel `flex` grid voor de 3 maaltijdkaarten — geen carousel nodig want er zijn altijd exact 3 kaarten
- [x] Gebruik `grid grid-cols-3 gap-1.5` of `flex gap-1.5` met `flex-1` per kaart
- [x] Zorg dat alle 3 kaarten exact gelijk van breedte zijn
- [x] Verwijder Carousel import als niet meer gebruikt

## Bug 2: Inhoud verdwijnt onder de menubalk (bottom overlap)
**Probleem:** `Dashboard.tsx` heeft `overflow-hidden` op de wrapper, waardoor de onderkant van de content (WeightProgressCard) achter de bottom nav balk verdwijnt.

**Fix:**
- [x] Verander `overflow-hidden` → `overflow-y-auto` op de Dashboard wrapper div (regel ~167)
- [x] Zorg dat `pb-0` voldoende ruimte laat — vergelijk met App.tsx die `pb-24`/`pb-28` gebruikt
- [x] Test: scroll naar beneden op het dashboard → WeightProgressCard volledig zichtbaar boven nav

## Done criteria
- [x] Alle 3 maaltijdkaarten exact gelijke breedte
- [x] WeightProgressCard volledig zichtbaar, niet achter nav
- [x] `npm run build` slaagt
- [x] Commit: "fix: meal cards equal width + dashboard bottom overflow"

# PRD: SlowCarb Dashboard Fixes

## Context
Impeccable design critique + Gemini QA uitgevoerd. Issues geprioriteerd voor launch.

## Tasks

### Fix 1: Pluralisatie "1 dagen" → "1 dag"
- [ ] Zoek alle strings die "dagen" gebruiken in de streak/protocol teller
- [ ] Fix pluralisatie logica: 1 dag, 2+ dagen
- [ ] Controleer ook: "1 weken" etc. dezelfde fix

### Fix 2: BREAKFAST / LUNCH / DINNER labels → Nederlands
- [ ] Verander "BREAKFAST" → "ONTBIJT", "LUNCH" → "LUNCH" (ok), "DINNER" → "DINER"
- [ ] Consistente Nederlandse labels op de maaltijdkaarten

### Fix 3: Gewichtssectie — verwijder duplicate info
- [ ] "Start 98.0 kg" staat 2x op het scherm — verwijder de herhaling
- [ ] "Resterend 8.0 kg" en "Nog 8.0 kg" zijn identiek — verwijder één
- [ ] Resultaat: clean gewichtssectie met huidig gewicht als held, één progressie-indicator

### Fix 4: Week cirkels — toekomstige dagen niet groen
- [ ] Zaterdag (za) staat groen maar is een toekomstige dag — dit verwarrt
- [ ] Logica: groen = voltooid (in het verleden), grijs = toekomst, groen gevuld ring = vandaag
- [ ] Controleer de hele week-component logica

## Done criteria
- Build slaagt (`npm run build`)
- Alle 4 fixes visueel geverifieerd
- Commit met message "fix: dashboard copy + week logic + weight dedup"

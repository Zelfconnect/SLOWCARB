# PRD: Logic & UI Fixes

## Tasks

### Fix 3: Gewichtssectie — verwijder duplicaat info
- [x] "Start 98.0 kg" staat 2x op het scherm → verwijder herhaling
- [x] "Resterend X kg" en "Nog X kg" zijn identiek → verwijder één
- [x] Resultaat: huidig gewicht als held, één progressie-indicator

### Fix 4: Week cirkels — toekomstige dagen niet groen
- [x] Zaterdag groen terwijl het toekomst is → fout
- [x] Logica: groen gevuld = voltooid (verleden), grijs = toekomst, huidige dag = aparte indicator
- [x] Controleer week-component logica volledig

## Done criteria
- `npm run build` slaagt
- Beide fixes gecommit: "fix: weight dedup + week logic"

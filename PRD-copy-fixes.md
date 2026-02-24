# PRD: Copy Fixes

## Tasks

### Fix 1: Pluralisatie "1 dagen" → "1 dag"
- [x] Zoek alle strings die "dagen" gebruiken in de streak/protocol teller
- [x] Fix pluralisatie logica: 1 dag, 2+ dagen
- [x] Check ook "weken" pluralisatie

### Fix 2: BREAKFAST / LUNCH / DINNER → Nederlands
- [x] "BREAKFAST" → "ONTBIJT"
- [x] "DINNER" → "DINER"  
- [x] "LUNCH" blijft "LUNCH"
- [x] Consistent Nederlandse labels op maaltijdkaarten

## Done criteria
- `npm run build` slaagt
- Beide fixes gecommit: "fix: copy nl + pluralisatie"

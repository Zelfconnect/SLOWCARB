# PRD: Flexible Cheat Day & Historical Logging (Backlog Logging)

## 1. Doel
Gebruikers meer controle geven over hun journey door:
1. Maaltijden van eerdere dagen (deze week) alsnog te kunnen loggen.
2. De Cheat Day van de huidige week flexibel te kunnen verschuiven (bijv. van zaterdag naar donderdag).

## 2. User Stories
- **Als gebruiker** wil ik op een dag in de weekkalender kunnen klikken om te zien wat ik die dag heb gegeten en dit aan te passen als ik het vergeten ben.
- **Als gebruiker** wil ik mijn cheat day voor deze week kunnen verzetten naar een andere dag zonder dat dit de rest van mijn journey verstoort.

## 3. Functionele Requirements

### 3.1 Interactieve Weekkalender (`WeeklyProgressGrid`)
- De cirkels/pillen in de `WeeklyProgressGrid` worden klikbaar (buttons).
- Alleen dagen in het verleden of de huidige dag zijn klikbaar (toekomstige dagen blijven disabled/read-only).
- Bij klik op een dag opent de **Log Dag Dialog**.

### 3.2 Log Dag Dialog (`BacklogLogDialog`)
- **Titel**: Toont de geselecteerde datum (bijv. "Woensdag 4 maart").
- **Content**: 
  - Drie toggles: Ontbijt, Lunch, Diner.
  - Een knop "Protocol Voltooid" (vinkt alle drie de maaltijden in één keer aan).
- **Actie**: Gebruikt `toggleMealForDate(date, meal)` om de data op te slaan in de `mealLog`.

### 3.3 Verschuifbare Cheat Day
- **UI**: Een "Wijzig" knop of icoon naast de tekst "Huidige week" in de `WeeklyProgressGrid`.
- **Actie**: Opent een kleine select-lijst (Select) met de 7 dagen van de week.
- **Logica**: Het updaten van de cheat day past `journey.cheatDay` aan in de `useUserStore` / `localStorage`.
- **Guardrail**: Optioneel een waarschuwing tonen als de gebruiker al een cheat day heeft gehad deze week.

## 4. Technische Implementatie
- **Componenten**:
  - `WeeklyProgressGrid.tsx`: Omzetten naar interactieve buttons + handler doorgeven.
  - `Dashboard.tsx`: State bijhouden voor `selectedBacklogDate` en de Dialog aansturen.
  - `CheatDayPicker`: Hergebruiken uit de onboarding of een compactere versie maken voor de Dashboard UI.
- **Hooks**:
  - `useJourney.ts` ondersteunt al `toggleMealForDate`, dus de core logica is aanwezig.

## 5. Design Guidelines (Calm Bold)
- Gebruik de bestaande `Dialog` en `Button` primitives uit de UI kit.
- De "Log Dag Dialog" moet simpel en mobielvriendelijk zijn.
- Feedback geven via de kalender grid (kleur verandert direct na opslaan).

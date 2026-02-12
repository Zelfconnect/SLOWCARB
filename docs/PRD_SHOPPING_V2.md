# PRD: Shopping V2 — Context-Aware Boodschappenlijst

## Problem Statement
De huidige shopping feature is vaag en onduidelijk:
1. **Onrealistische packages** — "3 eieren" bestaat niet in Nederlandse supermarkten
2. **Geen timing** — Wanneer koop je dit? Vandaag? Deze week?
3. **Verwarrende overlap** — Voorraad vs Boodschappen is onduidelijk
4. **Geen batch-logica** — Geen connectie met hoeveel keer je een recept eet

## Solution: Two Clear Lists

### 1. Weekboodschappen (Fresh Weekly)
- **Doel:** Verse ingrediënten voor deze week
- **Bevat:** Groente, vlees, zuivel — alles dat bederft
- **Logica:** Receptporties × geplande maaltijden = totaal nodig
- **Wanneer:** Koop op zaterdag/zondag voor meal prep

### 2. Voorraadkast (Pantry Staples)  
- **Doel:** Houdbare basis die je altijd in huis hebt
- **Bevat:** Blikken, droge producten, kruiden, olie
- **Logica:** Checklist "altijd in huis"
- **Wanneer:** Maandelijks aanvullen

## Technical Changes

### Phase 1: Fix Package Sizes (CRITICAL)
**File:** `src/data/packageSizes.ts`

Replace fantasy packages with real Dutch supermarket sizes:

```typescript
// BEFORE (fantasy)
'eieren': {
  packages: [
    { amount: 3, label: '3 stuks' },  // DOESN'T EXIST
    { amount: 6, label: '6 stuks' },
    { amount: 12, label: '12 stuks (dozijn)' },
  ]
}

// AFTER (real AH/Jumbo)
'eieren': {
  packages: [
    { amount: 6, label: '6 stuks (klein)' },
    { amount: 10, label: '10 stuks (standaard)' },
    { amount: 12, label: '12 stuks (dozijn)' },
    { amount: 20, label: '20 stuks (voordeelpak)' },
  ]
}
```

**Full realistic package updates:**
- Eieren: 6/10/12/20 stuks
- Gehakt: 300g/500g/750g/1kg
- Kipfilet: 300g/500g/1kg
- Spinazie vers: 150g/250g/400g zak
- Spinazie diepvries: 450g/750g
- Broccoli: 1 stuk (~400g) / 2 stuks
- Paprika: 3-pack / 6-pack
- Tomaten: 500g / 1kg
- Ui: 1kg net / 2kg net
- Zwarte bonen: 400g blik / 3-pack
- Tonijn: 145g blik / 4-pack

### Phase 2: Simplify UI Structure
**File:** `src/components/ShoppingListSection.tsx`

Remove category headers (eiwit/groente/pantry) from weekly list.
Replace with simple uncategorized list — users don't think in categories when shopping.

**New structure:**
```
┌─────────────────────────────┐
│ 🛒 Weekboodschappen         │
│ 12 items · voor 5 maaltijden│
├─────────────────────────────┤
│ □ 10 eieren                 │
│ □ 500g rundergehakt         │
│ □ 1kg kipfilet              │
│ □ 400g spinazie             │
│ ...                         │
└─────────────────────────────┘

┌─────────────────────────────┐
│ 🏠 Voorraadkast             │
│ Check wat je nodig hebt     │
├─────────────────────────────┤
│ ☑ Zwarte bonen              │
│ ☑ Tomatenblokjes            │
│ □ Olijfolie ← NODIG         │
│ ...                         │
└─────────────────────────────┘
```

### Phase 3: Add Meal Planning Context
**File:** `src/hooks/useShoppingList.ts`

Add `plannedMeals` to shopping calculation:

```typescript
interface WeekPlan {
  recipeId: string;
  recipeName: string;
  mealsPlanned: number;  // How many times this week
  portions: number;       // Serves X people
}

// Calculate total needed
function calculateIngredients(weekPlan: WeekPlan[]) {
  // For each recipe: ingredients × mealsPlanned × portions
  // Round up to nearest package size
}
```

### Phase 4: Smart Package Rounding
**File:** `src/data/packageSizes.ts`

Add helper function:

```typescript
function roundToPackage(ingredient: string, amountNeeded: number): PackageSize {
  const packages = getPackageSizes(ingredient);
  // Find smallest package that covers need
  // If need 8 eggs → suggest 10-pack
  // If need 650g gehakt → suggest 750g
}
```

## UI Copy Changes

**Current (vague):**
- "Boodschappenlijst" 
- "X items"
- "Ontbreekt in je voorraad"

**New (clear):**
- "Weekboodschappen" 
- "X items · voor Y maaltijden"
- "Voorraadkast · aanvullen"

## Files to Modify
1. `src/data/packageSizes.ts` — Realistic packages
2. `src/components/ShoppingListSection.tsx` — Simplified UI
3. `src/components/StockSection.tsx` — Rename to "Voorraadkast"
4. `src/hooks/useShoppingList.ts` — Meal planning logic
5. `src/components/BottomNav.tsx` — Update label if needed

## Success Criteria
- [ ] All package sizes match real Dutch supermarket offerings
- [ ] Clear visual separation between Weekly and Pantry
- [ ] Users understand WHY they're buying something (which meals)
- [ ] Smart rounding suggests appropriate package sizes
- [ ] No more "3 eieren" nonsense

## Out of Scope (V3)
- Supermarket API integration (AH/Jumbo)
- Price tracking
- Automatic reorder suggestions
- Recipe portion scaling UI

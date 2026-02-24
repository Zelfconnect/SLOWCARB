# PRD: Ingredient Scaling Bugs

## Bug 1: Fractions schalen niet correct
**Probleem:** `scaleAmount()` in RecipeDetailModal.tsx en RecipeDetail.tsx gebruikt regex `^(\d+(?:\.\d+)?)` die alleen integers en decimalen matcht. Breuken zoals `1/2` worden niet herkend.

**Resultaat:** "1/2 avocado" × 2 = "2/2 avocado" (fout) → moet "1 avocado" zijn.

**Fix:** Pas `scaleAmount()` aan in BEIDE componenten:
- [x] Detecteer breuken: `^(\d+\/\d+)` → parse als `teller/noemer`
- [x] Detecteer mixed numbers: `^(\d+)\s+(\d+\/\d+)` bijv. "1 1/2"
- [x] Na vermenigvuldiging: geef nette output terug (1.5 → "1 1/2", 1.0 → "1", 0.5 → "1/2", 0.25 → "1/4", 0.75 → "3/4")
- [x] Zet `scaleAmount` in een gedeeld util bestand `src/lib/scaleAmount.ts` (DRY — nu staat het 2x)

**Testcases:**
- "1/2" × 2 = "1"
- "1/2" × 4 = "2"
- "1/2" × 3 = "1 1/2"
- "1" × 2 = "2"
- "150" × 2 = "300"
- "1/4" × 4 = "1"

## Bug 2: "naar smaak" met hoeveelheid schalen niet
**Probleem:** `parseIngredient()` in recipeLoader.ts detecteert "naar smaak" en zet `scalable: false`. Maar ingrediënten als "naar smaak 150g kip" bevatten wél een hoeveelheid.

**Fix:**
- [x] Als ingredient de vorm heeft `naar smaak [hoeveelheid] [naam]` → extraheer de hoeveelheid, zet `scalable: true`
- [x] Voorbeeld: "naar smaak 150g kip" → `{ name: 'kip', amount: '150g', scalable: true }`
- [x] Pure "naar smaak" zonder hoeveelheid → blijft `scalable: false` (correct gedrag)

## Done criteria
- [x] Unit tests geschreven voor `scaleAmount` (alle testcases hierboven)
- [x] Unit tests voor `parseIngredient` met "naar smaak 150g" variant
- [x] `npm run build` slaagt
- [x] `npm test` slaagt
- [x] Commit: "fix: ingredient scaling — fractions + naar smaak met hoeveelheid"

# PRD: Color Harmony Fix

## Context
The app currently looks like a "kermis" (carnival) with competing colors. We need to apply the **calm-minimal strategy** while keeping the forest green brand identity.

## Color Strategy: Calm-Minimal

### The Rule
- **85%** of UI = neutrals (stone/warm)
- **10%** = surface contrast (white cards on grey bg)
- **5%** = accent color (sage green) for CTAs ONLY
- Semantic colors (red for delete) = muted, sparse

### Brand Color
- **Sage-600 (#3d623d)** = primary brand accent
- Use sage scale (50-900) for all green needs
- NO other accent colors competing

## Current Violations

| Location | Current | Problem |
|----------|---------|---------|
| Card backgrounds | `bg-amber-50`, `bg-amber-100` | Amber competes with green |
| Header/sections | Amber backgrounds | Should be stone/white |
| "Naar voorraad" button | `bg-amber-100` | Should be sage or neutral |
| Delete buttons | `bg-red-50` hover | OK for semantic, but could be more muted |
| Category tabs | Amber colors | Should be stone + sage active |

## Fixes Required

### 1. Replace Amber Backgrounds with Stone
```
bg-amber-50 → bg-stone-50 OR bg-warm-50
bg-amber-100 → bg-stone-100 OR bg-warm-100
bg-amber-200 → bg-stone-200 OR bg-warm-200
```

### 2. Replace Amber Text/Borders with Sage or Stone
```
text-amber-700 → text-stone-700 OR text-sage-700
text-amber-800 → text-stone-800
border-amber-100 → border-stone-200
border-amber-200 → border-stone-200
```

### 3. Action Buttons → Sage Accent
Buttons like "Naar voorraad" should use the brand color:
```
bg-amber-100 hover:bg-amber-200 text-amber-800
→ 
bg-sage-100 hover:bg-sage-200 text-sage-800
```

### 4. Keep Semantic Colors but Mute Them
Red for delete is fine, but ensure:
- Only on hover/interaction
- Not as card backgrounds
- Muted: `text-stone-400 hover:text-red-500` = ✅ (already correct)

### 5. Education Cards
ConceptCard, FAQCard, RuleCard currently use amber. Options:
- Use stone (neutral, content-focused)
- Use very subtle sage-50 (brand tint)
- Keep white with sage border/icon

## Files to Modify

1. `src/components/ShoppingListSection.tsx`
2. `src/components/StockSection.tsx`
3. `src/components/education/ConceptCard.tsx`
4. `src/components/education/FAQCard.tsx`
5. `src/components/education/RuleCard.tsx`
6. `src/components/RecipesList.tsx`
7. `src/components/primitives/Card.tsx`

## Validation

After changes:
1. **Kermis test:** No more than 2 hues visible (sage + semantic red)
2. **Neutral ratio:** 85%+ should be stone/white
3. **Brand consistency:** Sage green = only accent on CTAs
4. **Greyscale test:** Convert screenshot to greyscale, should still look designed

## DO NOT Change

- Emoji colors (they add warmth, that's fine)
- Red delete buttons hover state (semantic, correct)
- The sage color scale itself
- RecipeCard favorite heart (red is semantic for "love")

## Expected Result

Before: Carnival of amber + green + red
After: Calm stone/white base, sage green CTAs, red only for delete/favorite

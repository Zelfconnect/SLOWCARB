# PRD: Complete Emoji Elimination

**Date:** 2025-02-13  
**Assignee:** Codex  
**Reviewer:** Donny (Sonnet)  
**Status:** Ready for implementation  
**Parent:** PRD_ICON_MIGRATION.md (zone + food category icons done)

---

## Goal
Eliminate ALL remaining emoji from SlowCarb app for:
- Cross-platform visual consistency
- Professional appearance
- Design system compliance (Calm Bold aesthetic)
- Uniform Lucide icon usage throughout

---

## Scope

### 1. Recipe Emoji (src/data/recipes.ts)
Each recipe has decorative emoji — replace with Lucide icons based on ingredient/style.

**Current emoji → Lucide mapping:**
- 🍳 → `CookingPot`
- 🥣 → `Soup` (bowl icon)
- 🌶️ → `Flame` (represents spicy)
- 🥗 → `Salad` (already defined)
- 🐟 → `Fish` (already defined)
- 🔥 → `Flame`
- 🥚 → `Egg` (already defined)

**Files to modify:**
- `src/data/recipes.ts` — change `emoji: '🍳'` to `emoji: 'cooking-pot'` (string identifier)
- Recipe rendering components — map string → Lucide component

### 2. Meal Type Emoji (src/data/recipes.ts)
Meal time categories use emoji — replace with time-of-day icons.

**Current emoji → Lucide mapping:**
- 🌅 Ontbijt → `Sunrise`
- ☀️ Lunch → `Sun`
- 🌙 Avond → `Moon`
- 📦 Meal Prep → `Package` (already defined)
- 🔥 Airfryer → `Flame`
- 🥜 Snack → `Apple` (healthier snack icon than nut)

**Files to modify:**
- `src/data/recipes.ts` — `mealTypes` array
- Components that render meal type badges/chips

### 3. App Header Logo (src/App.tsx)
Line 137: `<span className="text-xl">🥗</span>` in app logo.

**Change:**
- Replace with `<Salad className="w-6 h-6 text-white" />` (or appropriate size for logo context)

### 4. DailyMealTracker (src/components/DailyMealTracker.tsx)
Line 51: `emoji: '🥗'` in meal config.

**Change:**
- Replace with icon identifier string (e.g., `icon: 'salad'`)
- Update rendering logic to use Lucide component

---

## Implementation Strategy

### Phase 1: Data Layer
1. Change `emoji` field to `icon` in recipes.ts (string identifiers)
2. Create icon mapping object (similar to existing food category maps)
3. Update meal type definitions

### Phase 2: Component Layer
1. Import new Lucide icons: `CookingPot`, `Soup`, `Flame`, `Sunrise`, `Sun`, `Moon`, `Apple`
2. Update recipe card rendering to use icon mapping
3. Update meal type chip/badge rendering
4. Update App.tsx header logo
5. Update DailyMealTracker meal config

### Phase 3: Styling
- Ensure all icons use consistent sizing (24px default, adjust per context)
- Color: stone-600 for neutral contexts, inherit/theme color for badges
- Verify alignment with adjacent text

---

## Icon Mapping Reference

```typescript
// Recipe icons
const RECIPE_ICONS = {
  'cooking-pot': CookingPot,
  'soup': Soup,
  'flame': Flame,
  'salad': Salad,
  'fish': Fish,
  'egg': Egg,
} as const;

// Meal type icons
const MEAL_TYPE_ICONS = {
  'sunrise': Sunrise,
  'sun': Sun,
  'moon': Moon,
  'package': Package,
  'flame': Flame,
  'apple': Apple,
} as const;
```

---

## Files to Modify

1. **src/data/recipes.ts**
   - Change recipe `emoji` to `icon` (string identifiers)
   - Change meal type `emoji` to `icon`

2. **src/App.tsx**
   - Line 137: Replace 🥗 with `<Salad />` component

3. **src/components/DailyMealTracker.tsx**
   - Line 51: Change `emoji: '🥗'` to `icon: 'salad'`
   - Update rendering logic for icon components

4. **Recipe rendering components** (wherever recipe.emoji is used)
   - Map icon string to Lucide component
   - Apply consistent styling

5. **Meal type rendering** (filter chips, badges)
   - Map icon string to Lucide component
   - Apply consistent styling

---

## Design Specs

- **Recipe card icons:** 24px (w-6 h-6), inherit color from context
- **Meal type badges:** 16px (w-4 h-4), theme color
- **App header logo:** 24px (w-6 h-6), white color
- **Stroke width:** Default (2px)

---

## Testing

### Visual Regression
- [ ] Recipe list shows icons (not emoji)
- [ ] Meal type filters show icons
- [ ] App header logo renders icon
- [ ] DailyMealTracker shows icons

### Functional
- [ ] Recipe filtering still works
- [ ] Meal type selection still works
- [ ] Icon alignment good on all screens

### Cross-platform
- [ ] Icons render consistently (no platform-specific emoji)

---

## Success Criteria

✅ Zero emoji visible in entire app  
✅ All icons use Lucide React components  
✅ Consistent sizing and color  
✅ No functional regressions  
✅ Professional, unified appearance

---

## Notes

- This completes the icon migration started in PRD_ICON_MIGRATION.md
- Recipe emoji are decorative — icon choice based on primary ingredient/style
- Meal type icons use time-of-day metaphors (Sunrise/Sun/Moon)
- App logo should remain recognizable (Salad icon maintains branding)

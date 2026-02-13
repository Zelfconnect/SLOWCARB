# PRD: Emoji → Lucide Icons Migration

**Date:** 2025-02-12  
**Assignee:** Codex  
**Reviewer:** Donny (Opus)  
**Status:** Ready for implementation

---

## Goal
Replace all emoji usage in SlowCarb with Lucide React icons for:
- Cross-platform consistency (no iOS/Android/Windows rendering differences)
- Sharper visual appearance (SVG-based, 24px uniform size)
- Design system compliance ("Calm Bold" aesthetic)
- Improved accessibility (semantic alt text capability)
- Dynamic color/size control

---

## Mockup Reference
Before/after comparison created by Kimi:  
`docs/icon-migration-mockup.html`

Open in browser to validate visual alignment.

---

## Icon Mapping

| Current Emoji | Semantic Meaning | Lucide Icon | Import Name |
|---------------|------------------|-------------|-------------|
| 🧊 | Vriezer | Snowflake | `Snowflake` |
| 🥫 | Voorraadkast | Package | `Package` |
| 🥶 | Koelkast | Refrigerator | `Refrigerator` |
| 🍳 | Airfryer/Koken | ChefHat | `ChefHat` |
| 🥩 | Vlees | Beef | `Beef` |
| 🐟 | Vis | Fish | `Fish` |
| 🥚 | Eieren | Egg | `Egg` |
| 🫘 | Bonen | Bean | `Bean` |
| 🥦 | Groenten | Salad | `Salad` |

---

## Files to Modify

### 1. `src/components/AmmoCheck/AmmoCheck.tsx`
- **Location:** Zone cards rendering (Vriezer, Voorraadkast, Koelkast, Airfryer)
- **Change:** Replace emoji strings (`"🧊"`, `"🥫"`, etc.) with `<Snowflake />`, `<Package />`, etc.
- **Styling:** `className="w-6 h-6 text-stone-600"`

### 2. `src/components/Shopping/ShoppingListSection.tsx`
- **Location:** Food item rendering (Vlees, Vis, Eieren, Bonen, Groenten)
- **Change:** Replace emoji in item display with corresponding icon components
- **Styling:** `className="w-6 h-6 text-stone-600"`

### 3. `src/components/Stock/StockSection.tsx`
- **Location:** Similar to ShoppingListSection (food categories)
- **Change:** Replace emoji with icons
- **Styling:** `className="w-6 h-6 text-stone-600"`

### 4. `src/components/DailyMealTracker/DailyMealTracker.tsx`
- **Location:** Meal logging interface (food categories)
- **Change:** Replace emoji with icons
- **Styling:** `className="w-6 h-6 text-stone-600"`

### 5. `src/components/Modals/PackageSelectorModal.tsx`
- **Location:** Package selection UI (Voorraad context)
- **Change:** Replace `🥫` with `<Package />`
- **Styling:** `className="w-6 h-6 text-stone-600"`

### 6. `src/hooks/useShoppingList.ts`
- **Location:** Zone emoji mapping (data layer)
- **Change:** Update emoji strings to icon names (string values for data persistence)
- **Note:** Icons are rendered in components, keep string identifiers here

---

## Implementation Details

### Import Statement
Add to top of each modified component:
```tsx
import { Snowflake, Package, Refrigerator, ChefHat, Beef, Fish, Egg, Bean, Salad } from 'lucide-react';
```

### Icon Usage Pattern
Replace:
```tsx
<span className="text-2xl">{emoji}</span>
```

With:
```tsx
<IconComponent className="w-6 h-6 text-stone-600" aria-label="[semantic label]" />
```

### Example Transformation
**Before:**
```tsx
<div className="flex items-center gap-3">
  <span className="text-2xl">🧊</span>
  <h3>De Vriezer</h3>
</div>
```

**After:**
```tsx
<div className="flex items-center gap-3">
  <Snowflake className="w-6 h-6 text-stone-600" aria-label="Vriezer" />
  <h3>De Vriezer</h3>
</div>
```

---

## Constraints

### Design System
- **Size:** 24px (w-6 h-6 in Tailwind)
- **Stroke:** Default (2px) — do NOT override
- **Color:** `text-stone-600` (warm neutral from Calm Bold palette)
- **Spacing:** Maintain existing gap-3 (12px) between icon and text

### Accessibility
- Add `aria-label` attributes for screen readers
- Use semantic labels (e.g., "Vriezer" not "Snowflake icon")

### Data Layer
- `useShoppingList.ts` may store emoji strings for zone identification
- Keep these strings as identifiers (do NOT change to JSX)
- Mapping can happen in component layer (string → icon component)

---

## Testing Requirements

### Visual Regression
- [ ] All zones display icons at consistent size (24px)
- [ ] Icons align properly with adjacent text
- [ ] Color matches design system (stone-600)
- [ ] Hover states preserved (no visual breakage)

### Functional
- [ ] Zone clicks/interactions still work (AmmoCheck)
- [ ] Food category selection preserved (ShoppingListSection, StockSection)
- [ ] Meal logging functional (DailyMealTracker)
- [ ] Package modal opens correctly

### Cross-browser
- [ ] Chrome (macOS)
- [ ] Safari (macOS)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Accessibility
- [ ] Screen reader announces semantic labels
- [ ] Keyboard navigation unaffected
- [ ] Focus indicators visible

---

## Lucide Package Info
- **Version:** ^0.562.0 (already installed)
- **Bundle impact:** Minimal (~2KB per icon, tree-shakable)
- **Docs:** https://lucide.dev/icons/

---

## Success Criteria
- ✅ All 9 emoji replaced across 6 files
- ✅ No visual regressions (alignment, size, spacing)
- ✅ All zone/food category features functional
- ✅ Accessibility maintained (aria-labels present)
- ✅ Design system compliance (Calm Bold aesthetic)

---

## Notes
- Do NOT modify `useShoppingList.ts` string identifiers unless they explicitly contain emoji (check first)
- If a component conditionally renders emoji (e.g., `{showIcon && emoji}`), apply same logic to icon component
- Commit message: `Replace emoji with Lucide icons (zone + food categories)`

# PRD: Touch Targets & UX Polish

## Context
Kimi UI review identified accessibility issues with touch targets and some UX inconsistencies.

## Priority Fixes

### 1. Heart/Favorite Icons Too Small (CRITICAL)
**Current:** ~32px
**Required:** ≥44px (iOS/Android minimum)

**Files:** `RecipesList.tsx` or wherever heart icons are rendered

**Fix:**
```tsx
// Heart button wrapper should be at least 44x44
<button className="w-11 h-11 flex items-center justify-center">
  <Heart className="w-5 h-5" />
</button>
```

### 2. Filter Chips Touch Targets (HIGH)
**Current:** ~36px height
**Required:** ≥44px

**Files:** `RecipesList.tsx`

**Fix:**
```tsx
// Filter chip buttons
className="h-11 px-4 ..." // was h-8 or h-9
```

### 3. Checkbox Touch Areas (HIGH)
**Location:** Voorraad page, shopping list

**Files:** `StockSection.tsx`, `ShoppingListSection.tsx`

**Fix:**
```tsx
// Checkbox wrapper
<label className="min-w-11 min-h-11 flex items-center justify-center cursor-pointer">
  <input type="checkbox" ... />
</label>
```

### 4. Recipe Modal Margins (MEDIUM)
**Current:** Modal extends to viewport edges
**Required:** 16px margin around modal

**Files:** `RecipeDetailModal.tsx`

**Fix:**
```tsx
// Modal container
className="fixed inset-4 ..." // was inset-0
// Or: mx-4 my-4 max-h-[calc(100vh-32px)]
```

### 5. Active Nav State (LOW)
**Current:** Only color change, no filled icon
**Desired:** Filled icon + subtle background

**Files:** Bottom nav component (likely in `App.tsx` or a `BottomNav.tsx`)

**Fix:**
- Active state: filled icon variant
- Add light background tint: `bg-primary-50` or `bg-sage-50/50`

## Out of Scope
- JA/NEE/CHEAT DAY semantic colors in Leren page — these are intentional for quick visual scanning (green=yes, red=no)
- Emoji colors — these are content, not UI

## Verification
After changes:
1. `npm run build` — no errors
2. Visual check: all buttons/icons feel tappable on mobile
3. Test on 390px viewport

## Files to Modify
1. `src/components/RecipesList.tsx` — filter chips, heart icons
2. `src/components/StockSection.tsx` — checkboxes
3. `src/components/ShoppingListSection.tsx` — checkboxes
4. `src/components/RecipeDetailModal.tsx` — modal margins
5. `src/App.tsx` or nav component — active states

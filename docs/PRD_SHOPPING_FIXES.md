# PRD: SlowCarb Shopping & Voorraad Fixes

**Date:** 2026-02-12
**Author:** Donny (automated analysis)
**Priority:** High
**Status:** Ready for Codex

---

## Problem Statement

De Shopping/Voorraad sectie heeft logic gaps en UI issues die de gebruikerservaring verstoren:

1. **Desktop-only patterns** op een mobile-first app
2. **Onduidelijke flow** van boodschappenlijst → daadwerkelijk gekocht → in voorraad
3. **Touch targets** te klein voor mobile
4. **Filter chip bug** op Recepten pagina

---

## Scope

**In scope:**
- Shopping list UX improvements
- Voorraad section improvements  
- Mobile-friendly touch targets
- Bug fixes

**Out of scope:**
- Nieuwe features
- Backend/API changes
- Design system overhaul

---

## Requirements

### 1. "Mark as Bought" Flow (HIGH)

**Current:** Items blijven in shopping list tot handmatig verwijderd
**Required:** Checked items kunnen eenvoudig naar voorraad worden verplaatst

**Implementation:**
```tsx
// In ShoppingListSection.tsx

// Add bulk action button when items are checked
{checkedCount > 0 && (
  <div className="flex gap-3 mt-4">
    <Button
      onClick={onMoveCheckedToPantry}  // NEW PROP
      className="flex-1 btn-secondary h-11"
    >
      <Home className="w-4 h-4 mr-2" />
      Naar voorraad ({checkedCount})
    </Button>
    <Button
      variant="outline"
      onClick={onClearChecked}
      className="h-11 rounded-xl border-stone-200"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  </div>
)}
```

**In App.tsx:**
```tsx
// Add new handler
const handleMoveCheckedToPantry = () => {
  const checkedItems = items.filter(i => i.checked);
  checkedItems.forEach(item => {
    handleMoveToPantry(item.id);
  });
  toast.success(`${checkedItems.length} items naar voorraad verplaatst`);
};
```

### 2. Mobile-Friendly Item Actions (HIGH)

**Current:** Move-to-pantry en delete buttons only show on hover
**Required:** Always visible on mobile, swipe actions optional

**Implementation:**
```tsx
// Replace hover-based visibility with always-visible on mobile

// OLD:
className="opacity-0 group-hover:opacity-100"

// NEW:
className="opacity-100 md:opacity-0 md:group-hover:opacity-100"
```

**Alternative: Swipe actions**
```tsx
// Consider using react-swipeable-list for mobile swipe gestures
// Swipe left = delete, swipe right = move to pantry
```

### 3. Touch Target Sizes (MEDIUM)

**Current:** Some buttons < 44px
**Required:** All interactive elements minimum 44px (h-11)

**Files to update:**
- `ShoppingListSection.tsx` - checkbox, action buttons
- `StockSection.tsx` - checkbox, action buttons  
- `RecipesList.tsx` - filter chips

**Specific fixes:**
```tsx
// Checkbox: was w-6 h-6, needs larger touch target
<button
  onClick={() => onToggleItem(item.id)}
  className="w-11 h-11 flex items-center justify-center -ml-2"
>
  <div className="w-6 h-6 rounded-lg border-2 border-stone-300 flex items-center justify-center">
    {item.checked && <Check className="w-4 h-4" />}
  </div>
</button>

// Filter chips: was h-7 px-3, needs h-9 px-4
<button className="h-9 px-4 flex items-center gap-2 ...">
```

### 4. Fix Duplicate "Alles" Filter Chips (LOW)

**Current:** Two "Alles" buttons appear in RecipesList filter chips
**Root cause:** Hardcoded "Alles" button PLUS `{ id: 'all', name: 'Alles' }` in categories array

**Fix in src/data/recipes.ts:**
```tsx
// REMOVE this line from categories array:
// { id: 'all', name: 'Alles', emoji: '🍽️' },

export const categories = [
  // { id: 'all', name: 'Alles', emoji: '🍽️' }, // REMOVE - already hardcoded in RecipesList
  { id: 'ontbijt', name: 'Ontbijt', emoji: '🌅' },
  { id: 'lunch', name: 'Lunch', emoji: '☀️' },
  { id: 'avond', name: 'Avond', emoji: '🌙' },
  { id: 'mealprep', name: 'Meal Prep', emoji: '📦' },
  { id: 'airfryer', name: 'Airfryer', emoji: '🔥' },
  { id: 'snack', name: 'Snack', emoji: '🥜' },
];
```

### 5. Voorraad Section Improvements (MEDIUM)

**Current issues:**
- Empty state instruction mentions hover action
- "Altijd op voorraad" items don't auto-add to shopping

**Fixes:**
```tsx
// Better empty state text
<p className="text-sm font-medium text-stone-700">Nog niets in huis</p>
<p className="text-xs mt-1">
  Vink items af in je boodschappenlijst en klik "Naar voorraad"
</p>

// Auto-suggest missing standard items at top of shopping list
// Already implemented via getRestockSuggestions() - verify it works
```

### 6. Tab Navigation Accessibility (MEDIUM)

**Current:** Playwright couldn't click "Boodschappen" tab
**Root cause:** Likely text matching issue or overlapping elements

**Fix:**
```tsx
// In BottomNav.tsx - ensure proper aria labels and unique identifiers
<button
  aria-label="Boodschappen"
  role="tab"
  aria-selected={activeTab === 'shopping'}
  ...
>
```

---

## Implementation Order

1. **Phase 1 (Critical):** Mobile touch targets + action buttons visibility
2. **Phase 2 (Important):** "Move checked to pantry" bulk action
3. **Phase 3 (Polish):** Fix duplicate filter chips, improve empty states
4. **Phase 4 (Accessibility):** Tab navigation aria labels

---

## Acceptance Criteria

- [ ] All buttons/checkboxes have 44px minimum touch target
- [ ] Action buttons visible without hover on mobile
- [ ] "Naar voorraad" bulk action works for checked items
- [ ] No duplicate "Alles" filter chips
- [ ] Empty states have clear, accurate instructions
- [ ] Tab navigation accessible to screen readers

---

## Files to Modify

1. `src/components/ShoppingListSection.tsx`
2. `src/components/StockSection.tsx`
3. `src/components/RecipesList.tsx`
4. `src/components/BottomNav.tsx`
5. `src/App.tsx` (new handler)

---

## Testing

After implementation:
```bash
# Visual regression
node record-shopping-flow.mjs

# Manual test on mobile viewport
# Open DevTools → Toggle device toolbar → iPhone 12 Pro

# Test flows:
1. Add recipe items to shopping list
2. Check items as "bought"
3. Bulk move to pantry
4. Verify items appear in Voorraad
5. Verify restock suggestions appear when items depleted
```

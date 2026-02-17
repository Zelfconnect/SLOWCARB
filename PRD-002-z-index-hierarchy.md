# PRD-002: Z-Index Hierarchy Fix

## Problem
Modal and bottom nav share same z-index (`z-30`):
- Potential layering conflicts
- Modal should be highest layer
- Nav should be below modal but above content

## Root Cause
1. `BottomNav.tsx` line 23: `z-30`
2. `RecipeDetailModal.tsx` line 43: `z-30`
3. App header: `z-20`

All interactive overlays share same z-index = fragile layering.

## Solution

### Z-Index Stack (Bottom to Top)
```
z-10: Content overlays (future)
z-20: Header (sticky)
z-30: Bottom Nav (fixed)
z-40: Modals (highest)
z-50: Toasts/Alerts (if needed)
```

### Changes Required

#### File 1: `src/components/RecipeDetailModal.tsx`
**Line 43, change className:**
```tsx
// BEFORE:
className="inset-x-4 top-20 bottom-24 translate-x-0 translate-y-0 max-w-none rounded-3xl border-0 shadow-2xl p-0 flex flex-col z-30"

// AFTER:
className="inset-x-4 top-20 bottom-24 translate-x-0 translate-y-0 max-w-none rounded-3xl border-0 shadow-2xl p-0 flex flex-col z-40"
```

**Change:** `z-30` → `z-40`

#### File 2: `src/components/BottomNav.tsx`
**Line 23, verify className has `z-30`:**
```tsx
// CURRENT (should remain):
className="fixed bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-md border-t border-warm-200 z-30"
```
**No change needed** - z-30 is correct for nav.

## Expected Outcome
- Modal renders above bottom nav (z-40 > z-30)
- Bottom nav renders above header (z-30 > z-20)
- Clear visual hierarchy
- No layering conflicts

## Verification
1. Open recipe modal
2. Verify modal is above bottom nav
3. Check no visual glitches when scrolling
4. Test modal close behavior

## Constraints
- 1 file change (RecipeDetailModal only)
- 1 line change (z-index value)
- No functional changes

## Time Estimate
< 2 minutes

## Files Changed
- `src/components/RecipeDetailModal.tsx`

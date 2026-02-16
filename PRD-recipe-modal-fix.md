# PRD: Recipe Modal Overlap Fix

## Problem
Recipe detail modal overlaps with sticky navigation bar causing:
1. Modal content bleeding under nav bar (64px header)
2. Back button barely visible, positioned too high
3. Z-index conflict - modal appears behind nav bar
4. Duplicate "Companion" branding (nav + modal)
5. No safe-area padding for iOS notch

## Root Cause
- `RecipeDetailModal.tsx` uses `top-16` (64px) but no explicit z-index higher than nav's z-20
- DialogContent positioned `fixed` but competes with sticky header
- No environment-safe padding for mobile notches

## Solution (Single Component: RecipeDetailModal.tsx)

### Changes Required:
1. **Z-index layering**: Add `z-30` to DialogContent (above nav's z-20)
2. **Safe spacing**: Change `top-16` to `top-20` (80px) for breathing room
3. **iOS safe-area**: Add `env(safe-area-inset-top)` padding support
4. **Back button**: Already inside card bounds - verify visual clarity with increased top offset

### Implementation
File: `src/components/RecipeDetailModal.tsx`

Line 42-44 (DialogContent className):
```tsx
// BEFORE:
className="inset-x-4 top-16 bottom-24 translate-x-0 translate-y-0 max-w-none rounded-3xl border-0 shadow-2xl p-0 flex flex-col"

// AFTER:
className="inset-x-4 top-20 bottom-24 translate-x-0 translate-y-0 max-w-none rounded-3xl border-0 shadow-2xl p-0 flex flex-col z-30"
style={{ paddingTop: 'max(0px, env(safe-area-inset-top))' }}
```

### Expected Outcome:
- Modal starts at 80px from top (nav=64px + 16px breathing room)
- Z-index 30 ensures modal always above nav (z-20)
- iOS notch safe-area respected
- Back button clearly visible within card bounds
- No duplicate branding visible

### Verification:
1. Local dev: Modal should not overlap nav bar
2. Browser DevTools: Check computed z-index and top position
3. Mobile test: iOS safe-area padding respected
4. Screenshot: Before/after comparison

### Time Estimate: <5 minutes
### Scope: 1 file, 1 component, 2 line changes

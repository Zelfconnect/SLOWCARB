# PRD-006: Modal Tab Active Indicator

**Bug ID:** BUG-012  
**Severity:** MEDIUM  
**Component:** `src/components/RecipeDetailModal.tsx`  
**Issue:** Active tab underline is subtle, not immediately obvious

## Problem
Modal tabs (Ingrediënten, Bereiding) use thin underline for active state. Users may not immediately see which tab is selected.

## Solution
Make active tab indicator more prominent:

### Option 1 (Recommended): Bolder underline
```tsx
// Find TabsTrigger elements, add to active state:
data-[state=active]:border-b-2 (instead of border-b)
```

### Option 2: Background color
```tsx
data-[state=active]:bg-sage-50
```

### Option 3: Combined (bold underline + subtle bg)
```tsx
data-[state=active]:border-b-2 data-[state=active]:bg-sage-50/30
```

## Files to Modify
- `src/components/RecipeDetailModal.tsx` (TabsTrigger elements)

## Current Implementation
Search for `<TabsTrigger>` or `TabsList` in RecipeDetailModal and locate the className with tab styling.

## Acceptance Criteria
- ✅ Active tab immediately recognizable
- ✅ Maintains visual harmony with modal design
- ✅ No visual regression on inactive tabs
- ✅ Dev server builds successfully

## Implementation Notes
- Single component change only
- Test both tabs (Ingrediënten and Bereiding)
- Ensure hover states still work
- Consider mobile touch feedback

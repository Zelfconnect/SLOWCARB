# PRD-003: Header-to-Content Spacing Fix

## Problem
Main content area has uniform `py-6` (24px vertical padding):
- Top padding feels cramped after sticky header
- First card/element too close to header
- Inconsistent visual breathing room

## Root Cause
`App.tsx` line 190:
```tsx
<main className="max-w-md mx-auto px-4 py-6">
```

Symmetric padding doesn't account for visual weight of sticky header above.

## Solution

### Change Required
File: `src/App.tsx`

**Line 190, change main element className:**
```tsx
// BEFORE:
<main className="max-w-md mx-auto px-4 py-6">

// AFTER:
<main className="max-w-md mx-auto px-4 pt-8 pb-6">
```

### Changes:
- `py-6` → `pt-8 pb-6`
- Top padding: 24px → 32px (+8px breathing room)
- Bottom padding: remains 24px (appropriate for bottom nav)

## Expected Outcome
- More breathing room between header and first content element
- Better visual hierarchy
- Improved readability
- Maintains bottom spacing for nav

## Verification
1. Visit all tabs (dashboard, recipes, learn, shopping, settings)
2. Verify top spacing feels comfortable
3. Check bottom nav doesn't clip content
4. Test on mobile viewports

## Constraints
- 1 file, 1 element, 1 line change
- No functional changes
- Must work across all tabs

## Time Estimate
< 2 minutes

## Files Changed
- `src/App.tsx`

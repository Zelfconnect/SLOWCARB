# PRD-004: Modal Header Padding Polish

## Problem
Recipe modal header has uniform `p-5` (20px) padding:
- Title and back button feel slightly cramped vertically
- Could use more breathing room at top
- Bottom padding is fine (tabs start right after)

## Root Cause
`RecipeDetailModal.tsx` line 47:
```tsx
<div className="p-5 bg-gradient-to-br from-sage-600 to-sage-700 flex-shrink-0 rounded-t-3xl">
```

Symmetric padding doesn't account for visual weight at top of modal.

## Solution

### Change Required
File: `src/components/RecipeDetailModal.tsx`

**Line 47, change header div className:**
```tsx
// BEFORE:
<div className="p-5 bg-gradient-to-br from-sage-600 to-sage-700 flex-shrink-0 rounded-t-3xl">

// AFTER:
<div className="pt-6 px-5 pb-5 bg-gradient-to-br from-sage-600 to-sage-700 flex-shrink-0 rounded-t-3xl">
```

### Changes:
- `p-5` → `pt-6 px-5 pb-5`
- Top padding: 20px → 24px (+4px breathing room)
- Horizontal padding: remains 20px
- Bottom padding: remains 20px

## Expected Outcome
- More comfortable top spacing in modal header
- Back button and title feel less cramped
- Maintains horizontal and bottom spacing
- Better visual hierarchy

## Verification
1. Open recipe modal
2. Verify header feels more spacious
3. Check back button positioning
4. Test on mobile

## Constraints
- 1 file, 1 element, 1 line change
- No functional changes
- Visual polish only

## Priority
LOW - Polish (after critical fixes)

## Time Estimate
< 2 minutes

## Files Changed
- `src/components/RecipeDetailModal.tsx`

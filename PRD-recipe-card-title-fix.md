# PRD: Recipe Card Title Truncation Fix

## Problem
Recipe titles in CompactRecipeCard.tsx use `truncate` class (single-line ellipsis). Long Dutch recipe names are cut off mid-word, e.g. "Airfryer Kipfilet met Krokant…" — unreadable.

## Acceptance Criteria
- Recipe titles can wrap to max 2 lines (no hard cutoff)
- Cards remain vertically consistent (min-height to handle 1 or 2 line titles)
- No text overflow beyond 2 lines
- Favorite button alignment maintained (aligns to center of card, not just top)

## File to Change
`src/components/CompactRecipeCard.tsx`

## Changes Required

### 1. Title element: replace `truncate` with `line-clamp-2`
Current:
```tsx
<h3 className="font-display font-semibold text-stone-800 text-sm leading-tight truncate group-hover:text-sage-700 transition-colors">
```
New:
```tsx
<h3 className="font-display font-semibold text-stone-800 text-sm leading-tight line-clamp-2 group-hover:text-sage-700 transition-colors">
```

### 2. Card: add `items-center` alignment and `min-h-[72px]`
The Card component needs `items-center` on its flex container to ensure the favorite button stays vertically centered when title wraps to 2 lines.

Current Card className:
```tsx
className="flex-row items-center gap-3 p-3 rounded-xl py-3 hover:border-sage-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
```
This is already using `items-center` — good. Just ensure the card has minimum height of 72px:
```tsx
className="flex-row items-center gap-3 p-3 rounded-xl py-3 min-h-[72px] hover:border-sage-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
```

## Testing
1. Dev server must start without errors
2. Recipes list shows title wrapping properly for long names
3. Short titles (1 line) still look correct
4. Favorite button stays centered regardless of title length

## Scope
- ONLY change CompactRecipeCard.tsx
- No other files
- No new features

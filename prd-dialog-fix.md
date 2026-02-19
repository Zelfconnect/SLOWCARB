# PRD: Dialog Centering & Scroll Fix

## Problem
Two modals have visual issues on mobile:
1. **PackageSelectorModal** — cut off on the right side, cannot scroll to bottom
2. **RecipeDetailModal** — cut off on the right side

Both should match the education card modal style: properly centered with margins, scrollable content.

## Reference (working correctly)
The education card dialogs use the base `DialogContent` from `src/components/ui/dialog.tsx` which has:
- `w-[calc(100%-2rem)]` for proper centering with margins
- `translate-x-[-50%] translate-y-[-50%]` for center positioning
- `max-h-[90dvh]` for viewport height constraint
- `rounded-2xl` for consistent border radius

## Fix 1: RecipeDetailModal.tsx

Current DialogContent className:
```
"!w-full sm:w-full sm:mx-auto max-w-lg h-[100dvh] sm:h-auto sm:max-h-[85dvh] rounded-none sm:rounded-3xl border-0 shadow-2xl p-0 flex flex-col z-50"
```

Change to:
```
"max-w-lg max-h-[90dvh] rounded-3xl border-0 shadow-2xl p-0 flex flex-col"
```

Key changes:
- Remove `!w-full` — let the base `w-[calc(100%-2rem)]` handle width with proper margins
- Remove `h-[100dvh]` — don't force fullscreen on mobile
- Remove `rounded-none` — keep rounded corners on mobile too
- Remove `sm:` responsive overrides — use same style on all screen sizes
- Remove `z-50` — already set in base component

## Fix 2: PackageSelectorModal.tsx

Current DialogContent className:
```
"mx-4 sm:mx-auto max-w-lg max-h-[85dvh] rounded-3xl border-0 shadow-2xl p-0 flex flex-col"
```

Change to:
```
"max-w-lg max-h-[85dvh] rounded-3xl border-0 shadow-2xl p-0 flex flex-col"
```

Key changes:
- Remove `mx-4 sm:mx-auto` — the base component already handles centering via `translate-x-[-50%]` and `w-[calc(100%-2rem)]`. Adding `mx-4` on top of that shifts it right.

## Verification
After changes:
1. Open any recipe → should be centered with equal margins on both sides, rounded corners
2. Click "+ Toevoegen" → package selector should be centered, scrollable to the bottom
3. Both modals should have consistent look & feel matching the education card style
4. Test on mobile viewport (375px width)

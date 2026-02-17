# PRD: Onboarding Wizard — Modal Backdrop Fix

**Bug ID:** WORK.md High Priority #1  
**Severity:** HIGH (blocks new users)  
**Component:** `src/components/OnboardingWizard.tsx`  
**Issue:** Dark overlay covers modal content, form inputs not visible on mobile

## Problem

OnboardingWizard renders with a dark backdrop overlay that covers the content:
- DialogOverlay: `z-40` with `bg-black/60` (60% opacity)
- DialogContent: `z-50` (should be above overlay)
- But on iOS Safari, content appears BEHIND overlay

**Root cause:** DialogContent automatically renders DialogOverlay, creating stacking context issue with fullscreen wizard.

## Solution

**Remove overlay for fullscreen onboarding wizard:**

The OnboardingWizard is fullscreen (`fixed inset-0`) and should NOT have a dark backdrop overlay. Remove the auto-rendered DialogOverlay.

### Option A (Recommended): Custom DialogContent without overlay

Create a Portal + Content without Overlay for OnboardingWizard only.

**Change in OnboardingWizard.tsx:**

```tsx
// BEFORE (line 50-56):
return (
  <Dialog open={true}>
    <DialogContent 
      className="fixed inset-0 z-50 w-full h-full max-w-none p-0 m-0 border-none bg-white"
      onPointerDownOutside={(e) => e.preventDefault()}
      onEscapeKeyDown={(e) => e.preventDefault()}
    >

// AFTER:
import * as DialogPrimitive from "@radix-ui/react-dialog"

return (
  <Dialog open={true}>
    <DialogPrimitive.Portal>
      <DialogPrimitive.Content
        className="fixed inset-0 z-50 w-full h-full max-w-none p-0 m-0 border-none bg-white outline-none"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
```

**And close tag:**
```tsx
// BEFORE:
</DialogContent>

// AFTER:
</DialogPrimitive.Content>
    </DialogPrimitive.Portal>
```

### Option B (Simpler): Hide overlay with CSS

Add `opacity-0` to DialogOverlay for this specific wizard.

**Not recommended** because overlay still renders (wastes DOM nodes).

## Files to Modify

- `src/components/OnboardingWizard.tsx` (lines ~1-5 for import, lines ~50-250 for Dialog)

## Acceptance Criteria

✅ Onboarding wizard displays fullscreen white background  
✅ NO dark overlay visible  
✅ Form inputs visible and functional  
✅ All 5 steps accessible  
✅ "Start Journey" button works  
✅ Dev server builds successfully  
✅ Visual verification via browser

## Testing

1. Start dev server: `cd ~/projects/slowcarb-new && npm run dev`
2. Clear localStorage (simulate new user)
3. Reload page → onboarding should appear
4. Verify: white fullscreen wizard, no dark overlay
5. Complete all 5 steps
6. Verify: redirects to dashboard

## Constraints

- Single file change only
- No functional changes (only visual fix)
- Must work on iOS Safari (test via DevTools responsive mode)
- Keep all existing form validation logic

## Implementation Notes

Use DialogPrimitive.Portal + Content directly to bypass the automatic DialogOverlay rendering in shadcn Dialog component.

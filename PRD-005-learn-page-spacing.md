# PRD-005: Learn Page Vertical Spacing

**Bug ID:** BUG-009  
**Severity:** MEDIUM  
**Component:** `src/components/LearnSection.tsx`  
**Issue:** Dense content sections need more breathing room

## Problem
Learn page sections are tightly packed with `space-y-6` (24px), reducing readability.

## Solution
Change main wrapper spacing from `space-y-6` to `space-y-8` (32px):

**Current:**
```tsx
<div className="space-y-6 pb-24">
```

**Change to:**
```tsx
<div className="space-y-8 pb-24">
```

## Files to Modify
- `src/components/LearnSection.tsx` (line with `space-y-6 pb-24`)

## Acceptance Criteria
- ✅ 32px vertical gap between major sections
- ✅ No visual regression on other spacing
- ✅ Dev server builds successfully
- ✅ Single atomic change

## Implementation Notes
- One line change only
- Preserve all existing content and functionality
- Visual polish only, no functional changes

# Git Commit Message Template

## For All PRD Fixes (Single Commit)

```
fix(ui): Pre-launch UI audit fixes for Feb 23

Comprehensive UI audit conducted, 4 atomic fixes deployed:

- PRD-001: Back button contrast (RecipeDetailModal)
  - Changed bg-white/10 to bg-white for visibility
  - Dark icon (text-sage-700) on white background
  - Improved accessibility

- PRD-002: Z-index hierarchy (RecipeDetailModal)
  - Modal z-index increased from z-30 to z-40
  - Ensures modal renders above bottom nav
  - Prevents layering conflicts

- PRD-003: Header spacing (App.tsx)
  - Changed py-6 to pt-8 pb-6 on main element
  - More breathing room after sticky header
  - Better visual hierarchy

- PRD-004: Modal header padding (RecipeDetailModal)
  - Changed p-5 to pt-6 px-5 pb-5
  - Less cramped header appearance
  - Polish improvement

Files changed:
- src/components/RecipeDetailModal.tsx (3 changes)
- src/App.tsx (1 change)

All fixes runtime verified.
Launch ready: Feb 23, 2026

Related: BUG-AUDIT-20260216.md
```

## Individual Commit Messages (If Needed)

### PRD-001
```
fix(modal): improve back button contrast

Changed back button from translucent white to solid white
with dark icon for better visibility against green header.

Component: RecipeDetailModal.tsx
Runtime verified: ✅
```

### PRD-002
```
fix(modal): correct z-index hierarchy

Increased modal z-index from 30 to 40 to ensure it
renders above bottom nav (z-30) and header (z-20).

Component: RecipeDetailModal.tsx
Runtime verified: ✅
```

### PRD-003
```
fix(layout): improve header-to-content spacing

Changed main element padding from py-6 to pt-8 pb-6
for more breathing room after sticky header.

Component: App.tsx
Runtime verified: ✅
```

### PRD-004
```
fix(modal): polish header padding

Changed modal header padding from p-5 to pt-6 px-5 pb-5
for less cramped appearance at top.

Component: RecipeDetailModal.tsx
Runtime verified: ✅
```

## Git Commands

### Single Commit (Recommended)
```bash
cd ~/projects/slowcarb-new
git add src/components/RecipeDetailModal.tsx src/App.tsx
git commit -F COMMIT-MSG-TEMPLATE.md
git push origin main
```

### Individual Commits (If PRDs deployed separately)
```bash
# PRD-001
git add src/components/RecipeDetailModal.tsx
git commit -m "fix(modal): improve back button contrast"

# PRD-002
git add src/components/RecipeDetailModal.tsx
git commit -m "fix(modal): correct z-index hierarchy"

# PRD-003
git add src/App.tsx
git commit -m "fix(layout): improve header-to-content spacing"

# PRD-004
git add src/components/RecipeDetailModal.tsx
git commit -m "fix(modal): polish header padding"

# Push all
git push origin main
```

## Verification Before Commit

```bash
# Check status
git status

# Review diffs
git diff src/components/RecipeDetailModal.tsx
git diff src/App.tsx

# Ensure no unwanted changes
git diff --stat
```

---

**Recommended:** Single commit for all PRD fixes (cleaner history).

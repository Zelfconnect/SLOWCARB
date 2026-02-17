# PRD Process Guide - SlowCarb Project

## What is a PRD?

**Product Requirement Document** - A precise specification for a single atomic code change.

## PRD Principles

1. **One Component, One Fix** - Never multi-component changes
2. **Atomic** - 1-3 lines of code max
3. **Testable** - Clear verification steps
4. **Fast** - 2-3 minute Codex execution time
5. **Isolated** - No dependencies on other PRDs

## PRD Structure

```markdown
# PRD-XXX: Title

## Problem
What's broken/wrong? Be specific.

## Root Cause
File, line number, exact code causing issue.

## Solution
Exact changes required (BEFORE/AFTER code blocks).

## Expected Outcome
What success looks like.

## Verification
Step-by-step testing instructions.

## Constraints
- File count
- Line count
- Scope limits

## Time Estimate
< X minutes

## Files Changed
- path/to/file.tsx
```

## Execution Workflow

### 1. Create PRD
```bash
# Use template above
vim PRD-XXX-descriptive-name.md
```

### 2. Spawn Codex Worker
```bash
# Via sub-agent (preferred)
sessions_spawn(
  model="anthropic/claude-sonnet-4-5",
  label="Codex PRD-XXX: Title",
  task="Execute Codex fix for PRD-XXX-*.md\n\n**PRD Path:** ~/projects/slowcarb-new/PRD-XXX-*.md\n**Repo:** ~/projects/slowcarb-new\n\n**Task:**\n1. Read PRD\n2. Execute via Codex CLI: `cd ~/projects/slowcarb-new && codex exec -s danger-full-access -p PRD-XXX-*.md`\n3. Verify changes\n4. Test runtime\n5. Return: ✅ DEPLOYED + verification\n\n**Constraints:**\n- Codex CLI mandatory\n- `-s danger-full-access` required\n- Runtime verification = done"
)

# Or direct Codex CLI
cd ~/projects/slowcarb-new
codex exec -s danger-full-access -p PRD-XXX-*.md
```

### 3. Runtime Verification
```bash
# Start dev server
npm run dev

# Manual test steps from PRD
# Screenshot/verify fix works
# Check console for errors
```

### 4. Deploy
```bash
git add .
git commit -m "fix: [PRD-XXX] descriptive message"
git push origin main

# Vercel auto-deploys
# Verify on production URL
```

## PRD Naming Convention

```
PRD-001-back-button-contrast.md
PRD-002-z-index-hierarchy.md
PRD-003-header-spacing.md
│   │   └── Descriptive slug (kebab-case)
│   └── Sequential number (zero-padded)
└── Prefix
```

## Priority Levels

- **🔴 Critical** - Blocks core functionality, deploy immediately
- **🟡 High** - Major UX issue, deploy same day
- **🟢 Medium** - Polish/refinement, deploy within 48h
- **🔵 Low** - Nice-to-have, deploy when convenient

## Example: PRD-001

### Problem
Back button has poor contrast (white on green).

### Solution
Change `bg-white/10 text-white/70` → `bg-white text-sage-700`

### Files Changed
- `src/components/RecipeDetailModal.tsx` (1 line)

### Verification
1. Open recipe modal
2. Check back button visibility ✅
3. Test hover state ✅

### Time
< 2 minutes

## Anti-Patterns ❌

### ❌ Multi-Component PRDs
```markdown
# BAD: PRD-XXX: Fix all modal issues
Changes: RecipeDetailModal.tsx, BottomNav.tsx, App.tsx
```

**Why bad:** Not atomic, hard to test, longer execution time.

**Fix:** Split into 3 PRDs (one per component).

### ❌ Vague Requirements
```markdown
# BAD: Make the UI better
Changes: "Improve spacing"
```

**Why bad:** No clear success criteria, subjective.

**Fix:** Specific measurements: `py-6 → pt-8 pb-6`

### ❌ No Verification Steps
```markdown
# BAD:
## Verification
"Test it"
```

**Why bad:** Not reproducible, incomplete testing.

**Fix:** Explicit steps with expected outcomes.

## Quality Checklist

Before spawning Codex worker, verify PRD has:

- [ ] Clear problem statement
- [ ] Exact file + line number
- [ ] BEFORE/AFTER code blocks
- [ ] Specific verification steps
- [ ] Time estimate < 5 minutes
- [ ] Single component only
- [ ] No dependencies on other PRDs

## Current PRDs (Feb 16, 2026)

| PRD | Status | Priority | Component |
|-----|--------|----------|-----------|
| PRD-001 | 🔄 Running | 🔴 Critical | RecipeDetailModal.tsx |
| PRD-002 | 🔄 Running | 🟡 High | RecipeDetailModal.tsx |
| PRD-003 | 🔄 Running | 🟢 Medium | App.tsx |
| PRD-004 | ⏳ Queued | 🔵 Low | RecipeDetailModal.tsx |

## Lessons Learned

1. **Atomic = Fast** - 1 component PRDs execute in 2-3 min
2. **Runtime verification is mandatory** - Code changes ≠ working feature
3. **Codex CLI always** - Never write code manually
4. **Parallel execution** - Independent PRDs can run simultaneously
5. **Kimi QA for visuals** - Automate screenshot verification

---

**Last Updated:** 2026-02-16 15:42 CET  
**Maintainer:** Donny (Opus subagent)

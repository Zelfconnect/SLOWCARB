# CLAUDE.md

This file provides guidance to Claude Code / Cursor when working with code in this repository.

## Build & Dev Commands

```bash
npm run dev          # Start Vite dev server with HMR
npm run build        # TypeScript check + Vite production build
npm run lint         # ESLint
npm run preview      # Preview production build
npm run test         # Vitest (unit tests)
npm run test:watch   # Vitest watch mode
```

## Architecture

**Single-page mobile-first app** for the Slow-Carb diet (Tim Ferriss's 4-Hour Body). All content is in Dutch. Stack: React + Vite + Tailwind + shadcn/ui.

### Routing & State

- No React Router. Tab-based navigation via `activeTab` state in App.tsx + `<BottomNav>`.
- 4 tabs: `dashboard`, `recipes`, `learn`, `shopping` (shopping has sub-tabs `list` | `stock`).
- **State management:** Zustand (`src/store/useUserStore.ts`) + custom hooks with `useLocalStorage`.
- Persistence via `useLocalStorage` hook → all user data lives in localStorage.

### Key localStorage Keys

`slowcarb-favorites`, `slowcarb-journey`, `slowcarb-weight-log`, `slowcarb-meal-log`, `slowcarb-shopping-v2`, `slowcarb-pantry`, `slowcarb-pantry-standard`, `slowcarb-stock`

### Testing

- **Framework:** Vitest + @testing-library/react + @testing-library/jest-dom
- **Tests:** `src/data/__tests__/`, `src/hooks/__tests__/`, `src/store/__tests__/`
- Run: `npm run test`

### Hooks (src/hooks/)

- **useLocalStorage** — Generic localStorage with `StorageEvent` sync across tabs
- **useJourney** — 84-day journey tracker: progress, day/week tips, meal logging, streak calculation, cheat day detection
- **useShoppingList** — Shopping list with package-size-aware consolidation (merges duplicate ingredients across recipes)
- **usePantry** — Pantry/stock management with standard items checklist and restock suggestions
- **useFavorites** — Recipe favorites toggle
- **useStock** — Basic stock checklist (separate from usePantry)

### Store (src/store/)

- **useUserStore** — Zustand store for user state (onboarding, preferences)

### Data Layer (src/data/)

- **recipes.ts** — Recipe database with Dutch recipes, ingredients have `scalable` flag
- **packageSizes.ts** — Dutch supermarket package sizes (stuks/gram/kg/blikken etc.) + `STANDARD_PANTRY_ITEMS` + `getPackageSizes()` lookup
- **journey.ts** — Day-by-day tips (days 1-7) and week tips (weeks 1-3) for metabolic adaptation
- **education.ts** — Structured education cards: RuleCard, ConceptCard, FAQCard
- **educationTokens.ts** — Validation rules and allowed icons per education card type
- **rules.ts** — The 5 slow-carb rules + 30/30 rule
- **stock.ts** — Basic stock categories (eiwit, bonen, groenten, pantry, kruiden, extra)

### Design System

- **Tailwind config** extends with custom color scales: `sage` (primary green), `clay` (warm accent), `stone` (neutrals), `cream` (background)
- **Design tokens** in `src/designTokens/index.ts` — 8pt grid spacing, typography scale, shadows, layout constants (header 64px, bottom nav 80px, safe bottom 96px)
- **shadcn/ui** (new-york style, Radix-based) — components in `src/components/ui/`, configured via `components.json`
- **Custom CSS** in `src/index.css` — utility classes for premium card styles
- **Education cards** use semantic color coding: rules=green gradient, concepts=amber gradient, reference=white

### Component Organization

- `src/components/` — App-specific components (Dashboard, RecipesList, ShoppingListSection, etc.)
- `src/components/education/` — ConceptCard, FAQCard, RuleCard
- `src/components/primitives/` — Badge, Button, Card, Text (app-level primitives)
- `src/components/ui/` — shadcn/ui library components (do not edit manually, use shadcn CLI)
- `src/components/LandingPage.tsx` — Sales landing page (standalone, not yet routed)

### Important Patterns

- **AmmoCheck** — Simplified daily checklist for the 5 slow-carb rules (our streamlined version of a full daily tracker)
- **Package Selector flow**: Recipe → PackageSelectorModal → user picks package sizes → items added to shopping list via `addItemsFromPackage` with consolidation, or marked "already have" → added to pantry
- **Category inference**: `useShoppingList` uses regex-based `normalizeCategory()` to auto-categorize ingredients into eiwit/groente/pantry/overig
- **Emoji mapping**: `getEmojiForIngredient()` in useShoppingList maps ingredient names to emoji icons
- **Path alias**: `@/` resolves to `./src/` (configured in both tsconfig.json and vite.config.ts)
- **Dialog centering**: All modals use base `DialogContent` from `src/components/ui/dialog.tsx` with `w-[calc(100%-2rem)]` + `translate-x-[-50%]`. Do NOT add extra `mx-*` or `!w-full` overrides.

## TypeScript

Strictmode enabled with noUnusedLocals, noUnusedParameters, verbatimModuleSyntax. Types are in `src/types/index.ts`.

## Deploy

Production: Vercel (auto-deploy on push to main)
URL: https://slowcarb-new.vercel.app

## Rules for AI Agents

1. Do NOT modify `src/components/ui/` files — use shadcn CLI for updates
2. All text content must be in Dutch
3. Use existing design tokens (sage/stone/cream palette) — no new colors
4. Mobile-first: test at 390px width
5. Build must pass (`npm run build`) before any commit

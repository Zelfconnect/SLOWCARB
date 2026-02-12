# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

```bash
npm run dev          # Start Vite dev server with HMR
npm run build        # TypeScript check + Vite production build
npm run lint         # ESLint
npm run preview      # Preview production build
```

No test framework is configured. On Windows, use quoted paths: `cd "C:\dev\slowcarb"`.

## Architecture

**Single-page mobile-first app** for the Slow-Carb diet (Tim Ferriss's 4-Hour Body). All content is in Dutch.

### Routing & State
- No React Router. Tab-based navigation via `activeTab` state in App.tsx + `<BottomNav>`.
- 4 tabs: `dashboard`, `recipes`, `learn`, `shopping` (shopping has sub-tabs `list` | `stock`).
- All state is prop-drilled from App.tsx. No Context or state management library.
- Persistence via `useLocalStorage` hook → all user data lives in localStorage.

### Key localStorage Keys
`slowcarb-favorites`, `slowcarb-journey`, `slowcarb-weight-log`, `slowcarb-meal-log`, `slowcarb-shopping-v2`, `slowcarb-pantry`, `slowcarb-pantry-standard`, `slowcarb-stock`

### Hooks (src/hooks/)
- **useLocalStorage** — Generic localStorage with `StorageEvent` sync across tabs
- **useJourney** — 84-day journey tracker: progress, day/week tips, meal logging, streak calculation, cheat day detection
- **useShoppingList** — Shopping list with package-size-aware consolidation (merges duplicate ingredients across recipes)
- **usePantry** — Pantry/stock management with standard items checklist and restock suggestions
- **useFavorites** — Recipe favorites toggle
- **useStock** — Basic stock checklist (separate from usePantry)

### Data Layer (src/data/)
- **recipes.ts** — Recipe database with Dutch recipes, ingredients have `scalable` flag
- **packageSizes.ts** — Dutch supermarket package sizes (stuks/gram/kg/blikken etc.) + `STANDARD_PANTRY_ITEMS` + `getPackageSizes()` lookup
- **journey.ts** — Day-by-day tips (days 1-7) and week tips (weeks 1-3) for metabolic adaptation
- **education.ts** — Structured education cards: RuleCard, ConceptCard, FAQCard
- **educationTokens.ts** — Validation rules and allowed icons per education card type
- **rules.ts** — The 5 slow-carb rules + 30/30 rule
- **stock.ts** — Basic stock categories (eiwit, bonen, groenten, pantry, kruiden, extra)

### Design System
- **Tailwind config** extends with custom color scales: `primary` (green), `accent` (amber), `warm` (beige gray), `sage`, `clay`
- **Design tokens** in `src/designTokens/index.ts` — 8pt grid spacing, typography scale, shadows, layout constants (header 64px, bottom nav 80px, safe bottom 96px)
- **shadcn/ui** (new-york style, Radix-based) — ~40 components in `src/components/ui/`, configured via `components.json`
- **Custom CSS** in `src/index.css` — `.card-premium`, `.btn-primary`, `.btn-secondary`, `.glass`, `.progress-premium` utility classes
- **Education cards** use semantic color coding: rules=green gradient, concepts=amber gradient, reference=white

### Component Organization
- `src/components/` — App-specific components (Dashboard, RecipesList, ShoppingListSection, etc.)
- `src/components/education/` — ConceptCard, FAQCard, RuleCard
- `src/components/primitives/` — Badge, Button, Card, Text (app-level primitives)
- `src/components/ui/` — shadcn/ui library components (do not edit manually, use shadcn CLI)

### Important Patterns
- **Package Selector flow**: Recipe → PackageSelectorModal → user picks package sizes → items added to shopping list via `addItemsFromPackage` with consolidation, or marked "already have" → added to pantry
- **Category inference**: `useShoppingList` uses regex-based `normalizeCategory()` to auto-categorize ingredients into eiwit/groente/pantry/overig
- **Emoji mapping**: `getEmojiForIngredient()` in useShoppingList maps ingredient names to emoji icons
- **Path alias**: `@/` resolves to `./src/` (configured in both tsconfig.json and vite.config.ts)

## TypeScript
Strict mode enabled with `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`. Types are in `src/types/index.ts`.

# CLAUDE.md

This file provides guidance to Claude Code, Codex, and Kimi when working with code in this repository.

**Last Updated:** 2026-02-15 (V3 "Zero Planning" architecture)

---

## Build & Dev Commands

```bash
npm run dev          # Start Vite dev server with HMR
npm run build        # TypeScript check + Vite production build
npm run lint         # ESLint
npm run preview      # Preview production build
```

No test framework is configured. On Windows, use quoted paths: `cd "C:\dev\slowcarb"`.

---

## Architecture Overview

**Single-page mobile-first app** for the Slow-Carb diet (Tim Ferriss's 4-Hour Body). All content is in Dutch.

### Tech Stack
- **Framework:** Vite React SPA (NOT Next.js)
- **Styling:** Tailwind CSS + shadcn/ui components
- **State:** Zustand + localStorage persistence
- **Language:** TypeScript (strict mode)
- **Icons:** Lucide React (100% emoji-free)

### V3 Philosophy
- **Repetition > Variety** — Focus on consistent habits, not meal diversity
- **Zero decisions** — App learns user patterns, suggests favorites
- **Just-in-time education** — Contextual tips, no separate info pages
- **Ingredient-first** — Protein selection → max 3 recipes shown

---

## Routing & Navigation

### Tab-Based Routing
No React Router. Navigation via `activeTab` state in App.tsx + `<BottomNav>`.

**5 tabs:**
1. `dashboard` — Home/progress (streak, weight, meals, cheat countdown)
2. `recipes` — Recipe browser with favorites
3. `learn` — Education cards (rules, concepts, FAQs)
4. `shopping` — Shopping list (sub-tabs: `list` | `stock`)
5. `settings` — Profile, preferences, data management

Navigation handled by `setActiveTab()` callback from `<BottomNav>` to App.tsx.

---

## State Management

### Zustand Stores

**`useUserStore` (src/store/useUserStore.ts)**
- Manages UserProfile (onboarding status, preferences, goals)
- localStorage key: `STORAGE_KEYS.PROFILE`
- Actions: `loadProfile()`, `updateProfile()`, `logout()`
- **CRITICAL:** Always check `isLoaded` before checking `profile` to avoid race conditions

**Pattern:**
```tsx
const { profile, isLoaded, loadProfile, updateProfile } = useUserStore();

// ALWAYS check isLoaded first
if (!isLoaded) {
  return null; // or <LoadingSpinner />
}

if (!profile || !profile.hasCompletedOnboarding) {
  return <OnboardingWizard ... />;
}
```

### Custom Hooks (src/hooks/)
All use `useLocalStorage` for persistence with cross-tab sync via `StorageEvent`.

- **useLocalStorage** — Generic localStorage with JSON serialization + tab sync
- **useJourney** — 84-day journey tracker (progress, streak, meal logging, cheat day detection)
- **useShoppingList** — Shopping list with package-size-aware consolidation
- **usePantry** — Pantry/stock with standard items + restock suggestions
- **useFavorites** — Recipe favorites toggle
- **useStock** — Basic stock checklist

### localStorage Keys (src/lib/storageKeys.ts)
```typescript
export const STORAGE_KEYS = {
  PROFILE: 'slowcarb-profile',
  FAVORITES: 'slowcarb-favorites',
  JOURNEY: 'slowcarb-journey',
  WEIGHT_LOG: 'slowcarb-weight-log',
  MEAL_LOG: 'slowcarb-meal-log',
  SHOPPING: 'slowcarb-shopping-v2',
  PANTRY: 'slowcarb-pantry',
  PANTRY_STANDARD: 'slowcarb-pantry-standard',
  STOCK: 'slowcarb-stock',
};
```

---

## Onboarding Flow

### OnboardingWizard (src/components/OnboardingWizard.tsx)

**5-step non-dismissible modal:**
1. **Naam** — Input for user's name
2. **Doel** — Weight goal slider (3-20 kg)
3. **Voorkeuren** — Vegetarian, has airfryer, sports regularly (checkboxes)
4. **Cheat day** — Zaterdag or Zondag (radio buttons)
5. **Samenvatting** — Review + "Start je Journey" button

**Behavior:**
- Renders full-screen (`fixed inset-0`)
- Cannot be dismissed (`onPointerDownOutside` + `onEscapeKeyDown` prevented)
- Progress dots (1-5) at top
- Validates name input before allowing "Volgende"
- On completion: calls `updateProfile()` with `hasCompletedOnboarding: true` + `startJourney()`

**UserProfile Type:**
```typescript
interface UserProfile {
  hasCompletedOnboarding: boolean;
  name: string;
  weightGoal: number;
  isVegetarian: boolean;      // Alias for vegetarian
  vegetarian: boolean;
  allergies: string;
  hasAirfryer: boolean;
  sportsRegularly: boolean;
  doesSport: boolean;          // Alias for sportsRegularly
  cheatDay: "zaterdag" | "zondag";
  createdAt: string;
}
```

**Trigger:** App.tsx shows OnboardingWizard when `!profile || !profile.hasCompletedOnboarding`.

---

## Design System

### shadcn/ui Compliance (MANDATORY)

**ALWAYS use shadcn/ui components and design tokens. NEVER hardcode colors.**

#### Design Tokens (Use These)
```typescript
// Text colors
text-muted-foreground        // Secondary text (NOT text-gray-*)
text-card-foreground         // Card text
text-destructive             // Error/destructive text

// Backgrounds
bg-card                      // Card backgrounds (NOT bg-white)
bg-muted                     // Muted backgrounds (NOT bg-gray-*)
bg-background                // Page background
bg-destructive               // Destructive button background (NOT bg-red-*)

// Borders
border                       // Default border (NOT border-gray-*)
```

#### Component Patterns

**Card Usage:**
```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Section Title</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Content */}
  </CardContent>
</Card>
```

**Separator Usage:**
```tsx
import { Separator } from '@/components/ui/separator';

<CardContent className="space-y-4">
  <div>First item</div>
  <Separator />
  <div>Second item</div>
  <Separator />
  <div>Third item</div>
</CardContent>
```

**AlertDialog for Destructive Actions:**
```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Wis alle data</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Weet je het zeker?</AlertDialogTitle>
      <AlertDialogDescription>
        Dit kan niet ongedaan worden gemaakt.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Annuleer</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>
        Verwijder
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

#### FORBIDDEN Patterns
❌ **NEVER do this:**
```tsx
// Hardcoded colors
<p className="text-gray-600">Text</p>           // Use text-muted-foreground
<div className="bg-white">...</div>             // Use bg-card
<Button className="bg-red-600">Delete</Button>  // Use variant="destructive"
<div className="border-gray-300">...</div>      // Use border
```

✅ **ALWAYS do this:**
```tsx
<p className="text-muted-foreground">Text</p>
<div className="bg-card">...</div>
<Button variant="destructive">Delete</Button>
<div className="border">...</div>
```

### Tailwind Custom Scales

**Color Palette:**
- `primary-*` — Green (sage) for CTAs and brand
- `accent-*` — Amber for highlights
- `warm-*` — Beige-gray for neutral surfaces
- `sage-*` — Alternative green scale
- `clay-*` — Earthy warm tones

**Spacing (8pt grid):**
Design tokens use 8pt grid spacing (gap-4, p-6, space-y-4, etc.).

**Layout Constants (src/designTokens/index.ts):**
- Header: 64px (`h-16`)
- Bottom nav: 80px (`h-20`)
- Safe bottom padding: 96px (`pb-24`)

### Custom CSS Classes (src/index.css)

Utility classes for premium styling:
- `.card-premium` — Elevated card with gradient
- `.btn-primary` — Primary button style
- `.btn-secondary` — Secondary button style
- `.glass` — Glassmorphism effect
- `.progress-premium` — Premium progress bar

**Use sparingly** — prefer shadcn/ui components + Tailwind utilities.

---

## Component Organization

### Directory Structure
```
src/
├── components/
│   ├── ui/                    # shadcn/ui library (DO NOT edit manually)
│   ├── education/             # ConceptCard, FAQCard, RuleCard
│   ├── primitives/            # App-level primitives (Badge, Button, Card, Text)
│   ├── Dashboard.tsx
│   ├── RecipesList.tsx
│   ├── SettingsTab.tsx
│   ├── OnboardingWizard.tsx
│   └── ...
├── store/
│   └── useUserStore.ts        # Zustand store
├── hooks/
│   └── use*.ts                # Custom hooks
├── data/
│   ├── recipes.ts
│   ├── packageSizes.ts
│   ├── journey.ts
│   ├── education.ts
│   └── ...
├── types/
│   └── index.ts               # All TypeScript types
└── lib/
    └── storageKeys.ts
```

### shadcn/ui Components (src/components/ui/)

**40+ components installed** (new-york style, Radix-based).

**Management:**
```bash
# Add new component
npx shadcn@latest add [component-name]

# Update existing component
npx shadcn@latest add [component-name] --overwrite
```

**DO NOT manually edit files in `src/components/ui/`** — use shadcn CLI to update.

---

## Data Layer (src/data/)

### recipes.ts
Recipe database with Dutch recipes. Each recipe has:
- `icon: RecipeIconKey` — Lucide icon name (cooking-pot, soup, flame, salad, fish, egg)
- `ingredients: Ingredient[]` — Each ingredient has `scalable?: boolean` flag
- `category` — ontbijt | lunch | avond | airfryer | mealprep | snack
- `tags` — Array of searchable tags

### packageSizes.ts
Dutch supermarket package sizes with intelligent lookup:
- `getPackageSizes(ingredient)` — Returns realistic package options
- `STANDARD_PANTRY_ITEMS` — Checklist of essential pantry items
- Format: `{ amount: number, label: string, unit: string }`

### journey.ts
Day-by-day tips (days 1-7) and week tips (weeks 1-3) for metabolic adaptation.

### education.ts
Structured education cards with type safety:
- `RuleCard` — The 5 slow-carb rules + 30/30 rule
- `ConceptCard` — Core concepts (metabolic switch, whoosh effect, etc.)
- `FAQCard` — Common questions + answers

**Semantic color coding:**
- Rules → green gradient (`from-primary-500 to-primary-600`)
- Concepts → amber gradient (`from-amber-500 to-amber-600`)
- Reference → white (`bg-white`)

### educationTokens.ts
Validation rules for education cards:
- Allowed icons per card type (enforces consistency)
- Icon name validation (prevents typos)

---

## Important Patterns

### Package Selector Flow
1. User clicks recipe → `onOpenPackageSelector(recipeName, ingredients)`
2. `<PackageSelectorModal>` opens with ingredient list
3. User selects package sizes OR marks "already have"
4. `onConfirm()` callback:
   - Items to buy → `addItemsFromPackage()` → shopping list (with consolidation)
   - "Already have" items → `addToPantry()` → pantry

### Category Inference
`useShoppingList` uses `normalizeCategory()` (regex-based) to auto-categorize:
- Eiwit: kip, vis, ei, tonijn, gehakt, etc.
- Groente: broccoli, spinazie, tomaat, ui, etc.
- Pantry: olie, zout, peper, kruiden, etc.
- Overig: everything else

### Emoji Mapping (DEPRECATED)
`getEmojiForIngredient()` still exists but **ICONS ARE PREFERRED**.  
App is now 100% emoji-free. Use Lucide React icons instead.

### Path Alias
`@/` resolves to `./src/` (configured in tsconfig.json + vite.config.ts).

---

## TypeScript

**Strict mode enabled:**
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `verbatimModuleSyntax: true`

**All types in `src/types/index.ts`.**

Common types:
- `Recipe`, `Ingredient`, `RecipeIconKey`
- `UserProfile` (onboarding + preferences)
- `Journey`, `MealEntry`, `DayStatus`
- `ShoppingItem`, `PantryItem`
- `EducationCardType`, `EducationIconKey`

---

## Code Quality Standards

### File Size
- **Soft limit:** 200 lines
- **Hard limit:** 400 lines
- Exceptions: test files, generated code, schemas

### Component Rules
- 1 component per file
- Co-located tests (if applicable)
- Barrel exports for related components
- Intent comments for non-obvious logic

### Refactoring Triggers
3+ fixes with side effects → stop patching, rebuild clean.

### Touch Targets
Minimum 44px (`h-11`) for all interactive elements (buttons, checkboxes, radio buttons).

---

## Common Pitfalls

### ❌ Race Condition in Onboarding
```tsx
// WRONG — doesn't check isLoaded
if (!profile || !profile.hasCompletedOnboarding) {
  return <OnboardingWizard />;
}
```

```tsx
// CORRECT — checks isLoaded first
if (!isLoaded) {
  return null;
}

if (!profile || !profile.hasCompletedOnboarding) {
  return <OnboardingWizard />;
}
```

### ❌ Hardcoded Colors
```tsx
// WRONG
<p className="text-gray-600">Description</p>
<Button className="bg-red-600">Delete</Button>
```

```tsx
// CORRECT
<p className="text-muted-foreground">Description</p>
<Button variant="destructive">Delete</Button>
```

### ❌ Missing Separators
```tsx
// WRONG — no visual separation
<CardContent className="space-y-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</CardContent>
```

```tsx
// CORRECT — separators between items
import { Separator } from '@/components/ui/separator';

<CardContent className="space-y-4">
  <div>Item 1</div>
  <Separator />
  <div>Item 2</div>
  <Separator />
  <div>Item 3</div>
</CardContent>
```

---

## Deployment

**Production:** https://slowcarb-new.vercel.app

Vercel auto-deploys on push to `main` branch.

Build process:
1. TypeScript check (`tsc -b`)
2. Vite production build
3. Output: `dist/` (static assets)

**Verify deployment:**
```bash
curl -sI https://slowcarb-new.vercel.app | grep last-modified
```

---

## Agent-Specific Guidelines

### For Codex
- Always use `codex exec -s danger-full-access`
- Atomic tasks: 1 component = 1 run
- NO multi-component PRDs in single run (causes analysis loops)
- Runtime verification mandatory after every run

### For Kimi
- Use browser tool directly (NOT Playwright scripts)
- Split complex QA into multiple runs (3+ screenshots = split)
- Default timeout: 180s (increase to 300s for multi-step QA)
- Screenshots + DOM inspection preferred over generated scripts

### For Claude Code
- Read this file before starting any task
- Check `WORKFLOW.md` for orchestration patterns
- Consult `PRD_TEMPLATE.md` for structured handoffs
- Always verify shadcn compliance (no hardcoded colors)

---

## Questions?

Check:
1. This file (CLAUDE.md) — architecture + patterns
2. `WORKFLOW.md` — orchestration + tool routing
3. `src/types/index.ts` — type definitions
4. `components.json` — shadcn/ui configuration
5. PRDs in `docs/` — historical context for major features

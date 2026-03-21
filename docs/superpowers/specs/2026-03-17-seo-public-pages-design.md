# SEO & Public Content Pages — Design Spec

**Date:** 2026-03-17
**Status:** Draft
**Scope:** Landing consolidation, React Router, public SEO pages, structured data, pre-rendering

---

## Problem

eatslowcarb.com is invisible to Google (0 indexed pages). The site has strong content (50+ recipes, 84-day education program, compelling founder story) but none of it is crawlable. Three root causes:

1. **React SPA without pre-rendering** — Googlebot can't reliably render client-side JS
2. **No public content pages** — all valuable content is behind auth
3. **Missing SEO infrastructure** — no robots.txt, sitemap, canonical URLs, or structured data
4. **Dual landing page** — `public/landing.html` (static, served in production) and `src/components/landing/LandingPage.tsx` (React, never served) create confusion and block routing consolidation

## Solution Overview

Add React Router as the routing spine. Consolidate to the React landing. Build public content pages with a hybrid design (dark branded header + clean reading body). Add SEO infrastructure. Pre-render public routes with `@prerenderer/rollup-plugin` for static HTML output.

---

## 1. Landing Consolidation

### What changes

| Before | After |
|--------|-------|
| `public/landing.html` serves as live landing | Deleted |
| `App.tsx:94` redirects to `/landing.html` | Removed — `/` renders `LandingPage` via React Router |
| `vercel.json` has explicit `landing.html` rewrite | Removed — catch-all SPA rewrite handles everything |
| Legal routes use manual `window.location.pathname` | Moved into React Router |

### Files affected

- **Delete:** `public/landing.html`, `public/landing.css`
- **Modify:** `src/App.tsx` — remove redirect logic, integrate React Router
- **Modify:** `vercel.json` — remove `landing.html` rewrite
- **Keep:** All `src/components/landing/*` components unchanged

### Risk mitigation

The React landing (`LandingPage.tsx`) was built as a replacement but never activated. Before deleting `landing.html`, verify:
- All sections from `landing.html` exist in the React version (hero, recognition, solution, app showcase, rules, founder, pricing, FAQ, final CTA, footer)
- Stripe checkout link is identical
- OG/meta tags are equivalent (handled by new `SEOHead` component)
- Analytics events fire correctly

---

## 2. Routing Architecture

### Router setup

Add `react-router-dom` with `BrowserRouter`. All routes defined in `App.tsx`.

```
Public routes (no auth, pre-rendered):
  /                           → LandingPage
  /gids/slow-carb-dieet       → PillarPage
  /gids/slow-carb-vs-keto     → ArticlePage
  /recepten                   → RecipeIndexPage
  /recepten/:slug             → RecipeDetailPage

Legal routes (no auth, not pre-rendered, noindex):
  /privacy-policy             → PrivacyPolicyPage
  /terms-of-service           → TermsOfServicePage
  /refund-policy              → RefundPolicyPage

App routes (auth required, not pre-rendered):
  /?app=1                     → AppShell
  /?welcome=1                 → WelcomePage
```

### Auth flow

The `?app=1` query parameter pattern stays. React Router handles path-based routes; query-param routes are handled inside the `/` route component with the existing logic:

```
/ route handler:
  if ?welcome=1 → WelcomePage
  if ?app=1 + hasAccess → AppShell
  if ?app=1 + !hasAccess → LoginPage
  else → LandingPage
```

This preserves backward compatibility with existing Stripe redirect URLs (`/?welcome=1`) and bookmarked app URLs (`/?app=1`).

### 404 handling

A catch-all route (`*`) renders a `NotFoundPage` component — minimal page with a link back to `/` and a suggestion to check `/recepten` or `/gids/slow-carb-dieet`. Uses `noindex` meta tag.

### Navigation between layers

- Public pages link to each other (internal linking for SEO)
- Public pages have CTA buttons linking to Stripe checkout (same as current landing)
- Public pages have a shared navigation header with links to key sections
- App shell navigation (BottomNav) is unchanged

---

## 3. Page Design — Hybrid (Dark Header + Clean Body)

### Shared layout: `ContentPageLayout`

Every public content page (except landing) uses this layout:

```
┌──────────────────────────────────────────┐
│  ContentPageHeader (dark, ~120px)        │
│  ┌────────────────────────────────────┐  │
│  │ Breadcrumb (muted)                 │  │
│  │ Kicker (sage, uppercase)           │  │
│  │ Title (Fraunces, white, large)     │  │
│  │ Author + reading time (muted)      │  │
│  └────────────────────────────────────┘  │
│  Gradient transition (dark → cream)      │
├──────────────────────────────────────────┤
│  Content body (cream bg, max-w-prose)    │
│  ┌────────────────────────────────────┐  │
│  │ H2 sections (Georgia/Fraunces)     │  │
│  │ Body text (Satoshi, 1.125rem)      │  │
│  │ Callout cards (sage left-border)   │  │
│  │ Rule cards (sage gradient bg)      │  │
│  │ Comparison tables                  │  │
│  │ Inline CTAs                        │  │
│  └────────────────────────────────────┘  │
├──────────────────────────────────────────┤
│  Author card (Jesper bio + photo)        │
├──────────────────────────────────────────┤
│  Related content links                   │
├──────────────────────────────────────────┤
│  CTA band (dark bg, Stripe link)         │
├──────────────────────────────────────────┤
│  Footer (same as landing)                │
└──────────────────────────────────────────┘
```

### Design tokens used

All colors map to existing palette values — no new colors introduced:

- **Dark header:** stone-900 (#1c1917) → sage-700 (#314f31) gradient
- **Kicker:** `editorial-kicker` class (exists in `landing.css`), sage-600 color
- **Title:** Fraunces display, white, letter-spacing -0.02em
- **Body background:** cream (#FAFAF9) — existing Tailwind `bg-cream`
- **Body text:** Satoshi, stone-800 (#292524), 1.125rem, line-height 1.65
- **H2:** Fraunces, stone-900, 1.5rem
- **Callouts:** sage-600 left-border, sage-50/90% background
- **CTA buttons:** `cta-accent-button` class (exists in `landing.css`)

### CSS class sourcing

The landing page CSS classes (`editorial-kicker`, `editorial-body`, `cta-accent-button`, etc.) are currently scoped under `.landing-page` in `src/styles/landing.css`. For content pages, we create a shared scope `.content-page` in a new `src/styles/content.css` that reuses the same token values. This avoids modifying landing styles while keeping visual consistency.

### Mobile-first approach

All layouts are designed mobile-first at 390px viewport width (per CLAUDE.md):
- Content body: full-width with `px-4` padding, `max-w-prose` on larger screens
- Recipe page: single column on mobile; ingredients become sticky sidebar at `md:` (768px+)
- ContentPageHeader: compact padding on mobile, more breathing room on desktop
- Recipe meta bar: horizontal scroll or wrap on mobile, inline on desktop

### Recipe page variant: `RecipePageLayout`

Recipe detail pages get a specialized layout:

```
┌──────────────────────────────────────────┐
│  ContentPageHeader                       │
│  (title = recipe name, kicker = category)│
├──────────────────────────────────────────┤
│  Recipe meta bar                         │
│  ┌──────┬──────┬──────┐                  │
│  │ Prep │ Cook │ Port │                  │
│  └──────┴──────┴──────┘                  │
├──────────────────────────────────────────┤
│  "Voldoet aan alle 5 regels" badge       │
├──────────────────────────────────────────┤
│  Ingredients list (card)                 │
├──────────────────────────────────────────┤
│  Steps (numbered, card per step)         │
├──────────────────────────────────────────┤
│  Tips (if available)                     │
├──────────────────────────────────────────┤
│  Tags (ontbijt, airfryer, etc.)          │
├──────────────────────────────────────────┤
│  Related recipes (3 cards)               │
├──────────────────────────────────────────┤
│  CTA: "Alle 50+ recepten → €47"         │
├──────────────────────────────────────────┤
│  Footer                                  │
└──────────────────────────────────────────┘
```

On desktop (768px+), ingredients become a sticky sidebar alongside the steps.

### Recipe index page: `/recepten`

Grid of recipe cards (image placeholder, title, category tag, prep time). Links to individual recipe pages. CTA banner: "Dit zijn 15 van onze 50+ recepten."

---

## 4. Content Sources

### Pillar page: `/gids/slow-carb-dieet`

- **Source:** `docs/SEO/content/pillar-slow-carb-dieet-gids.md` (2,500+ words, ready)
- **Sections:** Wat is slow carb, Hoe werkt het, 5 regels, Boodschappenlijst, Weekplanning, Vergelijkingen, Resultaten, FAQ
- **Schema:** Article + FAQPage (FAQ section at bottom)

### Comparison article: `/gids/slow-carb-vs-keto`

- **Source:** `docs/SEO/content/blog-slow-carb-vs-keto.md` (1,500+ words, ready)
- **Schema:** Article + FAQPage

### Recipe pages: `/recepten/:slug`

- **Source:** `src/data/recipes.ts` — existing recipe data, rendered as public pages
- **Which 15:** Selection from `docs/SEO/content/recept-seo-selectie.md` (Tier 1-3)
- **Schema:** Recipe (per page) — `nutrition` field omitted from JSON-LD (data not available; schema is valid without it, just won't get nutrition rich snippets)
- **Slug generation:** kebab-case from recipe name (e.g., "Mega Chili Con Carne" → `mega-chili-con-carne`)

### Recipe data shape note

The `Recipe` interface in `types/index.ts` defines `steps: RecipeStep[]` (objects with `text` and `note`), but `recipes.ts` actually uses `LegacyRecipe` where `steps: string[]`. The `RecipeDetailPage` must consume the `LegacyRecipe` shape from `recipes.ts`, not the `Recipe` interface. The `seo-recipes.ts` mapping file will reference recipes by `id` from the legacy data.

### Content storage

Content for guide/blog pages stored as data objects in `src/data/seo-content.ts`:

```typescript
interface SEOArticle {
  slug: string;
  title: string;
  kicker: string;
  metaTitle: string;
  metaDescription: string;
  author: string;
  readingTime: string;
  publishDate: string;
  lastModified: string;
  sections: ArticleSection[];
  faq?: FAQItem[];
}
```

This keeps content in the codebase (no CMS needed), co-located with the components that render it. Markdown rendering is not needed — sections contain structured HTML-ready content.

---

## 5. SEO Infrastructure

### `SEOHead` component

A component that manages document head per route:

```typescript
interface SEOHeadProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noindex?: boolean;
  jsonLd?: object | object[];
}
```

Uses `document.title` and DOM manipulation to set meta tags (no helmet library needed — react-snap captures the final DOM state).

### Structured data per page type

| Page | JSON-LD schemas |
|------|----------------|
| Landing `/` | `WebApplication` + `FAQPage` |
| Pillar guide | `Article` + `FAQPage` + `BreadcrumbList` |
| Blog/comparison | `Article` + `FAQPage` + `BreadcrumbList` |
| Recipe index | `CollectionPage` + `BreadcrumbList` |
| Recipe detail | `Recipe` + `BreadcrumbList` |
| Legal pages | None (noindex) |

Schema templates from `docs/SEO/technisch/seo-schema-templates.md`.

### Static SEO files

**`public/robots.txt`:**
```
User-agent: *
Allow: /

Sitemap: https://eatslowcarb.com/sitemap.xml

Disallow: /api/
```

**`public/sitemap.xml`:** Generated at build time by a custom build script (`scripts/generate-sitemap.ts`) that imports the route list from `seo-recipes.ts` — the same single source of truth used by the prerenderer. The script writes `sitemap.xml` to `/dist` during the build step. Uses `lastModified` from `SEOArticle` and a static date for recipe pages.

### Meta tags

- `<link rel="canonical" href="https://eatslowcarb.com{path}">` on every page
- `<meta name="robots" content="index, follow">` on public pages
- `<meta name="robots" content="noindex">` on legal pages
- `og:locale` fixed to `nl_NL` everywhere
- `lang="nl"` on `<html>` element

### Title tag pattern

| Page | Title |
|------|-------|
| Landing | SlowCarb – Val 8-10 kg af in 6 weken (50 chars) |
| Pillar | Slow Carb Dieet: Complete Gids (2026) (38 chars) |
| Slow Carb vs Keto | Slow Carb vs Keto: Welk Dieet Past? (36 chars) |
| Recipe detail | {Naam} – Slow Carb Recept \| SlowCarb |
| Recipe index | 50+ Slow Carb Recepten \| SlowCarb (34 chars) |

All titles ≤60 characters.

---

## 6. Pre-rendering with `@prerenderer/rollup-plugin`

### Why not `react-snap`?

`react-snap` is unmaintained since 2019, predates React 18/19, and relies on the removed `ReactDOM.render` API. It will not work with our stack.

### Tool choice: `@prerenderer/rollup-plugin`

Actively maintained Vite/Rollup-compatible prerenderer. Uses Puppeteer under the hood but provides a modern plugin API. Alternative: a custom Puppeteer build script that crawls `dist` post-build.

### How it works

1. `npm run build` runs Vite + the prerenderer plugin
2. The plugin launches Puppeteer, visits each listed route, and saves the rendered HTML
3. Output: `/dist/index.html` (landing), `/dist/gids/slow-carb-dieet/index.html`, `/dist/recepten/mega-chili-con-carne/index.html`, etc.
4. Vercel serves these static HTML files directly (before the SPA catch-all rewrite); React hydrates on the client

### Configuration

```typescript
// vite.config.ts
import prerender from '@prerenderer/rollup-plugin';
import { PUBLIC_RECIPE_SLUGS } from './src/data/seo-recipes';

const publicRoutes = [
  '/',
  '/gids/slow-carb-dieet',
  '/gids/slow-carb-vs-keto',
  '/recepten',
  ...PUBLIC_RECIPE_SLUGS.map(slug => `/recepten/${slug}`),
];

export default defineConfig({
  plugins: [
    react(),
    prerender({
      routes: publicRoutes,
      renderer: new PuppeteerRenderer(),
    }),
  ],
});
```

The route list is derived from `seo-recipes.ts` — single source of truth for both the prerenderer and sitemap generator.

### What gets pre-rendered

- `/` (landing page)
- `/gids/*` (guide pages)
- `/recepten` (recipe index)
- `/recepten/:slug` (15 individual recipes)

### What does NOT get pre-rendered

- `/?app=1` (authenticated app shell)
- `/?welcome=1` (post-purchase welcome)
- `/privacy-policy`, `/terms-of-service`, `/refund-policy` (low SEO value)

### Vercel serving order

Vercel serves static files before evaluating rewrites. Since the prerenderer outputs `index.html` files in subdirectories (e.g., `/dist/recepten/mega-chili-con-carne/index.html`), Vercel will serve these directly. The SPA catch-all only activates for routes without a pre-rendered file (app shell, legal pages).

### Hydration

`src/main.tsx` switches from `createRoot` to `hydrateRoot` when pre-rendered HTML is detected:

```typescript
const root = document.getElementById('root');
if (root?.hasChildNodes()) {
  hydrateRoot(root, <App />);
} else {
  createRoot(root!).render(<App />);
}
```

### StrictMode consideration

React's `StrictMode` double-invokes effects during development. With hydration, this can cause mismatches (especially with `IntersectionObserver` animations on the landing page). If hydration warnings appear, conditionally disable StrictMode for pre-rendered routes or ensure observers check for pre-existing state before firing.

---

## 7. File Structure (new/modified files)

```
src/
├── App.tsx                          # MODIFIED — React Router, remove redirect
├── main.tsx                         # MODIFIED — hydration support
├── components/
│   ├── seo/
│   │   ├── SEOHead.tsx              # NEW — manages <head> meta/schema per route
│   │   ├── ContentPageHeader.tsx    # NEW — dark branded header
│   │   ├── ContentPageLayout.tsx    # NEW — reading layout wrapper
│   │   ├── RecipePageLayout.tsx     # NEW — recipe-specific layout
│   │   ├── AuthorCard.tsx           # NEW — Jesper bio card
│   │   ├── CTABand.tsx              # NEW — conversion CTA strip
│   │   └── Breadcrumb.tsx           # NEW — breadcrumb nav
│   ├── pages/
│   │   ├── PillarPage.tsx           # NEW — /gids/slow-carb-dieet
│   │   ├── ArticlePage.tsx          # NEW — /gids/slow-carb-vs-keto
│   │   ├── RecipeIndexPage.tsx      # NEW — /recepten
│   │   └── RecipeDetailPage.tsx     # NEW — /recepten/:slug
│   ├── landing/                     # UNCHANGED — existing landing components
│   └── legal/                       # UNCHANGED — existing legal pages
├── data/
│   ├── recipes.ts                   # UNCHANGED — recipe data
│   ├── seo-content.ts               # NEW — pillar page + blog content
│   └── seo-recipes.ts               # NEW — slug mapping + which 15 to publish
public/
├── robots.txt                       # NEW
├── sitemap.xml                      # NEW (build-generated)
├── landing.html                     # DELETED
├── landing.css                      # DELETED
vercel.json                          # MODIFIED — remove landing.html rewrite
package.json                         # MODIFIED — add react-router-dom, react-snap
```

---

## 8. Vercel Configuration (updated)

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/recepten/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=86400, s-maxage=604800" }
      ]
    },
    {
      "source": "/gids/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=86400, s-maxage=604800" }
      ]
    }
  ]
}
```

Note: existing security headers and image caching preserved (omitted for brevity).

---

## 9. What This Does NOT Include

- **No CMS** — content lives in code, not an external system
- **No Next.js migration** — stays on Vite + React
- **No English content** — Dutch only, as scoped
- **No backlink strategy** — that's marketing, not engineering
- **No Google Search Console setup** — that's a manual Jesper task
- **No new app features** — the authenticated app is unchanged
- **No recipe images** — recipes currently have no photos; pages work without them (can be added later)
- **No nutritional data** — recipe pages show prep/cook/servings but not protein/calories (data not in `recipes.ts`; can be added later)

---

## 10a. Service Worker Scope

The current `main.tsx` registers `/sw.js` which caches the SPA shell. If unconstrained, the service worker could serve stale cached content on public routes after deployment, defeating pre-rendering. Fix: scope the service worker registration to only activate on app routes:

```typescript
navigator.serviceWorker.register('/sw.js', { scope: '/?app=1' });
```

Alternatively, update the service worker to use a network-first strategy for public routes and cache-first only for app assets.

---

## 10b. CLAUDE.md Update

After implementation, update CLAUDE.md to reflect the new architecture:
- Remove "No React Router" statement
- Add routing section documenting public routes, app routes, and auth flow
- Document new directories: `components/seo/`, `components/pages/`, `data/seo-content.ts`, `data/seo-recipes.ts`
- Document pre-rendering build step
- Add `src/styles/content.css` to design system section

---

## 10. Success Criteria

1. `site:eatslowcarb.com` returns indexed pages within 4 weeks of deploy
2. Google Rich Results Test validates FAQ, Recipe, and Article schemas
3. All public routes return full HTML content (not empty SPA shell) when JS is disabled
4. Lighthouse SEO score ≥ 95 on all public pages
5. `npm run build` completes successfully with pre-rendered output
6. Landing page looks and behaves identically to current `landing.html`
7. Stripe checkout flow (`/?welcome=1`) works unchanged
8. Existing app (`/?app=1`) works unchanged

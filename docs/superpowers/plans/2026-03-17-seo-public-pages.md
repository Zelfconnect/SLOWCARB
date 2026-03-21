# SEO & Public Content Pages — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make eatslowcarb.com visible to Google by consolidating to the React landing, adding React Router for public content pages, implementing SEO infrastructure, and pre-rendering public routes.

**Architecture:** React Router handles all routing (public pages, legal, app shell). Public content pages use a hybrid design (dark branded header + clean reading body). `@prerenderer/rollup-plugin` generates static HTML at build time for crawlability. All content lives in code (no CMS).

**Tech Stack:** React 19, Vite 7.2, react-router-dom, @prerenderer/rollup-plugin, Tailwind CSS 3.4, existing design tokens (sage/stone/cream)

**Spec:** `docs/superpowers/specs/2026-03-17-seo-public-pages-design.md`

---

## Chunk 1: Foundation — React Router + Landing Consolidation

### Task 1: Install react-router-dom

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install dependency**

```bash
npm install react-router-dom
```

- [ ] **Step 2: Verify build still passes**

```bash
npm run build
```

Expected: Clean build, no errors.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add react-router-dom dependency"
```

---

### Task 2: Add SEOHead component

**Files:**
- Create: `src/components/seo/SEOHead.tsx`
- Test: `src/components/seo/__tests__/SEOHead.test.tsx`

- [ ] **Step 1: Write the test**

Create `src/components/seo/__tests__/SEOHead.test.tsx`:

```tsx
import { render } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { SEOHead } from '../SEOHead';

describe('SEOHead', () => {
  afterEach(() => {
    // Clean up meta tags added by SEOHead
    document.querySelectorAll('meta[data-seo]').forEach(el => el.remove());
    document.querySelectorAll('link[data-seo]').forEach(el => el.remove());
    document.querySelectorAll('script[data-seo]').forEach(el => el.remove());
  });

  it('sets document title', () => {
    render(
      <SEOHead
        title="Test Title"
        description="Test description"
        canonical="https://eatslowcarb.com/test"
      />
    );
    expect(document.title).toBe('Test Title');
  });

  it('sets meta description', () => {
    render(
      <SEOHead
        title="Test"
        description="My description"
        canonical="https://eatslowcarb.com/test"
      />
    );
    const meta = document.querySelector('meta[name="description"]');
    expect(meta?.getAttribute('content')).toBe('My description');
  });

  it('sets canonical URL', () => {
    render(
      <SEOHead
        title="Test"
        description="Desc"
        canonical="https://eatslowcarb.com/gids/slow-carb-dieet"
      />
    );
    const link = document.querySelector('link[rel="canonical"]');
    expect(link?.getAttribute('href')).toBe('https://eatslowcarb.com/gids/slow-carb-dieet');
  });

  it('injects JSON-LD script', () => {
    const jsonLd = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Test' };
    render(
      <SEOHead
        title="Test"
        description="Desc"
        canonical="https://eatslowcarb.com/test"
        jsonLd={jsonLd}
      />
    );
    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    expect(JSON.parse(script!.textContent!)).toEqual(jsonLd);
  });

  it('sets noindex when specified', () => {
    render(
      <SEOHead
        title="Test"
        description="Desc"
        canonical="https://eatslowcarb.com/test"
        noindex
      />
    );
    const meta = document.querySelector('meta[name="robots"]');
    expect(meta?.getAttribute('content')).toBe('noindex, nofollow');
  });

  it('sets OG tags', () => {
    render(
      <SEOHead
        title="OG Test"
        description="OG desc"
        canonical="https://eatslowcarb.com/test"
        ogType="article"
      />
    );
    const ogTitle = document.querySelector('meta[property="og:title"]');
    expect(ogTitle?.getAttribute('content')).toBe('OG Test');
    const ogType = document.querySelector('meta[property="og:type"]');
    expect(ogType?.getAttribute('content')).toBe('article');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/components/seo/__tests__/SEOHead.test.tsx
```

Expected: FAIL — module `../SEOHead` not found.

- [ ] **Step 3: Implement SEOHead**

Create `src/components/seo/SEOHead.tsx`:

```tsx
import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noindex?: boolean;
  jsonLd?: object | object[];
}

function setMeta(attr: string, value: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${value}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, value);
    el.setAttribute('data-seo', '');
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    el.setAttribute('data-seo', '');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function SEOHead({
  title,
  description,
  canonical,
  ogImage = 'https://eatslowcarb.com/images/landing/og-image.jpg',
  ogType = 'website',
  noindex = false,
  jsonLd,
}: SEOHeadProps) {
  useEffect(() => {
    document.title = title;

    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    setLink('canonical', canonical);

    // Open Graph
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:image', ogImage);
    setMeta('property', 'og:locale', 'nl_NL');

    // Twitter
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);

    // JSON-LD
    document.querySelectorAll('script[data-seo]').forEach(el => el.remove());
    if (jsonLd) {
      const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      schemas.forEach(schema => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo', '');
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      });
    }

    // Ensure lang attribute
    document.documentElement.lang = 'nl';
  }, [title, description, canonical, ogImage, ogType, noindex, jsonLd]);

  return null;
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/components/seo/__tests__/SEOHead.test.tsx
```

Expected: All 6 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/seo/SEOHead.tsx src/components/seo/__tests__/SEOHead.test.tsx
git commit -m "feat: add SEOHead component for per-route meta tags and JSON-LD"
```

---

### Task 3: Add NotFoundPage component

**Files:**
- Create: `src/components/pages/NotFoundPage.tsx`

- [ ] **Step 1: Create NotFoundPage**

```tsx
import { SEOHead } from '@/components/seo/SEOHead';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <>
      <SEOHead
        title="Pagina niet gevonden | SlowCarb"
        description="Deze pagina bestaat niet."
        canonical="https://eatslowcarb.com/404"
        noindex
      />
      <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center">
        <h1 className="font-display text-4xl font-bold text-stone-900">404</h1>
        <p className="mt-2 text-lg text-stone-600">Deze pagina bestaat niet.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/"
            className="rounded-full bg-sage-600 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Naar home
          </Link>
          <Link
            to="/recepten"
            className="rounded-full border border-sage-200 bg-white px-6 py-3 text-sm font-bold text-sage-700 shadow-sm transition hover:-translate-y-0.5"
          >
            Bekijk recepten
          </Link>
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: Clean build. (Component isn't routed yet, just needs to compile.)

- [ ] **Step 3: Commit**

```bash
git add src/components/pages/NotFoundPage.tsx
git commit -m "feat: add 404 NotFoundPage component"
```

---

### Task 4: Integrate React Router into App.tsx

This is the critical task — it rewires the entire app routing.

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`

- [ ] **Step 1: Wrap App in BrowserRouter in main.tsx**

Modify `src/main.tsx` to wrap the app:

```tsx
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'

// Analytics/SpeedInsights render outside the hydration boundary
// to avoid hydration mismatches (they inject scripts dynamically)
const appTree = (
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);

const root = document.getElementById('root')!;
if (root.hasChildNodes()) {
  hydrateRoot(root, appTree);
} else {
  createRoot(root).render(appTree);
}

// Render analytics outside the hydrated tree
const analyticsRoot = document.createElement('div');
document.body.appendChild(analyticsRoot);
createRoot(analyticsRoot).render(
  <>
    <Analytics />
    <SpeedInsights />
  </>
);

// Service worker: use network-first for public routes, cache-first for app assets.
// Note: SW scope is a path prefix, not a query-string matcher — scope '/?app=1'
// would effectively scope to '/' (the path portion). Instead, update the SW itself
// to use a network-first strategy for public routes. For now, keep default scope
// and document that SW caching should be updated if stale content issues arise.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}
```

- [ ] **Step 2: Rewrite App.tsx with React Router**

Replace the routing logic in `src/App.tsx`. The key changes:
- Remove `window.location.href = '/landing.html'` redirect (line 94)
- Remove manual `renderLegalRoute()` function
- Add `<Routes>` with all public + legal + app routes
- The `/` route handler keeps the existing `?app=1` / `?welcome=1` query param logic
- Import `Routes`, `Route` from `react-router-dom`
- Lazy import `LandingPage` from `@/components/landing/LandingPage`

The `/` route renders a `HomeRoute` component that contains the current auth/redirect logic:

```tsx
// Inside App.tsx — new HomeRoute component
const LandingPage = lazy(() => import('@/components/landing/LandingPage'));

function HomeRoute() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const searchParams = new URLSearchParams(window.location.search);

  const isWelcome = searchParams.get('welcome') === '1';
  if (isWelcome) return <WelcomePage />;

  const hasLegacyToken = Boolean(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN));

  let hasCompletedProfile = false;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (stored) {
      const p = JSON.parse(stored) as { hasCompletedOnboarding?: boolean };
      hasCompletedProfile = !!p.hasCompletedOnboarding;
    }
  } catch { /* ignore */ }

  const isDevBypass = searchParams.get('dev') === '1';
  const hasAccess = isDevBypass || !isSupabaseConfigured || isAuthenticated || hasLegacyToken || hasCompletedProfile;
  const isAppRequested = searchParams.get('app') === '1';

  if (authLoading) {
    return (
      <div className="flex h-app-screen items-center justify-center bg-cream">
        <p className="text-stone-500">Laden…</p>
      </div>
    );
  }

  if (isAppRequested && !hasAccess) return <LoginPage />;
  if (isAppRequested && hasAccess) return <AppShell />;

  // Default: landing page
  return (
    <Suspense fallback={<div className="flex h-app-screen items-center justify-center bg-cream"><p className="text-stone-500">Laden…</p></div>}>
      <LandingPage />
    </Suspense>
  );
}
```

The main `App` component becomes:

```tsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/privacy-policy" element={
        <Suspense fallback={<div className="flex h-app-screen items-center justify-center bg-cream"><p className="text-stone-500">Laden…</p></div>}>
          <PrivacyPolicyPage />
        </Suspense>
      } />
      <Route path="/terms-of-service" element={
        <Suspense fallback={<div className="flex h-app-screen items-center justify-center bg-cream"><p className="text-stone-500">Laden…</p></div>}>
          <TermsOfServicePage />
        </Suspense>
      } />
      <Route path="/refund-policy" element={
        <Suspense fallback={<div className="flex h-app-screen items-center justify-center bg-cream"><p className="text-stone-500">Laden…</p></div>}>
          <RefundPolicyPage />
        </Suspense>
      } />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
```

Note: Public content page routes (`/gids/*`, `/recepten/*`) will be added in Chunk 3 after those components exist.

- [ ] **Step 3: Run build to verify compilation**

```bash
npm run build
```

Expected: Clean build.

- [ ] **Step 4: Run existing tests**

```bash
npm run test
```

Expected: All existing tests pass. No regressions.

- [ ] **Step 5: Manual verification in dev server**

```bash
npm run dev
```

Check:
- `http://localhost:5173/` → should render the React LandingPage (NOT redirect to /landing.html)
- `http://localhost:5173/?app=1` → should render LoginPage or AppShell
- `http://localhost:5173/?welcome=1` → should render WelcomePage
- `http://localhost:5173/privacy-policy` → should render PrivacyPolicyPage
- `http://localhost:5173/nonexistent` → should render NotFoundPage

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/main.tsx
git commit -m "feat: integrate React Router, render landing via React instead of static redirect"
```

---

### Task 5: Clean up static landing files and Vercel config

**Files:**
- Delete: `public/landing.html`
- Delete: `public/landing.css`
- Modify: `vercel.json`

- [ ] **Step 1: Delete static landing files**

```bash
git rm public/landing.html public/landing.css
```

- [ ] **Step 2: Remove landing.html rewrite from vercel.json**

Edit `vercel.json` — remove the explicit `/landing.html` rewrite rule. Keep all existing content intact:
- Keep the SPA catch-all rewrite: `{ "source": "/(.*)", "destination": "/index.html" }`
- Keep all existing security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- Keep all existing image/asset cache headers
- Only remove the landing.html-specific rewrite entry

- [ ] **Step 3: Build and verify**

```bash
npm run build
```

Expected: Clean build.

- [ ] **Step 4: Commit**

```bash
git add vercel.json
git commit -m "feat: remove static landing.html, consolidate to React landing"
```

---

### Task 6: Add robots.txt and static SEO files

**Files:**
- Create: `public/robots.txt`

- [ ] **Step 1: Create robots.txt**

Create `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://eatslowcarb.com/sitemap.xml

Disallow: /api/
```

- [ ] **Step 2: Fix index.html lang and locale**

Edit `index.html`:
- Change `<html lang="en">` to `<html lang="nl">`
- Change `og:locale` from `en_US` to `nl_NL`

- [ ] **Step 3: Build and verify robots.txt is in dist**

```bash
npm run build && cat dist/robots.txt
```

Expected: robots.txt content appears in dist.

- [ ] **Step 4: Commit**

```bash
git add public/robots.txt index.html
git commit -m "feat: add robots.txt, fix lang and og:locale to nl"
```

---

## Chunk 2: Content Data Layer

### Task 7: Create seo-recipes.ts — recipe slug mapping

**Files:**
- Create: `src/data/seo-recipes.ts`

- [ ] **Step 1: Write the test**

Create `src/data/__tests__/seo-recipes.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { PUBLIC_RECIPES, PUBLIC_RECIPE_SLUGS, getRecipeBySlug } from '../seo-recipes';
import { recipes } from '../recipes';

describe('seo-recipes', () => {
  it('exports 15 public recipes', () => {
    expect(PUBLIC_RECIPES).toHaveLength(15);
  });

  it('all recipe IDs exist in recipes.ts', () => {
    const recipeIds = new Set(recipes.map(r => r.id));
    PUBLIC_RECIPES.forEach(pr => {
      expect(recipeIds.has(pr.id), `Recipe ID "${pr.id}" not found in recipes.ts`).toBe(true);
    });
  });

  it('all slugs are unique', () => {
    const slugs = new Set(PUBLIC_RECIPE_SLUGS);
    expect(slugs.size).toBe(PUBLIC_RECIPE_SLUGS.length);
  });

  it('getRecipeBySlug returns recipe data', () => {
    const first = PUBLIC_RECIPES[0];
    const result = getRecipeBySlug(first.slug);
    expect(result).toBeDefined();
    expect(result!.recipe.id).toBe(first.id);
  });

  it('getRecipeBySlug returns undefined for unknown slug', () => {
    expect(getRecipeBySlug('does-not-exist')).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/data/__tests__/seo-recipes.test.ts
```

Expected: FAIL — module `../seo-recipes` not found.

- [ ] **Step 3: Implement seo-recipes.ts**

Create `src/data/seo-recipes.ts`. This maps the 15 selected recipes (from `docs/SEO/content/recept-seo-selectie.md`) to slugs and SEO metadata.

First, look up the actual recipe IDs in `recipes.ts` to match the 15 selections. The mapping structure:

```typescript
import { recipes } from './recipes';

interface PublicRecipe {
  id: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  targetKeyword: string;
}

// The 15 recipes selected for public SEO pages (from docs/SEO/content/recept-seo-selectie.md)
// IDs must match recipes in recipes.ts — look up by `name` field in recipes.ts
//
// HOW TO FIND IDs: Open src/data/recipes.ts, search for the recipe name below,
// and use the `id` field from that recipe object. Example: search "Chili" to find
// the recipe with id 'mega-chili'.
//
// The implementer MUST populate all 15 entries. Do NOT leave placeholders.
export const PUBLIC_RECIPES: PublicRecipe[] = [
  // === Tier 1 (highest search volume) ===
  // 1. Search recipes.ts for "Chili Con Carne" or similar
  {
    id: '', // FILL: look up in recipes.ts
    slug: 'slow-carb-chili-con-carne',
    metaTitle: 'Slow Carb Chili Con Carne – Recept | SlowCarb',
    metaDescription: 'Slow carb chili con carne met kidneybonen. Klaar in 60 min. Voldoet aan alle 5 slow carb regels.',
    targetKeyword: 'slow carb chili con carne',
  },
  // 2. Search for "Shakshuka"
  {
    id: '', // FILL
    slug: 'shakshuka-slow-carb',
    metaTitle: 'Shakshuka – Slow Carb Recept | SlowCarb',
    metaDescription: 'Shakshuka recept dat past in het slow carb dieet. Eieren in pittige tomatensaus.',
    targetKeyword: 'shakshuka recept slow carb',
  },
  // 3. Search for "Linzensoep" or "Linzen soep"
  {
    id: '', // FILL
    slug: 'slow-carb-linzensoep',
    metaTitle: 'Slow Carb Linzensoep – Recept | SlowCarb',
    metaDescription: 'Stevige linzensoep die past in het slow carb dieet. Vol eiwit en vezels.',
    targetKeyword: 'slow carb linzensoep',
  },
  // 4. Search for "Burrito Bowl" or "Burrito"
  {
    id: '', // FILL
    slug: 'slow-carb-burrito-bowl',
    metaTitle: 'Slow Carb Burrito Bowl – Recept | SlowCarb',
    metaDescription: 'Burrito bowl zonder rijst of tortilla. Slow carb proof met zwarte bonen.',
    targetKeyword: 'slow carb burrito bowl',
  },
  // 5. Search for "Roerbak" or "Stir Fry"
  {
    id: '', // FILL
    slug: 'slow-carb-roerbak',
    metaTitle: 'Slow Carb Roerbak – Recept | SlowCarb',
    metaDescription: 'Snelle roerbak met groenten en bonen. Klaar in 20 minuten. Slow carb approved.',
    targetKeyword: 'slow carb roerbak recept',
  },
  // === Tier 2 (medium search volume) ===
  // 6. Search for "Frittata"
  {
    id: '', // FILL
    slug: 'slow-carb-frittata',
    metaTitle: 'Slow Carb Frittata – Recept | SlowCarb',
    metaDescription: 'Slow carb frittata met groenten. Perfect voor ontbijt of lunch.',
    targetKeyword: 'slow carb frittata',
  },
  // 7. Search for "Huttenkase" or "Hüttenkäse"
  {
    id: '', // FILL
    slug: 'slow-carb-huttenkase-ontbijt',
    metaTitle: 'Hüttenkäse Ontbijt – Slow Carb | SlowCarb',
    metaDescription: 'Slow carb ontbijt met hüttenkäse. Snel, simpel en vol eiwit.',
    targetKeyword: 'slow carb ontbijt huttenkase',
  },
  // 8. Search for "Ferriss" or "Klassieker"
  {
    id: '', // FILL
    slug: 'de-ferriss-klassieker',
    metaTitle: 'De Ferriss Klassieker – Slow Carb | SlowCarb',
    metaDescription: 'Het originele slow carb recept van Tim Ferriss. Simpel, snel en bewezen.',
    targetKeyword: 'tim ferriss slow carb recept',
  },
  // 9. Search for "Mexicaan" or "Mexicaans"
  {
    id: '', // FILL
    slug: 'mexicaanse-slow-carb-bowl',
    metaTitle: 'Mexicaanse Bowl – Slow Carb Recept | SlowCarb',
    metaDescription: 'Mexicaanse slow carb bowl met bonen, gehakt en verse groenten.',
    targetKeyword: 'mexicaanse slow carb bowl',
  },
  // 10. Search for "Tonijn" or "Tuna"
  {
    id: '', // FILL
    slug: 'slow-carb-tonijnsalade',
    metaTitle: 'Tonijnsalade – Slow Carb Recept | SlowCarb',
    metaDescription: 'Snelle tonijnsalade met witte bonen. Slow carb lunch in 10 minuten.',
    targetKeyword: 'slow carb tonijnsalade',
  },
  // === Tier 3 (long-tail keywords) ===
  // 11-15: Search recipes.ts for these recipe names and fill in IDs + metadata:
  // 11. "Spinazie" recipe → slug: 'slow-carb-spinazie-ei'
  {
    id: '', // FILL
    slug: 'slow-carb-spinazie-ei',
    metaTitle: 'Spinazie met Ei – Slow Carb | SlowCarb',
    metaDescription: 'Simpel slow carb gerecht met spinazie en eieren. Klaar in 15 minuten.',
    targetKeyword: 'slow carb spinazie ei',
  },
  // 12. "Curry" recipe → slug: 'slow-carb-curry'
  {
    id: '', // FILL
    slug: 'slow-carb-curry',
    metaTitle: 'Slow Carb Curry – Recept | SlowCarb',
    metaDescription: 'Romige curry zonder rijst. Past perfect in het slow carb dieet.',
    targetKeyword: 'slow carb curry recept',
  },
  // 13. "Omelet" recipe → slug: 'slow-carb-omelet'
  {
    id: '', // FILL
    slug: 'slow-carb-omelet',
    metaTitle: 'Slow Carb Omelet – Recept | SlowCarb',
    metaDescription: 'Gevulde omelet voor slow carb ontbijt. Vol eiwit, zonder koolhydraten.',
    targetKeyword: 'slow carb omelet',
  },
  // 14. "Salade" recipe → slug: 'slow-carb-salade'
  {
    id: '', // FILL
    slug: 'slow-carb-salade',
    metaTitle: 'Slow Carb Salade – Recept | SlowCarb',
    metaDescription: 'Vullende salade met bonen en groenten. Slow carb lunch optie.',
    targetKeyword: 'slow carb salade recept',
  },
  // 15. "Soep" recipe (other than linzensoep) → slug: 'slow-carb-groentesoep'
  {
    id: '', // FILL
    slug: 'slow-carb-groentesoep',
    metaTitle: 'Slow Carb Groentesoep – Recept | SlowCarb',
    metaDescription: 'Stevige groentesoep met bonen. Slow carb proof en vol smaak.',
    targetKeyword: 'slow carb groentesoep',
  },
];

export const PUBLIC_RECIPE_SLUGS = PUBLIC_RECIPES.map(r => r.slug);

export function getRecipeBySlug(slug: string) {
  const publicRecipe = PUBLIC_RECIPES.find(pr => pr.slug === slug);
  if (!publicRecipe) return undefined;
  const recipe = recipes.find(r => r.id === publicRecipe.id);
  if (!recipe) return undefined;
  return { ...publicRecipe, recipe };
}
```

The implementer must search `recipes.ts` for the actual IDs matching the 15 recipe names from the SEO selection doc. Some names may not match exactly — find the closest match.

- [ ] **Step 4: Run tests**

```bash
npx vitest run src/data/__tests__/seo-recipes.test.ts
```

Expected: All 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/seo-recipes.ts src/data/__tests__/seo-recipes.test.ts
git commit -m "feat: add seo-recipes mapping for 15 public recipe pages"
```

---

### Task 8: Create seo-content.ts — pillar page and blog content

**Files:**
- Create: `src/data/seo-content.ts`
- Test: `src/data/__tests__/seo-content.test.ts`

Note: This file will contain ~500-800 lines of content. If it becomes unwieldy, split into `seo-content-pillar.ts` and `seo-content-keto.ts` with a shared types file. Start as one file and split only if needed.

- [ ] **Step 1: Write the test**

Create `src/data/__tests__/seo-content.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { pillarPage, ketoComparisonArticle, ALL_ARTICLES, getArticleBySlug } from '../seo-content';

describe('seo-content', () => {
  it('exports ALL_ARTICLES with 2 articles', () => {
    expect(ALL_ARTICLES).toHaveLength(2);
  });

  it('pillarPage has non-empty sections', () => {
    expect(pillarPage.sections.length).toBeGreaterThan(0);
    pillarPage.sections.forEach(s => {
      expect(s.heading).toBeTruthy();
      expect(s.content).toBeTruthy();
    });
  });

  it('ketoComparisonArticle has non-empty sections', () => {
    expect(ketoComparisonArticle.sections.length).toBeGreaterThan(0);
  });

  it('pillarPage has FAQ items', () => {
    expect(pillarPage.faq).toBeDefined();
    expect(pillarPage.faq!.length).toBeGreaterThan(0);
    pillarPage.faq!.forEach(f => {
      expect(f.question).toBeTruthy();
      expect(f.answer).toBeTruthy();
    });
  });

  it('getArticleBySlug finds pillar page', () => {
    const result = getArticleBySlug('/gids', 'slow-carb-dieet');
    expect(result).toBeDefined();
    expect(result!.title).toBe(pillarPage.title);
  });

  it('getArticleBySlug returns undefined for unknown slug', () => {
    expect(getArticleBySlug('/gids', 'nonexistent')).toBeUndefined();
  });

  it('all articles have required metadata fields', () => {
    ALL_ARTICLES.forEach(a => {
      expect(a.slug).toBeTruthy();
      expect(a.basePath).toBeTruthy();
      expect(a.metaTitle.length).toBeLessThanOrEqual(60);
      expect(a.metaDescription.length).toBeLessThanOrEqual(160);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/data/__tests__/seo-content.test.ts
```

Expected: FAIL — module `../seo-content` not found.

- [ ] **Step 3: Define types and article structure**

Create `src/data/seo-content.ts` with the interfaces and metadata:

```typescript
export interface ArticleSection {
  heading: string;
  content: string; // HTML-ready: use <p>, <strong>, <em>, <ul>/<li> tags
  subsections?: { heading: string; content: string }[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SEOArticle {
  slug: string;
  basePath: string; // e.g. '/gids'
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

- [ ] **Step 4: Transcribe pillar page content**

Open `docs/SEO/content/pillar-slow-carb-dieet-gids.md` and transcribe into the `pillarPage` object.

**Transcription procedure:**
1. For each H2 (`##`) heading in the markdown, create one `ArticleSection` object
2. Set `heading` to the H2 text (e.g., "Wat is het slow carb dieet?")
3. Set `content` to the body text under that H2, wrapped in HTML tags:
   - Each paragraph → `<p>paragraph text</p>`
   - Bold text → `<strong>text</strong>`
   - Italic text → `<em>text</em>`
   - Bullet lists → `<ul><li>item</li></ul>`
   - Numbered lists → `<ol><li>item</li></ol>`
4. If the H2 has H3 sub-headings, put them in `subsections` array
5. The FAQ section (last H2 with Q&A pairs) → put into the `faq` array instead

```typescript
export const pillarPage: SEOArticle = {
  slug: 'slow-carb-dieet',
  basePath: '/gids',
  title: 'Slow Carb Dieet: De Complete Gids',
  kicker: 'Complete gids',
  metaTitle: 'Slow Carb Dieet: Complete Gids (2026)',
  metaDescription: 'Alles over het slow carb dieet van Tim Ferriss. 5 regels, geen calorieën tellen, 1 cheatday per week. Inclusief recepten en weekplanning.',
  author: 'Jesper',
  readingTime: '12 min',
  publishDate: '2026-03-17',
  lastModified: '2026-03-17',
  sections: [
    // FILL: Transcribe ALL H2 sections from pillar-slow-carb-dieet-gids.md
    // Expected sections: Wat is het slow carb dieet?, Hoe werkt het?,
    // De 5 regels, Boodschappenlijst, Weekplanning, Vergelijkingen,
    // Resultaten, etc. — each as an ArticleSection object
  ],
  faq: [
    // FILL: Transcribe ALL FAQ Q&A pairs from the markdown
    // Each item: { question: 'Vraag?', answer: 'Antwoord.' }
  ],
};
```

- [ ] **Step 5: Transcribe keto comparison content**

Open `docs/SEO/content/blog-slow-carb-vs-keto.md` and transcribe using the same procedure:

```typescript
export const ketoComparisonArticle: SEOArticle = {
  slug: 'slow-carb-vs-keto',
  basePath: '/gids',
  title: 'Slow Carb vs Keto: Welk Dieet Past bij Jou?',
  kicker: 'Vergelijking',
  metaTitle: 'Slow Carb vs Keto: Welk Dieet Past?',
  metaDescription: 'Eerlijke vergelijking tussen slow carb en keto. Welk dieet is makkelijker vol te houden? Zonder hype, met feiten.',
  author: 'Jesper',
  readingTime: '8 min',
  publishDate: '2026-03-17',
  lastModified: '2026-03-17',
  sections: [
    // FILL: Transcribe ALL H2 sections from blog-slow-carb-vs-keto.md
  ],
  faq: [
    // FILL: Transcribe FAQ items if present
  ],
};
```

- [ ] **Step 6: Add exports and lookup function**

```typescript
export const ALL_ARTICLES: SEOArticle[] = [pillarPage, ketoComparisonArticle];

export function getArticleBySlug(basePath: string, slug: string): SEOArticle | undefined {
  return ALL_ARTICLES.find(a => a.basePath === basePath && a.slug === slug);
}
```

- [ ] **Step 7: Run tests**

```bash
npx vitest run src/data/__tests__/seo-content.test.ts
```

Expected: All 7 tests PASS.

- [ ] **Step 8: Commit**

```bash
git add src/data/seo-content.ts src/data/__tests__/seo-content.test.ts
git commit -m "feat: add SEO article content data (pillar page + keto comparison)"
```

---

## Chunk 3: Content Page Components

### Task 9: Create content.css for content page styles

**Files:**
- Create: `src/styles/content.css`

- [ ] **Step 1: Create content.css**

Create `src/styles/content.css` with shared styles for content pages. These mirror the landing page token values but are scoped under `.content-page`:

```css
/* Content page styles — mirrors landing.css token values */
/* Scoped under .content-page to prevent CSS leaks */

.content-page {
  --surface-dark: 28 25 23;
  --surface-accent: 49 79 49;
  --ink-strong: 28 25 23;
  --ink-body: 41 37 36;
  --ink-muted: 87 83 78;
  --sage-mid: 82 126 82;
  --sage-deep: 61 98 61;
  --cream-soft: 248 250 247;
}

.content-page .editorial-kicker {
  font-family: Satoshi, system-ui, sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.content-page .editorial-body {
  font-family: Satoshi, system-ui, sans-serif;
  font-size: 1.125rem;
  font-weight: 400;
  line-height: 1.65;
}

@media (min-width: 768px) {
  .content-page .editorial-body {
    font-size: 1.25rem;
  }
}

/* Content page header gradient transition */
.content-page .content-header-gradient {
  height: 1.5rem;
  background: linear-gradient(180deg, rgb(var(--surface-accent)), rgb(248, 250, 247));
}

/* Callout card */
.content-page .callout-card {
  padding: 0.85rem 1rem;
  border-radius: 0.75rem;
  border-left: 3px solid rgb(var(--sage-mid));
  background: rgba(244, 249, 243, 0.9);
}

/* CTA accent button (same as landing) */
.content-page .cta-accent-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgb(var(--surface-accent));
  color: white;
  font-family: Satoshi, system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-decoration: none;
  box-shadow: 0 12px 30px rgba(var(--surface-accent), 0.22);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  cursor: pointer;
  border: 0;
}

.content-page .cta-accent-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 36px rgba(var(--surface-accent), 0.28);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/content.css
git commit -m "feat: add content.css with shared content page styles"
```

---

### Task 10: Create ContentPageHeader component

**Files:**
- Create: `src/components/seo/ContentPageHeader.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { Link } from 'react-router-dom';

interface ContentPageHeaderProps {
  kicker: string;
  title: string;
  author: string;
  readingTime: string;
  breadcrumbs: { label: string; to: string }[];
}

export function ContentPageHeader({
  kicker,
  title,
  author,
  readingTime,
  breadcrumbs,
}: ContentPageHeaderProps) {
  return (
    <>
      <header className="bg-gradient-to-b from-stone-900 to-sage-800 px-4 pb-6 pt-8 md:px-8 md:pb-8 md:pt-12">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <nav className="mb-4 text-xs text-stone-400" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.to}>
                {i > 0 && <span className="mx-1.5">&rsaquo;</span>}
                {i < breadcrumbs.length - 1 ? (
                  <Link to={crumb.to} className="hover:text-stone-300 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-stone-500">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>

          {/* Kicker */}
          <p className="editorial-kicker text-sage-400">{kicker}</p>

          {/* Title */}
          <h1 className="mt-2 font-display text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
            {title}
          </h1>

          {/* Author + reading time */}
          <div className="mt-4 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sage-700/50 text-xs font-bold text-sage-300">
              J
            </div>
            <p className="text-sm text-stone-400">
              {author} &middot; {readingTime} leestijd
            </p>
          </div>
        </div>
      </header>

      {/* Gradient transition */}
      <div className="content-header-gradient" />
    </>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/seo/ContentPageHeader.tsx
git commit -m "feat: add ContentPageHeader with dark branded header"
```

---

### Task 11: Create shared layout components (AuthorCard, CTABand, ContentPageLayout)

**Files:**
- Create: `src/components/seo/AuthorCard.tsx`
- Create: `src/components/seo/CTABand.tsx`
- Create: `src/components/seo/ContentPageLayout.tsx`

- [ ] **Step 1: Create AuthorCard**

```tsx
export function AuthorCard() {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-sage-100 bg-white p-5 shadow-sm">
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-sage-100 text-lg font-bold text-sage-700">
        J
      </div>
      <div>
        <p className="font-bold text-stone-900">Jesper</p>
        <p className="text-sm text-stone-500">
          Oprichter SlowCarb. Ex-militair, vader van drie. 8 kilo afgevallen met het slow carb protocol.
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create CTABand**

```tsx
const STRIPE_URL = 'https://buy.stripe.com/5kQ28t0JQ9Geaht9Kb5Rm00';

export function CTABand() {
  return (
    <section className="bg-gradient-to-b from-stone-900 to-stone-800 px-4 py-12 text-center md:py-16">
      <div className="mx-auto max-w-2xl">
        <p className="editorial-kicker mb-3 text-sage-400">Klaar om te beginnen?</p>
        <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
          5 regels. 6 weken. Geen excuses.
        </h2>
        <p className="mt-3 text-stone-400">
          50+ recepten, boodschappenlijst, 84-dagen educatie. Eenmalig €47.
        </p>
        <a
          href={STRIPE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-accent-button mt-6 inline-flex px-8 py-3.5 text-sm"
        >
          Begin vandaag &rarr;
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create ContentPageLayout**

```tsx
import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ContentPageHeader } from './ContentPageHeader';
import { AuthorCard } from './AuthorCard';
import { CTABand } from './CTABand';
import { Footer } from '@/components/landing/Footer';
import '@/styles/content.css';

interface ContentPageLayoutProps {
  kicker: string;
  title: string;
  author: string;
  readingTime: string;
  breadcrumbs: { label: string; to: string }[];
  children: ReactNode;
  relatedLinks?: { label: string; to: string }[];
}

export function ContentPageLayout({
  kicker,
  title,
  author,
  readingTime,
  breadcrumbs,
  children,
  relatedLinks,
}: ContentPageLayoutProps) {
  return (
    <div className="content-page min-h-screen bg-cream">
      <ContentPageHeader
        kicker={kicker}
        title={title}
        author={author}
        readingTime={readingTime}
        breadcrumbs={breadcrumbs}
      />

      <main className="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12">
        <article className="editorial-body text-stone-700">
          {children}
        </article>

        <div className="mt-10">
          <AuthorCard />
        </div>

        {relatedLinks && relatedLinks.length > 0 && (
          <nav className="mt-8 border-t border-sage-100 pt-6">
            <p className="editorial-kicker mb-3 text-sage-600">Lees ook</p>
            <ul className="space-y-2">
              {relatedLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sage-700 font-semibold hover:underline">
                    {link.label} &rarr;
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </main>

      <CTABand />
      <Footer />
    </div>
  );
}
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add src/components/seo/AuthorCard.tsx src/components/seo/CTABand.tsx src/components/seo/ContentPageLayout.tsx
git commit -m "feat: add ContentPageLayout with AuthorCard, CTABand, and Footer"
```

---

### Task 12: Create PillarPage component

**Files:**
- Create: `src/components/pages/PillarPage.tsx`

- [ ] **Step 1: Create the page component**

The PillarPage renders the slow carb dieet guide using `ContentPageLayout` and content from `seo-content.ts`. It includes `SEOHead` with Article + FAQPage + BreadcrumbList JSON-LD schemas.

```tsx
import { SEOHead } from '@/components/seo/SEOHead';
import { ContentPageLayout } from '@/components/seo/ContentPageLayout';
import { pillarPage } from '@/data/seo-content';

export function PillarPage() {
  const article = pillarPage;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    author: { '@type': 'Person', name: article.author, url: 'https://eatslowcarb.com' },
    publisher: { '@type': 'Organization', name: 'SlowCarb', url: 'https://eatslowcarb.com' },
    datePublished: article.publishDate,
    dateModified: article.lastModified,
    mainEntityOfPage: `https://eatslowcarb.com${article.basePath}/${article.slug}`,
    inLanguage: 'nl',
  };

  const faqSchema = article.faq && article.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faq.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  } : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://eatslowcarb.com' },
      { '@type': 'ListItem', position: 2, name: 'Gids', item: 'https://eatslowcarb.com/gids' },
      { '@type': 'ListItem', position: 3, name: article.title, item: `https://eatslowcarb.com${article.basePath}/${article.slug}` },
    ],
  };

  const jsonLd = [articleSchema, breadcrumbSchema, ...(faqSchema ? [faqSchema] : [])];

  return (
    <>
      <SEOHead
        title={article.metaTitle}
        description={article.metaDescription}
        canonical={`https://eatslowcarb.com${article.basePath}/${article.slug}`}
        ogType="article"
        jsonLd={jsonLd}
      />
      <ContentPageLayout
        kicker={article.kicker}
        title={article.title}
        author={article.author}
        readingTime={article.readingTime}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Gids', to: '/gids' },
          { label: article.title, to: `${article.basePath}/${article.slug}` },
        ]}
        relatedLinks={[
          { label: 'Slow Carb vs Keto: Welk Dieet Past?', to: '/gids/slow-carb-vs-keto' },
          { label: 'Bekijk onze recepten', to: '/recepten' },
        ]}
      >
        {article.sections.map((section, i) => (
          <section key={i} className="mb-8">
            <h2 className="mb-4 font-display text-2xl font-bold text-stone-900">{section.heading}</h2>
            <div dangerouslySetInnerHTML={{ __html: section.content }} />
            {section.subsections?.map((sub, j) => (
              <div key={j} className="mt-6">
                <h3 className="mb-2 font-display text-xl font-semibold text-stone-800">{sub.heading}</h3>
                <div dangerouslySetInnerHTML={{ __html: sub.content }} />
              </div>
            ))}
          </section>
        ))}

        {article.faq && article.faq.length > 0 && (
          <section className="mt-10 border-t border-sage-100 pt-8">
            <h2 className="mb-6 font-display text-2xl font-bold text-stone-900">Veelgestelde vragen</h2>
            <dl className="space-y-6">
              {article.faq.map((faq, i) => (
                <div key={i}>
                  <dt className="font-bold text-stone-900">{faq.question}</dt>
                  <dd className="mt-1 text-stone-600">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </ContentPageLayout>
    </>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/pages/PillarPage.tsx
git commit -m "feat: add PillarPage for /gids/slow-carb-dieet"
```

---

### Task 13: Create ArticlePage component (generic, reusable)

**Files:**
- Create: `src/components/pages/ArticlePage.tsx`

- [ ] **Step 1: Create the component**

Similar to PillarPage but takes a slug parameter from the URL to look up the article. This is the generic article renderer for `/gids/:slug`.

```tsx
import { useParams, Navigate } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';
import { ContentPageLayout } from '@/components/seo/ContentPageLayout';
import { getArticleBySlug } from '@/data/seo-content';

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug('/gids', slug) : undefined;

  if (!article) return <Navigate to="/404" replace />;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    author: { '@type': 'Person', name: article.author, url: 'https://eatslowcarb.com' },
    publisher: { '@type': 'Organization', name: 'SlowCarb', url: 'https://eatslowcarb.com' },
    datePublished: article.publishDate,
    dateModified: article.lastModified,
    mainEntityOfPage: `https://eatslowcarb.com${article.basePath}/${article.slug}`,
    inLanguage: 'nl',
  };

  const faqSchema = article.faq && article.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faq.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  } : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://eatslowcarb.com' },
      { '@type': 'ListItem', position: 2, name: 'Gids', item: 'https://eatslowcarb.com/gids' },
      { '@type': 'ListItem', position: 3, name: article.title, item: `https://eatslowcarb.com${article.basePath}/${article.slug}` },
    ],
  };

  const jsonLd = [articleSchema, breadcrumbSchema, ...(faqSchema ? [faqSchema] : [])];

  return (
    <>
      <SEOHead
        title={article.metaTitle}
        description={article.metaDescription}
        canonical={`https://eatslowcarb.com${article.basePath}/${article.slug}`}
        ogType="article"
        jsonLd={jsonLd}
      />
      <ContentPageLayout
        kicker={article.kicker}
        title={article.title}
        author={article.author}
        readingTime={article.readingTime}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Gids', to: '/gids' },
          { label: article.title, to: `${article.basePath}/${article.slug}` },
        ]}
      >
        {article.sections.map((section, i) => (
          <section key={i} className="mb-8">
            <h2 className="mb-4 font-display text-2xl font-bold text-stone-900">{section.heading}</h2>
            <div dangerouslySetInnerHTML={{ __html: section.content }} />
            {section.subsections?.map((sub, j) => (
              <div key={j} className="mt-6">
                <h3 className="mb-2 font-display text-xl font-semibold text-stone-800">{sub.heading}</h3>
                <div dangerouslySetInnerHTML={{ __html: sub.content }} />
              </div>
            ))}
          </section>
        ))}

        {article.faq && article.faq.length > 0 && (
          <section className="mt-10 border-t border-sage-100 pt-8">
            <h2 className="mb-6 font-display text-2xl font-bold text-stone-900">Veelgestelde vragen</h2>
            <dl className="space-y-6">
              {article.faq.map((faq, i) => (
                <div key={i}>
                  <dt className="font-bold text-stone-900">{faq.question}</dt>
                  <dd className="mt-1 text-stone-600">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </ContentPageLayout>
    </>
  );
}
```

Note: PillarPage and ArticlePage share identical schema construction and content rendering. The implementer should refactor: either (a) make PillarPage a thin wrapper that renders `<ArticlePage />` with the slug hard-coded, or (b) extract `buildArticleSchemas()` and `ArticleContent` helpers into a shared module. Option (a) is simpler — PillarPage can redirect to `/gids/slow-carb-dieet` or just render ArticlePage with a fixed slug.

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/pages/ArticlePage.tsx
git commit -m "feat: add generic ArticlePage for /gids/:slug routes"
```

---

### Task 14: Create RecipeDetailPage and RecipeIndexPage

**Files:**
- Create: `src/components/pages/RecipeDetailPage.tsx`
- Create: `src/components/pages/RecipeIndexPage.tsx`

- [ ] **Step 1: Create RecipeDetailPage**

Create `src/components/pages/RecipeDetailPage.tsx`:

```tsx
import { useParams, Navigate, Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';
import { ContentPageHeader } from '@/components/seo/ContentPageHeader';
import { CTABand } from '@/components/seo/CTABand';
import { Footer } from '@/components/landing/Footer';
import { getRecipeBySlug, PUBLIC_RECIPES } from '@/data/seo-recipes';
import '@/styles/content.css';

// Convert "15 min" or "1 uur" to ISO 8601 duration "PT15M" or "PT60M"
function toIsoDuration(time: string): string {
  const match = time.match(/(\d+)\s*(min|uur)/i);
  if (!match) return 'PT0M';
  const [, num, unit] = match;
  return unit.toLowerCase() === 'uur' ? `PT${Number(num) * 60}M` : `PT${num}M`;
}

export function RecipeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const data = slug ? getRecipeBySlug(slug) : undefined;

  if (!data) return <Navigate to="/404" replace />;

  const { recipe, metaTitle, metaDescription, targetKeyword } = data;

  // NOTE: recipes.ts uses LegacyRecipe where steps: string[] (not RecipeStep[])
  const steps = recipe.steps as string[];

  const recipeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.name,
    description: `${recipe.name}. Voldoet aan alle 5 slow carb regels.`,
    author: { '@type': 'Organization', name: 'SlowCarb' },
    datePublished: '2026-03-17',
    prepTime: toIsoDuration(recipe.prepTime || ''),
    cookTime: toIsoDuration(recipe.cookTime || ''),
    recipeYield: `${recipe.servings} porties`,
    recipeCuisine: 'Nederlands',
    keywords: `slow carb recept, ${targetKeyword}`,
    recipeIngredient: recipe.ingredients.map(
      (ing: { amount: string; unit: string; name: string }) =>
        `${ing.amount} ${ing.unit} ${ing.name}`.trim()
    ),
    recipeInstructions: steps.map((step: string) => ({
      '@type': 'HowToStep',
      text: step,
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://eatslowcarb.com' },
      { '@type': 'ListItem', position: 2, name: 'Recepten', item: 'https://eatslowcarb.com/recepten' },
      { '@type': 'ListItem', position: 3, name: recipe.name, item: `https://eatslowcarb.com/recepten/${slug}` },
    ],
  };

  // Pick 3 related recipes (exclude current)
  const related = PUBLIC_RECIPES.filter(r => r.slug !== slug).slice(0, 3);

  return (
    <div className="content-page min-h-screen bg-cream">
      <SEOHead
        title={metaTitle}
        description={metaDescription}
        canonical={`https://eatslowcarb.com/recepten/${slug}`}
        ogType="article"
        jsonLd={[recipeSchema, breadcrumbSchema]}
      />

      <ContentPageHeader
        kicker={recipe.category || 'Recept'}
        title={recipe.name}
        author="SlowCarb"
        readingTime={`${recipe.prepTime || '?'} + ${recipe.cookTime || '?'}`}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Recepten', to: '/recepten' },
          { label: recipe.name, to: `/recepten/${slug}` },
        ]}
      />

      <main className="mx-auto max-w-4xl px-4 py-8 md:px-8">
        {/* Recipe meta bar */}
        <div className="mb-6 flex flex-wrap gap-4 text-sm text-stone-600">
          {recipe.prepTime && <span>Prep: {recipe.prepTime}</span>}
          {recipe.cookTime && <span>Koken: {recipe.cookTime}</span>}
          {recipe.servings && <span>{recipe.servings} porties</span>}
        </div>

        {/* Slow carb badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-sage-50 px-4 py-2 text-sm font-semibold text-sage-700 ring-1 ring-sage-200">
          Voldoet aan alle 5 regels
        </div>

        {/* Ingredients + Steps: side by side on desktop */}
        <div className="md:flex md:gap-8">
          {/* Ingredients card — sticky on desktop */}
          <div className="mb-8 md:mb-0 md:w-72 md:flex-shrink-0">
            <div className="rounded-xl border border-sage-100 bg-white p-5 shadow-sm md:sticky md:top-4">
              <h2 className="mb-3 font-display text-lg font-bold text-stone-900">Ingrediënten</h2>
              <ul className="space-y-2 text-sm text-stone-700">
                {recipe.ingredients.map((ing: { amount: string; unit: string; name: string }, i: number) => (
                  <li key={i} className="flex justify-between border-b border-stone-100 pb-1.5 last:border-0">
                    <span>{ing.name}</span>
                    <span className="text-stone-500">{ing.amount} {ing.unit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Steps */}
          <div className="flex-1">
            <h2 className="mb-4 font-display text-lg font-bold text-stone-900">Bereiding</h2>
            <ol className="space-y-4">
              {steps.map((step: string, i: number) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-sage-100 text-xs font-bold text-sage-700">
                    {i + 1}
                  </span>
                  <p className="pt-0.5 text-stone-700">{step}</p>
                </li>
              ))}
            </ol>

            {/* Tips */}
            {recipe.tips && (
              <div className="mt-8 rounded-xl border-l-3 border-sage-500 bg-sage-50/50 p-4">
                <h3 className="mb-2 font-bold text-stone-900">Tips</h3>
                <p className="text-sm text-stone-600">{recipe.tips}</p>
              </div>
            )}

            {/* Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {recipe.tags.map((tag: string) => (
                  <span key={tag} className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related recipes */}
        {related.length > 0 && (
          <nav className="mt-12 border-t border-sage-100 pt-8">
            <p className="editorial-kicker mb-4 text-sage-600">Meer recepten</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map(r => (
                <Link
                  key={r.slug}
                  to={`/recepten/${r.slug}`}
                  className="rounded-xl border border-stone-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <p className="font-bold text-stone-900">{r.metaTitle.split('–')[0].trim()}</p>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </main>

      <CTABand />
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Create RecipeIndexPage**

Create `src/components/pages/RecipeIndexPage.tsx`:

```tsx
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';
import { ContentPageHeader } from '@/components/seo/ContentPageHeader';
import { CTABand } from '@/components/seo/CTABand';
import { Footer } from '@/components/landing/Footer';
import { PUBLIC_RECIPES, getRecipeBySlug } from '@/data/seo-recipes';
import '@/styles/content.css';

export function RecipeIndexPage() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '50+ Slow Carb Recepten',
    description: '15 gratis slow carb recepten. Allemaal voldoen ze aan de 5 slow carb regels van Tim Ferriss.',
    url: 'https://eatslowcarb.com/recepten',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://eatslowcarb.com' },
      { '@type': 'ListItem', position: 2, name: 'Recepten', item: 'https://eatslowcarb.com/recepten' },
    ],
  };

  return (
    <div className="content-page min-h-screen bg-cream">
      <SEOHead
        title="50+ Slow Carb Recepten | SlowCarb"
        description="15 gratis slow carb recepten. Allemaal voldoen ze aan de 5 slow carb regels van Tim Ferriss."
        canonical="https://eatslowcarb.com/recepten"
        jsonLd={[collectionSchema, breadcrumbSchema]}
      />

      <ContentPageHeader
        kicker="Recepten"
        title="Slow Carb Recepten"
        author="SlowCarb"
        readingTime={`${PUBLIC_RECIPES.length} recepten`}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Recepten', to: '/recepten' },
        ]}
      />

      <main className="mx-auto max-w-4xl px-4 py-8 md:px-8">
        <p className="mb-8 text-lg text-stone-600">
          Dit zijn {PUBLIC_RECIPES.length} van onze 50+ recepten. Allemaal voldoen ze aan de 5 slow carb regels.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PUBLIC_RECIPES.map(pr => {
            const data = getRecipeBySlug(pr.slug);
            const recipe = data?.recipe;
            return (
              <Link
                key={pr.slug}
                to={`/recepten/${pr.slug}`}
                className="group rounded-xl border border-stone-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {recipe?.category && (
                  <span className="mb-2 inline-block rounded-full bg-sage-50 px-2.5 py-0.5 text-xs font-semibold text-sage-700">
                    {recipe.category}
                  </span>
                )}
                <h2 className="font-display text-lg font-bold text-stone-900 group-hover:text-sage-700">
                  {recipe?.name || pr.slug}
                </h2>
                <p className="mt-1 text-sm text-stone-500">
                  {recipe?.prepTime && `Prep: ${recipe.prepTime}`}
                  {recipe?.prepTime && recipe?.cookTime && ' · '}
                  {recipe?.cookTime && `Koken: ${recipe.cookTime}`}
                </p>
              </Link>
            );
          })}
        </div>
      </main>

      <CTABand />
      <Footer />
    </div>
  );
}
```

- [ ] **Step 3: Build and verify**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/pages/RecipeDetailPage.tsx src/components/pages/RecipeIndexPage.tsx
git commit -m "feat: add RecipeDetailPage and RecipeIndexPage"
```

---

### Task 15: Add content page routes to App.tsx

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add imports and routes**

Add these routes inside the `<Routes>` block in App.tsx, before the `*` catch-all:

```tsx
import { PillarPage } from '@/components/pages/PillarPage';
import { ArticlePage } from '@/components/pages/ArticlePage';
import { RecipeIndexPage } from '@/components/pages/RecipeIndexPage';
import { RecipeDetailPage } from '@/components/pages/RecipeDetailPage';

// Inside <Routes>:
<Route path="/gids/slow-carb-dieet" element={<PillarPage />} />
<Route path="/gids/:slug" element={<ArticlePage />} />
<Route path="/recepten" element={<RecipeIndexPage />} />
<Route path="/recepten/:slug" element={<RecipeDetailPage />} />
```

- [ ] **Step 2: Build and test**

```bash
npm run build
npm run dev
```

Manually verify:
- `http://localhost:5173/gids/slow-carb-dieet` → renders pillar page
- `http://localhost:5173/gids/slow-carb-vs-keto` → renders comparison article
- `http://localhost:5173/recepten` → renders recipe index
- `http://localhost:5173/recepten/slow-carb-chili-con-carne` → renders recipe detail
- `http://localhost:5173/recepten/nonexistent` → redirects to 404

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add content page routes for /gids/* and /recepten/*"
```

---

## Chunk 4: SEO Structured Data + Landing SEOHead

### Task 16: Add SEOHead to landing page

**Files:**
- Modify: `src/components/landing/LandingPage.tsx`

- [ ] **Step 1: Add SEOHead with WebApplication + FAQPage schemas**

Import `SEOHead` and add it at the top of the LandingPage `return` JSX:

```tsx
import { SEOHead } from '@/components/seo/SEOHead';

// Inside the return, before the first <div>:
<SEOHead
  title="SlowCarb – Val 8-10 kg af in 6 weken"
  description="Het slow carb dieet van Tim Ferriss. 5 simpele regels, 50+ recepten, 84-dagen programma. Zonder calorieën tellen. Eenmalig €47."
  canonical="https://eatslowcarb.com/"
  ogType="website"
  jsonLd={[
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'SlowCarb',
      url: 'https://eatslowcarb.com',
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Web',
      description: 'Slow carb dieet app met 50+ recepten, boodschappenlijst en 84-dagen programma.',
      offers: {
        '@type': 'Offer',
        price: '47.00',
        priceCurrency: 'EUR',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      // REQUIRED: This array MUST be populated or Google will flag invalid schema.
      // Open src/components/landing/FAQSection.tsx, find the FAQ data array,
      // and map each Q&A pair to the schema format below.
      mainEntity: [
        // Example format for each item:
        // { '@type': 'Question', name: 'Vraag hier?', acceptedAnswer: { '@type': 'Answer', text: 'Antwoord hier.' } },
        // FILL: Add ALL FAQ items from FAQSection.tsx (expect ~6 items)
      ],
    },
  ]}
/>
```

The FAQPage `mainEntity` array must contain the existing FAQ items from `FAQSection.tsx`. Open that file, find the Q&A data, and map each to `{ '@type': 'Question', name: '...', acceptedAnswer: { '@type': 'Answer', text: '...' } }`.

- [ ] **Step 2: Build and verify**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/LandingPage.tsx
git commit -m "feat: add SEOHead with WebApplication + FAQPage schemas to landing"
```

---

### Task 17: Add SEOHead to legal pages

**Files:**
- Modify: `src/components/legal/PrivacyPolicyPage.tsx`
- Modify: `src/components/legal/TermsOfServicePage.tsx`
- Modify: `src/components/legal/RefundPolicyPage.tsx`

- [ ] **Step 1: Add noindex SEOHead to each legal page**

Import `SEOHead` and add to each component's return JSX:

**PrivacyPolicyPage.tsx:**
```tsx
<SEOHead noindex title="Privacybeleid | SlowCarb" description="Privacybeleid van SlowCarb." canonical="https://eatslowcarb.com/privacy-policy" />
```

**TermsOfServicePage.tsx:**
```tsx
<SEOHead noindex title="Algemene Voorwaarden | SlowCarb" description="Algemene voorwaarden van SlowCarb." canonical="https://eatslowcarb.com/terms-of-service" />
```

**RefundPolicyPage.tsx:**
```tsx
<SEOHead noindex title="Restitutiebeleid | SlowCarb" description="Restitutiebeleid van SlowCarb." canonical="https://eatslowcarb.com/refund-policy" />
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: Clean build.

- [ ] **Step 3: Commit**

```bash
git add src/components/legal/
git commit -m "feat: add noindex SEOHead to legal pages"
```

---

## Chunk 5: Pre-rendering + Sitemap + Final Polish

### Task 18: Set up pre-rendering

**Files:**
- Modify: `vite.config.ts`
- Modify: `package.json`

- [ ] **Step 1: Install @prerenderer/rollup-plugin**

```bash
npm install -D @prerenderer/rollup-plugin @prerenderer/renderer-puppeteer
```

- [ ] **Step 2: Configure Vite**

Update `vite.config.ts` to add the prerender plugin in production mode:

```typescript
import prerender from '@prerenderer/rollup-plugin';
import { PuppeteerRenderer } from '@prerenderer/renderer-puppeteer';
import { PUBLIC_RECIPE_SLUGS } from './src/data/seo-recipes';

const publicRoutes = [
  '/',
  '/gids/slow-carb-dieet',
  '/gids/slow-carb-vs-keto',
  '/recepten',
  ...PUBLIC_RECIPE_SLUGS.map(slug => `/recepten/${slug}`),
];

export default defineConfig(({ mode }) => ({
  base: '/',  // Change from './' to '/' for pre-rendering compatibility
  plugins: [
    ...(mode !== 'production' ? [inspectAttr()] : []),
    react(),
    ...(mode === 'production' ? [
      prerender({
        routes: publicRoutes,
        renderer: new PuppeteerRenderer(),
      }),
    ] : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
```

Note: `base` changes from `'./'` to `'/'` — this is required for pre-rendering to generate correct asset paths. Verify this doesn't break existing Vercel deployment.

- [ ] **Step 3: Test production build**

```bash
npm run build
```

Expected: Build succeeds. Pre-rendered HTML files appear in `dist/gids/slow-carb-dieet/index.html`, `dist/recepten/index.html`, etc.

Verify pre-rendered content:
```bash
grep -l "Slow Carb Dieet" dist/gids/slow-carb-dieet/index.html
```

Expected: The file exists and contains the article content as static HTML.

- [ ] **Step 4: If pre-rendering fails**

If `@prerenderer/rollup-plugin` has compatibility issues with Vite 7.2 or React 19, **stop and escalate** to the user. Do not attempt to write a custom Puppeteer prerender script autonomously — it's non-trivial and needs architectural review. Document the error in the commit message and move on to Task 19.

- [ ] **Step 5: Commit**

```bash
git add vite.config.ts package.json package-lock.json
git commit -m "feat: add pre-rendering for public SEO routes"
```

---

### Task 19: Generate sitemap.xml at build time

**Files:**
- Create: `scripts/generate-sitemap.ts`
- Modify: `package.json` (build script)

- [ ] **Step 1: Create sitemap generator script**

Create `scripts/generate-sitemap.ts`:

```typescript
import { writeFileSync } from 'fs';
import { PUBLIC_RECIPE_SLUGS } from '../src/data/seo-recipes';
import { ALL_ARTICLES } from '../src/data/seo-content';

const BASE = 'https://eatslowcarb.com';
const today = new Date().toISOString().split('T')[0];

const staticPages = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/recepten', priority: '0.8', changefreq: 'weekly' },
];

const articlePages = ALL_ARTICLES.map(a => ({
  loc: `${a.basePath}/${a.slug}`,
  priority: '0.9',
  changefreq: 'monthly',
  lastmod: a.lastModified,
}));

const recipePages = PUBLIC_RECIPE_SLUGS.map(slug => ({
  loc: `/recepten/${slug}`,
  priority: '0.7',
  changefreq: 'monthly',
}));

const allPages = [...staticPages, ...articlePages, ...recipePages];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${BASE}${p.loc}</loc>
    <lastmod>${(p as { lastmod?: string }).lastmod || today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

writeFileSync('dist/sitemap.xml', xml);
console.log(`Sitemap generated with ${allPages.length} URLs`);
```

- [ ] **Step 2: Add to build pipeline**

Update `package.json` scripts:

```json
{
  "scripts": {
    "build": "tsc -b && vite build && tsx scripts/generate-sitemap.ts"
  }
}
```

Install tsx if not present:
```bash
npm install -D tsx
```

- [ ] **Step 3: Build and verify sitemap**

```bash
npm run build
cat dist/sitemap.xml
```

Expected: Valid XML with all public URLs listed.

- [ ] **Step 4: Commit**

```bash
git add scripts/generate-sitemap.ts package.json package-lock.json
git commit -m "feat: add build-time sitemap.xml generation"
```

---

### Task 20: Update Vercel config with content page cache headers

**Files:**
- Modify: `vercel.json`

- [ ] **Step 1: Add cache headers for content pages**

Add these header rules to the `headers` array in `vercel.json` (keep all existing entries — security headers, image caching, etc. — intact):

```json
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
```

This was already modified in Task 5 (removed landing.html rewrite). Now add these two new entries to the same `headers` array.

- [ ] **Step 2: Commit**

```bash
git add vercel.json
git commit -m "feat: add cache headers for public content pages"
```

---

### Task 21: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Update routing section**

Replace the "No React Router" statement with documentation of the new routing architecture. Add:
- Public routes list
- Auth flow (`?app=1` / `?welcome=1`)
- New directories (`components/seo/`, `components/pages/`, `data/seo-content.ts`, `data/seo-recipes.ts`)
- Pre-rendering build step
- `src/styles/content.css` in design system section

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md with new routing and SEO architecture"
```

---

### Task 22: Final verification

- [ ] **Step 1: Full build**

```bash
npm run build
```

Expected: Clean build with pre-rendered HTML output.

- [ ] **Step 2: Run all tests**

```bash
npm run test
```

Expected: All tests pass.

- [ ] **Step 3: Preview production build**

```bash
npm run preview
```

Visit all public routes and verify:
- Landing page renders correctly at `/`
- Pillar page at `/gids/slow-carb-dieet` has dark header + clean body
- Recipe index at `/recepten` shows 15 recipe cards
- Individual recipe at `/recepten/slow-carb-chili-con-carne` has full content
- App still works at `/?app=1`
- 404 page appears for unknown routes
- View page source on content pages — should show pre-rendered HTML content

- [ ] **Step 4: Validate structured data**

Open browser dev tools on each page type, check for `<script type="application/ld+json">` tags:
- Landing: WebApplication + FAQPage
- Pillar: Article + FAQPage + BreadcrumbList
- Recipe: Recipe + BreadcrumbList

- [ ] **Step 5: Lighthouse SEO audit**

Run Lighthouse on `/gids/slow-carb-dieet` in Chrome DevTools. Target: SEO score >= 95.

- [ ] **Step 6: Final commit if any fixes needed**

If any fixes were applied in the previous steps, stage only the changed files and commit:

```bash
git add <specific-files-that-were-fixed>
git commit -m "fix: address final verification issues"
```

If no fixes were needed, skip this step.

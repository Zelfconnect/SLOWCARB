# Editorial Article Header Redesign

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat dark-gradient article headers with a premium editorial hero that matches the landing page's visual identity — full-bleed background image, layered gradients, dramatic typography.

**Architecture:** The shared `ContentPageHeader` component gets a visual overhaul. We add an optional `heroImage` prop so each article/recipe/index page can supply a background image. When no image is provided, we fall back to a rich dark gradient (no regression). The header gets taller, gains a food photography background with dark overlays, and uses the same typographic hierarchy as the landing hero (large bold title, kicker above, metadata below). All changes are scoped to existing files — no new components needed.

**Tech Stack:** React, Tailwind CSS, existing content.css custom properties, existing `/public/images/landing/` assets.

---

## Current Problem

The `ContentPageHeader` (used by ArticlePage, PillarPage, RecipeDetailPage, GuideIndexPage, RecipeIndexPage) renders a short `bg-gradient-to-b from-stone-900 to-sage-800` bar with small text. It looks generic and disconnected from the premium, image-driven landing page hero.

## Design Direction

Reference: the landing hero uses:
- Full-bleed `<picture>` background with `object-cover`
- Layered gradient overlay: `from-surface-dark/50 via-surface-dark/20 to-surface-dark/70`
- Large, bold heading with `drop-shadow-2xl`
- `editorial-kicker` uppercase label
- Cream/sage metadata text

The article header should follow this pattern at a smaller scale: ~40vh height on mobile, ~50vh on desktop. The title stays readable (not display-size like the landing H1) but gets bigger and bolder. The breadcrumbs and metadata stay but get refined.

## Consumers of ContentPageHeader

| Page | File | Props used |
|------|------|-----------|
| ArticlePage | `src/components/pages/ArticlePage.tsx` | kicker, title, author, readingTime, breadcrumbs |
| PillarPage | `src/components/pages/PillarPage.tsx` | kicker, title, author, readingTime, breadcrumbs (via ContentPageLayout) |
| RecipeDetailPage | `src/components/pages/RecipeDetailPage.tsx` | kicker, title, author, readingTime, byline, breadcrumbs |
| GuideIndexPage | `src/components/pages/GuideIndexPage.tsx` | kicker, title, author, readingTime, byline, breadcrumbs |
| RecipeIndexPage | `src/components/pages/RecipeIndexPage.tsx` | kicker, title, author, readingTime, byline, breadcrumbs |

`ContentPageLayout` also passes props through to `ContentPageHeader`, so both direct and layout-wrapped consumers need the new `heroImage` prop.

## Available Images

In `/public/images/landing/`:
- `HERO.webp` / `HERO.jpg` — steak close-up (good default for guides)
- `MEALPREP.webp` — meal prep shot (good for recipe index)
- `HEROBREAKFAST.webp` — breakfast shot (good for recipes)
- `LIFESTYLE.webp` — lifestyle shot
- `CHEATDAY.webp` — cheatday food
- `final-cta-bg.webp` — dark food texture

---

### Task 1: Add `heroImage` prop to ContentPageHeader

**Files:**
- Modify: `src/components/seo/ContentPageHeader.tsx`

- [ ] **Step 1: Add `heroImage` to the interface**

Add an optional `heroImage` prop to `ContentPageHeaderProps`:

```tsx
interface ContentPageHeaderProps {
  kicker: string;
  title: string;
  author: string;
  readingTime: string;
  byline?: string;
  breadcrumbs: { label: string; to: string }[];
  heroImage?: string; // path to background image, e.g. "/images/landing/HERO.webp"
}
```

Destructure it in the component function signature.

- [ ] **Step 2: Rebuild the header markup with hero image support**

Replace the entire `<header>` return with:

```tsx
return (
  <>
    <header className="relative flex min-h-[40vh] flex-col justify-end overflow-hidden bg-surface-dark md:min-h-[50vh]">
      {/* Background image */}
      {heroImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt=""
            className="h-full w-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgb(28,25,23)]/60 via-[rgb(28,25,23)]/30 to-[rgb(28,25,23)]/80" />
        </div>
      )}

      {/* Fallback gradient when no image */}
      {!heroImage && (
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-stone-900 via-sage-900 to-[rgb(28,25,23)]" />
      )}

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-3xl px-5 pb-8 pt-16 md:px-8 md:pb-10 md:pt-24">
        <nav className="mb-6 text-xs text-white/50" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.to}>
              {i > 0 && <span className="mx-1.5">&rsaquo;</span>}
              {i < breadcrumbs.length - 1 ? (
                <Link to={crumb.to} className="transition-colors hover:text-white/70">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-white/35">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        <p className="editorial-kicker text-sage-400 mb-3">{kicker}</p>

        <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-white drop-shadow-lg md:text-5xl md:leading-tight">
          {title}
        </h1>

        <div className="mt-5 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white/80 backdrop-blur-sm">
            {author.charAt(0).toUpperCase()}
          </div>
          <p className="text-sm text-white/60">
            {byline ?? (
              <>
                {author} &middot; {readingTime} leestijd
              </>
            )}
          </p>
        </div>
      </div>
    </header>

    <div className="content-header-gradient" />
  </>
);
```

Key changes from current:
- `min-h-[40vh]` / `md:min-h-[50vh]` instead of fixed small padding
- `flex flex-col justify-end` to push content to bottom of hero
- Background image with gradient overlay (same pattern as landing hero)
- Fallback gradient when no `heroImage`
- Larger title: `md:text-5xl` (up from `md:text-4xl`)
- `drop-shadow-lg` on title for readability over images
- Refined breadcrumb colors: `text-white/50` instead of `text-stone-400`
- Slightly larger avatar circle with `backdrop-blur-sm`

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: no TypeScript errors (heroImage is optional, all existing consumers still work)

- [ ] **Step 4: Commit**

```bash
git add src/components/seo/ContentPageHeader.tsx
git commit -m "feat: redesign ContentPageHeader with hero image support"
```

---

### Task 2: Update content.css gradient transition

**Files:**
- Modify: `src/styles/content.css`

- [ ] **Step 1: Update the header gradient to be taller and smoother**

Change `.content-page .content-header-gradient`:

```css
.content-page .content-header-gradient {
  height: 3rem;
  background: linear-gradient(
    180deg,
    rgb(28 25 23) 0%,
    rgb(var(--surface-accent)) 40%,
    rgb(248, 250, 247) 100%
  );
}
```

This creates a smooth transition: dark header bottom → sage accent → cream page background. The current version jumps directly from sage to cream which is jarring.

- [ ] **Step 2: Visual check**

Run: `npm run dev`
Navigate to `/gids/slow-carb-vs-keto` — verify the gradient flows smoothly from the dark header into the cream body.

- [ ] **Step 3: Commit**

```bash
git add src/styles/content.css
git commit -m "style: smooth header-to-body gradient transition"
```

---

### Task 3: Add `heroImage` prop passthrough in ContentPageLayout

**Files:**
- Modify: `src/components/seo/ContentPageLayout.tsx`

- [ ] **Step 1: Add `heroImage` to the layout props and pass it through**

Add `heroImage?: string` to `ContentPageLayoutProps` and pass it to `<ContentPageHeader>`:

```tsx
interface ContentPageLayoutProps {
  kicker: string;
  title: string;
  author: string;
  readingTime: string;
  breadcrumbs: { label: string; to: string }[];
  children: ReactNode;
  relatedLinks?: { label: string; to: string }[];
  heroImage?: string;
}
```

In the JSX, pass it through:

```tsx
<ContentPageHeader
  kicker={kicker}
  title={title}
  author={author}
  readingTime={readingTime}
  breadcrumbs={breadcrumbs}
  heroImage={heroImage}
/>
```

- [ ] **Step 2: Verify build passes**

Run: `npm run build`
Expected: clean build, no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/seo/ContentPageLayout.tsx
git commit -m "feat: pass heroImage through ContentPageLayout"
```

---

### Task 4: Wire up hero images to article pages

**Files:**
- Modify: `src/components/pages/ArticlePage.tsx`
- Modify: `src/components/pages/PillarPage.tsx`

- [ ] **Step 1: Add heroImage to ArticlePage**

In `ArticlePage.tsx`, add `heroImage` to the `<ContentPageLayout>` call:

```tsx
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
  heroImage="/images/landing/HERO.webp"
>
```

- [ ] **Step 2: Add heroImage to PillarPage**

In `PillarPage.tsx`, add `heroImage` to the `<ContentPageLayout>` call:

```tsx
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
  heroImage="/images/landing/LIFESTYLE.webp"
>
```

- [ ] **Step 3: Verify visually**

Run: `npm run dev`
Check both `/gids/slow-carb-dieet` and `/gids/slow-carb-vs-keto` — should see full-bleed hero images behind the header text.

- [ ] **Step 4: Commit**

```bash
git add src/components/pages/ArticlePage.tsx src/components/pages/PillarPage.tsx
git commit -m "feat: add hero images to guide article headers"
```

---

### Task 5: Wire up hero images to recipe and index pages

**Files:**
- Modify: `src/components/pages/RecipeDetailPage.tsx`
- Modify: `src/components/pages/GuideIndexPage.tsx`
- Modify: `src/components/pages/RecipeIndexPage.tsx`

- [ ] **Step 1: Add heroImage to RecipeDetailPage**

In `RecipeDetailPage.tsx`, add `heroImage` to the `<ContentPageHeader>` call:

```tsx
<ContentPageHeader
  kicker={recipe.category}
  title={recipe.name}
  author="SlowCarb"
  readingTime=""
  byline={headerByline}
  breadcrumbs={[
    { label: 'Home', to: '/' },
    { label: 'Recepten', to: '/recepten' },
    { label: recipe.name, to: `/recepten/${slug}` },
  ]}
  heroImage="/images/landing/HEROBREAKFAST.webp"
/>
```

- [ ] **Step 2: Add heroImage to GuideIndexPage**

```tsx
<ContentPageHeader
  kicker="Gids"
  title="Slow Carb Gids"
  author="SlowCarb"
  readingTime=""
  byline={`SlowCarb · ${guideArticles.length} artikelen`}
  breadcrumbs={[
    { label: 'Home', to: '/' },
    { label: 'Gids', to: '/gids' },
  ]}
  heroImage="/images/landing/MEALPREP.webp"
/>
```

- [ ] **Step 3: Add heroImage to RecipeIndexPage**

In `RecipeIndexPage.tsx`, add `heroImage` to the `<ContentPageHeader>` call:

```tsx
<ContentPageHeader
  kicker="Recepten"
  title="Slow Carb Recepten"
  author="SlowCarb"
  readingTime=""
  byline={`SlowCarb · ${PUBLIC_RECIPES.length} recepten`}
  breadcrumbs={[
    { label: 'Home', to: '/' },
    { label: 'Recepten', to: '/recepten' },
  ]}
  heroImage="/images/landing/CHEATDAY.webp"
/>
```

- [ ] **Step 4: Verify all pages visually**

Run: `npm run dev`
Check: `/gids`, `/gids/slow-carb-dieet`, `/gids/slow-carb-vs-keto`, `/recepten`, `/recepten/chili-con-carne`
All should show hero images with readable text overlay.

- [ ] **Step 5: Verify build passes**

Run: `npm run build`
Expected: clean build

- [ ] **Step 6: Commit**

```bash
git add src/components/pages/RecipeDetailPage.tsx src/components/pages/GuideIndexPage.tsx src/components/pages/RecipeIndexPage.tsx
git commit -m "feat: add hero images to recipe and index page headers"
```

---

## Summary

| What changes | Before | After |
|---|---|---|
| Header height | ~120px fixed | 40-50vh responsive |
| Background | Flat gradient | Full-bleed food photography + layered gradient |
| Title size | 3xl / 4xl | 3xl / 5xl with drop shadow |
| Breadcrumbs | stone-400 text | white/50 text (softer, more editorial) |
| Avatar | sage bg circle | frosted glass circle (backdrop-blur) |
| Gradient transition | 1.5rem sage→cream | 3rem dark→sage→cream |
| Content position | Top-aligned | Bottom-aligned (content sits at base of hero) |

All changes are backwards-compatible — the `heroImage` prop is optional, so pages without it still render the existing gradient fallback.

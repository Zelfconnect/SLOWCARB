# SEO & Landing Page Visual Consistency Redesign

**Date:** 2026-03-21
**Status:** Design approved

## Problem

The landing page and SEO content pages (gids, recepten) feel like two separate websites. The landing page is dark, cinematic, and bold. The content pages have a lighter "blog template" feel with different typography, no shared navigation, and lower-quality hero images.

## Goals

1. Unify the visual language across landing and all public content pages
2. Add shared navigation so visitors can move between pages naturally
3. Replace SEO page hero images with new dark cinematic Midjourney images matching the landing hero
4. Maintain SEO page readability — consistent shell, editorial body content stays clean

## Design Decisions

### 1. Shared `SiteHeader` Component

**New file:** `src/components/seo/SiteHeader.tsx`

Extract the header + hamburger menu from `LandingHero.tsx` into a standalone component used by all public pages.

**Structure:**
- Logo ("SlowCarb") left-aligned
- Mobile: hamburger icon right-aligned (not logged in) or "Ga naar de app" button (logged in)
- Desktop: horizontal nav links right-aligned + "Ga naar de app" button when logged in

**Hamburger menu content (not logged in):**
- Top section — page links: Gids (`/gids`), Recepten (`/recepten`)
- Divider
- Bottom section — landing scroll anchors: De methode, Hoe werkt de app, Bewijs, Prijs, FAQ
- On the landing page: smooth-scroll to `#method`, `#premium-app-showcase`, `#reviews`, `#pricing`, `#faq`
- On content pages: navigate to `/#method`, `/#premium-app-showcase`, `/#reviews`, `/#pricing`, `/#faq`
- CTA button at bottom: "Begin met de 5 regels"

**Desktop nav:** Gids, Recepten + landing section links (De methode, Hoe werkt de app, Bewijs, Prijs, FAQ)

**Design decision — nav link reduction:** The current `LandingHero.tsx` has 5 scroll anchors (De methode, Hoe werkt de app, Bewijs, Prijs, FAQ). All 5 are kept in the new SiteHeader. The new addition is Gids and Recepten as page links at the top.

**Auth detection:** Uses `useUserStore` (`profile !== null` check). Note: `LandingPage.tsx` currently reads `localStorage.getItem('slowcarb_profile')` directly — the SiteHeader will use the Zustand store instead for consistency.

**Positioning:** Absolutely positioned over the hero area (transparent background), matching the current landing header style. Uses `text-inverse-strong` for white text over dark heroes.

**Integration:**
- `LandingHero.tsx`: Remove inline header + mobile menu code (lines 72-128), render `<SiteHeader isLandingPage />` instead
- `ContentPageHeader.tsx`: Add `<SiteHeader />` at the top, positioned over the hero image
- All public pages get navigation for free through ContentPageHeader/ContentPageLayout
- CSS classes `.landing-hero-brand` and `.landing-hero-nav` from `src/styles/landing.css` need to remain accessible — either move to shared CSS or keep as-is and apply in SiteHeader

### 2. Restyled `ContentPageHeader`

Align visual treatment with the landing hero:

**Typography changes:**
- Title: Switch from `font-display` (Fraunces serif) to `font-heading` (Oswald condensed sans-serif) to match the landing hero. Use `font-bold uppercase tracking-tight` with `drop-shadow-2xl`, larger scale (`text-4xl md:text-6xl`). This is a deliberate font-family change for visual consistency.
- Kicker: Keep `editorial-kicker text-sage-400` (already matches)

**Gradient overlay:**
- Replace hardcoded `from-[rgb(28,25,23)]/60 via-[rgb(28,25,23)]/30 to-[rgb(28,25,23)]/80`
- Use landing hero's token-based values: `from-surface-dark/50 via-surface-dark/20 to-surface-dark/70`
- Note: opacity values change from 60/30/80 to 50/20/70 to match the landing hero exactly

**Hero image — responsive `<picture>` element:**
- Current `ContentPageHeader` uses a plain `<img>` with a single `heroImage?: string` prop
- Refactor to `<picture>` with `<source>` for desktop, matching the landing hero pattern
- Change prop from `heroImage?: string` to `heroImage?: { mobile: string; desktop: string }` or two separate props `heroImageMobile?: string` and `heroImageDesktop?: string`
- All consumers of `ContentPageHeader` need updating for the new prop shape
- `ContentPageLayout` needs to pass through the new image props (currently only passes `heroImage?: string`)

**Dimensions:**
- Keep `min-h-[40vh] md:min-h-[50vh]` — content pages should NOT be full-screen heroes
- Add top padding (`pt-16` or similar) to account for the absolutely-positioned SiteHeader

**Breadcrumbs stay** as secondary navigation within the hero content area.

### 3. New Hero Images (Midjourney)

Replace existing low-quality SEO hero images with new dark cinematic food photography matching the landing hero style.

**Images needed:**

| Page | File | Description |
|------|------|-------------|
| `/gids` | `gids-hero-desktop.webp`, `gids-hero-mobile.webp` | Overhead meal prep containers, dark wooden counter, dramatic side lighting |
| `/gids/slow-carb-dieet` | `slowcarb-guide-hero-desktop.webp`, `slowcarb-guide-hero-mobile.webp` | Close-up ceramic plate with beans/steak/spinach, dark slate, warm side lighting |
| `/gids/slow-carb-vs-keto` | `keto-comparison-hero-desktop.webp`, `keto-comparison-hero-mobile.webp` | Top-down single plate with protein/legumes/vegetables, dark concrete, moody lighting |
| `/recepten` | `recepten-hero-desktop.webp`, `recepten-hero-mobile.webp` | Overhead dark table with multiple bowls, scattered ingredients, dramatic warm lighting |
| Recipe details | Keep existing recipe photos | Individual recipe pages keep their product-shot photos — different purpose |

**Storage:** `public/images/seo/` directory

**Usage:** `<picture>` element with `<source media="(min-width: 768px)">` for desktop variant, matching the landing hero's responsive image pattern.

**Style direction:** Dark backgrounds, warm side lighting, shallow depth of field, cinematic editorial food photography. Same moody quality as `hero-bg-mobile.webp` / `hero-bg-desktop.webp`.

**Midjourney prompts:**

`/gids` index:
```
overhead view of glass meal prep containers with lentils, grilled chicken, and green vegetables on a dark wooden kitchen counter, moody dramatic side lighting, shallow depth of field, dark food photography, warm tones, cinematic, editorial style --ar 16:9 --v 6.1 --style raw
```
(Also generate `--ar 9:16` variant for mobile)

`/gids/slow-carb-dieet`:
```
close-up of a rustic ceramic plate with black beans, seared steak, and sautéed spinach on a dark slate surface, dramatic warm side lighting, shallow depth of field, dark moody food photography, editorial cinematic style --ar 16:9 --v 6.1 --style raw
```

`/gids/slow-carb-vs-keto`:
```
top-down view of a single plate with grilled protein, legumes and roasted vegetables on a dark concrete surface, scattered herbs, moody dramatic lighting from the left, dark food photography, warm cinematic tones --ar 16:9 --v 6.1 --style raw
```

`/recepten` index:
```
overhead dark wooden table with multiple ceramic bowls of different slow carb meals, beans, grilled meats, fresh vegetables, scattered ingredients, dramatic warm lighting, dark moody food photography, editorial cinematic style --ar 16:9 --v 6.1 --style raw
```

### 4. Navigation Behavior — Scroll vs Link

The `SiteHeader` component receives a prop `isLandingPage?: boolean`:
- `true` (landing page): section links use smooth-scroll to anchor IDs (`#method`, `#premium-app-showcase`, `#reviews`, `#pricing`, `#faq`)
- `false` (content pages): section links navigate to `/#method`, `/#premium-app-showcase`, `/#reviews`, `/#pricing`, `/#faq`

### 5. StickyCTA — Content Pages

**Decision: No StickyCTA on content pages.** The existing `CTABand` component at the bottom of content pages is sufficient. SEO visitors are in information-seeking mode; a sticky price bar is too aggressive. The landing page remains the sales-focused experience.

### 6. Footer — No Changes

The `Footer` component is already shared and consistent. No modifications needed.

## Component Changes Summary

| Component | Action |
|-----------|--------|
| `SiteHeader.tsx` | **NEW** — extracted from LandingHero, shared across all public pages |
| `LandingHero.tsx` | **MODIFY** — remove inline header/menu (lines 72-128), use `<SiteHeader isLandingPage />` |
| `ContentPageHeader.tsx` | **MODIFY** — add SiteHeader, restyle typography (font-display → font-heading), update gradient, refactor `heroImage` prop to support mobile/desktop, use `<picture>` element |
| `ContentPageLayout.tsx` | **MODIFY** — update `heroImage` prop type to match new ContentPageHeader interface, pass through new props |
| `GuideIndexPage.tsx` | **MODIFY** — update hero image paths to new `public/images/seo/` images with mobile/desktop variants |
| `RecipeIndexPage.tsx` | **MODIFY** — update hero image paths to new `public/images/seo/` images with mobile/desktop variants |
| `RecipeDetailPage.tsx` | **MODIFY** — update hero image prop to match new interface (uses ContentPageHeader directly) |
| `ArticlePage.tsx` | **MODIFY** — update hero image paths |
| `PillarPage.tsx` | **MODIFY** — update hero image paths |
| `src/styles/landing.css` | **MINOR** — may need to make header CSS classes (`.landing-hero-brand`, `.landing-hero-nav`) accessible from SiteHeader context, or move to shared CSS |

## Files NOT Changed

- `src/components/ui/*` — shadcn components untouched
- `src/components/landing/Footer.tsx` — already consistent
- `src/components/seo/CTABand.tsx` — already consistent
- `src/components/seo/AuthorCard.tsx` — no changes needed
- `src/styles/content.css` — may need minor typography token updates

## Out of Scope

- No StickyCTA on content pages
- No parallax/scroll animations on content pages
- No changes to individual recipe detail photos (product shots, different purpose)
- No changes to the app shell (authenticated experience)
- No new content/articles

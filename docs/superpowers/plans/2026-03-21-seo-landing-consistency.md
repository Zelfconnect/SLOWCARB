# SEO & Landing Page Visual Consistency — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify the visual language across landing page and all SEO content pages with a shared navigation header, consistent hero styling, and new Midjourney hero images.

**Architecture:** Extract header + hamburger menu from LandingHero into a shared SiteHeader component. Restyle ContentPageHeader typography and gradient to match the landing hero. Convert new PNG hero images to high-quality WebP. Update all page components to use new image paths and prop shapes.

**Tech Stack:** React, React Router, Tailwind CSS, sharp (image conversion via inline Node script), Zustand (auth state)

**Spec:** `docs/superpowers/specs/2026-03-21-seo-landing-consistency-design.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `src/components/seo/SiteHeader.tsx` | CREATE | Shared header: logo, hamburger menu, desktop nav, auth-aware "Ga naar de app" |
| `src/components/landing/LandingHero.tsx` | MODIFY | Remove inline header/menu (lines 72-128), use `<SiteHeader>` |
| `src/components/landing/LandingPage.tsx` | MODIFY | Remove floating "Ga naar de app" button (lines 119-126), SiteHeader handles it |
| `src/components/seo/ContentPageHeader.tsx` | MODIFY | Add SiteHeader, restyle typography + gradient, support mobile/desktop hero images |
| `src/components/seo/ContentPageLayout.tsx` | MODIFY | Update heroImage prop to match new ContentPageHeader interface |
| `src/components/pages/GuideIndexPage.tsx` | MODIFY | Update hero image paths |
| `src/components/pages/RecipeIndexPage.tsx` | MODIFY | Update hero image paths |
| `src/components/pages/RecipeDetailPage.tsx` | MODIFY | Update hero image paths |
| `src/components/pages/ArticlePage.tsx` | MODIFY | Update hero image paths |
| `src/components/pages/PillarPage.tsx` | MODIFY | Update hero image paths |
| `src/components/landing/__tests__/LandingPage.test.tsx` | MODIFY | Fix tests for SiteHeader extraction + auth changes |
| `public/images/landing/gids/*.webp` | CREATE | Converted WebP images from Midjourney PNGs |

---

## Task 1: Convert PNG Hero Images to WebP

**Files:**
- Input: `public/images/landing/gids/*.png` (8 files, ~16MB total)
- Output: `public/images/landing/gids/*.webp` (8 files)

- [ ] **Step 1: Convert all PNGs to high-quality WebP using inline Node script**

sharp-cli's `-o` flag expects a directory (not a file path), and some output filenames need renaming (e.g., `gidsslow-carb-dieet.png` → `gidsslow-carb-dieet-desktop.webp`). Use a Node one-liner with sharp directly:

```bash
cd c:/dev/slowcarb
node -e "
const sharp = require('sharp');
const conversions = [
  ['public/images/landing/gids/gids-desktop.png', 'public/images/landing/gids/gids-desktop.webp'],
  ['public/images/landing/gids/gids-mobile.png', 'public/images/landing/gids/gids-mobile.webp'],
  ['public/images/landing/gids/gidsslow-carb-dieet.png', 'public/images/landing/gids/gidsslow-carb-dieet-desktop.webp'],
  ['public/images/landing/gids/gidsslow-carb-dieet-mobile.png', 'public/images/landing/gids/gidsslow-carb-dieet-mobile.webp'],
  ['public/images/landing/gids/gidsslow-carb-vs-keto-desktop.png', 'public/images/landing/gids/gidsslow-carb-vs-keto-desktop.webp'],
  ['public/images/landing/gids/gidsslow-carb-vs-keto-mobile.png', 'public/images/landing/gids/gidsslow-carb-vs-keto-mobile.webp'],
  ['public/images/landing/gids/recepten-desktop.png', 'public/images/landing/gids/recepten-desktop.webp'],
  ['public/images/landing/gids/recepten-mobile.png', 'public/images/landing/gids/recepten-mobile.webp'],
];
Promise.all(conversions.map(([src, dst]) =>
  sharp(src).webp({ quality: 85 }).toFile(dst).then(info => console.log(dst, Math.round(info.size/1024)+'KB'))
)).then(() => console.log('Done'));
"
```

- [ ] **Step 2: Verify output sizes and quality**

```bash
ls -lh public/images/landing/gids/*.webp
```

Expected: each WebP file is significantly smaller than the PNG while maintaining quality.

- [ ] **Step 3: Commit**

```bash
git add public/images/landing/gids/*.webp
git commit -m "assets: convert Midjourney hero PNGs to high-quality WebP"
```

---

## Task 2: Create SiteHeader Component

**Files:**
- Create: `src/components/seo/SiteHeader.tsx`

- [ ] **Step 1: Create SiteHeader**

This component is extracted from `LandingHero.tsx` lines 9-15 (navLinks), 17-28 (state/effects), 44-51 (scrollTo), 72-128 (header + mobile menu JSX). Add page links (Gids, Recepten) and auth-aware "Ga naar de app" button.

**Important:** Keep `landing-hero-brand` and `landing-hero-nav` CSS classes on the logo and nav elements. These classes drive the staggered intro animation in `src/styles/landing.css` (lines 206-249). Without them, the landing page header entrance animation breaks.

```tsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { trackLanding } from '@/components/landing/analytics';

interface SiteHeaderProps {
  /** When true, section links smooth-scroll to anchors. When false, they navigate to /#anchor */
  isLandingPage?: boolean;
  onCheckout?: () => void;
}

const pageLinks = [
  { to: '/gids', label: 'Gids' },
  { to: '/recepten', label: 'Recepten' },
];

const sectionLinks = [
  { anchor: '#method', label: 'De methode' },
  { anchor: '#premium-app-showcase', label: 'Hoe werkt de app' },
  { anchor: '#reviews', label: 'Bewijs' },
  { anchor: '#pricing', label: 'Prijs' },
  { anchor: '#faq', label: 'FAQ' },
];

export function SiteHeader({ isLandingPage = false, onCheckout }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const profile = useUserStore((s) => s.profile);
  const navigate = useNavigate();

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, anchor: string) => {
    e.preventDefault();
    setMenuOpen(false);
    if (isLandingPage) {
      const el = document.querySelector(anchor);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    } else {
      navigate('/' + anchor);
    }
  };

  const hasProfile = profile !== null;

  return (
    <>
      {/* Use relative positioning on landing (participates in flex flow),
          absolute on content pages (overlays the hero image) */}
      <header className={`${isLandingPage ? 'relative z-10' : 'absolute top-0 left-0 right-0 z-50'} w-full px-5 py-5 sm:px-6 md:px-10 md:py-8 flex justify-between items-center`}>
        <Link
          to="/"
          className="landing-hero-brand text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-inverse-strong font-sans truncate min-w-0"
        >
          SlowCarb
        </Link>

        {hasProfile ? (
          <a
            href="/?app=1"
            className="landing-hero-nav rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-sage-700 shadow-lg ring-1 ring-sage-200 backdrop-blur hover:bg-white transition-colors"
          >
            Ga naar de app
          </a>
        ) : (
          <>
            <button
              onClick={() => {
                setMenuOpen(true);
                trackLanding('landing_menu_open');
              }}
              className="landing-hero-nav text-inverse-strong hover:text-inverse-muted transition-colors md:hidden"
              aria-label="Menu openen"
            >
              <Menu className="w-8 h-8" />
            </button>
            <nav className="landing-hero-nav hidden md:flex items-center gap-8">
              {pageLinks.map(({ to, label }) => (
                <Link key={to} to={to} className="text-inverse-body hover:text-inverse-strong transition-colors text-sm font-medium">
                  {label}
                </Link>
              ))}
              {sectionLinks.map(({ anchor, label }) => (
                <a key={anchor} href={isLandingPage ? anchor : `/${anchor}`} onClick={(e) => handleSectionClick(e, anchor)} className="text-inverse-body hover:text-inverse-strong transition-colors text-sm font-medium">
                  {label}
                </a>
              ))}
            </nav>
          </>
        )}
      </header>

      {/* Mobile Menu — only for non-authenticated users */}
      {!hasProfile && (
        <div className={`fixed inset-0 z-[60] md:hidden ${menuOpen ? '' : 'pointer-events-none'}`} aria-hidden={!menuOpen}>
          <div
            className={`absolute inset-0 bg-surface-dark/80 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setMenuOpen(false)}
          />
          <nav
            className={`absolute top-0 right-0 w-full max-w-sm h-full bg-surface-dark/95 backdrop-blur-md transform transition-transform duration-300 flex flex-col pt-24 px-8 pb-8 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            <button onClick={() => setMenuOpen(false)} className="absolute top-5 right-5 text-inverse-strong hover:text-inverse-muted transition-colors p-2" aria-label="Menu sluiten">
              <X className="w-8 h-8" />
            </button>
            <div className="flex flex-col gap-2">
              {/* Page links */}
              {pageLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl font-bold text-inverse-strong hover:text-white/70 transition-colors py-3 border-b border-white/10"
                >
                  {label}
                </Link>
              ))}
              {/* Divider */}
              <div className="my-2 border-b border-white/20" />
              {/* Section links */}
              {sectionLinks.map(({ anchor, label }) => (
                <a
                  key={anchor}
                  href={isLandingPage ? anchor : `/${anchor}`}
                  onClick={(e) => handleSectionClick(e, anchor)}
                  className="text-2xl font-bold text-inverse-strong hover:text-white/70 transition-colors py-3 border-b border-white/10"
                >
                  {label}
                </a>
              ))}
            </div>
            <div className="mt-auto">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onCheckout?.();
                }}
                className="cta-accent-button w-full text-center text-base py-4"
              >
                Begin met de 5 regels
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: Clean build (SiteHeader isn't imported yet, so no errors)

- [ ] **Step 3: Commit**

```bash
git add src/components/seo/SiteHeader.tsx
git commit -m "feat: create shared SiteHeader with nav and auth-aware button"
```

---

## Task 3: Integrate SiteHeader into LandingHero + LandingPage

**Files:**
- Modify: `src/components/landing/LandingHero.tsx`
- Modify: `src/components/landing/LandingPage.tsx`

- [ ] **Step 1: Update LandingHero — remove inline header/menu, add SiteHeader**

Replace the entire header + mobile menu section in `LandingHero.tsx` with `<SiteHeader>`. Remove the `navLinks` array, `menuOpen` state, `scrollTo` function, and Menu/X imports. Keep the hero content (background, heading, CTA).

The component keeps `onCheckout` prop but now passes it to `SiteHeader`.

Key changes:
- Remove: lines 1-2 (Menu, X imports), lines 9-15 (navLinks), lines 18-51 (menuOpen state, keydown effect, scrollTo), lines 72-128 (header + mobile menu JSX)
- Add: `import { SiteHeader } from '@/components/seo/SiteHeader';`
- Add: `<SiteHeader isLandingPage onCheckout={onCheckout} />` inside the hero section, before the main content

**Critical: SiteHeader uses `relative z-10` when `isLandingPage` is true**, preserving the original flex flow behavior. The landing hero uses `flex flex-col justify-between`, so the header must participate in the flow (not `absolute`). This matches the original `LandingHero` header which used `relative z-10`.

The resulting `LandingHero.tsx` should be:

```tsx
import { useEffect, useState } from 'react';
import { SiteHeader } from '@/components/seo/SiteHeader';

interface LandingHeroProps {
  onCheckout: () => void;
}

export function LandingHero({ onCheckout }: LandingHeroProps) {
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    let introFrame = 0;
    let readyFrame = 0;

    introFrame = window.requestAnimationFrame(() => {
      readyFrame = window.requestAnimationFrame(() => setHeroReady(true));
    });

    return () => {
      window.cancelAnimationFrame(introFrame);
      window.cancelAnimationFrame(readyFrame);
    };
  }, []);

  return (
    <section
      className="landing-hero-shell relative w-full min-w-0 max-w-none h-[100dvh] min-h-[100dvh] flex flex-col justify-between overflow-hidden bg-surface-dark m-0 p-0"
      data-hero-ready={heroReady ? 'true' : 'false'}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source media="(min-width: 768px)" srcSet="/images/landing/hero-bg-desktop.webp" type="image/webp" />
          <img
            src="/images/landing/hero-bg-mobile.webp"
            alt="SlowCarb maaltijd"
            className="landing-hero-media w-full h-full object-cover object-center"
            loading="eager"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-surface-dark/50 via-surface-dark/20 to-surface-dark/70" />
      </div>

      {/* Header — relative positioning preserved for flex flow */}
      <SiteHeader isLandingPage onCheckout={onCheckout} />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-full px-4 sm:px-6 text-center">
        <p className="landing-hero-kicker editorial-kicker text-inverse-muted mb-4 md:mb-12">SlowCarb Methode</p>
        <h1 className="w-full max-w-full font-heading font-bold uppercase text-inverse-strong drop-shadow-2xl text-[5.5rem] leading-[0.85] tracking-[-0.03em] mb-4 sm:text-[5.5rem] md:text-[8rem] md:leading-[0.85] md:mb-12 lg:text-[10rem] xl:text-[12rem]">
          <span className="landing-hero-heading-line block">8 tot 10{' '}</span>
          <span className="landing-hero-heading-line block">kilo in{' '}</span>
          <span className="landing-hero-heading-line block">6 weken.</span>
        </h1>
        <p className="landing-hero-copy editorial-body italic text-inverse-body max-w-md drop-shadow-md md:mb-16">
          Geen calorie&#235;n tellen. Geen wilskracht nodig.<br />E&#233;n systeem dat werkt.
        </p>
      </div>

      {/* Bottom CTA */}
      <div className="relative z-10 w-full px-5 sm:px-6 pb-10 md:pb-8 text-center">
        <button onClick={onCheckout} className="landing-hero-cta cta-accent-button text-sm md:text-base px-12 py-4 md:px-16 md:py-5">
          Begin met de 5 regels
        </button>
        <p className="landing-hero-footnote hidden md:block mt-4 text-xs text-white/40">
          *Resultaten variëren per persoon. Gebaseerd op het protocol uit The 4-Hour Body.
        </p>
      </div>
    </section>
  );
}
```

Note: `trackLanding` import is removed from LandingHero — SiteHeader imports it directly.

- [ ] **Step 2: Update LandingPage — remove floating "Ga naar de app" button**

In `src/components/landing/LandingPage.tsx`:
- Remove lines 63-68 (the `hasProfile` localStorage check)
- Remove lines 119-126 (the floating `<a href="/?app=1">` button)

SiteHeader now handles auth-aware display on all pages via Zustand `useUserStore`.

- [ ] **Step 3: Verify landing page works**

```bash
npm run build
```

Then manually verify at `http://localhost:5173/`:
- Logo + hamburger appear with staggered intro animation
- Hamburger opens menu with Gids, Recepten + section links
- Section links smooth-scroll on landing page
- If localStorage has `slowcarb_profile`, "Ga naar de app" button shows instead

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/LandingHero.tsx src/components/landing/LandingPage.tsx
git commit -m "feat: integrate SiteHeader into landing page, remove inline nav"
```

---

## Task 4: Update ContentPageHeader + Layout + All Pages (single commit to avoid broken build)

**Files:**
- Modify: `src/components/seo/ContentPageHeader.tsx`
- Modify: `src/components/seo/ContentPageLayout.tsx`
- Modify: `src/components/pages/GuideIndexPage.tsx`
- Modify: `src/components/pages/RecipeIndexPage.tsx`
- Modify: `src/components/pages/RecipeDetailPage.tsx`
- Modify: `src/components/pages/ArticlePage.tsx`
- Modify: `src/components/pages/PillarPage.tsx`

**Why single task:** Changing the `heroImage` prop type from `string` to `{ mobile: string; desktop: string }` breaks all consumers. All changes must land together to keep the build passing per CLAUDE.md rules.

- [ ] **Step 1: Update ContentPageHeader**

Changes:
1. Add `SiteHeader` at the top of the hero (absolute positioning — content pages don't need flex flow)
2. Change `heroImage?: string` prop to `heroImage?: { mobile: string; desktop: string }`
3. Switch from `<img>` to `<picture>` with mobile/desktop sources
4. Restyle title: `font-display text-3xl` → `font-heading font-bold uppercase tracking-tight text-4xl md:text-6xl drop-shadow-2xl` (font-family changes from Fraunces serif to Oswald condensed sans-serif)
5. Update gradient to use `surface-dark` tokens: `from-surface-dark/50 via-surface-dark/20 to-surface-dark/70` (was `rgb(28,25,23)` with 60/30/80 opacities)
6. Increase top padding from `pt-16` to `pt-20` and `md:pt-24` to `md:pt-28` to accommodate SiteHeader

```tsx
import { Link } from 'react-router-dom';
import { SiteHeader } from './SiteHeader';

interface HeroImage {
  mobile: string;
  desktop: string;
}

interface ContentPageHeaderProps {
  kicker: string;
  title: string;
  author: string;
  readingTime: string;
  byline?: string;
  breadcrumbs: { label: string; to: string }[];
  heroImage?: HeroImage;
}

export function ContentPageHeader({
  kicker,
  title,
  author,
  readingTime,
  byline,
  breadcrumbs,
  heroImage,
}: ContentPageHeaderProps) {
  return (
    <>
      <header className="relative flex min-h-[40vh] flex-col justify-end overflow-hidden bg-surface-dark md:min-h-[50vh]">
        <SiteHeader />

        {heroImage && (
          <div className="absolute inset-0 z-0">
            <picture>
              <source media="(min-width: 768px)" srcSet={heroImage.desktop} type="image/webp" />
              <img
                src={heroImage.mobile}
                alt=""
                className="h-full w-full object-cover object-center"
                loading="eager"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-b from-surface-dark/50 via-surface-dark/20 to-surface-dark/70" />
          </div>
        )}

        {!heroImage && (
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-stone-900 via-sage-900 to-[rgb(28,25,23)]" />
        )}

        <div className="relative z-10 mx-auto w-full max-w-3xl px-5 pb-8 pt-20 md:px-8 md:pb-10 md:pt-28">
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

          <h1 className="font-heading text-4xl font-bold uppercase leading-tight tracking-tight text-white drop-shadow-2xl md:text-6xl md:leading-tight">
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
}
```

- [ ] **Step 2: Update ContentPageLayout — new heroImage prop type**

In `src/components/seo/ContentPageLayout.tsx`, change `heroImage?: string` to `heroImage?: { mobile: string; desktop: string }` in the interface:

```tsx
interface ContentPageLayoutProps {
  kicker: string;
  title: string;
  author: string;
  readingTime: string;
  breadcrumbs: { label: string; to: string }[];
  children: ReactNode;
  relatedLinks?: { label: string; to: string }[];
  heroImage?: { mobile: string; desktop: string };
}
```

- [ ] **Step 3: Update GuideIndexPage (line 56)**

```tsx
// Old:
heroImage="/images/landing/MEALPREP.webp"
// New:
heroImage={{ mobile: '/images/landing/gids/gids-mobile.webp', desktop: '/images/landing/gids/gids-desktop.webp' }}
```

- [ ] **Step 4: Update RecipeIndexPage (line 48)**

```tsx
// Old:
heroImage="/images/landing/CHEATDAY.webp"
// New:
heroImage={{ mobile: '/images/landing/gids/recepten-mobile.webp', desktop: '/images/landing/gids/recepten-desktop.webp' }}
```

- [ ] **Step 5: Update RecipeDetailPage (line 89)**

Recipe detail pages don't have new Midjourney images — use existing image for both:
```tsx
// Old:
heroImage="/images/landing/HEROBREAKFAST.webp"
// New:
heroImage={{ mobile: '/images/landing/HEROBREAKFAST.webp', desktop: '/images/landing/HEROBREAKFAST.webp' }}
```

- [ ] **Step 6: Update ArticlePage (line 66)**

```tsx
// Old:
heroImage="/images/landing/HERO.webp"
// New:
heroImage={{ mobile: '/images/landing/gids/gidsslow-carb-vs-keto-mobile.webp', desktop: '/images/landing/gids/gidsslow-carb-vs-keto-desktop.webp' }}
```

Note: Currently only `slow-carb-vs-keto` uses ArticlePage (PillarPage handles `slow-carb-dieet`).

- [ ] **Step 7: Update PillarPage (line 66)**

```tsx
// Old:
heroImage="/images/landing/LIFESTYLE.webp"
// New:
heroImage={{ mobile: '/images/landing/gids/gidsslow-carb-dieet-mobile.webp', desktop: '/images/landing/gids/gidsslow-carb-dieet-desktop.webp' }}
```

- [ ] **Step 8: Verify full build passes**

```bash
npm run build
```

Expected: Clean build, no TypeScript errors.

- [ ] **Step 9: Commit**

```bash
git add src/components/seo/ContentPageHeader.tsx src/components/seo/ContentPageLayout.tsx src/components/pages/GuideIndexPage.tsx src/components/pages/RecipeIndexPage.tsx src/components/pages/RecipeDetailPage.tsx src/components/pages/ArticlePage.tsx src/components/pages/PillarPage.tsx
git commit -m "feat: restyle content pages with SiteHeader, responsive hero images, landing typography"
```

---

## Task 5: Fix Tests

**Files:**
- Modify: `src/components/landing/__tests__/LandingPage.test.tsx`

The following tests will break after the SiteHeader extraction:

1. **`LandingHero` tests need Router context** — SiteHeader uses `<Link>` and `useNavigate()` from react-router-dom. Wrap `<LandingHero>` renders in `<MemoryRouter>`.
2. **"renders the existing hero animation hooks" test (line 184)** — checks for `.landing-hero-brand` and `.landing-hero-nav` CSS classes. SiteHeader preserves these classes, so this test should still pass IF wrapped in Router. Verify.
3. **"renders 5 nav links" test (line 196)** — SiteHeader now renders 7 links (Gids, Recepten + 5 section links) in desktop + mobile = 14+ links. Update assertion.
4. **"opens the mobile menu" test (line 205)** — needs Router context.
5. **"closes the mobile menu" tests (lines 213, 224)** — need Router context.
6. **"Ga naar de app" tests (lines 111, 117)** — SiteHeader uses Zustand `useUserStore` instead of direct localStorage. Need to mock the Zustand store or call `useUserStore.getState().updateProfile()` before rendering.
7. **"does not crash when localStorage.getItem throws" test (line 122)** — may need adjustment since SiteHeader reads from Zustand (which reads localStorage at load time, not render time).
8. **LandingPage render tests** — also need Router context since SiteHeader (via LandingHero) uses `<Link>`.

- [ ] **Step 1: Add Router wrapper and Zustand mocks to test file**

Add a helper at the top of the test file:

```tsx
import { MemoryRouter } from 'react-router-dom';
import { useUserStore } from '@/store/useUserStore';

function withRouter(ui: React.ReactElement) {
  return <MemoryRouter>{ui}</MemoryRouter>;
}
```

- [ ] **Step 2: Wrap all LandingPage renders in Router**

Every `render(<LandingPage />)` becomes `render(withRouter(<LandingPage />))`.
Every `render(<LandingHero onCheckout={onCheckout} />)` becomes `render(withRouter(<LandingHero onCheckout={onCheckout} />))`.

- [ ] **Step 3: Fix "Ga naar de app" tests**

Replace localStorage-based auth tests with Zustand store manipulation:

```tsx
it('shows "Ga naar de app" button when user has profile', () => {
  useUserStore.getState().updateProfile({ name: 'test' } as UserProfile);
  render(withRouter(<LandingPage />));
  expect(screen.getByText('Ga naar de app')).toBeInTheDocument();
});

it('hides "Ga naar de app" button when no profile', () => {
  render(withRouter(<LandingPage />));
  expect(screen.queryByText('Ga naar de app')).not.toBeInTheDocument();
});
```

Add `useUserStore.getState().logout()` to `beforeEach` to reset state.

- [ ] **Step 4: Fix "renders 5 nav links" test**

Update the count assertion — SiteHeader now renders Gids + Recepten + 5 section links = 7 unique labels, with desktop + mobile duplicates:

```tsx
it('renders 7 nav links (page + section)', () => {
  render(withRouter(<LandingHero onCheckout={onCheckout} />));
  const links = screen.getAllByText(
    /Gids|Recepten|De methode|Hoe werkt de app|Bewijs|Prijs|FAQ/,
  );
  expect(links.length).toBeGreaterThanOrEqual(7);
});
```

- [ ] **Step 5: Fix "does not crash when localStorage.getItem throws" test**

This test verifies localStorage resilience. Since SiteHeader uses Zustand (which reads localStorage at store init, not at render), adjust:

```tsx
it('does not crash when localStorage.getItem throws', () => {
  const originalGetItem = Storage.prototype.getItem;
  Storage.prototype.getItem = vi.fn(() => {
    throw new Error('Storage unavailable');
  });

  // Re-initialize the store to trigger the failing localStorage read
  useUserStore.getState().loadProfile();

  expect(() => render(withRouter(<LandingPage />))).not.toThrow();

  Storage.prototype.getItem = originalGetItem;
});
```

- [ ] **Step 6: Run tests**

```bash
npm run test
```

Expected: All tests pass.

- [ ] **Step 7: Run full build**

```bash
npm run build
```

Expected: Clean build.

- [ ] **Step 8: Commit**

```bash
git add src/components/landing/__tests__/LandingPage.test.tsx
git commit -m "test: fix tests for SiteHeader extraction and Zustand auth"
```

---

## Task 6: Manual Verification

- [ ] **Step 1: Start dev server and verify all pages**

```bash
npm run dev
```

**Landing page (`/`):**
- [ ] SiteHeader shows logo + hamburger (mobile) / nav links (desktop)
- [ ] Logo + nav have staggered intro animation (landing-hero-brand, landing-hero-nav classes)
- [ ] Hamburger menu has Gids, Recepten (top) + De methode, Hoe werkt de app, Bewijs, Prijs, FAQ (bottom)
- [ ] Section links smooth-scroll on landing page
- [ ] "Begin met de 5 regels" CTA in hamburger menu works

**Content pages (`/gids`, `/recepten`, `/gids/slow-carb-dieet`, `/recepten/chili-con-carne`):**
- [ ] SiteHeader appears over dark hero image
- [ ] New Midjourney hero images load (check mobile and desktop via browser resize)
- [ ] Title uses Oswald (font-heading), uppercase, bold — visually matches landing hero
- [ ] Gradient overlay matches landing page feel
- [ ] Section links in hamburger navigate to `/#method` etc.
- [ ] Breadcrumbs still visible below header
- [ ] Page body content (text, cards, articles) unchanged

**Auth behavior:**
- [ ] With profile in Zustand store: "Ga naar de app" button appears on ALL pages
- [ ] Without profile: hamburger menu appears on ALL pages

- [ ] **Step 2: Final commit if any visual tweaks needed**

```bash
git add -A
git commit -m "fix: visual tweaks from manual verification"
```

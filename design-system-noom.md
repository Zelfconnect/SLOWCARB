# Design System — SlowCarb Landing v3 (Noom-exact)

## Core Aesthetic
Conversion machine. Bold, clean, white. Every section does ONE job.
No decoration for decoration's sake. Visual hierarchy über alles.
Noom reference: https://www.noom.com

## Typography
- Display: Fraunces — weight 900, letter-spacing -0.02em
- Body: Source Sans 3 — weight 400/600
- Key sizes:
  - Hero H1: text-6xl md:text-8xl weight-900 leading-[1.05]
  - Section H2: text-4xl md:text-5xl weight-800
  - H3 (blocks): text-3xl weight-900 Fraunces
  - Body: text-lg leading-relaxed (1.7)
  - Step numbers: text-7xl font-display text-stone-200 (huge, ghosted)

## Colors — Strict
- bg-white and bg-stone-50 ONLY for alternating sections
- bg-stone-900 for Final CTA (dark, premium — NOT sage)
- bg-sage-50 for Guarantee section only
- Accent: sage-600 (CTAs, highlights) — used sparingly
- Pain icons: rose-500
- Text: stone-900 (primary), stone-600 (body), stone-400 (muted)
- NO clay colors on landing page
- NO colorful section backgrounds (no sage-800 mid-page)
- NO wave dividers or decorative SVGs

## Spacing — Noom breathes
- Section: py-24 md:py-32 (generous!)
- Container: max-w-6xl mx-auto px-5 md:px-8
- Alternating block gap: gap-16 md:gap-24
- Content prose max-width: max-w-xl

## Section Order & Background Pattern
1. Sticky mobile bar (fixed, stone-900 bg)
2. Hero — bg-white
3. Herkenbaar? — bg-stone-50
4. Wat als afvallen simpel was? — bg-white
5. Zo werkt de app — bg-stone-50
6. De 5 regels — bg-white
7. Founder — bg-stone-50
8. Vergelijking — bg-white
9. Pricing — bg-stone-50
10. Garantie — bg-sage-50
11. Social Proof — bg-white
12. FAQ — bg-stone-50
13. Final CTA — bg-stone-900 (dark)
14. Footer — bg-stone-900

## Component Rules

### Buttons
- Primary: `h-14 px-8 bg-sage-600 hover:bg-sage-700 text-white rounded-xl font-bold text-lg transition-colors`
- Mobile sticky CTA button: `bg-white text-stone-900 font-bold` (inverted on dark bar)
- NO scale transform on hover (not Noom's style)

### Rule Cards
- `rounded-2xl border border-stone-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow`
- Number circle: `w-10 h-10 bg-stone-900 text-white rounded-full` (dark, NOT sage)
- Title: `text-xl font-display font-bold text-stone-900`
- Quote: `text-sm italic text-stone-500 mt-1`
- Body: `text-sm text-stone-600 leading-relaxed mt-3`

### Comparison Table
- Container: `rounded-2xl border border-stone-200 overflow-hidden`
- Rows alternate: bg-white / bg-stone-50
- Highlight row: `bg-stone-900 text-white font-bold` (dark, NOT sage)

### FAQ
- Question: `text-lg font-semibold text-stone-900`
- Chevron: `text-stone-400` (not sage)
- Answer: `text-stone-600 leading-relaxed`
- Divider: `border-b border-stone-200`

## Animations
- Hero elements: staggered opacity + translateY fade-in on mount (0ms, 150ms, 300ms, 450ms)
- Scroll sections: IntersectionObserver → opacity-0 translateY-6 → opacity-100 translateY-0, 600ms ease-out
- Cards hover: shadow-sm → shadow-md, 200ms
- NO heavy motion, NO sliding panels
- Sticky mobile bar: initial slide-in from bottom on first render

## Anti-Patterns (DO NOT)
- No gradient section backgrounds
- No clay colors
- No sage-700/800 as section background mid-page
- No wave SVG dividers
- No shadow-elevated everywhere
- No colorful floating badges (max 1 badge per page: Early Bird on pricing)
- No stock-photo style background images behind text
- Rule circles MUST be stone-900, not sage

# PRD: SlowCarb Landing Page

## Goal
Build a high-converting landing page for SlowCarb — a slow-carb diet recipe app selling for €40-60 lifetime access.

## File Location
Create: `src/components/LandingPage.tsx`
This is a NEW file. Do NOT modify existing components.

## Design System
Use the EXISTING design tokens from the project:
- Colors: sage-600/700 (primary green), stone-* (neutrals), cream background
- Font: Inter (font-display for headings, font-sans for body)
- Tailwind classes already configured — use them
- Match the style of existing components (rounded-2xl/3xl cards, subtle borders)

## Page Structure (single scrollable page)

### 1. Hero Section
- Background: gradient from sage-600 to sage-700
- Headline: "8-10 kg kwijt in 6 weken" (large, white, bold)
- Subheadline: "Geen calorie-tellen. Geen bullshit. Gewoon eten wat werkt."
- CTA button: "Start nu — €49 lifetime" (white bg, sage text, rounded-xl)
- Below CTA: "Eenmalige betaling • Geen abonnement • Direct toegang"

### 2. Problem/Solution Section
- "Herkenbaar?" header
- 3 pain points with icons:
  - 🔄 "Elke maandag opnieuw beginnen met een dieet"
  - 📊 "Calorie-apps die het erger maken dan het probleem"
  - ⏱️ "Geen tijd om elke dag te bedenken wat je eet"
- Then: "SlowCarb is anders." + brief explanation of the 5 rules

### 3. The 5 Rules Section
- Clean cards showing the 5 slow carb rules:
  1. Geen witte koolhydraten
  2. 30g eiwit binnen 30 min na opstaan
  3. Geen vloeibare calorieën
  4. Geen fruit (avocado & tomaat OK)
  5. Peulvruchten bij elke maaltijd
- Each card: icon + rule + one-line explanation

### 4. What You Get Section
- "Wat je krijgt" header
- Feature cards:
  - 🍳 35+ recepten (ontbijt, lunch, diner)
  - 📱 PWA — werkt als app op je telefoon
  - 🛒 Slimme boodschappenlijst
  - 📚 Weekelijkse educatie over de wetenschap
  - 🎉 Cheatday protocol
  - 📈 Gewicht & voortgang tracking

### 5. Social Proof Section (placeholder for now)
- "Wat gebruikers zeggen" header
- 3 testimonial cards (use realistic but clearly placeholder text)
- Format: quote + name + result ("Mark, -9 kg in 5 weken")

### 6. Pricing Section
- Single pricing card, centered
- "SlowCarb Lifetime Access"
- Price: €49 (was €79 doorgestreept)
- Feature checklist with green checkmarks
- CTA button: "Direct toegang →"
- Below: "30 dagen geld-terug garantie"

### 7. FAQ Section
- Accordion/collapsible items:
  - "Is dit veilig?"
  - "Wat mag ik op een cheatday?"
  - "Moet ik calorieën tellen?" (Nee!)
  - "Hoe lang heb ik toegang?"
  - "Wat als het niet werkt?"

### 8. Final CTA Section
- Dark sage background
- "Klaar om te beginnen?"
- Same CTA button as hero
- Trust signals: "500+ recepten bekeken" "Direct toegang" "Geen abonnement"

## Technical Requirements
- Single React component, no external dependencies beyond what's in package.json
- Responsive: mobile-first (this is primarily a mobile app)
- NO Stripe integration yet — CTA buttons just scroll to pricing or link to #pricing
- Use smooth scroll between sections
- Animations: subtle fade-in on scroll using Intersection Observer (vanilla, no library)
- Must be importable in App.tsx (but don't modify App.tsx)
- Export as default: `export default function LandingPage()`

## Typography
- Hero headline: text-4xl md:text-6xl font-bold
- Section headers: text-3xl font-bold
- Body: text-base text-stone-600
- Use Inter throughout (already configured)

## DO NOT
- Do not modify ANY existing files
- Do not add npm packages
- Do not create router/navigation — this is a standalone component
- Do not implement actual payment — just UI

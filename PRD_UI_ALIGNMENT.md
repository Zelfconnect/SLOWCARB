# PRD: UI Alignment - Landing Page vs App

## Visuele Analyse Samenvatting

| Aspect | Landing Page | App | Status |
|--------|-------------|-----|--------|
| **Primary Button** | `rounded-xl` (12px), `sage-700` | `rounded-2xl` (16px), `sage-600` | ❌ INCONSISTENT |
| **Input Fields** | N/A | `rounded-2xl` (16px), custom | ⚠️ Afwijkend van shadcn |
| **Card Radius** | `rounded-2xl` (20px) | `rounded-2xl` (20px) | ✅ OK |
| **Card Shadows** | `shadow-card` | `shadow-soft` / none | ❌ INCONSISTENT |
| **Headings** | `font-display` (Fraunces) | Mix sans/display | ⚠️ Gedeeltelijk |
| **Hero Gradient** | `sage-600 → sage-700` | `sage-600 → sage-700` | ✅ OK |
| **Neutral Colors** | `stone-*` | `warm-*` + `stone-*` | ❌ INCONSISTENT |

---

## Top 10 Fixes (meest impactvol eerst)

### 1. Unified Button Border Radius
**Probleem:** Landing page gebruikt `rounded-xl` (12px), app onboarding gebruikt `rounded-2xl` (16px)

**Fix:** Standaardiseer op `rounded-xl` (12px) voor alle buttons
```
Bestand: src/components/OnboardingWizard.tsx
Wijzig: rounded-2xl → rounded-xl (alleen voor buttons)
```

---

### 2. Unified Primary Button Color
**Probleem:** Landing page gebruikt `sage-700`, app gebruikt `sage-600`

**Fix:** Gebruik `sage-600` als primary (consistent met shadcn button variant)
```
Bestand: src/components/LandingPage.tsx (2 locaties)
Wijzig: bg-sage-700 → bg-sage-600
Wijzig: text-sage-700 → text-sage-600
```

---

### 3. Input Field Consistentie
**Probleem:** Onboarding gebruikt `rounded-2xl` en custom styling, shadcn input gebruikt `rounded-md`

**Fix:** Pas shadcn input aan naar app styling
```
Bestand: src/components/ui/input.tsx
Wijzig: rounded-md → rounded-2xl
Wijzig: h-9 → h-14
Wijzig: px-3 → px-5
Wijzig: toevoegen: border-warm-300 bg-white/90
```

---

### 4. Card Shadow Standaardisatie
**Probleem:** Landing page gebruikt `shadow-card`, app gebruikt `shadow-soft` of geen shadow

**Fix:** Gebruik `shadow-card` voor alle cards
```
Bestanden: 
- src/components/RecipeCard.tsx
- src/components/StreakHeroCard.tsx
- src/components/DailyMealTracker.tsx
- src/components/JourneyCard.tsx

Wijzig: shadow-soft → shadow-card (waar van toepassing)
```

---

### 5. Typography Headings Consistentie
**Probleem:** Niet alle app headings gebruiken `font-display`

**Fix:** Zorg dat alle H1-H3 `font-display` gebruiken
```
Bestand: src/components/Dashboard.tsx
Wijzig: DialogTitle en headings → font-display

Bestand: src/components/OnboardingWizard.tsx  
Wijzig: h1 elementen → font-display (zijn al OK)
```

---

### 6. Neutral Color Consolidatie
**Probleem:** App mixt `warm-*` en `stone-*` kleuren

**Fix:** Gebruik `stone-*` voor neutrale kleuren (consistent met landing page)
```
Bestand: src/components/OnboardingWizard.tsx
Wijzig: text-warm-900 → text-stone-900
Wijzig: text-warm-600 → text-stone-600
Wijzig: text-warm-700 → text-stone-700
Wijzig: bg-warm-50 → bg-stone-50
Wijzig: border-warm-200 → border-stone-200
Wijzig: border-warm-300 → border-stone-300
```

---

### 7. Section Padding Consistentie  
**Probleem:** Landing page heeft consistente section padding, app niet

**Fix:** Standaardiseer section padding
```
Bestand: src/App.tsx (main content area)
Huidig: px-4 pt-4 pb-28
Aanpassen: px-5 pt-5 pb-28 (match landing page px-5)
```

---

### 8. Card Border Color
**Probleem:** Landing page gebruikt `border-stone-200`, app gebruikt soms geen border

**Fix:** Voeg consistente borders toe
```
Bestanden:
- src/components/StreakHeroCard.tsx
- src/components/DailyMealTracker.tsx

Toevoegen: border border-stone-200 (waar missing)
```

---

### 9. Premium Input Class Usage
**Probleem:** Onboarding definieert eigen input styling, niet herbruikbaar

**Fix:** Gebruik de bestaande `.input-premium` class
```
Bestand: src/components/OnboardingWizard.tsx
Wijzig: Input className → gebruik input-premium class

Bestand: src/components/Dashboard.tsx (weight dialog)
Wijzig: Input className → gebruik input-premium class
```

---

### 10. Background Color Consistentie
**Probleem:** Landing page gebruikt `bg-cream`, app gebruikt soms `bg-warm-50`

**Fix:** Gebruik overal `bg-cream`
```
Bestand: src/components/OnboardingWizard.tsx
Wijzig: bg-warm-50 → bg-cream
Wijzig: bg-gradient-to-b from-cream via-warm-50 → from-cream via-cream
```

---

## Implementatie Volgorde

1. **Kleuren** (items 2, 6, 10) - Hoogste visuele impact
2. **Buttons** (item 1) - Core interactie element
3. **Inputs** (item 3, 9) - Formulier consistentie
4. **Cards** (item 4, 8) - Layout consistentie
5. **Typography** (item 5) - Polish
6. **Spacing** (item 7) - Fijne afstemming

---

## Test Checklist

- [ ] Landing page buttons zien er hetzelfde uit als app buttons
- [ ] Input fields hebben consistente styling
- [ ] Cards hebben consistente shadows en borders
- [ ] Alle headings gebruiken Fraunces font
- [ ] Geen `warm-*` kleuren meer in codebase
- [ ] Geen visuele regressies in onboarding flow
- [ ] Geen visuele regressies in dashboard
- [ ] Mobile (390px) en desktop werken beide

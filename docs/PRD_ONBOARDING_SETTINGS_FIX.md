# PRD: Onboarding + Settings shadcn Compliance Fix

**Context:** Onboarding visibility issue (mogelijk race condition) + Settings tab heeft hardcoded colors ipv design tokens.

**Goal:** Fix onboarding conditional logic + refactor Settings naar 100% shadcn compliance.

---

## Task 1: Fix Onboarding Conditional Logic

**File:** `src/App.tsx`

**Problem:** 
Conditional `!profile || !profile.hasCompletedOnboarding` checkt alleen `profile`, maar niet of `isLoaded` is true. Dit kan een race condition veroorzaken bij mount.

**Fix:**
```tsx
// BEFORE
if (!profile || !profile.hasCompletedOnboarding) {
  return <OnboardingWizard ... />;
}

// AFTER
if (!isLoaded) {
  return null; // or <LoadingSpinner />
}

if (!profile || !profile.hasCompletedOnboarding) {
  return <OnboardingWizard ... />;
}
```

**Acceptance:**
- Fresh state (localStorage empty) → OnboardingWizard shows immediately
- Existing profile (hasCompletedOnboarding: true) → skip onboarding, show dashboard
- No flash of unstyled content during profile load

---

## Task 2: Settings Tab — Replace Hardcoded Colors with Design Tokens

**File:** `src/components/SettingsTab.tsx`

**Changes:**

### 2.1: Text colors
```tsx
// BEFORE
<p className="text-center text-gray-600">Geen profiel gevonden</p>
<p className="text-sm text-gray-500 mt-1">{profile.weightGoal || 10} kg afvallen</p>
<p className="text-sm text-gray-600">Versie 3.0.0</p>

// AFTER
<p className="text-center text-muted-foreground">Geen profiel gevonden</p>
<p className="text-sm text-muted-foreground mt-1">{profile.weightGoal || 10} kg afvallen</p>
<p className="text-sm text-muted-foreground">Versie 3.0.0</p>
```

### 2.2: Destructive button (Wis alles)
```tsx
// BEFORE
<AlertDialogAction
  className="bg-red-600 hover:bg-red-700"
  onClick={handleClearAllData}
>
  Wis alles
</AlertDialogAction>

// AFTER
// Remove className, destructive styling is built into AlertDialogAction when parent is destructive
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive" className="w-full">Wis alle data</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Wis alle data?</AlertDialogTitle>
      <AlertDialogDescription>
        Dit verwijdert ALLES - profiel, voortgang, voorkeuren. Dit kan niet ongedaan worden gemaakt.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Annuleer</AlertDialogCancel>
      <AlertDialogAction onClick={handleClearAllData}>
        Wis alles
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### 2.3: Container spacing
```tsx
// BEFORE
<div className="space-y-6 pb-24 px-4">

// AFTER
<div className="space-y-6 pb-24">
{/* px-4 is redundant — main wrapper in App.tsx already has px-4 */}
```

**Acceptance:**
- No `text-gray-*` classes (use `text-muted-foreground`)
- No `bg-red-*` hardcoded classes (use shadcn variant system)
- Consistent spacing with rest of app

---

## Task 3: Add Separator Components to Settings Cards

**File:** `src/components/SettingsTab.tsx`

**Add:** `import { Separator } from '@/components/ui/separator';`

**Changes:**
Between items in CardContent where visual separation helps (Profile section between inputs, Preferences section between switches):

```tsx
// Profile Section — BEFORE
<CardContent className="space-y-4">
  <div>
    <Label htmlFor="name">Naam</Label>
    <Input ... />
  </div>
  
  <div>
    <Label htmlFor="weight-goal">Gewichtsdoel (kg)</Label>
    <Slider ... />
    <p className="text-sm text-muted-foreground mt-1">...</p>
  </div>
  
  <div>
    <Label>Cheat day</Label>
    <RadioGroup ...>...</RadioGroup>
  </div>
</CardContent>

// Profile Section — AFTER
<CardContent className="space-y-4">
  <div>
    <Label htmlFor="name">Naam</Label>
    <Input ... />
  </div>
  
  <Separator />
  
  <div>
    <Label htmlFor="weight-goal">Gewichtsdoel (kg)</Label>
    <Slider ... />
    <p className="text-sm text-muted-foreground mt-1">...</p>
  </div>
  
  <Separator />
  
  <div>
    <Label>Cheat day</Label>
    <RadioGroup ...>...</RadioGroup>
  </div>
</CardContent>
```

Apply same pattern to:
- Preferences section (between each Switch item)
- Data section (between Reset Journey and Wis alle data buttons)

**Acceptance:**
- Visual separators between major input groups
- Consistent with shadcn patterns (see https://ui.shadcn.com/docs/components/separator)
- Improves scannability

---

## Verification

**Build:**
```bash
cd ~/projects/slowcarb-new
npm run build
```

**Runtime:**
1. Clear localStorage: `localStorage.clear()` in console
2. Hard refresh (Cmd+Shift+R)
3. Onboarding should show immediately
4. Complete onboarding → Settings tab
5. Check:
   - No `text-gray-*` in DOM (inspect Settings tab)
   - Separator lines visible between sections
   - "Wis alles" button has correct destructive styling (no hardcoded bg-red)
   - App loads without flashing/race conditions

**Kimi QA (post-fix):**
Screenshot Settings tab → compare with pre-fix → confirm shadcn compliance.

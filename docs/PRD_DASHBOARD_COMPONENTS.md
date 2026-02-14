# PRD: SlowCarb Dashboard Missing Components

## Context
SlowCarb v3 dashboard implementation. Most components exist, need to build the missing pieces.

**Stack:**
- Vite React SPA (NOT Next.js)
- Tailwind CSS + shadcn/ui
- Zustand for state (useUserStore already exists)
- localStorage persistence

**Existing Infrastructure:**
- `/src/types/index.ts` - UserProfile type with onboarding status
- `/src/store/useUserStore.ts` - Zustand store with user data
- `/src/lib/storageKeys.ts` - Storage constants
- `/src/components/Dashboard.tsx` - Main dashboard (already imports components)

**Existing Components (working):**
- StreakHeroCard.tsx
- WeeklyProgressGrid.tsx
- CheatDayCountdown.tsx
- WeightProgressCard.tsx
- DailyMealTracker.tsx

## Required Components

### 1. QuickActionFAB (`/src/components/QuickActionFAB.tsx`)

Floating action button in bottom-right corner that's context-aware.

**Requirements:**
- Position: `fixed bottom-20 right-4` (above BottomNav)
- Background: `bg-sage-600` with white icon
- Size: `w-14 h-14` with shadow-lg
- Icon: Plus from lucide-react

**Behavior:**
- Click opens action menu with 2 options:
  - "Log Maaltijd" → opens meal logging modal
  - "Log Gewicht" → opens weight input modal
- Use shadcn Dialog for modals
- Context-aware: if it's morning, prioritize weight; if meal time, prioritize meal

**Implementation:**
```typescript
interface QuickActionFABProps {
  onLogMeal: () => void;
  onLogWeight: () => void;
}
```

### 2. OnboardingWizard (`/src/components/OnboardingWizard.tsx`)

Full-screen modal wizard that blocks app until complete.

**Requirements:**
- Full-screen overlay using shadcn Dialog
- Cannot be dismissed (no X button, no ESC, no backdrop click)
- 5 steps with progress indicator at top
- Mobile-first design (max-w-md mx-auto)

**Steps:**

**Step 1: Welcome**
- Title: "Welkom bij SlowCarb"
- Subtitle: "Je persoonlijke slow-carb coach"
- Input: Name (text field)
- CTA: "Volgende"

**Step 2: Goal**
- Title: "Wat is je doel?"
- Weight loss slider: 3-20 kg
- Shows: "In ongeveer X weken" (calculated)
- CTA: "Volgende"

**Step 3: Preferences**
- Title: "Jouw voorkeuren"
- Checkboxes:
  - "Ik ben vegetarisch"
  - "Ik heb een airfryer"
  - "Ik sport regelmatig"
- CTA: "Volgende"

**Step 4: Cheat Day**
- Title: "Kies je cheat day"
- Radio buttons:
  - "Zaterdag"
  - "Zondag"
- Info text: "Dit is je wekelijkse vrije dag"
- CTA: "Volgende"

**Step 5: Start**
- Title: "Klaar om te starten!"
- Summary of choices
- Big CTA: "Start je Journey" (sage-600 button)

**State Management:**
- Use `useUserStore` to save:
  - hasCompletedOnboarding: true
  - profile data (name, goal, preferences, cheatDay)
  - journey start date

### 3. SettingsTab (`/src/components/SettingsTab.tsx`)

5th tab in BottomNav for user settings.

**Requirements:**
- Clean list-style settings
- Uses shadcn Card components

**Sections:**

**Profile Section:**
- Name (editable)
- Weight goal (editable slider)
- Cheat day (radio selection)

**Preferences Section:**
- Vegetarian toggle
- Airfryer toggle
- Sport toggle

**Data Section:**
- "Reset Journey" button (destructive, with confirmation)
- "Clear All Data" button (super destructive, double confirmation)

**About Section:**
- App version
- Contact link

### 4. Integration Updates

**Update `/src/App.tsx`:**
- Check `hasCompletedOnboarding` from store
- If false: show OnboardingWizard
- If true: show normal app with Dashboard
- Add Settings as 5th tab in navigation

**Update `/src/components/BottomNav.tsx`:**
- Add 5th tab: Settings (Cog icon)
- Route to SettingsTab component

## Testing Requirements

1. **Onboarding Flow:**
   - Fresh load → OnboardingWizard appears
   - Complete all 5 steps → saves to localStorage
   - Refresh page → goes straight to dashboard

2. **QuickActionFAB:**
   - Visible on dashboard
   - Opens action menu
   - Both actions work (log meal, log weight)

3. **Settings:**
   - 5th tab works
   - All settings editable
   - Changes persist in localStorage

## shadcn Components to Use
- Dialog (for modals)
- Card (for settings sections)
- Button (all CTAs)
- Input (text fields)
- Slider (weight goal)
- RadioGroup (cheat day selection)
- Switch (toggles)
- Label (form labels)

## File Structure
```
/src/components/
  QuickActionFAB.tsx       (new)
  OnboardingWizard.tsx     (new)
  SettingsTab.tsx          (new)
  BottomNav.tsx            (update - add 5th tab)
/src/App.tsx               (update - check onboarding)
```

## Success Criteria
- User can complete onboarding on first visit
- Dashboard shows personalized data
- FAB provides quick actions
- Settings allow profile edits
- All data persists in localStorage
- No build errors, TypeScript happy
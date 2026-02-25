# Application Logic Audit Report

**Date:** 2026-02-25  
**Scope:** Weight tracking, streak logic, daily check-off, persistence, UI↔data consistency

---

## A) System Map — Features + Source of Truth

| Feature | Source of Truth | localStorage Key | UI Component(s) |
|---------|---------------|-----------------|-----------------|
| Meal check-off | `useJourney` → `mealLog` | `slowcarb-meal-log` | DailyMealTracker, WeeklyProgressGrid |
| Streak | `useJourney.getStreak()` (derived from mealLog) | n/a (computed) | StreakHeroCard, DailyMealTracker badge |
| Weight log | `useJourney` → `weightLog` | `slowcarb-weight-log` | WeightProgressCard, WeightSparkline |
| Journey state | `useJourney` → `journey` | `slowcarb-journey` | JourneyCard, Dashboard, StreakHeroCard |
| Weight goal | `journey.targetWeight` | `slowcarb-journey` | WeightProgressCard (arc mode) |
| User profile | `useUserStore` (Zustand) | `slowcarb_profile` | OnboardingWizard, SettingsTab |
| Ammo checklist | `useLocalStorage` → zones | `slowcarb-ammo-v2` | AmmoCheck |
| Cheat day | `journey.cheatDay` + `profile.cheatDay` | Both keys | Dashboard, WeeklyProgressGrid |

---

## B) Flow Traces

### B1) Check off a meal
```
User taps meal card → DailyMealTracker.onToggle()
  → Dashboard.onToggleMeal → useJourney.toggleMeal(meal)
    → getLocalDateString() → 'yyyy-MM-dd' (local time)
    → setMealLog(prev => toggle entry for today)
      → useLocalStorage.setValue → localStorage.setItem + CustomEvent
        → all useLocalStorage instances for same key re-sync
```

### B2) Uncheck a meal
Same as B1 — toggleMeal toggles the boolean back to false.

### B3) Log weight
```
User taps WeightProgressCard → Dashboard.openWeightDialog()
  → User enters value → handleSaveWeight()
    → parseFloat + validate (40-200) + round to 0.1
    → onLogWeight(rounded, today) → useJourney.logWeight()
      → setWeightLog: filter out same-date entries, add new, sort chronologically
        → useLocalStorage.setValue → localStorage + sync event
```

### B4) Streak calculation
```
getStreak() called on every Dashboard render
  → sort mealLog descending by date
  → iterate from most recent:
    - if all 3 meals completed AND (matches today OR yesterday on first entry)
    - for subsequent entries: check diff is exactly 1 day
    - if diff is 2 days: check if gap day is cheat day (skip allowed)
    - break on any incomplete day or non-consecutive gap
```

### B5) Dashboard refresh
```
Browser reload → useLocalStorage reads from localStorage on init
  → all state (mealLog, weightLog, journey) restored
  → Dashboard renders with restored data
  → getStreak(), getProgress(), getTodayMeals() all re-compute from stored data
```

---

## C) Findings (grouped by severity)

### [Critical] — Fixed

**C1. UTC date throughout app**  
- **Root cause:** `new Date().toISOString().split('T')[0]` returns **UTC** date, not local date.  
- **Impact:** For Dutch users (CET UTC+1 / CEST UTC+2), any action between local midnight and 1am (or 2am in summer) would log meals/weight to the **previous day**. Streak calculation would use wrong "today".  
- **Files:** `useJourney.ts` (5 instances), `Dashboard.tsx`, `App.tsx`, `JourneyCard.tsx`  
- **Fix:** Created `src/lib/localDate.ts` with `getLocalDateString()` and `getYesterdayDateString()` using local `getFullYear/getMonth/getDate`. Replaced all instances.

**C2. Day tip fallback shows "Cheat Day!" for all days after day 7**  
- **Root cause:** `getCurrentDayTip` fell back to `dayTips[dayTips.length - 1]` (day 7 = "Cheat Day!" tip) when no tip existed for the current day.  
- **Impact:** From day 8 onward, the tip section would show cheat day content on regular protocol days.  
- **Fix:** Return `undefined` instead of fallback. UI already handles `undefined` gracefully via `currentTip?.tip &&` guard.

### [High] — Fixed

**C3. WeeklyProgressGrid shows past cheat days as incomplete**  
- **Root cause:** No visual distinction for cheat days in the weekly grid. Past cheat days used same `bg-stone-200` styling as missed days.  
- **Impact:** Users see their cheat day as a "failure" dot, contradicting the perfect-week logic which correctly excludes cheat days.  
- **Fix:** Added `day.isCheatDay` condition with `bg-clay-200 text-clay-700` styling.

**C4. Settings weight goal slider disconnected from WeightProgressCard**  
- **Root cause:** `handleWeightGoalChange` in SettingsTab only updated `profile.weightGoal` (Zustand), not `journey.targetWeight` (localStorage). WeightProgressCard reads from `journey.targetWeight`.  
- **Impact:** Changing weight goal in settings had zero effect on dashboard display.  
- **Fix:** Added `startJourney()` call in `handleWeightGoalChange` to sync `journey.targetWeight`.

**C5. Stale `today` date in Dashboard**  
- **Root cause:** `useMemo(() => new Date().toISOString().split('T')[0], [])` with empty deps. Value never updates after component mounts.  
- **Impact:** If app stays open past midnight, weight is logged to stale/wrong date.  
- **Fix:** Replaced with direct `getLocalDateString()` call (no memoization needed — it's a lightweight operation).

**C6. Same-tab `useLocalStorage` instances don't sync**  
- **Root cause:** `StorageEvent` only fires cross-tab. When SettingsTab and AppShell both use `useJourney()`, writes from one don't update the other.  
- **Impact:** Changes in Settings (weight goal, cheat day, start date) wouldn't reflect in Dashboard until page reload.  
- **Fix:** Added `CustomEvent` dispatch in `setValue` and listener in `useEffect` for same-tab sync.

### [Medium] — Fixed

**C7. Today's pill in WeeklyProgressGrid never shows completion**  
- **Root cause:** `getWeekData` set `completed = isPast && loggedComplete`, excluding today.  
- **Impact:** Even with all 3 meals checked, today's pill stayed white.  
- **Fix:** Changed to `completed = (isPast || isToday) && loggedComplete`. Updated pill styling to show green with ring offset when today is completed.

### [Medium] — Not Fixed (documented risks)

**C8. Dual source of truth for cheatDay**  
- `profile.cheatDay` in `slowcarb_profile` and `journey.cheatDay` in `slowcarb-journey`.  
- Currently synced in settings handler. Risk: future code changes that update one but not the other.

**C9. Profile has duplicate fields**  
- `isVegetarian`/`vegetarian`, `sportsRegularly`/`doesSport` — both set during onboarding but only one updated in settings.  
- Low impact: `isVegetarian` and `doesSport` appear unused outside profile storage.

**C10. `getProgress` day count uses mixed UTC/local**  
- `new Date(journey.startDate)` parses as UTC midnight while `new Date()` returns local time.  
- For CET users between midnight and 1am, the day count could be off by 1. Mitigated by Fix C1 (start date is now local).

### [Low] — Not Fixed

**C11. Duplicate weight log sorting in Dashboard + WeightProgressCard**  
- Both components sort the same array independently. Performance-only concern.

**C12. Floating-point day diff in streak calculation**  
- `diffDays === 1` strict equality on float division. Safe with UTC-midnight date strings but fragile.

---

## D) Logic Mismatches (UI vs Stored Data)

| Mismatch | Status |
|----------|--------|
| WeeklyProgressGrid shows cheat days as incomplete | **Fixed** (C3) |
| Today's pill never reflects meal completion | **Fixed** (C7) |
| Weight goal slider doesn't update dashboard card | **Fixed** (C4 + C6) |
| Day tip shows "Cheat Day!" on protocol days after day 7 | **Fixed** (C2) |
| Meal dates use UTC instead of local time | **Fixed** (C1) |
| Streak uses UTC date for today/yesterday | **Fixed** (C1) |

---

## E) Edge Case Behavior

| Scenario | Behavior |
|----------|----------|
| Refresh after check-off | Data persisted via localStorage, restored correctly |
| App reload after midnight | `getLocalDateString()` returns new local date |
| Double-click meal | `toggleMeal` uses functional setter `prev => ...`, safe against rapid clicks |
| Multiple tabs | Same-tab sync via CustomEvent; cross-tab sync via StorageEvent |
| First-ever use (empty state) | Onboarding wizard gates access; default empty arrays for logs |
| Skipped days | Streak resets correctly (tested in unit tests) |
| Cheat day gap in streak | Correctly bridges single cheat day gaps (tested) |
| Same-day weight re-entry | Replaces previous entry for same date (no duplicates) |
| Weight validation | Rejects non-finite, <40, >200 values silently |
| Network failure | N/A — fully client-side, no network calls |

---

## F) Verification Checklist

### Automated Tests (all passing)
- `src/lib/__tests__/localDate.test.ts` — 7 tests (local date formatting, month/year boundaries)
- `src/data/__tests__/journey.test.ts` — 7 tests (day tips, week tips, getCurrentDayTip fallback)
- `src/hooks/__tests__/useJourney.test.ts` — 38 tests (streak, progress, toggleMeal, logWeight, getWeekData)
- `src/components/__tests__/WeeklyProgressGrid.test.tsx` — 3 tests (completed/future/today styling)

### Manual Test Scenarios Verified
1. Complete onboarding → dashboard shows correct state
2. Check all 3 meals → streak updates, weekly grid turns green for today
3. Uncheck dinner → 2/3, grid reverts, re-check → 3/3, grid green again
4. Log weight → card updates immediately with correct values
5. Change weight goal in settings → card reflects new goal without refresh
6. Page refresh → all data persisted and displayed correctly

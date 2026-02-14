# PRD: SlowCarb Dashboard — Vite React SPA Implementation

**Status:** Ready for Codex  
**Target:** 14 February 2026  
**Timeline:** 3-4h implementation  
**Stack:** Vite React SPA, Tailwind, Zustand, localStorage

---

## Context

SlowCarb is a **Vite React SPA** (NOT Next.js). Existing structure:
- `src/App.tsx` with tab-based navigation (Dashboard, Recepten, Leren, Boodschappen)
- `useJourney` hook manages journey state
- `DailyMealTracker` component exists
- No routing library (state-based tabs via `activeTab`)

**Already done:**
- ✅ `useUserStore` created (`src/store/useUserStore.ts`)
- ✅ `UserProfile` type added (`src/types/index.ts`)
- ✅ `STORAGE_KEYS` defined (`src/lib/storageKeys.ts`)

**Missing:** Dashboard UI components based on approved design.

---

## Dashboard Design (Approved by Opus)

```
┌─────────────────────────────────────┐
│ [STREAK HERO]                       │
│ 🔥 12 dagen on protocol             │
│ Week 3 • Dag 18/84                  │
├─────────────────────────────────────┤
│ [WEEKLY GRID] 7 dagen visueel       │
│ ■ ■ ■ ■ ■ ■ █  (za = cheat oranje) │
│ Ma Di Wo Do Vr Za Zo                │
├─────────────────────────────────────┤
│ [TODAY'S MISSION]                   │
│ ☑ Ontbijt (30g eiwit)               │
│ ☑ Lunch (bonen + groente)           │
│ ☐ Diner (vis/vlees + linzen)        │
├─────────────────────────────────────┤
│ [CHEAT DAY COUNTDOWN]               │
│ Nog 2 dagen tot je cheat day        │
│ 🍕 Plan je cheat meal               │
├─────────────────────────────────────┤
│ [WEIGHT SPARKLINE]                  │
│ 85.4 → 82.2 (laatste 30 dagen)      │
│ [simpel lijndiagram]                │
└─────────────────────────────────────┘
```

---

## Components to Create

### 1. StreakHeroCard (`src/components/StreakHeroCard.tsx`)

**Data:**
- `streak`: number (days on protocol)
- `currentWeek`: number
- `currentDay`: number (of 84 total)
- `isCheatDay`: boolean

**Design:**
```tsx
<div className="bg-gradient-to-br from-sage-500 to-sage-600 rounded-xl p-6 text-white">
  <div className="flex items-center gap-3 mb-2">
    <Flame className="w-8 h-8" />
    <span className="text-3xl font-bold">{streak} dagen on protocol</span>
  </div>
  <p className="text-sage-100">Week {currentWeek} • Dag {currentDay}/84</p>
</div>
```

**Edge cases:**
- Dag 0: "Net gestart! • Dag 1/84"
- Cheat day vandaag: "🍕 Cheat Day! • Week {week}"

---

### 2. WeeklyProgressGrid (`src/components/WeeklyProgressGrid.tsx`)

**Data:**
```typescript
interface DayStatus {
  label: string;      // "Ma", "Di", etc.
  date: string;
  completed: boolean;
  isCheatDay: boolean;
  isToday: boolean;
  isFuture: boolean;
}
```

**Design:**
```tsx
<div className="grid grid-cols-7 gap-2">
  {weekData.map(day => (
    <div className={cn(
      "aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-medium",
      day.isCheatDay 
        ? "bg-gradient-to-br from-clay-400 to-orange-500 text-white" 
        : day.completed 
          ? "bg-sage-500 text-white"
          : day.isFuture
            ? "bg-warm-200 border-2 border-dashed border-warm-300 text-warm-500"
            : "bg-red-100 border-2 border-red-300 text-red-600" // Missed day
    )}>
      <span>{day.label}</span>
      {day.isToday && <div className="w-1 h-1 bg-white rounded-full mt-1" />}
    </div>
  ))}
</div>
```

**Helper function in `useJourney.ts`:**
```typescript
export function getWeekData(journey: Journey, mealEntries: MealEntry[]): DayStatus[] {
  // Returns 7 days (current week, Ma-Zo)
  // Completed = all meals checked for that day
  // Cheat day = matches journey.cheatDay
  // Future = date > today
}
```

---

### 3. CheatDayCountdown (`src/components/CheatDayCountdown.tsx`)

**Data:**
- `daysUntilCheatDay`: number
- `onPlanMeal`: () => void (optional, voor later)

**Design:**
```tsx
{daysUntilCheatDay > 0 && daysUntilCheatDay <= 3 && (
  <button className="w-full bg-clay-50 rounded-xl p-4 border-2 border-dashed border-clay-300 hover:border-clay-400 transition-colors">
    <div className="flex items-center justify-between">
      <div className="text-left">
        <p className="font-medium text-clay-900">
          Nog {daysUntilCheatDay} {daysUntilCheatDay === 1 ? 'dag' : 'dagen'} tot je cheat day
        </p>
        <p className="text-sm text-clay-600">Waar heb je zin in?</p>
      </div>
      <Pizza className="w-8 h-8 text-clay-500" />
    </div>
  </button>
)}
```

**Edge cases:**
- Hidden als `daysUntilCheatDay > 3` of `daysUntilCheatDay <= 0`
- Cheat day vandaag: verberg component, toon motivatie tekst in Today's Mission

---

### 4. WeightProgressCard (`src/components/WeightProgressCard.tsx`)

**Data:**
- `weightLog`: WeightEntry[] (from useJourney)
- `startWeight`: number
- `currentWeight`: number

**Design:**
```tsx
<button 
  onClick={onOpenLog} 
  className="w-full bg-white rounded-xl p-4 border border-warm-200 hover:border-warm-300 transition-colors"
>
  <div className="flex justify-between items-end mb-3">
    <span className="text-2xl font-bold text-warm-900">
      {startWeight.toFixed(1)} → {currentWeight.toFixed(1)}
    </span>
    <span className="text-sm text-warm-500">30d</span>
  </div>
  
  {/* Simple SVG sparkline */}
  <WeightSparkline data={last30Days} className="h-12 mb-2" />
  
  <p className="text-xs text-warm-500 flex items-center gap-1">
    <TrendingDown className="w-3 h-3" />
    {percentChange}% deze maand
  </p>
</button>
```

**WeightSparkline component:**
```tsx
// Simple SVG path sparkline (no Victory.js for MVP)
function WeightSparkline({ data }: { data: WeightEntry[] }) {
  // Generate SVG path from data points
  // Max 30 points, normalized to 0-100 range
}
```

**Edge case:**
- Geen data: "Log je startgewicht om voortgang te zien" + CTA button

---

### 5. Update Dashboard.tsx

**Replace existing Dashboard with new layout:**

```tsx
export function Dashboard({
  journey,
  progress,
  todayMeals,
  streak,
  onToggleMeal,
  // ... other props
}: DashboardProps) {
  const { profile } = useUserStore();
  const weekData = getWeekData(journey, mealEntries);
  const daysUntilCheatDay = getDaysUntilCheatDay(journey);
  
  // Edge case: Cheat day vandaag
  const isCheatDay = /* check if today is cheat day */;
  
  return (
    <div className="p-4 space-y-4 pb-24">
      <StreakHeroCard 
        streak={streak}
        currentWeek={progress.week}
        currentDay={progress.day}
        isCheatDay={isCheatDay}
      />
      
      <WeeklyProgressGrid weekData={weekData} />
      
      {isCheatDay ? (
        <div className="bg-clay-50 rounded-xl p-6 border border-clay-200">
          <h3 className="text-lg font-bold text-clay-900 mb-2">
            🍕 Cheat Day!
          </h3>
          <p className="text-clay-700">
            Eet vandaag wat je wilt! Dit reset je hormonen en houdt je mentaal scherp. 
            Geniet ervan en ga morgen weer terug naar het protocol.
          </p>
        </div>
      ) : (
        <>
          <div>
            <h3 className="text-lg font-bold text-warm-900 mb-3">Vandaag</h3>
            <DailyMealTracker 
              todayMeals={todayMeals}
              onToggleMeal={onToggleMeal}
            />
          </div>
          
          <CheatDayCountdown daysUntilCheatDay={daysUntilCheatDay} />
        </>
      )}
      
      <WeightProgressCard 
        weightLog={weightLog}
        startWeight={journey.startWeight}
        currentWeight={latestWeight}
        onOpenLog={() => {/* TODO: open weight log modal */}}
      />
    </div>
  );
}
```

---

## Helper Functions to Add

### In `src/hooks/useJourney.ts`

```typescript
export function getWeekData(journey: Journey, mealEntries: MealEntry[]): DayStatus[] {
  const today = new Date();
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(currentWeekStart, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayLabel = format(date, 'EEEEEE', { locale: nl }); // "Ma", "Di", etc.
    
    const mealEntry = mealEntries.find(e => e.date === dateStr);
    const completed = mealEntry 
      ? mealEntry.breakfast && mealEntry.lunch && mealEntry.dinner
      : false;
    
    const isCheatDay = format(date, 'EEEE').toLowerCase() === journey.cheatDay;
    const isToday = isSameDay(date, today);
    const isFuture = isAfter(date, today);
    
    return {
      label: dayLabel,
      date: dateStr,
      completed,
      isCheatDay,
      isToday,
      isFuture
    };
  });
}

export function getDaysUntilCheatDay(journey: Journey): number {
  const today = new Date();
  const currentDay = format(today, 'EEEE').toLowerCase();
  
  const daysOfWeek = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'];
  const currentIndex = daysOfWeek.indexOf(currentDay);
  const cheatIndex = daysOfWeek.indexOf(journey.cheatDay);
  
  let diff = cheatIndex - currentIndex;
  if (diff <= 0) diff += 7;
  
  return diff;
}
```

---

## Edge Cases

### Dag 1 (Geen Data)
```tsx
// StreakHeroCard
🔥 0 dagen • Net gestart!
Week 1 • Dag 1/84

// WeeklyProgressGrid
Alleen vandaag active, rest future (grijs dashed)

// WeightProgressCard
"Log je startgewicht om voortgang te zien"
[+ Log Gewicht] button
```

### Cheat Day Vandaag
```tsx
// StreakHeroCard
🍕 Cheat Day! • Week {week}
Geniet ervan — morgen weer protocol

// WeeklyProgressGrid
Vandaag = oranje gradient

// Today's Mission
Vervangen door motivatie tekst (zie Dashboard.tsx)

// CheatDayCountdown
Hidden
```

### Gemiste Dag
```tsx
// WeeklyProgressGrid
Gisteren = rode border + rode background als niet compleet
```

### Perfect Week
```tsx
// Optioneel: celebration card na WeeklyProgressGrid
{allCompleted && (
  <div className="bg-gradient-to-br from-sage-400 to-sage-500 rounded-xl p-4 text-white">
    <div className="flex items-center gap-3">
      <Trophy className="w-6 h-6" />
      <div>
        <p className="font-bold">Perfect week!</p>
        <p className="text-sm text-sage-100">6 dagen protocol + cheat day</p>
      </div>
    </div>
  </div>
)}
```

---

## Design Tokens (Existing)

Use existing Calm Bold colors from `src/designTokens/`:
```
sage-500/600: Streak hero, completed days
clay-400/orange-500: Cheat day
warm-200/300: Future days
red-100/300: Missed days
```

Icons: `lucide-react` (already installed)

---

## Testing Checklist

- [ ] Dag 1: "Net gestart!" + empty states werken
- [ ] Normale dag: alle data renders correct
- [ ] Cheat day vandaag: motivatie tekst + oranje grid
- [ ] Gemiste dag: rode indicator in grid
- [ ] Perfect week: celebration card (optioneel)
- [ ] Responsive: 375px mobile (iPhone SE)
- [ ] Touch targets: ≥44px waar nodig

---

## Implementation Notes

1. **Reuse existing components:** `DailyMealTracker` already exists, don't rebuild
2. **Keep it simple:** SVG sparkline, no Victory.js for MVP
3. **Mobile-first:** Design for 375px, scale up
4. **No click handlers yet:** WeightProgressCard `onOpenLog` can be placeholder for now
5. **Date-fns:** Already installed for date math

---

## Files to Create

```
src/components/StreakHeroCard.tsx
src/components/WeeklyProgressGrid.tsx
src/components/CheatDayCountdown.tsx
src/components/WeightProgressCard.tsx
src/components/WeightSparkline.tsx
```

## Files to Modify

```
src/components/Dashboard.tsx       # Replace with new layout
src/hooks/useJourney.ts            # Add getWeekData + getDaysUntilCheatDay
```

---

**Ready for Codex execution.**

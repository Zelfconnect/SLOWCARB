# PRD: SlowCarb Dashboard — User Onboarding + Profile Management

**Status:** Ready for implementation  
**Target:** 14 February 2026 (today)  
**Timeline:** 6h realistic sprint  
**Tech:** Next.js 14, Zustand, localStorage (Stripe/backend next week)

---

## Context

SlowCarb v3 "Zero Planning" is live (https://slowcarb-v3.vercel.app) with:
- ✅ Ingredient-first home (protein → 3 recipes)
- ✅ Progress tracking (weight, cheat days, streaks)
- ✅ Shopping list (Pantry/Weekly)

**Missing:** User accounts, persistent data, personalization.

**Problem:** Currently everything resets on refresh. Users can't save their preferences, track long-term progress, or access recipes across devices.

---

## Goals

1. **User onboarding** — Capture name, weight goal, dietary preferences
2. **Persistent state** — Save to localStorage (backend integration next week)
3. **Dashboard hub** — Welcome screen with streak, quick actions
4. **Profile management** — Edit settings, view progress

---

## Out of Scope (Next Week)

- Stripe payment integration
- Supabase backend
- Email verification
- Password reset flow
- Social auth (Google/Apple)

---

## User Flow

### First Visit (New User)

```
Landing → "Start Gratis" → Onboarding Flow:
  1. "Hoe heet je?" → Naam invoeren
  2. "Wat is je doel?" → Gewicht target slider (3-20 kg)
  3. "Voedingsvoorkeuren?" → Vegetarisch? Allergieën?
  4. "Heb je een airfryer?" → Ja/Nee
  5. "Sport je regelmatig?" → Ja/Nee (voor eiwitporties)
→ Dashboard
```

### Returning User

```
Landing → Check localStorage
  → Has profile? → Dashboard
  → No profile? → Onboarding
```

---

## Components

### 1. Onboarding Flow (`/onboarding`)

**Route:** `/onboarding`

**Component:** `app/onboarding/page.tsx`

**Features:**
- Multi-step wizard (5 stappen)
- Progress indicator (1/5, 2/5, etc.)
- "Volgende" button (disabled tot valid input)
- "Terug" button (vanaf stap 2)

**Steps:**

#### Step 1: Naam
```typescript
<input 
  type="text"
  placeholder="Bijv. Jesper"
  minLength={2}
  className="text-lg p-4 border rounded-lg"
/>
```

#### Step 2: Gewicht Doel
```typescript
<input 
  type="range" 
  min={3} 
  max={20} 
  step={1}
  className="w-full"
/>
<p className="text-center text-2xl font-bold">{value} kg</p>
<p className="text-muted-foreground">~ {weeks} weken bij 0.5 kg/week</p>
```

#### Step 3: Voedingsvoorkeuren
```typescript
<div className="space-y-4">
  <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer">
    <input type="checkbox" />
    <span>Ik eet vegetarisch</span>
  </label>
  
  <textarea 
    placeholder="Allergieën of zaken die je niet eet (optioneel)"
    rows={3}
    className="w-full p-4 border rounded-lg"
  />
</div>
```

#### Step 4: Airfryer
```typescript
<div className="grid grid-cols-2 gap-4">
  <button className={isAirfryer ? 'bg-primary text-white' : 'border'}>
    Ja
  </button>
  <button className={!isAirfryer ? 'bg-primary text-white' : 'border'}>
    Nee
  </button>
</div>
```

#### Step 5: Sport
```typescript
<div className="grid grid-cols-2 gap-4">
  <button className={isSport ? 'bg-primary text-white' : 'border'}>
    Ja, regelmatig
  </button>
  <button className={!isSport ? 'bg-primary text-white' : 'border'}>
    Nee
  </button>
</div>
```

**On Complete:**
```typescript
// Save to localStorage
localStorage.setItem('slowcarb_profile', JSON.stringify({
  name,
  weightGoal,
  isVegetarian,
  allergies,
  hasAirfryer,
  doesSport,
  createdAt: new Date().toISOString()
}));

// Redirect to dashboard
router.push('/dashboard');
```

---

### 2. Dashboard Home (`/dashboard`)

**Route:** `/dashboard`

**Component:** `app/dashboard/page.tsx`

**Layout:**
```
┌─────────────────────────────────┐
│ Header: "Hey [Naam]! 👋"        │
│ Subtitle: "Je bent X dagen bezig"│
├─────────────────────────────────┤
│ Stats Cards (Grid):             │
│ ┌──────┐ ┌──────┐ ┌──────┐      │
│ │Streak│ │Weight│ │Cheat │      │
│ │ 🔥 5 │ │-2.3kg│ │Day 7 │      │
│ └──────┘ └──────┘ └──────┘      │
├─────────────────────────────────┤
│ Quick Actions:                  │
│ [Start je dag] [Cheat day]      │
│ [Weeg jezelf] [Boodschappen]    │
├─────────────────────────────────┤
│ Voortgang Grafiek               │
│ (Weight over time line chart)   │
└─────────────────────────────────┘
```

**Features:**
- Personalized greeting with name
- Current streak display (days on protocol)
- Weight progress (from localStorage history)
- Quick action buttons → navigate to features
- Progress chart (simple line chart with weight entries)

**Data Sources:**
```typescript
// Load from localStorage
const profile = JSON.parse(localStorage.getItem('slowcarb_profile'));
const progressHistory = JSON.parse(localStorage.getItem('slowcarb_progress') || '[]');
const recipeHistory = JSON.parse(localStorage.getItem('slowcarb_recipes') || '[]');

// Calculate streak
const streak = calculateDaysOnProtocol(progressHistory);

// Get latest weight
const latestWeight = progressHistory[progressHistory.length - 1]?.weight;

// Next cheat day
const nextCheatDay = getNextCheatDay(progressHistory);
```

---

### 3. Navigation Updates

**Top Nav:**
```typescript
<nav className="flex items-center justify-between p-4 border-b">
  <h1 className="text-xl font-bold">SlowCarb</h1>
  
  <div className="flex items-center gap-4">
    {/* Avatar/Name Dropdown */}
    <button className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
        {name[0].toUpperCase()}
      </div>
      <span>{name}</span>
      <ChevronDown className="w-4 h-4" />
    </button>
  </div>
</nav>
```

**Dropdown Menu:**
```typescript
<DropdownMenu>
  <DropdownMenuItem onClick={() => router.push('/dashboard')}>
    Dashboard
  </DropdownMenuItem>
  <DropdownMenuItem onClick={() => router.push('/settings')}>
    Instellingen
  </DropdownMenuItem>
  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
    Uitloggen
  </DropdownMenuItem>
</DropdownMenu>
```

---

### 4. Settings Page (`/settings`)

**Route:** `/settings`

**Component:** `app/settings/page.tsx`

**Features:**
- Edit name
- Edit weight goal
- Toggle vegetarisch
- Edit allergieën
- Toggle airfryer
- Toggle sport
- **Gevaarzone:** Alles wissen (localStorage clear)

**Layout:**
```
┌─────────────────────────────────┐
│ Profiel                         │
│ ┌─────────────────────────────┐ │
│ │ Naam: [input]               │ │
│ │ Gewicht doel: [slider]      │ │
│ │ ☑ Vegetarisch               │ │
│ │ Allergieën: [textarea]      │ │
│ │ ☑ Airfryer                  │ │
│ │ ☑ Sport regelmatig          │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ Gevaarzone                      │
│ [Alles wissen] (rood)           │
│ ⚠️ Dit verwijdert al je data   │
└─────────────────────────────────┘
```

**Save Logic:**
```typescript
const handleSave = () => {
  localStorage.setItem('slowcarb_profile', JSON.stringify(profile));
  toast.success('Profiel opgeslagen');
};

const handleClearAll = () => {
  if (confirm('Weet je zeker dat je alles wilt wissen?')) {
    localStorage.clear();
    router.push('/');
  }
};
```

---

## State Management

### Zustand Store (`useUserStore.ts`)

```typescript
interface UserState {
  profile: UserProfile | null;
  isLoaded: boolean;
  loadProfile: () => void;
  updateProfile: (profile: UserProfile) => void;
  logout: () => void;
}

interface UserProfile {
  name: string;
  weightGoal: number;
  isVegetarian: boolean;
  allergies: string;
  hasAirfryer: boolean;
  doesSport: boolean;
  createdAt: string;
}

const useUserStore = create<UserState>((set) => ({
  profile: null,
  isLoaded: false,
  
  loadProfile: () => {
    const stored = localStorage.getItem('slowcarb_profile');
    if (stored) {
      set({ profile: JSON.parse(stored), isLoaded: true });
    } else {
      set({ isLoaded: true });
    }
  },
  
  updateProfile: (profile) => {
    localStorage.setItem('slowcarb_profile', JSON.stringify(profile));
    set({ profile });
  },
  
  logout: () => {
    localStorage.clear();
    set({ profile: null });
  }
}));
```

---

## localStorage Keys

```typescript
const STORAGE_KEYS = {
  PROFILE: 'slowcarb_profile',
  PROGRESS: 'slowcarb_progress',      // Weight entries array
  RECIPES: 'slowcarb_recipes',        // Recipe history
  CHEAT_DAYS: 'slowcarb_cheat_days',  // Cheat day log
  SHOPPING: 'slowcarb_shopping',      // Shopping list state
};
```

---

## Routing Updates

```typescript
// app/page.tsx (Landing)
export default function Home() {
  const { profile, isLoaded } = useUserStore();
  
  useEffect(() => {
    if (isLoaded && profile) {
      router.push('/dashboard');
    }
  }, [isLoaded, profile]);
  
  return <LandingPage />;
}

// Protected Route Wrapper
function ProtectedRoute({ children }) {
  const { profile, isLoaded } = useUserStore();
  
  if (!isLoaded) return <LoadingSpinner />;
  if (!profile) {
    router.push('/onboarding');
    return null;
  }
  
  return children;
}
```

---

## Acceptance Criteria

### Onboarding
- [ ] 5-step wizard met progress indicator
- [ ] Alle inputs valideren (naam min 2 chars, gewicht 3-20kg)
- [ ] "Terug" button werkt vanaf stap 2
- [ ] Profile saved to localStorage on complete
- [ ] Redirect naar dashboard na complete

### Dashboard
- [ ] Toon naam in greeting
- [ ] Calculate + display streak (days on protocol)
- [ ] Show latest weight (if available)
- [ ] Quick action buttons navigate correct
- [ ] Progress chart renders (empty state if no data)

### Navigation
- [ ] Avatar met eerste letter van naam
- [ ] Dropdown menu werkt (Dashboard, Instellingen, Uitloggen)
- [ ] Logout cleared localStorage + redirect naar landing

### Settings
- [ ] Alle velden editable
- [ ] Save button updates localStorage
- [ ] Toast notification on save
- [ ] "Alles wissen" confirmed met native confirm dialog
- [ ] Wissen cleared localStorage + redirect naar landing

### Mobile
- [ ] Responsive op 375px (iPhone SE)
- [ ] Touch targets ≥44px
- [ ] No horizontal scroll

---

## Design Tokens (Existing SlowCarb)

Use existing Calm Bold palette:
```css
--color-primary: #2A7C6F;
--color-surface: #F0F4F3;
--color-accent: #D97706;
--color-text: #1F2937;
```

Icons: lucide-react (already installed)

---

## Testing

```bash
# Build
npm run build

# Dev
npm run dev

# Manual test flow:
1. Fresh localStorage (clear Application > Local Storage)
2. Visit http://localhost:3000
3. Complete onboarding (5 steps)
4. Verify redirect to /dashboard
5. Check localStorage has profile
6. Refresh → should stay on dashboard
7. Edit settings → save → verify localStorage updated
8. Logout → verify localStorage cleared + redirect to landing
9. Onboarding again → dashboard → repeat
```

---

## Implementation Notes

1. **Use existing components** — Card, Button from current SlowCarb codebase
2. **Keep it simple** — No complex state, just localStorage + Zustand
3. **Mobile-first** — Design for 375px, scale up
4. **Toast notifications** — Use simple alert() for now (toast library next week)
5. **No password yet** — Just name-based onboarding (auth next week with Stripe)

---

## Files to Create/Modify

### New Files
```
app/onboarding/page.tsx          # Onboarding wizard
app/dashboard/page.tsx           # Dashboard home
app/settings/page.tsx            # Settings page
store/useUserStore.ts            # Zustand store
components/ProtectedRoute.tsx    # Auth wrapper
components/StatsCard.tsx         # Dashboard stat card
components/ProgressChart.tsx     # Weight progress chart
```

### Modified Files
```
app/page.tsx                     # Check profile → redirect
app/layout.tsx                   # Add nav with user menu
components/Navigation.tsx        # Update with user dropdown
```

---

## Deployment

```bash
# After Codex completes:
1. Review diffs
2. Test locally (npm run dev)
3. Build (npm run build)
4. Commit + push
5. Vercel auto-deploys
6. Runtime verify on https://slowcarb-new.vercel.app
```

---

**Ready for Codex execution.**

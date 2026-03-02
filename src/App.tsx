import { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { CalendarDays, Cog } from 'lucide-react';
import LandingPage from '@/components/LandingPageFinal';
import WelcomePage from '@/components/WelcomePage';
import { LoginPage } from '@/components/LoginPage';
import { BottomNav } from '@/components/BottomNav';
import { Dashboard } from '@/components/Dashboard';
import { RecipesList } from '@/components/RecipesList';
import { LearnSection } from '@/components/LearnSection';
import { AmmoCheck } from '@/components/AmmoCheck';
import { SettingsTab } from '@/components/SettingsTab';
import { MealHistorySection } from '@/components/MealHistorySection';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { useFavorites } from '@/hooks/useFavorites';
import { useJourney } from '@/hooks/useJourney';
import { useAuth } from '@/hooks/useAuth';
import { useUserStore } from '@/store/useUserStore';
import { getLocalDateString } from '@/lib/localDate';
import { STORAGE_KEYS } from '@/lib/storageKeys';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import './App.css';

const PrivacyPolicyPage = lazy(() => import('@/components/legal/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('@/components/legal/TermsOfServicePage'));
const RefundPolicyPage = lazy(() => import('@/components/legal/RefundPolicyPage'));

function renderLegalRoute() {
  switch (window.location.pathname) {
    case '/privacy-policy':
      return (
        <Suspense fallback={<div className="flex h-app-screen items-center justify-center bg-cream"><p className="text-stone-500">Laden…</p></div>}>
          <PrivacyPolicyPage />
        </Suspense>
      );
    case '/terms-of-service':
      return (
        <Suspense fallback={<div className="flex h-app-screen items-center justify-center bg-cream"><p className="text-stone-500">Laden…</p></div>}>
          <TermsOfServicePage />
        </Suspense>
      );
    case '/refund-policy':
      return (
        <Suspense fallback={<div className="flex h-app-screen items-center justify-center bg-cream"><p className="text-stone-500">Laden…</p></div>}>
          <RefundPolicyPage />
        </Suspense>
      );
    default:
      return null;
  }
}

function App() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const legalRoute = renderLegalRoute();
  if (legalRoute) return legalRoute;

  const searchParams = new URLSearchParams(window.location.search);

  // Show welcome page via ?welcome=1 query param (post-Stripe redirect)
  const isWelcome = searchParams.get('welcome') === '1';
  if (isWelcome) return <WelcomePage />;

  // Backward compat: existing users who received a localStorage token via Stripe flow
  const hasLegacyToken = Boolean(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN));

  // Check if user completed onboarding (existing users who already have profile data)
  let hasCompletedProfile = false;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (stored) {
      const p = JSON.parse(stored) as { hasCompletedOnboarding?: boolean };
      hasCompletedProfile = !!p.hasCompletedOnboarding;
    }
  } catch { /* ignore */ }

  const isDevBypass = searchParams.get('dev') === '1';
  const hasAccess = isDevBypass || !isSupabaseConfigured || isAuthenticated || hasLegacyToken || hasCompletedProfile;
  const isAppRequested = searchParams.get('app') === '1';

  // Wait for Supabase auth to resolve before deciding
  if (authLoading) {
    return (
      <div className="flex h-app-screen items-center justify-center bg-cream">
        <p className="text-stone-500">Laden…</p>
      </div>
    );
  }

  // No ?app=1 → landing page
  if (!isAppRequested) return <div className="h-full overflow-y-auto"><LandingPage /></div>;

  // ?app=1 but no access → login page for returning users
  if (!hasAccess) return <LoginPage />;

  return <AppShell />;
}

function AppShell() {
  const forceOnboarding = new URLSearchParams(window.location.search).get('onboarding') === '1';

  const [activeTab, setActiveTab] = useState('dashboard');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedHistoryDate, setSelectedHistoryDate] = useState(getLocalDateString());
  const [historyDragOffset, setHistoryDragOffset] = useState(0);
  const [isHistoryDragging, setIsHistoryDragging] = useState(false);
  const historyDragStartYRef = useRef<number | null>(null);
  const historyDragOffsetRef = useRef(0);

  const { profile, isLoaded, loadProfile, updateProfile } = useUserStore();
  const { favorites, toggleFavorite } = useFavorites();
  const { 
    journey, 
    weightLog,
    mealLog,
    startJourney, 
    resetJourney, 
    getCurrentTip, 
    getProgress, 
    isCheatDay,
    getMealsForDate,
    getTodayMeals,
    toggleMealForDate,
    toggleMeal,
    markDayCompliant,
    logWeight,
    getStreak
  } = useJourney();
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const selectedMeals = getMealsForDate(selectedHistoryDate);

  const closeHistorySheet = () => {
    setHistoryOpen(false);
    setHistoryDragOffset(0);
    setIsHistoryDragging(false);
    historyDragStartYRef.current = null;
    historyDragOffsetRef.current = 0;
  };

  const openHistorySheet = () => {
    setHistoryOpen(true);
  };

  const handleHistoryDragStart = (clientY: number) => {
    if (!historyOpen) return;
    setIsHistoryDragging(true);
    historyDragStartYRef.current = clientY;
  };

  const handleHistoryDragMove = (clientY: number) => {
    if (!isHistoryDragging || historyDragStartYRef.current === null) return;
    const nextOffset = Math.max(0, clientY - historyDragStartYRef.current);
    historyDragOffsetRef.current = nextOffset;
    setHistoryDragOffset(nextOffset);
  };

  const handleHistoryDragEnd = () => {
    if (!isHistoryDragging) return;
    setIsHistoryDragging(false);
    historyDragStartYRef.current = null;
    if (historyDragOffsetRef.current > 120) {
      closeHistorySheet();
      return;
    }
    historyDragOffsetRef.current = 0;
    setHistoryDragOffset(0);
  };

  if (!isLoaded) {
    return (
      <div className="flex h-app-screen items-center justify-center bg-cream">
        <p className="text-stone-500">Laden…</p>
      </div>
    );
  }

  if (!profile || !profile.hasCompletedOnboarding || forceOnboarding) {
    return (
      <OnboardingWizard
        onComplete={(data) => {
          const computedWeightGoal = Math.round((data.currentWeight - data.targetWeight) * 10) / 10;
          updateProfile({
            hasCompletedOnboarding: true,
            name: data.name,
            weightGoal: computedWeightGoal,
            currentWeight: data.currentWeight,
            desiredWeight: data.targetWeight,
            isVegetarian: data.vegetarian,
            vegetarian: data.vegetarian,
            allergies: '',
            hasAirfryer: data.hasAirfryer,
            sportsRegularly: data.sportsRegularly,
            doesSport: data.sportsRegularly,
            cheatDay: data.cheatDay,
            createdAt: new Date().toISOString(),
          });
          logWeight(data.currentWeight);
          startJourney(getLocalDateString(), data.cheatDay, computedWeightGoal);
          // Clean up ?onboarding=1 so it doesn't loop
          if (forceOnboarding) {
            const url = new URL(window.location.href);
            url.searchParams.delete('onboarding');
            window.history.replaceState({}, '', url.toString());
          }
        }}
      />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            journey={journey}
            onboardingStartWeight={profile.currentWeight}
            progress={getProgress()}
            currentTip={getCurrentTip()}
            isCheatDay={isCheatDay()}
            onStartJourney={startJourney}
            onResetJourney={resetJourney}
            todayMeals={getTodayMeals()}
            streak={getStreak()}
            onToggleMeal={toggleMeal}
            mealEntries={mealLog}
            weightLog={weightLog}
            onLogWeight={logWeight}
          />
        );
      case 'recipes':
        return (
          <RecipesList
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        );
      case 'learn':
        return <LearnSection />;
      case 'ammo':
        return <AmmoCheck />;
      default:
        return null;
    }
  };

  return (
    <div
      className="flex h-full flex-col overflow-hidden bg-cream"
      style={{ overscrollBehaviorX: 'none' }}
    >
      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
        <header className="sticky left-0 right-0 top-0 z-50 h-14 shrink-0 border-b border-stone-200 bg-white/95 backdrop-blur-md">
          <div className="max-w-md mx-auto h-full px-4 flex items-center justify-between">
            <h1 className="font-display text-lg font-semibold text-stone-800">SlowCarb</h1>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={openHistorySheet}
                className="size-9 rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-900"
                aria-label="Open geschiedenis"
              >
                <CalendarDays className="size-5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSettingsOpen(true)}
                className="size-9 rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-900"
                aria-label="Open instellingen"
              >
                <Cog className="size-5" />
              </Button>
            </div>
          </div>
        </header>

        <SheetContent
          side="right"
          className="z-[60] w-full overflow-y-auto bg-white p-4 sm:max-w-md"
          style={{ overscrollBehaviorX: 'none', overscrollBehaviorY: 'contain', touchAction: 'pan-y' }}
        >
          <SheetHeader className="-mx-4 border-b border-stone-200 px-4">
            <SheetTitle>Instellingen</SheetTitle>
            <SheetDescription className="sr-only">
              Beheer je profiel, meldingen en app-voorkeuren.
            </SheetDescription>
          </SheetHeader>
          <div className="pt-4">
            <SettingsTab />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main
        className={cn(
          'w-full max-w-md mx-auto px-5 pt-4 flex-1 min-h-0',
          activeTab === 'dashboard'
            ? 'pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] overflow-y-auto'
            : 'pb-28 overflow-y-auto'
        )}
        style={{ overscrollBehaviorX: 'none', overscrollBehaviorY: 'contain', WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
      >
        {renderContent()}
      </main>

      <div
        className={cn(
          'fixed inset-0 z-[65] bg-stone-900/35 transition-opacity duration-300',
          historyOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={closeHistorySheet}
        aria-hidden={!historyOpen}
      />
      <div
        className={cn(
          'pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex justify-center px-2',
          historyOpen ? 'opacity-100' : 'opacity-0'
        )}
        aria-hidden={!historyOpen}
      >
        <section
          className="pointer-events-auto flex h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-b-0 border-stone-200 bg-white shadow-elevated"
          style={{
            transform: historyOpen ? `translateY(${historyDragOffset}px)` : 'translateY(100%)',
            transition: isHistoryDragging ? 'none' : 'transform 300ms ease-out',
          }}
        >
          <div
            className="flex justify-center px-4 py-3"
            onPointerDown={(event) => {
              handleHistoryDragStart(event.clientY);
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => handleHistoryDragMove(event.clientY)}
            onPointerUp={handleHistoryDragEnd}
            onPointerCancel={handleHistoryDragEnd}
            role="presentation"
          >
            <div className="h-1.5 w-12 rounded-full bg-stone-300" />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
            <MealHistorySection
              journeyStartDate={journey.startDate}
              cheatDay={journey.cheatDay}
              mealEntries={mealLog}
              selectedDate={selectedHistoryDate}
              selectedMeals={selectedMeals}
              onSelectDate={setSelectedHistoryDate}
              onToggleMealForDate={toggleMealForDate}
              onMarkDayCompliant={markDayCompliant}
            />
          </div>
        </section>
      </div>

      {/* Bottom Navigation (80px fixed height) */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'white',
            border: '1px solid rgb(231 229 228)',
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          },
        }}
      />
    </div>
  );
}

export default App;

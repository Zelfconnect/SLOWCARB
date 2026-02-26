import { useState, useEffect } from 'react';
import { Cog } from 'lucide-react';
import LandingPage from '@/components/LandingPageFinal';
import WelcomePage from '@/components/WelcomePage';
import { BottomNav } from '@/components/BottomNav';
import { Dashboard } from '@/components/Dashboard';
import { RecipesList } from '@/components/RecipesList';
import { LearnSection } from '@/components/LearnSection';
import { AmmoCheck } from '@/components/AmmoCheck';
import { SettingsTab } from '@/components/SettingsTab';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { useFavorites } from '@/hooks/useFavorites';
import { useJourney } from '@/hooks/useJourney';
import { useUserStore } from '@/store/useUserStore';
import { getLocalDateString } from '@/lib/localDate';
import { STORAGE_KEYS } from '@/lib/storageKeys';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { ImprintPage, PrivacyPage, RefundPolicyPage, TermsPage } from '@/components/LegalPages';
import './App.css';

const LEGAL_ROUTE_COMPONENTS = {
  '/privacy': PrivacyPage,
  '/privacy-policy': PrivacyPage,
  '/terms': TermsPage,
  '/terms-and-conditions': TermsPage,
  '/terms-of-service': TermsPage,
  '/refund-policy': RefundPolicyPage,
  '/refund': RefundPolicyPage,
  '/refunds': RefundPolicyPage,
  '/imprint': ImprintPage,
  '/impressum': ImprintPage,
} as const;

function normalizePathname(pathname: string) {
  const withoutTrailingSlash = pathname.replace(/\/+$/, '') || '/';
  return withoutTrailingSlash.toLowerCase();
}

function App() {
  const pathname = normalizePathname(window.location.pathname);
  const LegalPage = LEGAL_ROUTE_COMPONENTS[pathname as keyof typeof LEGAL_ROUTE_COMPONENTS];
  if (LegalPage) return <LegalPage />;

  const searchParams = new URLSearchParams(window.location.search);

  // Show welcome page via ?welcome=1 query param
  const isWelcome = searchParams.get('welcome') === '1';
  if (isWelcome) return <WelcomePage />;

  const tokenFromUrl = searchParams.get('token');
  if (tokenFromUrl) {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokenFromUrl);

    const nextParams = new URLSearchParams(window.location.search);
    nextParams.delete('token');
    nextParams.set('app', '1');
    const nextSearch = nextParams.toString();
    const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}${window.location.hash}`;
    window.history.replaceState({}, '', nextUrl);
  }

  const hasAccessToken = Boolean(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN));
  const isAppRequested = searchParams.get('app') === '1' || Boolean(tokenFromUrl);

  if (!isAppRequested) return <LandingPage />;
  if (!hasAccessToken && !tokenFromUrl) {
    let shouldShowLanding = false;
    // If user has a completed profile but lost the token (e.g. cleared URL), restore access
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (stored) {
        const p = JSON.parse(stored) as { hasCompletedOnboarding?: boolean };
        if (p.hasCompletedOnboarding) {
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'slowcarb2026');
          // continue to app
        } else {
          shouldShowLanding = true;
        }
      } else {
        shouldShowLanding = true;
      }
    } catch {
      shouldShowLanding = true;
    }

    if (shouldShowLanding) {
      return <LandingPage />;
    }
  }

  return <AppShell />;
}

function AppShell() {
  const forceOnboarding = new URLSearchParams(window.location.search).get('onboarding') === '1';

  const [activeTab, setActiveTab] = useState('dashboard');
  const [settingsOpen, setSettingsOpen] = useState(false);

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
    getTodayMeals,
    toggleMeal,
    logWeight,
    getStreak
  } = useJourney();
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

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
      className="flex h-app-screen flex-col overflow-x-hidden overflow-y-hidden bg-cream"
      style={{ overscrollBehaviorX: 'none' }}
    >
      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
        <header className="sticky left-0 right-0 top-0 z-50 h-14 shrink-0 border-b border-stone-200 bg-white/95 backdrop-blur-md">
          <div className="max-w-md mx-auto h-full px-4 flex items-center justify-between">
            <h1 className="font-display text-lg font-semibold text-stone-800">SlowCarb</h1>
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
        </header>

        <SheetContent
          side="right"
          className="z-[60] w-full overflow-y-auto bg-white p-4 sm:max-w-md"
          style={{ overscrollBehaviorX: 'none', overscrollBehaviorY: 'contain', touchAction: 'pan-y' }}
        >
          <SheetHeader className="-mx-4 border-b border-stone-200 px-4">
            <SheetTitle>Instellingen</SheetTitle>
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
            ? 'pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] overflow-y-hidden'
            : 'pb-28 overflow-y-auto'
        )}
        style={{ overscrollBehaviorX: 'none', overscrollBehaviorY: 'contain' }}
      >
        {renderContent()}
      </main>

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

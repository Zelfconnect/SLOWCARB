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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { OnboardingWizard } from '@/components/OnboardingWizard';
import { useFavorites } from '@/hooks/useFavorites';
import { useJourney } from '@/hooks/useJourney';
import { useUserStore } from '@/store/useUserStore';
import { getLocalDateString } from '@/lib/localDate';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import './App.css';

function App() {
  const searchParams = new URLSearchParams(window.location.search);

  // Show welcome page via ?welcome=1 query param
  const isWelcome = searchParams.get('welcome') === '1';
  if (isWelcome) return <WelcomePage />;

  // Only show app when explicitly requested via ?app=1
  const isApp = searchParams.get('app') === '1';
  if (!isApp) return <LandingPage />;

  return <AppShell />;
}

function AppShell() {

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
    return null;
  }

  if (!profile || !profile.hasCompletedOnboarding) {
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
    <div className="flex h-[100dvh] flex-col overflow-x-hidden overflow-y-hidden bg-cream">
      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
        <header className="sticky left-0 right-0 top-0 z-50 h-14 shrink-0 border-b border-stone-200 bg-white/95 backdrop-blur-md">
          <div className="max-w-md mx-auto h-full px-4 flex items-center justify-between">
            <h1 className="font-display text-lg font-semibold text-stone-800">SlowCarb</h1>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-stone-500 transition-colors duration-200 hover:bg-primary-100 hover:text-primary-700 active:bg-primary-200"
              aria-label="Open instellingen"
            >
              <Cog className="w-5 h-5" />
            </button>
          </div>
        </header>

        <SheetContent side="right" className="z-[60] w-full overflow-y-auto bg-white p-4 sm:max-w-md">
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
            ? 'pb-[calc(6rem+env(safe-area-inset-bottom,0px))] overflow-y-auto overscroll-contain'
            : 'pb-28 overflow-y-auto overscroll-contain'
        )}
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

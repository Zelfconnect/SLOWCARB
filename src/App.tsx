import { useState, useEffect } from 'react';
import { Cog } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { Dashboard } from '@/components/Dashboard';
import { RecipesList } from '@/components/RecipesList';
import { LearnSection } from '@/components/LearnSection';
import { Shopping } from '@/pages/Shopping';
import { SettingsTab } from '@/components/SettingsTab';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { OnboardingWizard } from '@/components/OnboardingWizard';
import { PackageSelectorModal } from '@/components/PackageSelectorModal';
import { useFavorites } from '@/hooks/useFavorites';
import { useJourney } from '@/hooks/useJourney';
import { useShoppingList } from '@/hooks/useShoppingList';
import { usePantry } from '@/hooks/usePantry';
import { useUserStore } from '@/store/useUserStore';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import type { Ingredient } from '@/types';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [settingsOpen, setSettingsOpen] = useState(false);
  // Package Selector state
  const [packageSelectorOpen, setPackageSelectorOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<{ name: string; ingredients: Ingredient[] } | null>(null);
  
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
  
  const { addItemsFromPackage } = useShoppingList();
  const { addToPantry } = usePantry();

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
          updateProfile({
            hasCompletedOnboarding: true,
            name: data.name,
            weightGoal: data.weightGoal,
            isVegetarian: data.vegetarian,
            vegetarian: data.vegetarian,
            allergies: '',
            hasAirfryer: data.hasAirfryer,
            sportsRegularly: data.sportsRegularly,
            doesSport: data.sportsRegularly,
            cheatDay: data.cheatDay,
            createdAt: new Date().toISOString(),
          });
          startJourney(new Date().toISOString().split('T')[0], data.cheatDay, data.weightGoal);
        }}
      />
    );
  }

  // Handle opening package selector from recipe
  const handleOpenPackageSelector = (recipeName: string, ingredients: Ingredient[]) => {
    setSelectedRecipe({ name: recipeName, ingredients });
    setPackageSelectorOpen(true);
  };

  // Handle package selector confirm
  const handlePackageConfirm = (
    selections: Array<{
      ingredient: Ingredient;
      selectedPackage: { amount: number; label: string };
      alreadyHave: boolean;
    }>
  ) => {
    if (!selectedRecipe) return;

    // Filter out "already have" items
    const itemsToAdd = selections.filter((s) => !s.alreadyHave);
    const itemsAlreadyHave = selections.filter((s) => s.alreadyHave);

    // Add to shopping list
    if (itemsToAdd.length > 0) {
      addItemsFromPackage(
        selectedRecipe.name,
        itemsToAdd.map((s) => ({
          ingredient: s.ingredient,
          selectedPackage: s.selectedPackage,
        }))
      );

      toast.success(`${itemsToAdd.length} items toegevoegd`, {
        description: `Van ${selectedRecipe.name}`,
      });
    }

    // Add "already have" items to pantry
    itemsAlreadyHave.forEach((s) => {
      addToPantry({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: s.ingredient.name,
        category: 'overig',
        amount: s.selectedPackage.amount,
        unit: 'stuks',
        addedAt: new Date().toISOString(),
        fromRecipes: [selectedRecipe.name],
      });
    });

    if (itemsAlreadyHave.length > 0) {
      toast.info(`${itemsAlreadyHave.length} items toegevoegd aan voorraad`, {
        description: 'Omdat je ze al in huis hebt',
      });
    }

    setPackageSelectorOpen(false);
    setSelectedRecipe(null);
  };

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
            onOpenPackageSelector={handleOpenPackageSelector}
          />
        );
      case 'learn':
        return <LearnSection />;
      case 'shopping':
        return <Shopping />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-warm-50">
      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
        <header className="fixed top-0 left-0 right-0 h-14 bg-white/90 backdrop-blur-md border-b border-warm-200 z-30">
          <div className="max-w-md mx-auto h-full px-4 flex items-center justify-between">
            <h1 className="text-lg font-bold text-warm-900">SlowCarb</h1>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="text-warm-600 hover:text-warm-800 transition-colors"
              aria-label="Open instellingen"
            >
              <Cog className="w-5 h-5" />
            </button>
          </div>
        </header>

        <SheetContent side="right" className="w-full sm:max-w-md p-0">
          <SheetHeader className="border-b border-warm-200">
            <SheetTitle>Instellingen</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-4">
            <SettingsTab />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 pt-14 pb-6">
        {renderContent()}
      </main>

      {/* Bottom Navigation (80px fixed height) */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Package Selector Modal */}
      {selectedRecipe && (
        <PackageSelectorModal
          isOpen={packageSelectorOpen}
          recipeName={selectedRecipe.name}
          ingredients={selectedRecipe.ingredients}
          onClose={() => {
            setPackageSelectorOpen(false);
            setSelectedRecipe(null);
          }}
          onConfirm={handlePackageConfirm}
        />
      )}

      {/* Toast notifications */}
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#fff',
            border: '1px solid #E7E5E4',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          },
        }}
      />
    </div>
  );
}

export default App;

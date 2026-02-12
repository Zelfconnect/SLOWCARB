import { useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { Dashboard } from '@/components/Dashboard';
import { RecipesList } from '@/components/RecipesList';
import { LearnSection } from '@/components/LearnSection';
import { StockSection } from '@/components/StockSection';
import { ShoppingListSection } from '@/components/ShoppingListSection';
import { PackageSelectorModal } from '@/components/PackageSelectorModal';
import { useFavorites } from '@/hooks/useFavorites';
import { useJourney } from '@/hooks/useJourney';
import { useShoppingList } from '@/hooks/useShoppingList';
import { usePantry } from '@/hooks/usePantry';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import type { Ingredient } from '@/types';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [shoppingSubTab, setShoppingSubTab] = useState<'list' | 'stock'>('list');
  
  // Package Selector state
  const [packageSelectorOpen, setPackageSelectorOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<{ name: string; ingredients: Ingredient[] } | null>(null);
  
  const { favorites, toggleFavorite } = useFavorites();
  const { 
    journey, 
    startJourney, 
    resetJourney, 
    getCurrentTip, 
    getProgress, 
    isCheatDay,
    getTodayMeals,
    toggleMeal,
    getStreak
  } = useJourney();
  
  const { 
    items, 
    addItemsFromPackage, 
    addCustomItem,
    addFromSuggestion,
    toggleItem, 
    removeItem, 
    clearChecked, 
    moveToPantry,
    getByCategory,
    getEmojiForIngredient,
  } = useShoppingList();
  
  const {
    pantryItems,
    addToPantry,
    removeFromPantry,
    toggleStandardItem,
    getRestockSuggestions,
    getByCategory: getPantryByCategory,
    getStandardItems,
    clearPantry,
  } = usePantry();

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

  // Handle move to pantry from shopping list
  const handleMoveToPantry = (id: string) => {
    const movedItem = moveToPantry(id);
    if (movedItem) {
      addToPantry(movedItem);
      toast.success('Verplaatst naar voorraad', {
        description: movedItem.name,
      });
    }
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
        return (
          <div className="space-y-4 safe-bottom">
            {/* Sub-tab navigation - NEW DESIGN SYSTEM */}
            <div className="flex gap-2 p-1 bg-warm-100 rounded-xl">
              <button
                onClick={() => setShoppingSubTab('list')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  shoppingSubTab === 'list' 
                    ? 'bg-white text-primary-700 shadow-sm' 
                    : 'text-warm-500 hover:text-warm-700'
                }`}
              >
                🛒 Lijst
              </button>
              <button
                onClick={() => setShoppingSubTab('stock')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  shoppingSubTab === 'stock' 
                    ? 'bg-white text-primary-700 shadow-sm' 
                    : 'text-warm-500 hover:text-warm-700'
                }`}
              >
                📦 Voorraad
              </button>
            </div>

            {/* Content based on sub-tab */}
            {shoppingSubTab === 'list' ? (
              <ShoppingListSection
                items={items}
                restockSuggestions={getRestockSuggestions()}
                onToggleItem={toggleItem}
                onRemoveItem={removeItem}
                onClearChecked={clearChecked}
                onMoveToPantry={handleMoveToPantry}
                onAddFromSuggestion={addFromSuggestion}
                onAddCustomItem={addCustomItem}
                getByCategory={getByCategory}
                getEmojiForIngredient={getEmojiForIngredient}
              />
            ) : (
              <StockSection
                pantryItems={pantryItems}
                standardItems={getStandardItems()}
                onRemoveFromPantry={removeFromPantry}
                onToggleStandardItem={toggleStandardItem}
                onClearPantry={clearPantry}
                onAddToShoppingList={addFromSuggestion}
                getByCategory={getPantryByCategory}
              />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Header - NEW DESIGN SYSTEM (64px fixed height) */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-warm-200">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-xl">🥗</span>
            </div>
            <div>
              <h1 className="font-semibold text-lg text-warm-900 leading-tight">Slow-Carb</h1>
              <p className="text-xs text-warm-500 font-medium">Companion</p>
            </div>
          </div>
          {journey.startDate && (
            <div className="px-3 py-1.5 bg-warm-100 rounded-full">
              <span className="text-sm font-medium text-warm-700">
                Dag {getProgress().day}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
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

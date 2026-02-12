import { useState, useMemo } from 'react';
import { Search, Heart } from 'lucide-react';
import { recipes, categories } from '@/data/recipes';
import { CompactRecipeCard } from './CompactRecipeCard';
import { RecipeDetailModal } from './RecipeDetailModal';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Ingredient } from '@/types';

interface RecipesListProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onOpenPackageSelector: (recipeName: string, ingredients: Ingredient[]) => void;
}

export function RecipesList({ favorites, onToggleFavorite, onOpenPackageSelector }: RecipesListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  const filteredRecipes = useMemo(() => {
    let filtered = recipes;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.ingredients.some(i => i.name.toLowerCase().includes(query)) ||
        r.tags.some(t => t.toLowerCase().includes(query))
      );
    }
    if (activeCategory !== 'all') filtered = filtered.filter(r => r.category === activeCategory);
    if (showFavoritesOnly) filtered = filtered.filter(r => favorites.includes(r.id));
    return filtered.sort((a, b) => {
      const aFav = favorites.includes(a.id);
      const bFav = favorites.includes(b.id);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return 0;
    });
  }, [searchQuery, activeCategory, showFavoritesOnly, favorites]);

  const selectedRecipe = selectedRecipeId 
    ? recipes.find(r => r.id === selectedRecipeId) 
    : null;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
        <Input
          placeholder="Zoek recepten..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-premium pl-12 h-11 text-base"
        />
      </div>

      {/* Filter Chips - Horizontal scroll with fade */}
      <div className="relative -mx-5">
        {/* Fade indicator on right */}
        <div className="absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-cream to-transparent pointer-events-none z-10" />
        
        <div className="flex gap-2 overflow-x-auto pb-2 px-5 scrollbar-hide">
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200',
              showFavoritesOnly 
                ? 'bg-red-100 text-red-700' 
                : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
            )}
          >
            <Heart className={cn('w-3 h-3', showFavoritesOnly && 'fill-current')} />
            Favorieten
          </button>
          
          <button
            onClick={() => setActiveCategory('all')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200',
              activeCategory === 'all' 
                ? 'bg-sage-100 text-sage-700 border border-sage-200' 
                : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
            )}
          >
            Alles
          </button>
          
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200',
                activeCategory === cat.id 
                  ? 'bg-sage-100 text-sage-700 border border-sage-200' 
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
              )}
            >
              <span className="text-sm">{cat.emoji}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Recipe Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-500">
          {filteredRecipes.length} recept{filteredRecipes.length !== 1 ? 'en' : ''}
        </p>
      </div>

      {/* Recipe List - Compact */}
      <div className="space-y-2 pb-24">
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-12 text-stone-500">
            <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">🔍</span>
            </div>
            <p className="font-display font-medium text-stone-700">Geen recepten gevonden</p>
            <p className="text-sm mt-1">Probeer een andere zoekterm</p>
          </div>
        ) : (
          filteredRecipes.map((recipe) => (
            <CompactRecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={favorites.includes(recipe.id)}
              onToggleFavorite={(e) => {
                e.stopPropagation();
                onToggleFavorite(recipe.id);
              }}
              onClick={() => setSelectedRecipeId(recipe.id)}
            />
          ))
        )}
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          isOpen={true}
          isFavorite={favorites.includes(selectedRecipe.id)}
          onToggleFavorite={() => onToggleFavorite(selectedRecipe.id)}
          onOpenPackageSelector={() => {
            onOpenPackageSelector(selectedRecipe.name, selectedRecipe.ingredients);
            setSelectedRecipeId(null);
          }}
          onClose={() => setSelectedRecipeId(null)}
        />
      )}
    </div>
  );
}

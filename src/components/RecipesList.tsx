import { Fragment, useState, useMemo } from 'react';
import { Search, Heart } from 'lucide-react';
import { RECIPES, RECIPE_CATEGORIES } from '@/data/recipeLoader';
import { CompactRecipeCard } from './CompactRecipeCard';
import { RecipeDetailModal } from './RecipeDetailModal';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Recipe } from '@/types';
import { getMealTypeIcon } from '@/lib/recipeIcons';

interface RecipesListProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

const CATEGORY_SECTIONS: Array<{ id: Recipe['category']; label: string }> = [
  { id: 'airfryer', label: 'Airfryer' },
  { id: 'meal-prep', label: 'Meal Prep' },
  { id: 'no-time', label: 'No-Time' },
];

export function RecipesList({ favorites, onToggleFavorite }: RecipesListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  const filteredRecipes = useMemo(() => {
    let filtered = RECIPES;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.ingredients.some(i => i.name.toLowerCase().includes(query)) ||
        r.tags.some(t => t.toLowerCase().includes(query))
      );
    }
    if (activeCategory !== 'all') filtered = filtered.filter(r => r.tags.includes(activeCategory));
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
    ? RECIPES.find(r => r.id === selectedRecipeId) 
    : null;
  const groupedRecipes = useMemo(() => {
    if (activeCategory !== 'all') return [];
    return CATEGORY_SECTIONS
      .map((section) => ({
        ...section,
        recipes: filteredRecipes.filter((recipe) => recipe.category === section.id),
      }))
      .filter((section) => section.recipes.length > 0);
  }, [activeCategory, filteredRecipes]);

  return (
    <div className="space-y-5">
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

      {/* Filter Chips – premium: h-10, active shadow + stronger sage */}
      <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={cn(
              'flex h-10 flex-none items-center gap-1.5 whitespace-nowrap rounded-full border px-4 text-xs font-medium transition-all duration-200',
              showFavoritesOnly 
                ? 'border-red-200 bg-red-50 text-red-700 shadow-soft'
                : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
            )}
          >
            <Heart className={cn('w-3.5 h-3.5', showFavoritesOnly && 'fill-current')} />
            Favorieten
          </button>
          
          <button
            onClick={() => setActiveCategory('all')}
            className={cn(
              'flex h-10 flex-none items-center gap-1.5 whitespace-nowrap rounded-full border px-4 text-xs font-medium transition-all duration-200',
              activeCategory === 'all' 
                ? 'border-sage-300 bg-sage-100 text-sage-800 shadow-soft'
                : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
            )}
          >
            Alles
          </button>
          
          {RECIPE_CATEGORIES.map((cat) => {
            const MealTypeIcon = getMealTypeIcon(cat.icon);
            return (
              <Fragment key={cat.id}>
                {cat.id === 'airfryer' && <div key="sep" className="w-px h-7 bg-stone-200 self-center" />}
                <button
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    'flex h-10 flex-none items-center gap-1.5 whitespace-nowrap rounded-full border px-4 text-xs font-medium transition-all duration-200',
                    activeCategory === cat.id 
                      ? 'border-sage-300 bg-sage-100 text-sage-800 shadow-soft'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                  )}
                >
                  <MealTypeIcon
                    className={cn(
                      'w-4 h-4',
                      activeCategory === cat.id ? 'text-sage-700' : 'text-stone-500'
                    )}
                  />
                  {cat.name}
                </button>
              </Fragment>
            );
          })}
      </div>

      {/* Recipe Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-500">
          {`${filteredRecipes.length} ${filteredRecipes.length === 1 ? 'recept' : 'recepten'}`}
        </p>
      </div>

      {/* Recipe List - Compact */}
      <div className="space-y-2 pb-24">
        {filteredRecipes.length === 0 ? (
          <div className="card-website py-12 text-center text-stone-500">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-stone-200 bg-stone-100 shadow-soft">
              <Search className="w-8 h-8 text-stone-400" />
            </div>
            <p className="font-display font-medium text-stone-700">Geen recepten gevonden</p>
            <p className="text-sm mt-1">Probeer een andere zoekterm</p>
          </div>
        ) : activeCategory === 'all' ? (
          <div className="space-y-5">
            {groupedRecipes.map((section) => (
              <div key={section.id} className="space-y-2">
                <div className="flex items-center justify-between px-0.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-600">
                    {section.label}
                  </p>
                  <p className="text-xs text-stone-400">
                    {`${section.recipes.length} ${section.recipes.length === 1 ? 'recept' : 'recepten'}`}
                  </p>
                </div>
                <div className="space-y-2">
                  {section.recipes.map((recipe) => (
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
                  ))}
                </div>
              </div>
            ))}
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
          onClose={() => setSelectedRecipeId(null)}
        />
      )}
    </div>
  );
}

import { Fragment, useState, useMemo } from 'react';
import { Search, Heart } from 'lucide-react';
import { RECIPES, RECIPE_CATEGORIES } from '@/data/recipeLoader';
import { RecipeDetailModal } from './RecipeDetailModal';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Recipe } from '@/types';
import { getMealTypeIcon } from '@/lib/recipeIcons';
import { useTranslation } from '@/i18n';

interface RecipesListProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

const PLACEHOLDER_GRADIENTS: Record<string, string> = {
  ontbijt: 'bg-gradient-to-br from-amber-100 to-orange-200',
  breakfast: 'bg-gradient-to-br from-amber-100 to-orange-200',
  lunch: 'bg-gradient-to-br from-green-100 to-emerald-200',
  avondeten: 'bg-gradient-to-br from-blue-100 to-indigo-200',
  dinner: 'bg-gradient-to-br from-blue-100 to-indigo-200',
  snack: 'bg-gradient-to-br from-rose-100 to-pink-200',
  airfryer: 'bg-gradient-to-br from-orange-100 to-amber-200',
  default: 'bg-gradient-to-br from-sage-100 to-sage-200',
};

const getRecipeGradient = (recipe: Recipe) => {
  if (recipe.tags.includes('ontbijt')) return PLACEHOLDER_GRADIENTS.ontbijt;
  if (recipe.tags.includes('lunch')) return PLACEHOLDER_GRADIENTS.lunch;
  if (recipe.tags.includes('avondeten')) return PLACEHOLDER_GRADIENTS.avondeten;
  if (recipe.tags.includes('snack')) return PLACEHOLDER_GRADIENTS.snack;
  if (recipe.tags.includes('airfryer') || recipe.category === 'airfryer') return PLACEHOLDER_GRADIENTS.airfryer;
  return PLACEHOLDER_GRADIENTS.default;
};

const getActiveCategoryLabel = (activeCategory: string) => {
  if (activeCategory === 'all') return null;
  const fromCategories = RECIPE_CATEGORIES.find((category) => category.id === activeCategory);
  return fromCategories?.name ?? activeCategory;
};

export function RecipesList({ favorites, onToggleFavorite }: RecipesListProps) {
  const { t } = useTranslation();
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
  const activeCategoryLabel = getActiveCategoryLabel(activeCategory);

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
        <Input
          placeholder={String(t('app.searchRecipes'))}
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

      {activeCategory !== 'all' && (
        <div className="flex items-baseline justify-between mb-3 mt-1">
          <div className="flex items-baseline gap-2">
            <p className="text-xs font-bold tracking-widest text-stone-500 uppercase">
              {activeCategoryLabel}
            </p>
            <p className="text-xs text-stone-400">
              {`${filteredRecipes.length} recepten`}
            </p>
          </div>
          <button
            onClick={() => setActiveCategory('all')}
            className="text-xs text-sage-600 font-medium"
          >
            Wis alles →
          </button>
        </div>
      )}

      {/* Recipe List */}
      <div className="space-y-2">
        {filteredRecipes.length === 0 ? (
          <div className="card-website py-12 text-center text-stone-500">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-stone-200 bg-stone-100 shadow-soft">
              <Search className="w-8 h-8 text-stone-400" />
            </div>
            <p className="font-display font-medium text-stone-700">Geen recepten gevonden</p>
            <p className="text-sm mt-1">Probeer een andere zoekterm</p>
          </div>
        ) : (
          filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => setSelectedRecipeId(recipe.id)}
              className="rounded-2xl overflow-hidden bg-white shadow-card border border-stone-100 mb-3 cursor-pointer"
            >
              <div className="relative h-44 w-full overflow-hidden">
                {recipe.image ? (
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className={cn('h-full w-full', getRecipeGradient(recipe))} />
                )}
                <span className="absolute top-3 left-3 bg-sage-600 text-white text-xs font-semibold rounded-full px-2.5 py-1">
                  {recipe.cookTime}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(recipe.id);
                  }}
                  className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-sm"
                  aria-label={favorites.includes(recipe.id) ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten'}
                >
                  <Heart
                    className={cn(
                      'h-4 w-4',
                      favorites.includes(recipe.id) ? 'fill-current text-red-500' : 'text-stone-500'
                    )}
                    strokeWidth={favorites.includes(recipe.id) ? 2.5 : 2}
                  />
                </button>
              </div>
              <div className="p-3 pb-4">
                <h3 className="font-semibold text-stone-900 text-base leading-snug">
                  {recipe.name}
                </h3>
                {recipe.subtitle && (
                  <p className="text-sm text-stone-500 mt-0.5 line-clamp-1">
                    {recipe.subtitle}
                  </p>
                )}
              </div>
            </div>
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

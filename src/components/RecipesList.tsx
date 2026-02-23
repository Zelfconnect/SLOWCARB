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

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={cn(
              'flex h-10 flex-none items-center gap-1.5 whitespace-nowrap rounded-full border px-4 text-xs font-medium transition-all duration-200',
              showFavoritesOnly 
                ? 'border-black bg-black text-white'
                : 'border-transparent bg-stone-100 text-stone-500 hover:bg-stone-200'
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
                ? 'border-black bg-black text-white'
                : 'border-transparent bg-stone-100 text-stone-500 hover:bg-stone-200'
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
                      ? 'border-black bg-black text-white'
                      : 'border-transparent bg-stone-100 text-stone-500 hover:bg-stone-200'
                  )}
                >
                  <MealTypeIcon
                    className={cn(
                      'w-4 h-4',
                      activeCategory === cat.id ? 'text-white' : 'text-stone-500'
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
            <p className="text-xs font-bold tracking-widest text-stone-400 uppercase">
              {activeCategoryLabel}
            </p>
            <p className="text-xs text-stone-400">
              {`${filteredRecipes.length} recepten`}
            </p>
          </div>
          <button
            onClick={() => setActiveCategory('all')}
            className="text-xs text-stone-900 font-semibold"
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
          filteredRecipes.map((recipe) => {
            const protein = (recipe as Recipe & { macros?: { protein?: number } }).macros?.protein;
            const metaItems = [
              recipe.cookTime || recipe.prepTime ? `⏱ ${recipe.cookTime || recipe.prepTime}` : null,
              Number.isFinite(recipe.servings) ? `👤 ${recipe.servings}p` : null,
              recipe.difficulty || null,
              protein != null ? `${protein}g eiwit` : null,
            ].filter((item): item is string => Boolean(item));

            return (
              <div
                key={recipe.id}
                onClick={() => setSelectedRecipeId(recipe.id)}
                className="rounded-2xl overflow-hidden bg-white shadow-card border border-stone-200 mb-4 cursor-pointer"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  {/* Gradient is always rendered as fallback background */}
                  <div className={cn('absolute inset-0', getRecipeGradient(recipe))} />
                  {recipe.image && (
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                  {(recipe.cookTime || recipe.prepTime) && (
                    <div className="absolute bottom-3 left-3 bg-stone-900 text-white text-xs font-semibold rounded-full px-2.5 py-1">
                      {recipe.cookTime || recipe.prepTime}
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(recipe.id);
                    }}
                    className="absolute top-3 right-3 h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-stone-100"
                    aria-label={favorites.includes(recipe.id) ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten'}
                  >
                    <Heart
                      className={cn(
                        'h-4 w-4',
                        favorites.includes(recipe.id) ? 'fill-current text-red-500' : 'text-stone-500'
                      )}
                      strokeWidth={2}
                    />
                  </button>
                </div>
                <div className="p-4 pb-5">
                  <h3 className="font-semibold text-[17px] leading-snug text-stone-900 line-clamp-2">
                    {recipe.name}
                  </h3>
                  {recipe.subtitle && (
                    <p className="mt-0.5 line-clamp-1 text-sm text-stone-400">
                      {recipe.subtitle}
                    </p>
                  )}
                  {metaItems.length > 0 && (
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-stone-500">
                      {metaItems.map((item, index) => (
                        <Fragment key={`${recipe.id}-meta-${index}`}>
                          {index > 0 && <span aria-hidden="true">·</span>}
                          <span>{item}</span>
                        </Fragment>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
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

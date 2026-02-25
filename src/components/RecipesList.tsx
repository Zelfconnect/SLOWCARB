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
  avondeten: 'bg-gradient-to-br from-stone-100 to-stone-200',
  dinner: 'bg-gradient-to-br from-stone-100 to-stone-200',
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
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

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

      {/* Recipe Grid */}
      <div className="grid grid-cols-2 gap-3" data-testid="recipes-grid">
        {filteredRecipes.length === 0 ? (
          <div className="card-website col-span-2 py-12 text-center text-stone-500">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100 shadow-surface">
              <Search className="w-8 h-8 text-stone-400" />
            </div>
            <p className="font-display font-medium text-stone-700">Geen recepten gevonden</p>
            <p className="text-sm mt-1">Probeer een andere zoekterm</p>
          </div>
        ) : (
          filteredRecipes.map((recipe, index) => {
            const protein = (recipe as Recipe & { macros?: { protein?: number } }).macros?.protein;
            const timeLabel = recipe.cookTime || recipe.prepTime || 'Tijd n.b.';
            const servingsLabel = Number.isFinite(recipe.servings) ? `${recipe.servings}p` : 'Porties n.b.';
            const proteinLabel = protein != null ? `${protein}g eiwit` : 'Eiwit n.b.';

            return (
              <div
                key={recipe.id}
                onClick={() => setSelectedRecipeId(recipe.id)}
                className="overflow-hidden rounded-2xl bg-white shadow-card cursor-pointer"
                data-testid={`recipe-card-${recipe.id}`}
              >
                <div className="relative aspect-square w-full overflow-hidden" data-testid={`recipe-image-${recipe.id}`}>
                  {/* Gradient is always rendered as fallback background */}
                  <div className={cn('absolute inset-0', getRecipeGradient(recipe))} />
                  {recipe.image && (
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className={cn(
                        'absolute inset-0 h-full w-full object-cover transition-opacity duration-300',
                        loadedImages[recipe.id] ? 'opacity-100' : 'opacity-0'
                      )}
                      loading={index < 4 ? 'eager' : 'lazy'}
                      fetchPriority={index < 4 ? 'high' : 'auto'}
                      decoding="async"
                      onLoad={() => setLoadedImages((prev) => ({ ...prev, [recipe.id]: true }))}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                  {(recipe.cookTime || recipe.prepTime) && (
                    <div className="absolute bottom-2 left-2 rounded-full bg-stone-900 px-2 py-0.5 text-[10px] font-semibold text-white">
                      {timeLabel}
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(recipe.id);
                    }}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-surface"
                    aria-label={favorites.includes(recipe.id) ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten'}
                  >
                    <Heart
                      className={cn(
                        'h-3.5 w-3.5',
                        favorites.includes(recipe.id) ? 'fill-current text-red-500' : 'text-stone-500'
                      )}
                      strokeWidth={2}
                    />
                  </button>
                </div>
                <div className="p-2.5">
                  <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-stone-900">
                    {recipe.name}
                  </h3>
                  <div
                    className="mt-2 flex flex-nowrap items-center gap-1 overflow-hidden text-[11px] text-stone-600"
                    data-testid={`recipe-meta-${recipe.id}`}
                  >
                    <span className="rounded-full bg-stone-100 px-1.5 py-0.5 truncate">{timeLabel}</span>
                    <span className="rounded-full bg-stone-100 px-1.5 py-0.5 truncate">{servingsLabel}</span>
                    <span className="rounded-full bg-sage-50 px-1.5 py-0.5 text-sage-700 truncate">{proteinLabel}</span>
                  </div>
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

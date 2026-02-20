import { Heart, Clock, Users, ChevronRight } from 'lucide-react';
import type { Recipe } from '@/types';
import { cn } from '@/lib/utils';
import { getRecipeIcon } from '@/lib/recipeIcons';
import { getCategoryAccent } from '@/lib/recipeCardStyle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CompactRecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onClick: () => void;
}

const DIFFICULTY_LABELS: Record<string, string> = {
  makkelijk: 'Makkelijk',
  medium: 'Gemiddeld',
  moeilijk: 'Uitdagend',
};

export function CompactRecipeCard({
  recipe,
  isFavorite,
  onToggleFavorite,
  onClick,
}: CompactRecipeCardProps) {
  const RecipeIcon = getRecipeIcon(recipe.icon);
  const protein = (recipe as Recipe & { macros?: { protein?: number } }).macros?.protein;
  const { iconBox, iconColor } = getCategoryAccent(recipe.category);
  const difficultyLabel = recipe.difficulty
    ? DIFFICULTY_LABELS[recipe.difficulty.toLowerCase()] ?? recipe.difficulty
    : null;

  return (
    <div
      onClick={onClick}
      className="card-website group relative flex cursor-pointer flex-row items-center gap-4 px-3.5 py-3 shadow-[0_6px_18px_rgba(47,94,63,0.08)] hover:shadow-[0_10px_24px_rgba(47,94,63,0.14)]"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleFavorite}
        className={cn(
          'absolute right-2.5 top-2.5 z-10 h-7 w-7 rounded-md border border-sage-200/70 bg-white/90',
          isFavorite
            ? 'text-red-500 hover:bg-red-50 hover:border-sage-300'
            : 'text-stone-300/80 hover:text-stone-500 hover:bg-stone-100 hover:border-sage-300'
        )}
      >
        <Heart
          className={cn('h-4 w-4', isFavorite && 'fill-current')}
          strokeWidth={isFavorite ? 2.5 : 2}
        />
      </Button>

      {/* Icon – category-based accent */}
      <div
        className={cn(
          'ml-8 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-[1.03]',
          iconBox
        )}
      >
        <RecipeIcon className={cn('h-5 w-5', iconColor)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="line-clamp-2 text-sm font-display font-semibold leading-tight text-stone-800 transition-colors group-hover:text-sage-700">
          {recipe.name}
        </h3>
        {recipe.subtitle && (
          <p className="mt-0.5 text-xs text-stone-500 line-clamp-1">
            {recipe.subtitle}
          </p>
        )}
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-sage-600" />
            {recipe.prepTime}
          </span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-stone-300" />
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3 text-sage-600" />
            {recipe.servings}p
          </span>
          {difficultyLabel && (
            <>
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-stone-300" />
              <Badge
                variant="secondary"
                className="border-0 bg-stone-100 px-1.5 py-0.5 text-[11px] font-medium text-stone-600"
              >
                {difficultyLabel}
              </Badge>
            </>
          )}
          {protein != null && (
            <>
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-stone-300" />
              <Badge
                variant="secondary"
                className={cn(
                  'border-0 px-1.5 py-0.5 text-[11px] font-medium',
                  protein >= 25 ? 'text-sage-600 bg-sage-50' : 'text-stone-400 bg-stone-100'
                )}
              >
                {protein}g eiwit
              </Badge>
            </>
          )}
        </div>
      </div>
      
      <div className="mt-0.5 flex items-center">
        <ChevronRight className="h-4 w-4 text-sage-500 transition-colors group-hover:text-sage-600" />
      </div>
    </div>
  );
}

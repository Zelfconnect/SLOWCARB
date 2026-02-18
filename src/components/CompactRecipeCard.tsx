import { Heart, Clock, Users } from 'lucide-react';
import type { Recipe } from '@/types';
import { cn } from '@/lib/utils';
import { getRecipeIcon } from '@/lib/recipeIcons';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CompactRecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onClick: () => void;
}

export function CompactRecipeCard({ 
  recipe, 
  isFavorite, 
  onToggleFavorite, 
  onClick 
}: CompactRecipeCardProps) {
  const RecipeIcon = getRecipeIcon(recipe.icon);
  const protein = (recipe as Recipe & { macros?: { protein?: number } }).macros?.protein;

  return (
    <Card
      onClick={onClick}
      className="flex-row items-center gap-3 p-3 rounded-xl py-3 min-h-[72px] hover:border-sage-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-sage-100 to-sage-50 flex items-center justify-center flex-shrink-0">
        <RecipeIcon className="w-6 h-6 text-stone-600" />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-semibold text-stone-800 text-sm leading-tight line-clamp-2 group-hover:text-sage-700 transition-colors">
          {recipe.name}
        </h3>
        <div className="flex items-center gap-2 mt-1 text-xs text-stone-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {recipe.prepTime}
          </span>
          <span className="text-stone-300">|</span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {recipe.servings}p
          </span>
          {protein != null && (
            <>
              <span className="text-stone-300">|</span>
              <Badge
                variant="secondary"
                className={cn(
                  'text-sm px-1.5 py-0.5 border-0 font-medium',
                  protein >= 25 ? 'text-sage-600 bg-sage-50' : 'text-stone-400 bg-stone-100'
                )}
              >
                {protein}g eiwit
              </Badge>
            </>
          )}
        </div>
      </div>
      
      {/* Favorite button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleFavorite}
        className={cn(
          'rounded-lg',
          isFavorite
            ? 'text-red-500 hover:bg-red-50'
            : 'text-stone-300 hover:text-stone-500 hover:bg-stone-100'
        )}
      >
        <Heart
          className={cn('w-5 h-5', isFavorite && 'fill-current')}
          strokeWidth={isFavorite ? 2.5 : 2}
        />
      </Button>
    </Card>
  );
}

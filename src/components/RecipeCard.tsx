import { Heart, Clock, Users } from 'lucide-react';
import type { Recipe } from '@/types';
import { cn } from '@/lib/utils';
import { getRecipeIcon } from '@/lib/recipeIcons';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClick: () => void;
}

export function RecipeCard({ recipe, isFavorite, onToggleFavorite, onClick }: RecipeCardProps) {
  const RecipeIcon = getRecipeIcon(recipe.icon);

  return (
    <div onClick={onClick} className="card-premium cursor-pointer group">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sage-100 to-sage-50 flex items-center justify-center shadow-soft">
              <RecipeIcon className="w-6 h-6 text-stone-600" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-stone-800 text-lg leading-tight group-hover:text-sage-700 transition-colors">
                {recipe.name}
              </h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-stone-500">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" strokeWidth={2} />
                  {recipe.prepTime}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" strokeWidth={2} />
                  {recipe.servings}p
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(recipe.id); }}
            className={cn(
              'w-11 h-11 rounded-xl transition-all duration-200 flex items-center justify-center',
              isFavorite ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-stone-100 text-stone-400 hover:bg-stone-200 hover:text-stone-600'
            )}
          >
            <Heart className={cn('w-5 h-5 transition-transform', isFavorite && 'fill-current scale-110')} strokeWidth={isFavorite ? 2.5 : 2} />
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {recipe.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag-sage">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

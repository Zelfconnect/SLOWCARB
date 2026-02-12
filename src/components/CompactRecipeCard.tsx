import { Heart, Clock, Users } from 'lucide-react';
import type { Recipe } from '@/types';
import { cn } from '@/lib/utils';

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
  return (
    <div 
      onClick={onClick}
      className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-200 hover:border-sage-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-sage-100 to-sage-50 flex items-center justify-center text-xl flex-shrink-0">
        {recipe.emoji}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-semibold text-stone-800 text-sm leading-tight truncate group-hover:text-sage-700 transition-colors">
          {recipe.name}
        </h3>
        <div className="flex items-center gap-2 mt-1 text-xs text-stone-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {recipe.prepTime}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {recipe.servings}p
          </span>
          {recipe.tags.slice(0, 2).map((tag) => (
            <span 
              key={tag} 
              className="text-[10px] bg-sage-50 text-sage-600 px-1.5 py-0.5 rounded font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      {/* Favorite button */}
      <button
        onClick={onToggleFavorite}
        className={cn(
          'p-2 rounded-lg transition-all duration-200 flex-shrink-0',
          isFavorite 
            ? 'text-red-500 hover:bg-red-50' 
            : 'text-stone-300 hover:text-stone-500 hover:bg-stone-100'
        )}
      >
        <Heart 
          className={cn('w-5 h-5', isFavorite && 'fill-current')} 
          strokeWidth={isFavorite ? 2.5 : 2} 
        />
      </button>
    </div>
  );
}

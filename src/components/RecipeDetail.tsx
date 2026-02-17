import { useState } from 'react';
import { Heart, Clock, Users, ChefHat, Plus, ShoppingCart, Info } from 'lucide-react';
import type { Recipe } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getRecipeIcon } from '@/lib/recipeIcons';

interface RecipeDetailProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onAddToShoppingList: (items: string[]) => void;
}

const portionOptions = [
  { value: '0.5', label: '½ portie', multiplier: 0.5 },
  { value: '1', label: '1 portie', multiplier: 1 },
  { value: '2', label: '2 porties', multiplier: 2 },
  { value: '4', label: '4 porties (meal prep)', multiplier: 4 },
  { value: '6', label: '6 porties (bulk)', multiplier: 6 },
  { value: '8', label: '8 porties (week prep)', multiplier: 8 },
];

export function RecipeDetail({ recipe, isOpen, onClose, isFavorite, onToggleFavorite, onAddToShoppingList }: RecipeDetailProps) {
  const [portionMultiplier, setPortionMultiplier] = useState(1);
  const [showAddedToast, setShowAddedToast] = useState(false);

  if (!recipe) return null;
  const RecipeIcon = getRecipeIcon(recipe.icon);

  const scaleAmount = (amount: string, multiplier: number): string => {
    const match = amount.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
    if (!match) return amount;
    const [, num, unit] = match;
    const scaled = parseFloat(num) * multiplier;
    const formatted = scaled % 1 === 0 ? scaled.toString() : scaled.toFixed(1).replace(/\.0$/, '');
    return `${formatted} ${unit}`;
  };

  const handleAddToShoppingList = () => {
    const items = recipe.ingredients.map(ing => {
      if (ing.scalable) return `${scaleAmount(ing.amount, portionMultiplier)} ${ing.name}`;
      return `${ing.amount} ${ing.name}`;
    });
    onAddToShoppingList(items);
    setShowAddedToast(true);
    setTimeout(() => setShowAddedToast(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90dvh] p-0 border-0 rounded-3xl shadow-2xl">
        <DialogHeader className="sticky top-0 z-10 p-6 bg-gradient-to-br from-sage-600 to-sage-700 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <RecipeIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-display text-white">{recipe.name}</DialogTitle>
                <div className="flex items-center gap-4 mt-2 text-sm text-sage-100">
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{recipe.prepTime} prep</span>
                  <span className="flex items-center gap-1.5"><ChefHat className="w-4 h-4" />{recipe.cookTime} koken</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onToggleFavorite(recipe.id)}
              className={cn('w-11 h-11 rounded-xl transition-all duration-200 backdrop-blur-sm flex items-center justify-center', isFavorite ? 'bg-white/30 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20')}
            >
              <Heart className={cn('w-6 h-6', isFavorite && 'fill-current')} strokeWidth={2.5} />
            </button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="bg-sage-50 rounded-2xl p-5 border border-sage-100">
            <label className="flex items-center gap-2 text-sm font-medium text-sage-800 mb-3">
              <Users className="w-4 h-4" />Hoeveel porties?
            </label>
            <Select value={portionMultiplier.toString()} onValueChange={(val) => setPortionMultiplier(parseFloat(val))}>
              <SelectTrigger className="bg-white border-sage-200 rounded-xl h-12"><SelectValue /></SelectTrigger>
              <SelectContent className="rounded-xl">
                {portionOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="rounded-lg">{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <h3 className="font-display font-semibold text-stone-800 text-lg mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-sage-600" />Ingrediënten
            </h3>
            <ul className="space-y-3">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx} className="flex items-start gap-3 text-stone-700 py-2 border-b border-stone-100 last:border-0">
                  <span className="w-2 h-2 rounded-full bg-sage-400 mt-2 flex-shrink-0" />
                  <span>
                    <span className="font-medium text-stone-900">{ing.scalable ? scaleAmount(ing.amount, portionMultiplier) : ing.amount}</span>
                    {' '}{ing.name}
                  </span>
                </li>
              ))}
            </ul>
            
            <Button onClick={handleAddToShoppingList} className="w-full mt-5 h-12 text-base flex-shrink-0">
              <Plus className="w-5 h-5 mr-2" />Voeg toe aan boodschappenlijst
            </Button>
          </div>

          <div>
            <h3 className="font-display font-semibold text-stone-800 text-lg mb-4 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-sage-600" />Bereiding
            </h3>
            <ol className="space-y-4">
              {recipe.steps.map((step, idx) => (
                <li key={idx} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-sage-100 text-sage-700 text-sm font-display font-semibold flex items-center justify-center">{idx + 1}</span>
                  <span className="text-stone-700 pt-1 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {recipe.tips && recipe.tips.length > 0 && (
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200">
              <h3 className="font-display font-semibold text-stone-800 mb-3 flex items-center gap-2"><Info className="w-5 h-5" />Tips</h3>
              <ul className="space-y-2">
                {recipe.tips.map((tip, idx) => (
                  <li key={idx} className="text-stone-700 text-sm flex items-start gap-2 leading-relaxed">
                    <span className="text-stone-400 mt-0.5">•</span>{tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {showAddedToast && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-stone-800 text-white px-5 py-3 rounded-xl text-sm shadow-elevated animate-in">
            Toegevoegd aan lijst!
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

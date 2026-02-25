import { useState } from 'react';
import { Heart, Users, ChevronLeft } from 'lucide-react';
import type { Recipe } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { scaleAmount } from '@/lib/scaleAmount';

interface RecipeDetailModalProps {
  recipe: Recipe;
  isOpen: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenPackageSelector?: (portionMultiplier: number) => void;
  onClose: () => void;
}

const portionOptions = [
  { value: '0.5', label: '½', multiplier: 0.5 },
  { value: '1', label: '1', multiplier: 1 },
  { value: '2', label: '2', multiplier: 2 },
  { value: '4', label: '4', multiplier: 4 },
  { value: '6', label: '6', multiplier: 6 },
  { value: '8', label: '8', multiplier: 8 },
];

export function RecipeDetailModal({
  recipe,
  isOpen,
  isFavorite,
  onToggleFavorite,
  onOpenPackageSelector,
  onClose
}: RecipeDetailModalProps) {
  const [portionMultiplier, setPortionMultiplier] = useState(1);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="flex h-[calc(100dvh-1rem)] max-h-[calc(100dvh-1rem)] max-w-md flex-col rounded-2xl border-0 bg-white p-0 shadow-surface"
      >
        <DialogTitle className="sr-only">{recipe.name}</DialogTitle>
        <DialogDescription className="sr-only">Recept detail met ingredienten en bereiding.</DialogDescription>
        <div className="flex min-h-0 flex-1 flex-col bg-white" data-testid="recipe-detail-modal">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#1a3626] to-[#145a45] px-4 pb-3 pt-3 text-white">
            <div className="mb-2 flex items-center justify-between">
              <Button
                onClick={onClose}
                variant="ghost"
                className="min-h-10 gap-1 rounded-2xl border-0 bg-white/10 px-3 text-white/95 shadow-surface hover:bg-white/20 hover:text-white"
                aria-label="Terug"
              >
                <ChevronLeft className="h-4 w-4" />
                Terug
              </Button>
              <button
                onClick={onToggleFavorite}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-2xl border-0 shadow-surface transition-colors',
                  isFavorite ? 'bg-white/30 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
                )}
                aria-label={isFavorite ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten'}
              >
                <Heart className={cn('h-4.5 w-4.5', isFavorite && 'fill-current')} strokeWidth={2.25} />
              </button>
            </div>
            <h2 className="line-clamp-2 font-display text-[28px] font-bold leading-tight text-white">{recipe.name}</h2>
          </div>
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-200">
            {recipe.image ? (
              <img
                src={recipe.image}
                alt={recipe.name}
                className="h-full w-full object-cover"
                loading="eager"
                onError={(event) => {
                  const img = event.target as HTMLImageElement;
                  img.style.display = 'none';
                }}
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-stone-300 via-stone-200 to-stone-100" />
            )}
          </div>

          <Tabs defaultValue="ingredients" className="flex min-h-0 flex-1 flex-col gap-0">
            <TabsList className="mx-4 mt-3 h-auto w-auto flex-shrink-0 rounded-2xl bg-stone-100 p-1">
              <TabsTrigger
                value="ingredients"
                className="flex-1"
              >
                Ingrediënten
              </TabsTrigger>
              <TabsTrigger
                value="instructions"
                className="flex-1"
              >
                Bereiding
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ingredients" className="mt-0 min-h-0 flex-1 overflow-y-auto">
              <div className="space-y-2 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-stone-600">
                    <Users className="h-4 w-4" />
                    Personen:
                  </span>
                  <Select
                    value={portionOptions.find((option) => option.multiplier === portionMultiplier)?.value ?? '1'}
                    onValueChange={(value) => {
                      const selectedOption = portionOptions.find((option) => option.value === value);
                      if (selectedOption) setPortionMultiplier(selectedOption.multiplier);
                    }}
                  >
                    <SelectTrigger className="h-11 w-[92px] rounded-2xl bg-white text-sm font-medium text-stone-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border border-stone-100 bg-white text-stone-800 shadow-surface">
                      {portionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <ul className="space-y-1">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li
                      key={`${recipe.id}-ingredient-${index}`}
                      className="flex items-start gap-2 py-1.5 text-stone-800"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#10b981]" />
                      <span className="text-base leading-relaxed">
                        <span className="font-medium">
                          {ingredient.scalable ? scaleAmount(ingredient.amount, portionMultiplier) : ingredient.amount}
                        </span>{' '}
                        {ingredient.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="instructions" className="mt-0 min-h-0 flex-1 overflow-y-auto">
              <div className="space-y-3 px-4 py-3">
                {recipe.prepNote && (
                  <div className="rounded-2xl bg-stone-50 p-3 text-sm leading-relaxed text-stone-600 shadow-surface">
                    {recipe.prepNote}
                  </div>
                )}
                <ol className="space-y-2">
                  {recipe.steps.map((step, index) => (
                    <li key={`${recipe.id}-step-${index}`} className="flex gap-3">
                      <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-semibold text-emerald-700">
                        {index + 1}
                      </span>
                      <span className="space-y-1">
                        <span className="block text-sm leading-relaxed text-stone-700">{step.text}</span>
                        {step.note && (
                          <span className="block text-xs leading-relaxed text-stone-500">{step.note}</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ol>
                {recipe.tips && recipe.tips.length > 0 && (
                  <div className="rounded-2xl bg-stone-50 p-3 shadow-surface">
                    <p className="mb-2 text-sm font-semibold text-stone-800">Tips</p>
                    <ul className="space-y-1.5 text-sm text-stone-700">
                      {recipe.tips.map((tip, index) => (
                        <li key={`${recipe.id}-tip-${index}`} className="flex items-start gap-2">
                          <span className="mt-1 text-stone-400">&bull;</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex-shrink-0 bg-white p-3">
            <Button
              onClick={() => {
                if (onOpenPackageSelector) {
                  onOpenPackageSelector(portionMultiplier);
                  return;
                }
                onClose();
              }}
              className="h-14 w-full rounded-2xl bg-[#10b981] text-base font-semibold text-white hover:bg-[#059669] active:shadow-surface-pressed"
              data-testid="recipe-start-cooking-button"
            >
              Start koken
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

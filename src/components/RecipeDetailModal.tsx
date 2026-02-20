import { useState } from 'react';
import { Heart, Clock, ChefHat, Users, ShoppingCart, Info, ChevronLeft } from 'lucide-react';
import type { Recipe } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

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

  const scaleAmount = (amount: string, multiplier: number): string => {
    const match = amount.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
    if (!match) return amount;
    const [, num, unit] = match;
    const scaled = parseFloat(num) * multiplier;
    const formatted = scaled % 1 === 0 ? scaled.toString() : scaled.toFixed(1).replace(/\.0$/, '');
    return `${formatted} ${unit}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="flex h-[85dvh] max-h-[90dvh] max-w-lg flex-col rounded-3xl border border-stone-100 bg-white p-0 shadow-elevated"
      >
        {/* Header */}
        <div className="flex-shrink-0 rounded-t-3xl bg-gradient-to-br from-sage-600 to-sage-700 p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Button
                onClick={onClose}
                variant="ghost"
                className="min-h-10 px-3 gap-1.5 flex-shrink-0 rounded-xl text-white/95 hover:text-white hover:bg-white/20 border border-white/25 hover:border-white/40 transition-colors"
                aria-label="Terug"
              >
                <ChevronLeft className="w-4 h-4" />
                Terug
              </Button>
              <div className="flex-1 min-w-0 space-y-1">
                <h2 className="text-xl font-bold text-white leading-tight">{recipe.name}</h2>
                <div className="flex items-center gap-3 text-sm text-white/90">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{recipe.prepTime} prep</span>
                  <span className="flex items-center gap-1"><ChefHat className="w-3 h-3" />{recipe.cookTime}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onToggleFavorite}
              className={cn('w-11 h-11 rounded-xl transition-all duration-200 backdrop-blur-sm flex items-center justify-center flex-shrink-0', isFavorite ? 'bg-white/30 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20')}
            >
              <Heart className={cn('w-5 h-5', isFavorite && 'fill-current')} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Tabs + Content */}
        <Tabs defaultValue="ingredients" className="flex min-h-0 flex-1 flex-col gap-0">
          <TabsList className="h-auto w-full flex-shrink-0 rounded-none border-b border-stone-200 bg-stone-50 p-1.5">
            <TabsTrigger
              value="ingredients"
              className="rounded-xl border border-transparent px-4 data-[state=active]:border-sage-600 data-[state=active]:bg-sage-600 data-[state=active]:font-semibold data-[state=active]:text-white data-[state=active]:shadow-none text-muted-foreground"
            >
              Ingrediënten
            </TabsTrigger>
            <TabsTrigger
              value="instructions"
              className="rounded-xl border border-transparent px-4 data-[state=active]:border-sage-600 data-[state=active]:bg-sage-600 data-[state=active]:font-semibold data-[state=active]:text-white data-[state=active]:shadow-none text-muted-foreground"
            >
              Bereiding
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ingredients" className="mt-0 min-h-0 flex-1 overflow-y-auto">
            <div className="space-y-5 p-6">
                {/* Portion Selector */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-600 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Personen:
                  </span>
                  <Select
                    value={portionOptions.find(o => o.multiplier === portionMultiplier)?.value ?? '1'}
                    onValueChange={(val) => {
                      const opt = portionOptions.find(o => o.value === val);
                      if (opt) setPortionMultiplier(opt.multiplier);
                    }}
                  >
                    <SelectTrigger className="w-[80px] h-9 bg-stone-100 border-0 rounded-lg text-sm font-medium text-stone-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {portionOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Ingredients List */}
                <ul className="space-y-2">
                  {recipe.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-stone-700 py-2 border-b border-stone-100 last:border-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-sage-400 mt-1.5 flex-shrink-0" />
                      <span>
                        <span className="font-medium text-stone-900">{ing.scalable ? scaleAmount(ing.amount, portionMultiplier) : ing.amount}</span>
                        {' '}{ing.name}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Add to Shopping List */}
                {onOpenPackageSelector ? (
                  <Button
                    onClick={() => onOpenPackageSelector(portionMultiplier)}
                    className="w-full rounded-xl bg-sage-600 text-white hover:bg-sage-700"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    + Toevoegen
                  </Button>
                ) : null}
            </div>
          </TabsContent>

          <TabsContent value="instructions" className="mt-0 min-h-0 flex-1 overflow-y-auto">
            <div className="space-y-5 p-6">
                {/* Steps */}
                <ol className="space-y-4">
                  {recipe.steps.map((step, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sage-100 text-sage-700 text-xs font-display font-semibold flex items-center justify-center mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-stone-700 leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>

                {/* Tips - Accordion */}
                {recipe.tips && recipe.tips.length > 0 && (
                  <Accordion type="single" collapsible className="mt-6">
                    <AccordionItem value="tips" className="rounded-2xl border border-stone-200 bg-stone-50">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <span className="flex items-center gap-2 text-sm font-medium text-stone-800">
                          <Info className="w-4 h-4" />
                          Tips ({recipe.tips.length})
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <ul className="space-y-2">
                          {recipe.tips.map((tip, idx) => (
                            <li key={idx} className="text-stone-700 text-sm flex items-start gap-2 leading-relaxed">
                              <span className="text-stone-400 mt-0.5">&bull;</span>{tip}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
            </div>
          </TabsContent>

        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

import { useState, useRef, useEffect } from 'react';
import { Heart, Clock, ChefHat, Users, ShoppingCart, Info, ChevronDown, ArrowLeft, ChevronUp } from 'lucide-react';
import type { Recipe } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface RecipeDetailModalProps {
  recipe: Recipe;
  isOpen: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenPackageSelector: () => void;
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

type TabType = 'ingredients' | 'instructions';

export function RecipeDetailModal({ 
  recipe, 
  isOpen,
  isFavorite, 
  onToggleFavorite, 
  onOpenPackageSelector,
  onClose
}: RecipeDetailModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('ingredients');
  const [portionMultiplier, setPortionMultiplier] = useState(1);
  const [showPortionDropdown, setShowPortionDropdown] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowPortionDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scaleAmount = (amount: string, multiplier: number): string => {
    const match = amount.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
    if (!match) return amount;
    const [, num, unit] = match;
    const scaled = parseFloat(num) * multiplier;
    const formatted = scaled % 1 === 0 ? scaled.toString() : scaled.toFixed(1).replace(/\.0$/, '');
    return `${formatted} ${unit}`;
  };

  const selectedPortion = portionOptions.find(opt => opt.multiplier === portionMultiplier);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        className="fixed inset-x-4 top-16 bottom-24 z-50 animate-expand-up"
        style={{ maxHeight: 'calc(100vh - 160px)' }}
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden h-full flex flex-col">
          {/* Header - Fixed */}
          <div className="p-5 bg-gradient-to-br from-sage-600 to-sage-700 flex-shrink-0">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-xl bg-white/10 text-white/70 hover:bg-white/20 transition-all duration-200 flex items-center justify-center flex-shrink-0"
                  aria-label="Terug"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-display text-white leading-tight">{recipe.name}</h2>
                  <div className="flex items-center gap-3 mt-1 text-xs text-sage-100">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{recipe.prepTime} prep</span>
                    <span className="flex items-center gap-1"><ChefHat className="w-3 h-3" />{recipe.cookTime}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onToggleFavorite}
                className={cn('w-10 h-10 rounded-xl transition-all duration-200 backdrop-blur-sm flex items-center justify-center flex-shrink-0', isFavorite ? 'bg-white/30 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20')}
              >
                <Heart className={cn('w-5 h-5', isFavorite && 'fill-current')} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-stone-200 flex-shrink-0">
            <button 
              onClick={() => setActiveTab('ingredients')}
              className={cn(
                'flex-1 py-3 text-sm font-medium transition-colors relative',
                activeTab === 'ingredients' 
                  ? 'text-sage-700' 
                  : 'text-stone-500 hover:text-stone-700'
              )}
            >
              Ingrediënten
              {activeTab === 'ingredients' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sage-500" />
              )}
            </button>
            <button 
              onClick={() => setActiveTab('instructions')}
              className={cn(
                'flex-1 py-3 text-sm font-medium transition-colors relative',
                activeTab === 'instructions' 
                  ? 'text-sage-700' 
                  : 'text-stone-500 hover:text-stone-700'
              )}
            >
              Bereiding
              {activeTab === 'instructions' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sage-500" />
              )}
            </button>
          </div>

          {/* Content - Scrollable */}
          <div 
            className="flex-1 overflow-y-auto"
            style={{ 
              paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {activeTab === 'ingredients' ? (
              <div className="p-5 space-y-5">
                {/* Portion Selector - Compact */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-600 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Personen:
                  </span>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowPortionDropdown(!showPortionDropdown)}
                      className="flex items-center gap-2 px-3 py-2 bg-stone-100 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-200 transition-colors"
                    >
                      {selectedPortion?.label}
                      <ChevronDown className={cn('w-4 h-4 transition-transform', showPortionDropdown && 'rotate-180')} />
                    </button>
                    
                    {showPortionDropdown && (
                      <div className="absolute top-full right-0 mt-1 bg-white border border-stone-200 rounded-xl shadow-lg z-50 overflow-hidden min-w-[80px]">
                        {portionOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              setPortionMultiplier(opt.multiplier);
                              setShowPortionDropdown(false);
                            }}
                            className={cn(
                              'w-full px-4 py-2 text-left hover:bg-sage-50 transition-colors text-sm',
                              portionMultiplier === opt.multiplier && 'bg-sage-100 text-sage-700 font-medium'
                            )}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
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

                {/* Compact Button */}
                <Button onClick={onOpenPackageSelector} className="w-full btn-primary h-11 text-sm">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  + Toevoegen
                </Button>
              </div>
            ) : (
              <div className="p-5 space-y-5">
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

                {/* Tips - Collapsible */}
                {recipe.tips && recipe.tips.length > 0 && (
                  <div className="mt-6">
                    <button
                      onClick={() => setShowTips(!showTips)}
                      className="w-full flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-200"
                    >
                      <span className="flex items-center gap-2 text-sm font-medium text-stone-800">
                        <Info className="w-4 h-4" />
                        Tips ({recipe.tips.length})
                      </span>
                      <ChevronUp className={cn('w-4 h-4 text-stone-500 transition-transform', !showTips && 'rotate-180')} />
                    </button>
                    
                    {showTips && (
                      <ul className="mt-3 space-y-2 p-4 bg-stone-50 rounded-xl">
                        {recipe.tips.map((tip, idx) => (
                          <li key={idx} className="text-stone-700 text-sm flex items-start gap-2 leading-relaxed">
                            <span className="text-stone-400 mt-0.5">•</span>{tip}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Bottom spacing */}
            <div className="h-4" />
          </div>

          {/* Scroll indicator gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-3xl" />
        </div>
      </div>
    </>
  );
}

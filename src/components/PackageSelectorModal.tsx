import { useState, useEffect } from 'react';
import { Home, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getPackageSizes, getDefaultPackage, type PackageSize } from '@/data/packageSizes';
import type { Ingredient } from '@/types';
import { getStockIconInfo } from '@/lib/stockIcons';
import { getIconKeyForIngredient } from '@/lib/ingredientIcons';

interface SelectedPackage {
  ingredient: Ingredient;
  selectedPackage: PackageSize;
  alreadyHave: boolean;
}

interface PackageSelectorModalProps {
  isOpen: boolean;
  recipeName: string;
  ingredients: Ingredient[];
  portionMultiplier: number;
  onClose: () => void;
  onConfirm: (items: SelectedPackage[]) => void;
}

export function PackageSelectorModal({
  isOpen,
  recipeName,
  ingredients,
  portionMultiplier,
  onClose,
  onConfirm,
}: PackageSelectorModalProps) {
  const [selections, setSelections] = useState<Record<string, SelectedPackage>>({});

  const renderIcon = (iconKey: string, ariaLabel: string) => {
    const iconInfo = getStockIconInfo(iconKey);
    const Icon = iconInfo.Icon;
    return <Icon className="w-6 h-6 text-stone-600 flex-shrink-0" aria-label={ariaLabel} />;
  };

  useEffect(() => {
    if (isOpen) {
      const initialSelections: Record<string, SelectedPackage> = {};

      ingredients.forEach((ing) => {
        const packages = getPackageSizes(ing.name);
        const parsedIngredientAmount = parseFloat(ing.amount.match(/[\d.,]+/)?.[0]?.replace(',', '.') || '1');
        const requiredAmount = ing.scalable ? parsedIngredientAmount * portionMultiplier : parsedIngredientAmount;
        const defaultPkg = packages
          ? getDefaultPackage(ing.name, requiredAmount) || packages.packages[0]
          : { amount: requiredAmount, label: ing.amount };

        initialSelections[ing.name] = {
          ingredient: ing,
          selectedPackage: defaultPkg,
          alreadyHave: false,
        };
      });

      setSelections(initialSelections);
    }
  }, [isOpen, ingredients, portionMultiplier, recipeName]);


  const handlePackageSelect = (ingredientName: string, pkg: PackageSize) => {
    setSelections((prev) => ({
      ...prev,
      [ingredientName]: {
        ...prev[ingredientName],
        selectedPackage: pkg,
      },
    }));
  };

  const handleAlreadyHaveToggle = (ingredientName: string) => {
    setSelections((prev) => ({
      ...prev,
      [ingredientName]: {
        ...prev[ingredientName],
        alreadyHave: !prev[ingredientName]?.alreadyHave,
      },
    }));
  };

  const handleConfirm = () => {
    const selectedItems = Object.values(selections);
    onConfirm(selectedItems);
    onClose();
  };

  const allItemsAlreadyHave = Object.values(selections).every((item) => item.alreadyHave);
  const itemsToAddCount = Object.values(selections).filter((item) => !item.alreadyHave).length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[85dvh] max-w-lg flex-col rounded-3xl border border-stone-100 bg-white p-0 shadow-elevated"
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-br from-sage-600 to-sage-700 flex-shrink-0 rounded-t-3xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-display text-xl leading-tight text-white">
                  Toevoegen aan lijst
                </h2>
                <p className="text-sm text-white/80 mt-0.5 truncate">{recipeName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-5 space-y-4">
            <p className="text-sm text-stone-500">
              Selecteer hoe je het wilt kopen:
            </p>

            {ingredients.map((ing, index) => {
              const selection = selections[ing.name];
              if (!selection) return null;

              const packages = getPackageSizes(ing.name);

              return (
                <div
                  key={index}
                  className={cn(
                    'rounded-2xl border p-0 shadow-soft transition-all duration-200',
                    selection.alreadyHave
                      ? 'border-stone-200 bg-stone-50 opacity-60'
                      : 'border-stone-100 bg-white'
                  )}
                >
                  {/* Ingredient Header */}
                  <div className="p-4 border-b border-stone-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {renderIcon(getIconKeyForIngredient(ing.name), ing.name)}
                        <div>
                          <p className="font-medium text-stone-800">{ing.name}</p>
                          <p className="text-xs text-stone-500">
                            Nodig: {ing.amount}
                          </p>
                        </div>
                      </div>

                      {/* Already have checkbox */}
                      <button
                        onClick={() => handleAlreadyHaveToggle(ing.name)}
                        className={cn(
                          'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200',
                          selection.alreadyHave
                            ? 'bg-sage-100 text-sage-700'
                            : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                        )}
                      >
                        <Home className="w-4 h-4" />
                        <span className="hidden sm:inline">Ik heb dit al</span>
                      </button>
                    </div>
                  </div>

                  {/* Package Options */}
                  {!selection.alreadyHave && (
                    <div className="p-4">
                      {packages ? (
                        <div className="flex flex-wrap gap-2">
                          {packages.packages.map((pkg, pkgIndex) => (
                            <button
                              key={pkgIndex}
                              onClick={() => handlePackageSelect(ing.name, pkg)}
                              className={cn(
                                'rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200',
                                selection.selectedPackage.amount === pkg.amount &&
                                  selection.selectedPackage.label === pkg.label
                                  ? 'border-sage-600 bg-sage-600 text-white'
                                  : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-sage-300'
                              )}
                            >
                              {pkg.label}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-stone-500 italic">
                          Geen verpakkingsopties beschikbaar. Dit wordt toegevoegd als "{ing.amount}".
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Bottom spacing */}
            <div className="h-4" />
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex-shrink-0 rounded-b-3xl border-t border-stone-100 bg-white p-5">
          <Button
            onClick={handleConfirm}
            className="w-full rounded-xl bg-sage-600 text-white hover:bg-sage-700 disabled:bg-stone-200 disabled:text-stone-500"
            size="xl"
          >
            {allItemsAlreadyHave
              ? `Naar voorraad (${Object.values(selections).length} items)`
              : `Toevoegen (${itemsToAddCount} items)`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useState, useEffect } from 'react';
import { X, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { getPackageSizes, getDefaultPackage, type PackageSize } from '@/data/packageSizes';
import type { Ingredient } from '@/types';

interface SelectedPackage {
  ingredient: Ingredient;
  selectedPackage: PackageSize;
  alreadyHave: boolean;
}

interface PackageSelectorModalProps {
  isOpen: boolean;
  recipeName: string;
  ingredients: Ingredient[];
  onClose: () => void;
  onConfirm: (items: SelectedPackage[]) => void;
}

export function PackageSelectorModal({
  isOpen,
  recipeName,
  ingredients,
  onClose,
  onConfirm,
}: PackageSelectorModalProps) {
  const [selections, setSelections] = useState<Record<string, SelectedPackage>>({});

  // Initialize selections when modal opens
  useEffect(() => {
    if (isOpen) {
      const initialSelections: Record<string, SelectedPackage> = {};

      ingredients.forEach((ing) => {
        const packages = getPackageSizes(ing.name);
        const requiredAmount = parseFloat(ing.amount.match(/\d+/)?.[0] || '1');
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
  }, [isOpen, ingredients]);

  // Body scroll lock
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
    const selectedItems = Object.values(selections).filter((item) => !item.alreadyHave);
    onConfirm(selectedItems);
    onClose();
  };

  if (!isOpen) return null;

  const allItemsAlreadyHave = Object.values(selections).every((item) => item.alreadyHave);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-4 top-16 bottom-24 z-50 animate-expand-up">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden h-full flex flex-col">
          {/* Header */}
          <div className="p-5 bg-gradient-to-br from-sage-600 to-sage-700 flex-shrink-0">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
                  🛒
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-display text-white leading-tight">
                    Toevoegen aan lijst
                  </h2>
                  <p className="text-sm text-white/80 mt-0.5 truncate">{recipeName}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-white/10 text-white/70 hover:bg-white/20 transition-all duration-200 flex items-center justify-center flex-shrink-0"
                aria-label="Sluiten"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div
            className="flex-1 overflow-y-auto p-5 space-y-4"
            style={{
              paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
              WebkitOverflowScrolling: 'touch',
            }}
          >
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
                    'rounded-2xl border-2 transition-all duration-200',
                    selection.alreadyHave
                      ? 'bg-stone-50 border-stone-200 opacity-60'
                      : 'bg-white border-stone-200'
                  )}
                >
                  {/* Ingredient Header */}
                  <div className="p-4 border-b border-stone-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">
                          {ing.name.toLowerCase().includes('ei')
                            ? '🥚'
                            : ing.name.toLowerCase().includes('kip') ||
                              ing.name.toLowerCase().includes('vlees') ||
                              ing.name.toLowerCase().includes('gehakt')
                            ? '🥩'
                            : ing.name.toLowerCase().includes('bonen') ||
                              ing.name.toLowerCase().includes('linzen')
                            ? '🫘'
                            : ing.name.toLowerCase().includes('tomaat')
                            ? '🍅'
                            : ing.name.toLowerCase().includes('spinazie') ||
                              ing.name.toLowerCase().includes('groente')
                            ? '🥬'
                            : '📦'}
                        </span>
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
                          'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200',
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
                                'px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border-2',
                                selection.selectedPackage.amount === pkg.amount &&
                                  selection.selectedPackage.label === pkg.label
                                  ? 'bg-sage-600 text-white border-sage-600'
                                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-sage-300'
                              )}
                            >
                              {pkg.label}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-stone-500 italic">
                          Geen package opties beschikbaar - wordt toegevoegd als "{ing.amount}"
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

          {/* Footer */}
          <div className="p-5 border-t border-stone-100 bg-white flex-shrink-0">
            <Button
              onClick={handleConfirm}
              disabled={allItemsAlreadyHave}
              className="w-full btn-primary h-12 text-base"
            >
              {allItemsAlreadyHave
                ? 'Alles al in huis'
                : `Toevoegen (${Object.values(selections).filter((s) => !s.alreadyHave).length} items)`}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

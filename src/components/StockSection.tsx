import { Check, Trash2, Package, ClipboardList, Home, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { PantryItem } from '@/types';

interface StockSectionProps {
  pantryItems: PantryItem[];
  standardItems: Array<{ id: string; name: string; emoji: string; category: string; checked: boolean }>;
  onRemoveFromPantry: (id: string) => void;
  onToggleStandardItem: (id: string) => void;
  onClearPantry: () => void;
  onAddToShoppingList: (item: { id: string; name: string; emoji: string; category: string }) => void;
  getByCategory: () => Record<string, PantryItem[]>;
}

const categoryLabels: Record<string, { label: string; emoji: string; color: string }> = {
  eiwit: { label: 'Eiwit', emoji: '🥩', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  groente: { label: 'Groente', emoji: '🥬', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  pantry: { label: 'Voorraad', emoji: '🥫', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  overig: { label: 'Overig', emoji: '📦', color: 'bg-stone-50 text-stone-700 border-stone-200' },
};

export function StockSection({
  pantryItems,
  standardItems,
  onRemoveFromPantry,
  onToggleStandardItem,
  onClearPantry,
  onAddToShoppingList,
  getByCategory,
}: StockSectionProps) {
  const groupedItems = getByCategory();
  const checkedStandardCount = standardItems.filter((i) => i.checked).length;
  
  // Check if a standard item is currently in pantry
  const isInPantry = (name: string) => {
    return pantryItems.some(p => p.name.toLowerCase() === name.toLowerCase());
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Section 1: In Huis */}
      <div className="rounded-2xl p-5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-emerald-200 flex items-center justify-center">
            <Home className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg text-emerald-900">
              In huis
            </h2>
            <p className="text-sm text-emerald-700">
              {pantryItems.length} items
            </p>
          </div>
        </div>

        {pantryItems.length > 0 && (
          <Button
            variant="outline"
            onClick={onClearPantry}
            className="w-full h-10 rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-100"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Lijst leegmaken
          </Button>
        )}
      </div>

      {/* Pantry Items by Category */}
      {pantryItems.length > 0 ? (
        <div className="space-y-4">
          {Object.entries(groupedItems).map(([category, catItems]) => {
            if (catItems.length === 0) return null;

            const catConfig = categoryLabels[category] || categoryLabels.overig;

            return (
              <div key={category} className="card-premium overflow-hidden">
                <div className={cn('p-4 border-b', catConfig.color)}>
                  <h3 className="font-display font-medium flex items-center gap-2">
                    <span>{catConfig.emoji}</span>
                    <span>{catConfig.label}</span>
                    <span className="text-xs opacity-70">({catItems.length})</span>
                  </h3>
                </div>
                <div className="divide-y divide-stone-100">
                  {catItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-4 hover:bg-stone-50 transition-colors"
                    >
                      <span className="text-xl flex-shrink-0">
                        {item.name.toLowerCase().includes('ei')
                          ? '🥚'
                          : item.name.toLowerCase().includes('kip') ||
                            item.name.toLowerCase().includes('vlees') ||
                            item.name.toLowerCase().includes('gehakt')
                          ? '🥩'
                          : item.name.toLowerCase().includes('bonen') ||
                            item.name.toLowerCase().includes('linzen')
                          ? '🫘'
                          : item.name.toLowerCase().includes('tomaat')
                          ? '🍅'
                          : item.name.toLowerCase().includes('spinazie') ||
                            item.name.toLowerCase().includes('groente')
                          ? '🥬'
                          : '📦'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-stone-700 block font-medium">
                          {item.amount} {item.unit} {item.name}
                        </span>
                        {item.fromRecipes.length > 0 && (
                          <span className="text-xs text-stone-400">
                            Van: {item.fromRecipes.join(', ')}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => onRemoveFromPantry(item.id)}
                        className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-stone-500">
          <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-3">
            <Package className="w-6 h-6 text-stone-400" />
          </div>
          <p className="text-sm font-medium text-stone-700">Nog niets in huis</p>
          <p className="text-xs mt-1">
            Klik op "🏠 Ik heb dit al" in je boodschappenlijst
          </p>
        </div>
      )}

      {/* Section 2: Altijd op voorraad (was: Standaard lijst) */}
      <div className="rounded-2xl p-5 bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 mt-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-amber-200 flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg text-amber-900">
              Altijd op voorraad
            </h2>
            <p className="text-sm text-amber-700">
              {checkedStandardCount} items geselecteerd
            </p>
          </div>
        </div>
        <p className="text-xs text-amber-600">
          Vink aan wat je standaard in huis wilt hebben. Uitgevinkt = direct op je boodschappenlijst.
        </p>
      </div>

      {/* Standard Items */}
      <div className="card-premium overflow-hidden">
        <div className="divide-y divide-stone-100">
          {standardItems.map((item) => {
            const inPantry = isInPantry(item.name);
            const showAddButton = item.checked && !inPantry;
            
            return (
              <div
                key={item.id}
                className={cn(
                  'w-full p-4 flex items-center gap-4 transition-colors',
                  item.checked ? 'bg-sage-50/50' : 'hover:bg-stone-50'
                )}
              >
                <button
                  onClick={() => onToggleStandardItem(item.id)}
                  className={cn(
                    'w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0',
                    item.checked
                      ? 'bg-sage-500 border-sage-500'
                      : 'border-stone-300 hover:border-sage-400'
                  )}
                >
                  {item.checked && <Check className="w-4 h-4 text-white" />}
                </button>
                <span className="text-xl flex-shrink-0">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <span
                    className={cn(
                      'block text-stone-700',
                      !item.checked && 'text-stone-400'
                    )}
                  >
                    {item.name}
                  </span>
                  {item.checked && inPantry && (
                    <span className="text-xs text-emerald-600">In huis</span>
                  )}
                  {item.checked && !inPantry && (
                    <span className="text-xs text-amber-600">Ontbreekt</span>
                  )}
                </div>
                {showAddButton && (
                  <button
                    onClick={() => onAddToShoppingList(item)}
                    className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 text-sm font-medium rounded-full transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Toevoegen
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

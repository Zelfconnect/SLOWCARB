import { Trash2, Package, ClipboardList, Home, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import type { PantryItem } from '@/types';
import { getStockIconInfo } from '@/lib/stockIcons';
import { useTranslation } from '@/i18n';

interface StockSectionProps {
  pantryItems: PantryItem[];
  standardItems: Array<{ id: string; name: string; icon: string; category: string; checked: boolean }>;
  onRemoveFromPantry: (id: string) => void;
  onToggleStandardItem: (id: string) => void;
  onClearPantry: () => void;
  onAddToShoppingList: (item: { id: string; name: string; icon: string; category: string }) => void;
  getByCategory: () => Record<string, PantryItem[]>;
}

const categoryLabels: Record<string, { label: string; iconKey: string; color: string }> = {
  eiwit: { label: 'Eiwit', iconKey: 'beef', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  groente: { label: 'Groente', iconKey: 'salad', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  pantry: { label: 'Voorraad', iconKey: 'package', color: 'bg-stone-50 text-stone-700 border-stone-200' },
  overig: { label: 'Overig', iconKey: 'package', color: 'bg-stone-50 text-stone-700 border-stone-200' },
};

function getIconKeyForName(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes('ei')) return 'egg';
  if (lower.includes('kip')) return 'drumstick';
  if (lower.includes('vlees') || lower.includes('gehakt')) return 'beef';
  if (lower.includes('bonen') || lower.includes('linzen')) return 'bean';
  if (lower.includes('tonijn') || lower.includes('zalm') || lower.includes('vis')) return 'fish';
  if (
    lower.includes('tomaat') ||
    lower.includes('spinazie') ||
    lower.includes('groente') ||
    lower.includes('sla') ||
    lower.includes('broccoli') ||
    lower.includes('ui') ||
    lower.includes('knoflook') ||
    lower.includes('avocado')
  ) {
    return 'salad';
  }
  return 'package';
}

function renderIcon(iconKey: string, ariaLabel: string) {
  const iconInfo = getStockIconInfo(iconKey);
  const Icon = iconInfo.Icon;
  return <Icon className="w-6 h-6 text-stone-600 flex-shrink-0" aria-label={ariaLabel} />;
}

export function StockSection({
  pantryItems,
  standardItems,
  onRemoveFromPantry,
  onToggleStandardItem,
  onClearPantry,
  onAddToShoppingList,
  getByCategory,
}: StockSectionProps) {
  const { t } = useTranslation();
  const groupedItems = getByCategory();
  const checkedStandardCount = standardItems.filter((i) => i.checked).length;
  
  // Check if a standard item is currently in pantry
  const isInPantry = (name: string) => {
    return pantryItems.some(p => p.name.toLowerCase() === name.toLowerCase());
  };

  return (
    <div className="space-y-5">
      {/* Section 1: In Huis */}
      <div className="rounded-2xl p-5 bg-gradient-to-br from-sky-50 to-sky-100/50 border border-sky-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-sky-200 flex items-center justify-center">
            <Home className="w-6 h-6 text-sky-700" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg text-sky-900">
              Voorraadkast
            </h2>
            <p className="text-sm text-sky-700">
              Altijd in huis · {pantryItems.length} items
            </p>
          </div>
        </div>

        {pantryItems.length > 0 && (
          <Button
            variant="outline"
            onClick={onClearPantry}
            className="w-full h-11 rounded-xl border-sky-200 text-sky-700 hover:bg-sky-100"
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
              <Card key={category} className="rounded-2xl py-0 gap-0 overflow-hidden">
                <div className={cn('p-4 border-b', catConfig.color)}>
                  <h3 className="text-base font-semibold flex items-center gap-2">
                    {renderIcon(catConfig.iconKey, catConfig.label)}
                    <span>{catConfig.label}</span>
                    <span className="text-xs opacity-70">({catItems.length})</span>
                  </h3>
                </div>
                <div className="divide-y divide-stone-100">
                  {catItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors"
                    >
                      {renderIcon(getIconKeyForName(item.name), item.name)}
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
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onRemoveFromPantry(item.id)}
                        className="text-stone-400 hover:text-red-500 hover:bg-red-50 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 text-stone-500">
          <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-3">
            <Package className="w-6 h-6 text-stone-400" />
          </div>
          <p className="text-base font-semibold text-stone-600">Nog niets in huis</p>
          <p className="text-sm mt-1 text-stone-500">
            {String(t('app.stockHint'))}
          </p>
        </div>
      )}

      {/* Section 2: Altijd op voorraad (was: Standaard lijst) */}
      <div className="rounded-2xl p-5 bg-gradient-to-br from-stone-50 to-stone-100/50 border border-stone-200 mt-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-stone-200 flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-stone-700" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg text-stone-900">
              Altijd op voorraad
            </h2>
            <p className="text-sm text-stone-700">
              {checkedStandardCount} items geselecteerd
            </p>
          </div>
        </div>
        <p className="text-xs text-stone-600">
          Vink aan wat je standaard in huis wilt hebben. Uitgevinkt = direct op je boodschappenlijst.
        </p>
      </div>

      {/* Standard Items */}
      <Card className="rounded-2xl py-0 gap-0 overflow-hidden">
        <div className="divide-y divide-stone-100">
          {standardItems.map((item) => {
            const inPantry = isInPantry(item.name);
            const showAddButton = item.checked && !inPantry;
            
            return (
              <div
                key={item.id}
                className={cn(
                  'w-full px-4 py-3 flex items-center gap-4 transition-colors',
                  item.checked ? 'bg-sage-50/50' : 'hover:bg-stone-50'
                )}
              >
                <Checkbox
                  checked={item.checked}
                  onCheckedChange={() => onToggleStandardItem(item.id)}
                  className="w-5 h-5 rounded-lg border-2 border-stone-300 data-[state=checked]:bg-sage-500 data-[state=checked]:border-sage-500"
                />
                {renderIcon(item.icon, item.name)}
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
                    <span className="text-xs text-stone-500">Ontbreekt</span>
                  )}
                </div>
                {showAddButton && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onAddToShoppingList(item)}
                    className="rounded-full bg-sage-100 hover:bg-sage-200 text-sage-800"
                  >
                    <Plus className="w-3 h-3" />
                    Toevoegen
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

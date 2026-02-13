import { useState } from 'react';
import {
  Plus,
  Trash2,
  Check,
  X,
  ShoppingCart,
  Home,
  PackagePlus,
  Beef,
  Fish,
  Egg,
  Bean,
  Salad,
  Package,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ShoppingItem } from '@/types';

interface ShoppingListSectionProps {
  items: ShoppingItem[];
  restockSuggestions: Array<{ id: string; name: string; emoji: string; category: string }>;
  onToggleItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onClearChecked: () => void;
  onMoveToPantry: (id: string) => void;
  onMoveCheckedToPantry: () => void;
  onAddFromSuggestion: (item: { id: string; name: string; emoji: string; category: string }) => void;
  onAddCustomItem: (name: string) => void;
  getByCategory: () => Record<string, ShoppingItem[]>;
  getEmojiForIngredient: (name: string) => string;
}

const categoryLabels: Record<string, { label: string; iconKey: string; color: string }> = {
  eiwit: { label: 'Eiwit', iconKey: 'beef', color: 'bg-rose-50/60 text-rose-600 border-rose-100' },
  groente: { label: 'Groente', iconKey: 'salad', color: 'bg-emerald-50/60 text-emerald-600 border-emerald-100' },
  pantry: { label: 'Voorraad', iconKey: 'package', color: 'bg-stone-50/70 text-stone-600 border-stone-100' },
  overig: { label: 'Overig', iconKey: 'package', color: 'bg-stone-50/70 text-stone-600 border-stone-100' },
};

const iconMap: Record<string, { Icon: LucideIcon; label: string }> = {
  '🥩': { Icon: Beef, label: 'Vlees' },
  beef: { Icon: Beef, label: 'Vlees' },
  '🐟': { Icon: Fish, label: 'Vis' },
  fish: { Icon: Fish, label: 'Vis' },
  '🥚': { Icon: Egg, label: 'Eieren' },
  egg: { Icon: Egg, label: 'Eieren' },
  '🫘': { Icon: Bean, label: 'Bonen' },
  bean: { Icon: Bean, label: 'Bonen' },
  '🥦': { Icon: Salad, label: 'Groenten' },
  '🥬': { Icon: Salad, label: 'Groenten' },
  salad: { Icon: Salad, label: 'Groenten' },
  '🥫': { Icon: Package, label: 'Voorraadkast' },
  package: { Icon: Package, label: 'Voorraadkast' },
};

function getIconInfo(value: string) {
  const normalized = value.replace(/[\s-]/g, '').toLowerCase();
  return iconMap[value] || iconMap[normalized] || iconMap.package;
}

function renderIcon(iconKey: string, ariaLabel: string) {
  const iconInfo = getIconInfo(iconKey);
  const Icon = iconInfo.Icon;
  return <Icon className="w-6 h-6 text-stone-600 flex-shrink-0" aria-label={ariaLabel} />;
}

export function ShoppingListSection({
  items,
  restockSuggestions,
  onToggleItem,
  onRemoveItem,
  onClearChecked,
  onMoveToPantry,
  onMoveCheckedToPantry,
  onAddFromSuggestion,
  onAddCustomItem,
  getByCategory,
  getEmojiForIngredient,
}: ShoppingListSectionProps) {
  const [newItem, setNewItem] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const groupedItems = getByCategory();
  const checkedCount = items.filter((i) => i.checked).length;

  const handleAdd = () => {
    if (newItem.trim()) {
      onAddCustomItem(newItem.trim());
      setNewItem('');
      setShowAddForm(false);
    }
  };

  const handleMoveToPantry = (id: string) => {
    onMoveToPantry(id);
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Header Card */}
      <div className="rounded-2xl p-5 bg-gradient-to-br from-sage-50 to-sage-100/50 border border-sage-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-sage-200 flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-sage-700" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg text-sage-900">
              Weekboodschappen
            </h2>
            <p className="text-sm text-sage-700">
              {items.length} items
              {checkedCount > 0 && ` · ${checkedCount} afgevinkt`}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex-1 btn-primary h-11"
          >
            <Plus className="w-4 h-4 mr-2" />
            Toevoegen
          </Button>
        </div>
      </div>

      {/* Add Form - Eigen item toevoegen */}
      {showAddForm && (
        <div className="card-premium p-5 space-y-4">
          <Input
            placeholder="Typ een eigen item..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            autoFocus
            className="input-premium"
          />
          <div className="flex gap-3">
            <Button onClick={handleAdd} className="flex-1 btn-primary h-11">
              Toevoegen
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAddForm(false)}
              className="h-11 rounded-xl border-stone-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Restock Suggestions - Ontbreekt in voorraad */}
      {restockSuggestions.length > 0 && (
        <div className="card-premium overflow-hidden">
          <div className="p-4 bg-stone-50 border-b border-stone-200">
            <h3 className="font-display font-medium text-stone-800 flex items-center gap-2">
              <PackagePlus className="w-4 h-4" />
              Ontbreekt in je voorraad
            </h3>
            <p className="text-xs text-stone-600 mt-1">
              Deze staan op je "altijd op voorraad" lijst maar zijn nu op
            </p>
          </div>
          <div className="divide-y divide-stone-100">
            {restockSuggestions.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-4 hover:bg-stone-50 transition-colors"
              >
                {renderIcon(item.emoji, item.name)}
                <span className="flex-1 text-stone-700">{item.name}</span>
                <button
                  onClick={() => onAddFromSuggestion(item)}
                  className="h-11 px-4 bg-sage-100 hover:bg-sage-200 text-sage-800 text-sm font-medium rounded-full transition-colors"
                >
                  + Toevoegen
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 && restockSuggestions.length === 0 && (
        <div className="text-center py-16 text-stone-500">
          <div className="w-20 h-20 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8 text-stone-400" />
          </div>
          <p className="text-lg font-display font-medium text-stone-700">
            Nog geen weekboodschappen
          </p>
          <p className="text-sm mt-1">
            Voeg items toe vanuit je planning of typ er zelf een bij
          </p>
        </div>
      )}

      {/* Items by Category */}
      <div className="space-y-4">
        {Object.entries(groupedItems).map(([category, catItems]) => {
          const unchecked = catItems.filter((i) => !i.checked);
          if (unchecked.length === 0) return null;

          const catConfig = categoryLabels[category] || categoryLabels.overig;

          return (
            <div key={category} className="card-premium overflow-hidden">
              <div className={cn('p-3 border-b', catConfig.color)}>
                <h3 className="font-display text-sm font-medium flex items-center gap-2">
                  {renderIcon(catConfig.iconKey, catConfig.label)}
                  <span>{catConfig.label}</span>
                  <span className="text-xs opacity-70">({unchecked.length})</span>
                </h3>
              </div>
              <div className="divide-y divide-stone-100">
                {unchecked.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-4 hover:bg-stone-50 transition-colors group"
                  >
                    <button
                      onClick={() => onToggleItem(item.id)}
                      className="min-w-11 min-h-11 -ml-2 flex items-center justify-center flex-shrink-0"
                    >
                      <div className="w-6 h-6 rounded-lg border-2 border-stone-300 flex items-center justify-center hover:border-sage-400 transition-colors" />
                    </button>
                    {renderIcon(getEmojiForIngredient(item.name), item.name)}
                    <div className="flex-1 min-w-0">
                      <span className="text-stone-700 block font-medium">
                        {item.packageLabel || `${item.amount} ${item.unit}`} {item.name}
                      </span>
                      {item.recipeName && (
                        <span className="text-xs text-stone-400">
                          {item.recipeName}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleMoveToPantry(item.id)}
                      className="w-11 h-11 text-stone-400 hover:text-sage-600 hover:bg-sage-50 rounded-lg transition-colors flex-shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 flex items-center justify-center"
                      title="Ik heb dit al"
                    >
                      <Home className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="w-11 h-11 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {checkedCount > 0 && (
          <div className="flex gap-3">
            <Button
              onClick={onMoveCheckedToPantry}
              className="flex-1 btn-secondary h-11"
            >
              <Home className="w-4 h-4 mr-2" />
              Naar voorraad ({checkedCount})
            </Button>
            <Button
              variant="outline"
              onClick={onClearChecked}
              className="h-11 rounded-xl border-stone-200"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Checked Items */}
        {checkedCount > 0 && (
          <div className="card-premium overflow-hidden opacity-60">
            <div className="p-4 bg-stone-50 border-b border-stone-100">
              <h3 className="font-display font-medium text-stone-500">
                Afgevinkt ({checkedCount})
              </h3>
            </div>
            <div className="divide-y divide-stone-100">
              {items
                .filter((i) => i.checked)
                .map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-4">
                    <button
                      onClick={() => onToggleItem(item.id)}
                      className="min-w-11 min-h-11 -ml-2 flex items-center justify-center flex-shrink-0"
                    >
                      <div className="w-6 h-6 rounded-lg bg-sage-500 border-2 border-sage-500 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </button>
                    {renderIcon(getEmojiForIngredient(item.name), item.name)}
                    <span className="flex-1 text-stone-400 line-through">
                      {item.packageLabel || `${item.amount} ${item.unit}`} {item.name}
                    </span>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="w-11 h-11 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

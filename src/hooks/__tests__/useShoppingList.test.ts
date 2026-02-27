import { beforeEach, describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useShoppingList } from '../useShoppingList';

// Helper: a minimal package selection entry
const pkg = (name: string, amount: number) => ({
  ingredient: { name, amount: `${amount} g` },
  selectedPackage: { amount, label: `${amount} g` },
});

beforeEach(() => {
  window.localStorage.clear();
});

// ─── addItemsFromPackage — consolidation ──────────────────────────────────────

describe('addItemsFromPackage – consolidation', () => {
  it('adds a new item when the list is empty', () => {
    const { result } = renderHook(() => useShoppingList());
    act(() => {
      result.current.addItemsFromPackage('Recept A', [pkg('kipfilet', 500)]);
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].name).toBe('kipfilet');
    expect(result.current.items[0].amount).toBe(500);
  });

  it('consolidates the same ingredient from two different recipes into one entry', () => {
    const { result } = renderHook(() => useShoppingList());

    act(() => {
      result.current.addItemsFromPackage('Recept A', [pkg('kipfilet', 500)]);
    });
    act(() => {
      result.current.addItemsFromPackage('Recept B', [pkg('kipfilet', 500)]);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].amount).toBe(1000);
    expect(result.current.items[0].recipeName).toBe('Recept A + Recept B');
  });

  it('does not duplicate the recipe name when the same recipe is added twice', () => {
    const { result } = renderHook(() => useShoppingList());

    act(() => result.current.addItemsFromPackage('Recept A', [pkg('kipfilet', 500)]));
    act(() => result.current.addItemsFromPackage('Recept A', [pkg('kipfilet', 500)]));

    expect(result.current.items[0].recipeName).toBe('Recept A');
  });

  it('keeps distinct ingredients as separate entries', () => {
    const { result } = renderHook(() => useShoppingList());

    act(() => {
      result.current.addItemsFromPackage('Recept A', [
        pkg('kipfilet', 500),
        pkg('broccoli', 300),
      ]);
    });

    expect(result.current.items).toHaveLength(2);
  });

  it('matching is case-insensitive', () => {
    const { result } = renderHook(() => useShoppingList());

    act(() => result.current.addItemsFromPackage('Recept A', [pkg('kipfilet', 500)]));
    act(() => result.current.addItemsFromPackage('Recept B', [pkg('Kipfilet', 500)]));

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].amount).toBe(1000);
  });

  it('does NOT consolidate a checked item — adds a new entry instead', () => {
    const { result } = renderHook(() => useShoppingList());

    act(() => result.current.addItemsFromPackage('Recept A', [pkg('kipfilet', 500)]));

    // Mark the item as checked (bought)
    act(() => result.current.toggleItem(result.current.items[0].id));

    // Adding the same ingredient again while the first entry is checked
    act(() => result.current.addItemsFromPackage('Recept B', [pkg('kipfilet', 500)]));

    expect(result.current.items).toHaveLength(2);
  });
});

// ─── addCustomItem ────────────────────────────────────────────────────────────

describe('addCustomItem', () => {
  it('adds an item to the list', () => {
    const { result } = renderHook(() => useShoppingList());
    act(() => result.current.addCustomItem('melk'));
    expect(result.current.items.some((i: any) => i.name === 'melk')).toBe(true);
  });

  it('does not duplicate an already-present unchecked item', () => {
    const { result } = renderHook(() => useShoppingList());
    act(() => result.current.addCustomItem('melk'));
    act(() => result.current.addCustomItem('melk'));
    const melkItems = result.current.items.filter((i: any) => i.name === 'melk');
    expect(melkItems).toHaveLength(1);
  });

  it('sets recipeName to "Eigen item"', () => {
    const { result } = renderHook(() => useShoppingList());
    act(() => result.current.addCustomItem('melk'));
    expect(result.current.items[0].recipeName).toBe('Eigen item');
  });
});

// ─── toggleItem & clearChecked ────────────────────────────────────────────────

describe('toggleItem', () => {
  it('marks an unchecked item as checked', () => {
    const { result } = renderHook(() => useShoppingList());
    act(() => result.current.addCustomItem('melk'));
    const id = result.current.items[0].id;
    act(() => result.current.toggleItem(id));
    expect(result.current.items[0].checked).toBe(true);
  });

  it('marks a checked item as unchecked', () => {
    const { result } = renderHook(() => useShoppingList());
    act(() => result.current.addCustomItem('melk'));
    const id = result.current.items[0].id;
    act(() => result.current.toggleItem(id));
    act(() => result.current.toggleItem(id));
    expect(result.current.items[0].checked).toBe(false);
  });
});

describe('clearChecked', () => {
  it('removes only checked items', () => {
    const { result } = renderHook(() => useShoppingList());
    act(() => result.current.addCustomItem('melk'));
    act(() => result.current.addCustomItem('eieren'));
    const milkId = result.current.items.find((i: any) => i.name === 'melk')!.id;
    act(() => result.current.toggleItem(milkId));

    act(() => result.current.clearChecked());

    expect(result.current.items.some((i: any) => i.name === 'melk')).toBe(false);
    expect(result.current.items.some((i: any) => i.name === 'eieren')).toBe(true);
  });
});

// ─── getByCategory ────────────────────────────────────────────────────────────

describe('getByCategory', () => {
  it('returns an object with the four standard categories', () => {
    const { result } = renderHook(() => useShoppingList());
    const grouped = result.current.getByCategory();
    expect(grouped).toHaveProperty('eiwit');
    expect(grouped).toHaveProperty('groente');
    expect(grouped).toHaveProperty('pantry');
    expect(grouped).toHaveProperty('overig');
  });

  it('excludes checked items from all categories', () => {
    const { result } = renderHook(() => useShoppingList());
    act(() => result.current.addCustomItem('melk'));
    const id = result.current.items[0].id;
    act(() => result.current.toggleItem(id));

    const grouped = result.current.getByCategory();
    const allGrouped = Object.values(grouped).flat();
    expect(allGrouped).toHaveLength(0);
  });

  it('places a protein ingredient in the eiwit category', () => {
    const { result } = renderHook(() => useShoppingList());
    act(() => {
      result.current.addItemsFromPackage('Recept A', [pkg('kipfilet', 500)]);
    });
    const grouped = result.current.getByCategory();
    expect(grouped.eiwit.some((i: any) => i.name === 'kipfilet')).toBe(true);
  });
});

// ─── getTotalCount ────────────────────────────────────────────────────────────

describe('getTotalCount', () => {
  it('counts only unchecked items', () => {
    const { result } = renderHook(() => useShoppingList());
    act(() => result.current.addCustomItem('melk'));
    act(() => result.current.addCustomItem('eieren'));
    const milkId = result.current.items.find((i: any) => i.name === 'melk')!.id;
    act(() => result.current.toggleItem(milkId));

    expect(result.current.getTotalCount()).toBe(1);
  });
});

// ─── removeItem ───────────────────────────────────────────────────────────────

describe('removeItem', () => {
  it('removes the item with the given id', () => {
    const { result } = renderHook(() => useShoppingList());
    act(() => result.current.addCustomItem('melk'));
    const id = result.current.items[0].id;
    act(() => result.current.removeItem(id));
    expect(result.current.items).toHaveLength(0);
  });

  it('leaves other items untouched', () => {
    const { result } = renderHook(() => useShoppingList());
    act(() => result.current.addCustomItem('melk'));
    act(() => result.current.addCustomItem('eieren'));
    const milkId = result.current.items.find((i: any) => i.name === 'melk')!.id;
    act(() => result.current.removeItem(milkId));
    expect(result.current.items.some((i: any) => i.name === 'eieren')).toBe(true);
  });
});

describe('addFromSuggestion', () => {
  it('adds a suggestion as a shopping item', () => {
    const { result } = renderHook(() => useShoppingList());

    act(() => {
      result.current.addFromSuggestion({
        id: 'eieren',
        name: 'Eieren',
        icon: 'egg',
        category: 'eiwit',
      });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].name).toBe('Eieren');
    expect(result.current.items[0].recipeName).toBe('Van voorraad');
  });

  it('does not add duplicate unchecked suggestion', () => {
    const { result } = renderHook(() => useShoppingList());

    act(() => {
      result.current.addFromSuggestion({
        id: 'eieren',
        name: 'Eieren',
        icon: 'egg',
        category: 'eiwit',
      });
      result.current.addFromSuggestion({
        id: 'eieren',
        name: 'eieren',
        icon: 'egg',
        category: 'eiwit',
      });
    });

    expect(result.current.items).toHaveLength(1);
  });
});

describe('moveToPantry', () => {
  it('returns pantry item and removes the shopping item', () => {
    const { result } = renderHook(() => useShoppingList());

    act(() => {
      result.current.addCustomItem('eieren');
    });

    const shoppingItemId = result.current.items[0].id;
    let pantryItem = null;
    act(() => {
      pantryItem = result.current.moveToPantry(shoppingItemId);
    });

    expect(pantryItem?.name).toBe('eieren');
    expect(result.current.items).toHaveLength(0);
  });

  it('returns null when item id does not exist', () => {
    const { result } = renderHook(() => useShoppingList());
    let pantryItem = null;
    act(() => {
      pantryItem = result.current.moveToPantry('missing-id');
    });
    expect(pantryItem).toBeNull();
  });
});

describe('getCheckedItems', () => {
  it('returns only checked items', () => {
    const { result } = renderHook(() => useShoppingList());

    act(() => {
      result.current.addCustomItem('melk');
      result.current.addCustomItem('eieren');
    });

    const milkId = result.current.items.find((item) => item.name === 'melk')!.id;
    act(() => {
      result.current.toggleItem(milkId);
    });

    const checkedItems = result.current.getCheckedItems();
    expect(checkedItems).toHaveLength(1);
    expect(checkedItems[0].name).toBe('melk');
  });
});

describe('unit-aware consolidation', () => {
  it('keeps items separate when units differ', () => {
    window.localStorage.setItem(
      'slowcarb-shopping-v2',
      JSON.stringify([
        {
          id: 'legacy-item',
          name: 'kipfilet',
          category: 'eiwit',
          checked: false,
          recipeName: 'Legacy lijst',
          amount: 1,
          unit: 'stuks',
          packageLabel: '1 stuk',
          addedAt: new Date().toISOString(),
        },
      ])
    );

    const { result } = renderHook(() => useShoppingList());

    act(() => {
      result.current.addItemsFromPackage('Recept A', [pkg('kipfilet', 500)]);
    });

    expect(result.current.items).toHaveLength(2);
  });
});

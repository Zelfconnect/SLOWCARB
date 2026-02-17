import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useShoppingList } from '../useShoppingList';

// Helper: a minimal package selection entry
const pkg = (name: string, amount: number) => ({
  ingredient: { name, amount: `${amount} g` },
  selectedPackage: { amount, label: `${amount} g` },
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
    expect(result.current.items.some((i) => i.name === 'melk')).toBe(true);
  });

  it('does not duplicate an already-present unchecked item', () => {
    const { result } = renderHook(() => useShoppingList());
    act(() => result.current.addCustomItem('melk'));
    act(() => result.current.addCustomItem('melk'));
    const melkItems = result.current.items.filter((i) => i.name === 'melk');
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
    const milkId = result.current.items.find((i) => i.name === 'melk')!.id;
    act(() => result.current.toggleItem(milkId));

    act(() => result.current.clearChecked());

    expect(result.current.items.some((i) => i.name === 'melk')).toBe(false);
    expect(result.current.items.some((i) => i.name === 'eieren')).toBe(true);
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
    expect(grouped.eiwit.some((i) => i.name === 'kipfilet')).toBe(true);
  });
});

// ─── getTotalCount ────────────────────────────────────────────────────────────

describe('getTotalCount', () => {
  it('counts only unchecked items', () => {
    const { result } = renderHook(() => useShoppingList());
    act(() => result.current.addCustomItem('melk'));
    act(() => result.current.addCustomItem('eieren'));
    const milkId = result.current.items.find((i) => i.name === 'melk')!.id;
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
    const milkId = result.current.items.find((i) => i.name === 'melk')!.id;
    act(() => result.current.removeItem(milkId));
    expect(result.current.items.some((i) => i.name === 'eieren')).toBe(true);
  });
});

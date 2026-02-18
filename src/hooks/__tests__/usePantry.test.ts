import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { usePantry } from '../usePantry';
import type { PantryItem } from '@/types';

const makePantryItem = (overrides: Partial<PantryItem> = {}): PantryItem => ({
  id: `item-${Math.random()}`,
  name: 'kipfilet',
  category: 'eiwit',
  amount: 500,
  unit: 'g',
  addedAt: '2024-01-01T00:00:00.000Z',
  fromRecipes: ['Recept A'],
  ...overrides,
});

// ─── addToPantry ──────────────────────────────────────────────────────────────

describe('addToPantry', () => {
  it('adds a new item when the pantry is empty', () => {
    const { result } = renderHook(() => usePantry());
    act(() => result.current.addToPantry(makePantryItem()));
    expect(result.current.pantryItems).toHaveLength(1);
  });

  it('merges amounts when the same item (same name) is added twice', () => {
    const { result } = renderHook(() => usePantry());
    act(() => result.current.addToPantry(makePantryItem({ name: 'kipfilet', amount: 500 })));
    act(() => result.current.addToPantry(makePantryItem({ name: 'kipfilet', amount: 300 })));
    expect(result.current.pantryItems).toHaveLength(1);
    expect(result.current.pantryItems[0].amount).toBe(800);
  });

  it('merges fromRecipes without duplicates when the same item comes from a new recipe', () => {
    const { result } = renderHook(() => usePantry());
    act(() => result.current.addToPantry(makePantryItem({ name: 'kipfilet', fromRecipes: ['Recept A'] })));
    act(() => result.current.addToPantry(makePantryItem({ name: 'kipfilet', fromRecipes: ['Recept B'] })));
    expect(result.current.pantryItems[0].fromRecipes).toEqual(['Recept A', 'Recept B']);
  });

  it('does not duplicate a recipe name in fromRecipes if added twice', () => {
    const { result } = renderHook(() => usePantry());
    act(() => result.current.addToPantry(makePantryItem({ name: 'kipfilet', fromRecipes: ['Recept A'] })));
    act(() => result.current.addToPantry(makePantryItem({ name: 'kipfilet', fromRecipes: ['Recept A'] })));
    expect(result.current.pantryItems[0].fromRecipes).toEqual(['Recept A']);
  });

  it('name matching is case-insensitive', () => {
    const { result } = renderHook(() => usePantry());
    act(() => result.current.addToPantry(makePantryItem({ name: 'kipfilet', amount: 500 })));
    act(() => result.current.addToPantry(makePantryItem({ name: 'Kipfilet', amount: 200 })));
    expect(result.current.pantryItems).toHaveLength(1);
    expect(result.current.pantryItems[0].amount).toBe(700);
  });

  it('keeps distinct items as separate entries', () => {
    const { result } = renderHook(() => usePantry());
    act(() => result.current.addToPantry(makePantryItem({ name: 'kipfilet' })));
    act(() => result.current.addToPantry(makePantryItem({ name: 'broccoli', category: 'groente' })));
    expect(result.current.pantryItems).toHaveLength(2);
  });
});

// ─── removeFromPantry ─────────────────────────────────────────────────────────

describe('removeFromPantry', () => {
  it('removes the item with the matching id', () => {
    const { result } = renderHook(() => usePantry());
    const item = makePantryItem({ id: 'fixed-id' });
    act(() => result.current.addToPantry(item));
    act(() => result.current.removeFromPantry('fixed-id'));
    expect(result.current.pantryItems).toHaveLength(0);
  });

  it('leaves other items untouched', () => {
    const { result } = renderHook(() => usePantry());
    act(() => result.current.addToPantry(makePantryItem({ id: 'keep', name: 'broccoli' })));
    act(() => result.current.addToPantry(makePantryItem({ id: 'remove', name: 'kipfilet' })));
    act(() => result.current.removeFromPantry('remove'));
    expect(result.current.pantryItems).toHaveLength(1);
    expect(result.current.pantryItems[0].name).toBe('broccoli');
  });
});

// ─── clearPantry ─────────────────────────────────────────────────────────────

describe('clearPantry', () => {
  it('removes all pantry items', () => {
    const { result } = renderHook(() => usePantry());
    act(() => result.current.addToPantry(makePantryItem({ name: 'kipfilet' })));
    act(() => result.current.addToPantry(makePantryItem({ name: 'broccoli' })));
    act(() => result.current.clearPantry());
    expect(result.current.pantryItems).toHaveLength(0);
  });
});

// ─── getByCategory ────────────────────────────────────────────────────────────

describe('getByCategory', () => {
  it('returns the four standard category buckets', () => {
    const { result } = renderHook(() => usePantry());
    const grouped = result.current.getByCategory();
    expect(grouped).toHaveProperty('eiwit');
    expect(grouped).toHaveProperty('groente');
    expect(grouped).toHaveProperty('pantry');
    expect(grouped).toHaveProperty('overig');
  });

  it('places an eiwit item in the eiwit bucket', () => {
    const { result } = renderHook(() => usePantry());
    act(() => result.current.addToPantry(makePantryItem({ name: 'kipfilet', category: 'eiwit' })));
    expect(result.current.getByCategory().eiwit).toHaveLength(1);
  });

  it('places a groente item in the groente bucket', () => {
    const { result } = renderHook(() => usePantry());
    act(() =>
      result.current.addToPantry(makePantryItem({ name: 'broccoli', category: 'groente' })),
    );
    expect(result.current.getByCategory().groente).toHaveLength(1);
  });

  it('falls back to overig for an unknown category', () => {
    const { result } = renderHook(() => usePantry());
    act(() =>
      result.current.addToPantry(
        // @ts-expect-error — deliberate invalid category to test fallback
        makePantryItem({ name: 'iets-raars', category: 'onbekend' }),
      ),
    );
    expect(result.current.getByCategory().overig).toHaveLength(1);
  });
});

// ─── getTotalCount ────────────────────────────────────────────────────────────

describe('getTotalCount', () => {
  it('returns 0 for an empty pantry', () => {
    const { result } = renderHook(() => usePantry());
    expect(result.current.getTotalCount()).toBe(0);
  });

  it('counts all pantry items', () => {
    const { result } = renderHook(() => usePantry());
    act(() => result.current.addToPantry(makePantryItem({ name: 'kipfilet' })));
    act(() => result.current.addToPantry(makePantryItem({ name: 'broccoli' })));
    expect(result.current.getTotalCount()).toBe(2);
  });
});

// ─── getRestockSuggestions ───────────────────────────────────────────────────

describe('getRestockSuggestions', () => {
  it('returns no suggestions when no standard items are checked', () => {
    const { result } = renderHook(() => usePantry());
    expect(result.current.getRestockSuggestions()).toHaveLength(0);
  });

  it('suggests a checked standard item that is not in the pantry', () => {
    const { result } = renderHook(() => usePantry());
    // Get the list of standard items and toggle the first one
    const standardItems = result.current.getStandardItems();
    expect(standardItems.length).toBeGreaterThan(0);
    const firstItem = standardItems[0];

    act(() => result.current.toggleStandardItem(firstItem.id));

    const suggestions = result.current.getRestockSuggestions();
    expect(suggestions.some((s) => s.id === firstItem.id)).toBe(true);
  });

  it('does not suggest a checked standard item that is already in the pantry', () => {
    const { result } = renderHook(() => usePantry());
    const standardItems = result.current.getStandardItems();
    const firstItem = standardItems[0];

    act(() => result.current.toggleStandardItem(firstItem.id));
    // Add that item to the pantry
    act(() =>
      result.current.addToPantry(
        makePantryItem({ name: firstItem.name, category: 'pantry' }),
      ),
    );

    const suggestions = result.current.getRestockSuggestions();
    expect(suggestions.some((s) => s.id === firstItem.id)).toBe(false);
  });

  it('unchecking a standard item removes it from suggestions', () => {
    const { result } = renderHook(() => usePantry());
    const firstItem = result.current.getStandardItems()[0];

    act(() => result.current.toggleStandardItem(firstItem.id)); // check
    act(() => result.current.toggleStandardItem(firstItem.id)); // uncheck

    expect(result.current.getRestockSuggestions()).toHaveLength(0);
  });
});

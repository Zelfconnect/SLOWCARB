import { beforeEach, describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { usePantry } from '../usePantry';

describe('usePantry', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('adds a new pantry item', () => {
    const { result } = renderHook(() => usePantry());

    act(() => {
      result.current.addToPantry({
        id: 'item-1',
        name: 'Kipfilet',
        category: 'eiwit',
        amount: 500,
        unit: 'gram',
        addedAt: new Date().toISOString(),
        fromRecipes: ['Recept A'],
      });
    });

    expect(result.current.pantryItems).toHaveLength(1);
    expect(result.current.pantryItems[0].name).toBe('Kipfilet');
  });

  it('merges duplicate items case-insensitively and combines recipes', () => {
    const { result } = renderHook(() => usePantry());

    act(() => {
      result.current.addToPantry({
        id: 'item-1',
        name: 'Kipfilet',
        category: 'eiwit',
        amount: 500,
        unit: 'gram',
        addedAt: new Date().toISOString(),
        fromRecipes: ['Recept A'],
      });
    });

    act(() => {
      result.current.addToPantry({
        id: 'item-2',
        name: 'kipfilet',
        category: 'eiwit',
        amount: 300,
        unit: 'gram',
        addedAt: new Date().toISOString(),
        fromRecipes: ['Recept B', 'Recept A'],
      });
    });

    expect(result.current.pantryItems).toHaveLength(1);
    expect(result.current.pantryItems[0].amount).toBe(800);
    expect(result.current.pantryItems[0].fromRecipes).toEqual(['Recept A', 'Recept B']);
  });

  it('returns restock suggestions for checked standard items not in pantry', () => {
    const { result } = renderHook(() => usePantry());

    act(() => {
      result.current.toggleStandardItem('eieren');
    });

    expect(result.current.getRestockSuggestions().some((item) => item.id === 'eieren')).toBe(true);
  });

  it('removes restock suggestion when item exists in pantry', () => {
    const { result } = renderHook(() => usePantry());

    act(() => {
      result.current.toggleStandardItem('eieren');
      result.current.addToPantry({
        id: 'item-1',
        name: 'Eieren',
        category: 'eiwit',
        amount: 10,
        unit: 'stuks',
        addedAt: new Date().toISOString(),
        fromRecipes: ['Recept A'],
      });
    });

    expect(result.current.getRestockSuggestions().some((item) => item.id === 'eieren')).toBe(false);
  });

  it('groups pantry items by category', () => {
    const { result } = renderHook(() => usePantry());

    act(() => {
      result.current.addToPantry({
        id: 'item-1',
        name: 'Kipfilet',
        category: 'eiwit',
        amount: 500,
        unit: 'gram',
        addedAt: new Date().toISOString(),
        fromRecipes: ['Recept A'],
      });
      result.current.addToPantry({
        id: 'item-2',
        name: 'Broccoli',
        category: 'groente',
        amount: 1,
        unit: 'stuks',
        addedAt: new Date().toISOString(),
        fromRecipes: ['Recept B'],
      });
    });

    const groupedItems = result.current.getByCategory();
    expect(groupedItems.eiwit).toHaveLength(1);
    expect(groupedItems.groente).toHaveLength(1);
    expect(groupedItems.pantry).toHaveLength(0);
  });
});

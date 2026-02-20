import { beforeEach, describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { usePantry } from '../usePantry';
import { useShoppingList } from '../useShoppingList';

describe('shopping and pantry integration flow', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('handles recipe to shopping to pantry and restock cycle', () => {
    const { result: shoppingResult } = renderHook(() => useShoppingList());
    const { result: pantryResult } = renderHook(() => usePantry());

    act(() => {
      shoppingResult.current.addItemsFromPackage('Mega Chili', [
        {
          ingredient: { name: 'kipfilet', amount: '400 g' },
          selectedPackage: { amount: 500, label: '500g' },
        },
      ]);
    });

    expect(shoppingResult.current.items.some((item) => item.name === 'kipfilet')).toBe(true);

    act(() => {
      pantryResult.current.toggleStandardItem('eieren');
    });

    const initialSuggestions = pantryResult.current.getRestockSuggestions();
    expect(initialSuggestions.some((suggestion) => suggestion.id === 'eieren')).toBe(true);

    act(() => {
      shoppingResult.current.addFromSuggestion(
        initialSuggestions.find((suggestion) => suggestion.id === 'eieren')!
      );
    });

    const eggItemId = shoppingResult.current.items.find((item) => item.name.toLowerCase() === 'eieren')!.id;
    const chickenItemId = shoppingResult.current.items.find((item) => item.name === 'kipfilet')!.id;

    act(() => {
      const movedChicken = shoppingResult.current.moveToPantry(chickenItemId);
      if (movedChicken) {
        pantryResult.current.addToPantry(movedChicken);
      }

      const movedEggs = shoppingResult.current.moveToPantry(eggItemId);
      if (movedEggs) {
        pantryResult.current.addToPantry(movedEggs);
      }
    });

    expect(shoppingResult.current.items).toHaveLength(0);
    expect(pantryResult.current.pantryItems.some((item) => item.name.toLowerCase() === 'kipfilet')).toBe(true);
    expect(pantryResult.current.pantryItems.some((item) => item.name.toLowerCase() === 'eieren')).toBe(true);
    expect(pantryResult.current.getRestockSuggestions().some((suggestion) => suggestion.id === 'eieren')).toBe(
      false
    );
  });
});

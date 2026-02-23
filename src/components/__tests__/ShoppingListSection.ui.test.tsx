import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ShoppingListSection } from '@/components/ShoppingListSection';
import type { ShoppingItem } from '@/types';

function createItem(overrides: Partial<ShoppingItem> = {}): ShoppingItem {
  return {
    id: 'item-1',
    name: 'kipfilet',
    category: 'eiwit',
    checked: false,
    amount: 1,
    unit: 'stuks',
    addedAt: '2026-02-20T08:00:00.000Z',
    ...overrides,
  };
}

function renderSection({
  items = [],
  restockSuggestions = [],
}: {
  items?: ShoppingItem[];
  restockSuggestions?: Array<{ id: string; name: string; icon: string; category: string }>;
} = {}) {
  const onToggleItem = vi.fn();
  const onRemoveItem = vi.fn();
  const onClearChecked = vi.fn();
  const onMoveToPantry = vi.fn();
  const onMoveCheckedToPantry = vi.fn();
  const onAddFromSuggestion = vi.fn();
  const onAddCustomItem = vi.fn();

  const groupedItems = items.reduce<Record<string, ShoppingItem[]>>((accumulator, item) => {
    const current = accumulator[item.category] ?? [];
    return { ...accumulator, [item.category]: [...current, item] };
  }, {});

  render(
    <ShoppingListSection
      items={items}
      restockSuggestions={restockSuggestions}
      onToggleItem={onToggleItem}
      onRemoveItem={onRemoveItem}
      onClearChecked={onClearChecked}
      onMoveToPantry={onMoveToPantry}
      onMoveCheckedToPantry={onMoveCheckedToPantry}
      onAddFromSuggestion={onAddFromSuggestion}
      onAddCustomItem={onAddCustomItem}
      getByCategory={() => groupedItems}
      getIconKeyForIngredient={() => 'beef'}
    />
  );

  return {
    onToggleItem,
    onRemoveItem,
    onClearChecked,
    onMoveToPantry,
    onMoveCheckedToPantry,
    onAddFromSuggestion,
    onAddCustomItem,
  };
}

describe('ShoppingListSection UI/UX', () => {
  it('shows empty state when no items and no suggestions exist', () => {
    renderSection();
    expect(screen.getByText('Nog geen weekboodschappen')).toBeInTheDocument();
  });

  it('opens add form and adds custom item via enter key', () => {
    const { onAddCustomItem } = renderSection();

    fireEvent.click(screen.getByRole('button', { name: /Toevoegen/i }));
    const input = screen.getByPlaceholderText('Typ een eigen item...');
    fireEvent.change(input, { target: { value: 'komkommer' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onAddCustomItem).toHaveBeenCalledWith('komkommer');
  });

  it('renders restock suggestions and triggers add callback', () => {
    const { onAddFromSuggestion } = renderSection({
      restockSuggestions: [{ id: 'r1', name: 'Eieren', icon: 'egg', category: 'eiwit' }],
    });

    expect(screen.getByText('Ontbreekt in je voorraad')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '+ Toevoegen' }));
    expect(onAddFromSuggestion).toHaveBeenCalledWith({
      id: 'r1',
      name: 'Eieren',
      icon: 'egg',
      category: 'eiwit',
    });
  });

  it('renders category list and fires item action callbacks', () => {
    const item = createItem({ id: 'item-99', name: 'kip', recipeName: 'Kip salade' });
    const { onToggleItem, onMoveToPantry, onRemoveItem } = renderSection({ items: [item] });

    expect(screen.getByText('Eiwit')).toBeInTheDocument();
    expect(screen.getByText(/1 stuks/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Verplaats naar voorraad').className).toContain('w-11');

    fireEvent.click(screen.getByLabelText('Verplaats naar voorraad'));
    expect(onMoveToPantry).toHaveBeenCalledWith('item-99');

    const removeButton = screen.getAllByRole('button').find((button) =>
      button.className.includes('hover:text-red-500')
    );
    expect(removeButton).toBeDefined();
    fireEvent.click(removeButton as HTMLButtonElement);
    expect(onRemoveItem).toHaveBeenCalledWith('item-99');

    const toggleButton = screen.getAllByRole('button').find((button) =>
      button.className.includes('min-h-11')
    );
    expect(toggleButton).toBeDefined();
    fireEvent.click(toggleButton as HTMLButtonElement);
    expect(onToggleItem).toHaveBeenCalledWith('item-99');
  });

  it('shows checked section and footer actions for checked items', () => {
    const checkedItem = createItem({ id: 'done-1', checked: true });
    const { onMoveCheckedToPantry, onClearChecked } = renderSection({ items: [checkedItem] });

    expect(screen.getByText('Afgevinkt (1)')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Naar voorraad (1)' }));
    expect(onMoveCheckedToPantry).toHaveBeenCalledTimes(1);

    const clearButton = screen.getAllByRole('button').find((button) =>
      button.className.includes('border-stone-200')
    );
    expect(clearButton).toBeDefined();
    fireEvent.click(clearButton as HTMLButtonElement);
    expect(onClearChecked).toHaveBeenCalledTimes(1);
  });
});

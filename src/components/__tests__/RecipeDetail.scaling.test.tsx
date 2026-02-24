import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RecipeDetail } from '@/components/RecipeDetail';
import type { Recipe } from '@/types';

const recipe: Recipe = {
  id: 'fraction-recipe',
  name: 'Fraction Test',
  category: 'diner',
  icon: 'egg',
  prepTime: '10 min',
  cookTime: '20 min',
  servings: 1,
  ingredients: [
    { name: 'citroen', amount: '1/2 stuk', scalable: true },
    { name: 'zout', amount: 'naar smaak', scalable: false },
  ],
  steps: ['Mix alles.'],
  tags: ['eiwit'],
};

describe('RecipeDetail amount scaling', () => {
  it('formats scaled values as clean fractions and mixed numbers', () => {
    const onAddToShoppingList = vi.fn();

    render(
      <RecipeDetail
        recipe={{
          ...recipe,
          ingredients: [
            { name: 'citroen', amount: '1/2 stuk', scalable: true },
            { name: 'avocado', amount: '1/4 stuk', scalable: true },
            { name: 'tomaat', amount: '3/4 stuk', scalable: true },
            { name: 'komkommer', amount: '1.5 stuk', scalable: true },
            { name: 'paprika', amount: '1.0 stuk', scalable: true },
            { name: 'zout', amount: 'naar smaak', scalable: false },
          ],
        }}
        isOpen
        onClose={vi.fn()}
        isFavorite={false}
        onToggleFavorite={vi.fn()}
        onAddToShoppingList={onAddToShoppingList}
      />
    );

    expect(screen.getByText('1/2 stuk', { selector: 'span.font-medium' })).toBeInTheDocument();
    expect(screen.getByText('1/4 stuk', { selector: 'span.font-medium' })).toBeInTheDocument();
    expect(screen.getByText('3/4 stuk', { selector: 'span.font-medium' })).toBeInTheDocument();
    expect(screen.getByText('1 1/2 stuk', { selector: 'span.font-medium' })).toBeInTheDocument();
    expect(screen.getByText('1 stuk', { selector: 'span.font-medium' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Voeg toe aan boodschappenlijst/i }));
    expect(onAddToShoppingList).toHaveBeenCalledWith(
      expect.arrayContaining([
        '1/2 stuk citroen',
        '1/4 stuk avocado',
        '3/4 stuk tomaat',
        '1 1/2 stuk komkommer',
        '1 stuk paprika',
        'naar smaak zout',
      ])
    );
  });
});

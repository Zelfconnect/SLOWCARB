import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CompactRecipeCard } from '@/components/CompactRecipeCard';
import type { Recipe } from '@/types';

function createRecipe(overrides: Partial<Recipe> = {}): Recipe {
  return {
    id: 'kip-bowl',
    name: 'Kip Bowl',
    category: 'meal-prep',
    icon: 'egg',
    prepTime: '10 min',
    cookTime: '20 min',
    servings: 2,
    ingredients: [{ name: 'kip', amount: '300g', scalable: true }],
    steps: ['Bak de kip.'],
    tags: ['lunch'],
    subtitle: 'Meal prep favoriet',
    difficulty: 'medium',
    macros: { protein: 30, carbs: 12, fat: 8 },
    ...overrides,
  };
}

describe('CompactRecipeCard UI/UX', () => {
  it('renders key recipe metadata and mapped difficulty label', () => {
    render(
      <CompactRecipeCard
        recipe={createRecipe()}
        isFavorite={false}
        onToggleFavorite={vi.fn()}
        onClick={vi.fn()}
      />
    );

    expect(screen.getByText('Kip Bowl')).toBeInTheDocument();
    expect(screen.getByText('Meal prep favoriet')).toBeInTheDocument();
    expect(screen.getByText('10 min')).toBeInTheDocument();
    expect(screen.getByText('2p')).toBeInTheDocument();
    expect(screen.getByText('Gemiddeld')).toBeInTheDocument();
    expect(screen.getByText('30g eiwit')).toBeInTheDocument();
  });

  it('triggers card click and favorite toggle callbacks', () => {
    const onCardClick = vi.fn();
    const onToggleFavorite = vi.fn();

    render(
      <CompactRecipeCard
        recipe={createRecipe()}
        isFavorite={false}
        onToggleFavorite={onToggleFavorite}
        onClick={onCardClick}
      />
    );

    fireEvent.click(screen.getByText('Kip Bowl'));
    fireEvent.click(screen.getByRole('button'));

    expect(onCardClick).toHaveBeenCalledTimes(2);
    expect(onToggleFavorite).toHaveBeenCalledTimes(1);
  });

  it('keeps premium card and favorite visual contracts', () => {
    render(
      <CompactRecipeCard
        recipe={createRecipe()}
        isFavorite
        onToggleFavorite={vi.fn()}
        onClick={vi.fn()}
      />
    );

    const titleElement = screen.getByText('Kip Bowl');
    const rootCard = titleElement.closest('div[class*="card-website"]');
    expect(rootCard).toBeInTheDocument();
    expect(rootCard?.className).toContain('shadow-[0_6px_18px_rgba(47,94,63,0.08)]');

    const favoriteIcon = document.querySelector('svg.fill-current');
    expect(favoriteIcon).toBeInTheDocument();
  });
});

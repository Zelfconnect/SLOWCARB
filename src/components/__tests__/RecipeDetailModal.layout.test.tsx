import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RecipeDetailModal } from '@/components/RecipeDetailModal';
import type { Recipe } from '@/types';

function createRecipe(overrides: Partial<Recipe> = {}): Recipe {
  return {
    id: 'tofu-scramble',
    name: 'Tofu Scramble',
    category: 'ontbijt',
    icon: 'egg',
    prepTime: '4 min',
    cookTime: '12 min',
    servings: 1,
    ingredients: [
      { name: 'tofu', amount: '150g', scalable: true },
      { name: 'zwarte bonen', amount: '100g', scalable: true },
    ],
    steps: ['Verkruimel tofu en bak aan met kurkuma.', 'Voeg bonen en spinazie toe.'],
    tags: ['eiwit'],
    ...overrides,
  };
}

describe('RecipeDetailModal layout', () => {
  it('renders a full-bleed style detail viewport with hero and metadata', () => {
    render(
      <RecipeDetailModal
        recipe={createRecipe()}
        isOpen
        isFavorite={false}
        onToggleFavorite={vi.fn()}
        onClose={vi.fn()}
      />
    );

    const dialogContent = document.querySelector('[data-slot="dialog-content"]');
    expect(dialogContent).toBeInTheDocument();
    expect(dialogContent?.className).toContain('h-[calc(100dvh-1rem)]');
    expect(screen.getByTestId('recipe-detail-modal')).toBeInTheDocument();
    expect(screen.queryByTestId('recipe-detail-meta-pills')).not.toBeInTheDocument();
  });

  it('keeps real tabs with shared scrollable panel behavior', () => {
    render(
      <RecipeDetailModal
        recipe={createRecipe()}
        isOpen
        isFavorite={false}
        onToggleFavorite={vi.fn()}
        onClose={vi.fn()}
      />
    );

    const tabPanels = Array.from(document.querySelectorAll('[data-slot="tabs-content"]'));
    expect(tabPanels).toHaveLength(2);
    expect(screen.getByRole('tab', { name: 'Ingrediënten' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Bereiding' })).toBeInTheDocument();

    for (const tabPanel of tabPanels) {
      expect(tabPanel.className).toContain('min-h-0');
      expect(tabPanel.className).toContain('overflow-y-auto');
    }

    const activePanel = document.querySelector('[data-slot="tabs-content"][data-state="active"]');
    expect(activePanel).toBeInTheDocument();
    expect(within(activePanel as HTMLElement).getByText('tofu')).toBeInTheDocument();
  });

  it('shows only one primary action button in the bottom action area', () => {
    render(
      <RecipeDetailModal
        recipe={createRecipe()}
        isOpen
        isFavorite={false}
        onToggleFavorite={vi.fn()}
        onClose={vi.fn()}
      />
    );

    const startCookingButton = screen.getByTestId('recipe-start-cooking-button');
    expect(startCookingButton).toBeInTheDocument();
    expect(startCookingButton).toHaveTextContent('Start koken');
    expect(screen.queryByText('Log maaltijd')).not.toBeInTheDocument();
  });

  it('formats fractional ingredient amounts as readable fractions', () => {
    render(
      <RecipeDetailModal
        recipe={createRecipe({
          ingredients: [{ name: 'citroen', amount: '1/2 stuk', scalable: true }],
        })}
        isOpen
        isFavorite={false}
        onToggleFavorite={vi.fn()}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText('1/2 stuk', { exact: false })).toBeInTheDocument();
  });

  it('formats mixed-number ingredient amounts as whole plus fraction', () => {
    render(
      <RecipeDetailModal
        recipe={createRecipe({
          ingredients: [{ name: 'komkommer', amount: '1 1/2 stuk', scalable: true }],
        })}
        isOpen
        isFavorite={false}
        onToggleFavorite={vi.fn()}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText('1 1/2 stuk', { exact: false })).toBeInTheDocument();
  });
});

import React from 'react';
import { render } from '@testing-library/react';
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
  it('keeps a fixed modal height for consistent recipe card sizing', () => {
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
    expect(dialogContent?.className).toContain('h-[85dvh]');
  });

  it('uses the same scroll-bound viewport for ingredients and instructions', () => {
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

    for (const tabPanel of tabPanels) {
      expect(tabPanel.className).toContain('min-h-0');
      expect(tabPanel.className).toContain('overflow-y-auto');
    }
  });
});

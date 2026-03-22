import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { RecipeIndexPage } from '@/components/pages/RecipeIndexPage';
import { PUBLIC_RECIPES, getRecipeBySlug } from '@/data/seo-recipes';

// Mock useDocumentScroll to avoid errors in jsdom
vi.mock('@/hooks/useDocumentScroll', () => ({
  useDocumentScroll: vi.fn(),
}));

describe('RecipeIndexPage', () => {
  it('renders a list of recipe links', () => {
    render(
      <MemoryRouter>
        <RecipeIndexPage />
      </MemoryRouter>
    );

    // Verify that at least one recipe link is present
    const firstRecipe = PUBLIC_RECIPES[0];
    const firstRecipeName = getRecipeBySlug(firstRecipe.slug)?.recipe?.name ?? firstRecipe.slug;
    const link = screen.getByRole('link', { name: new RegExp(firstRecipeName, 'i') });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', `/recepten/${firstRecipe.slug}`);
  });
});

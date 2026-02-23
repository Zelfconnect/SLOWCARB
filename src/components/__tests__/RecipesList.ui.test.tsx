import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RecipesList } from '@/components/RecipesList';

vi.mock('@/data/recipeLoader', () => {
  const recipes = [
    {
      id: 'omelet',
      name: 'Omelet bowl',
      category: 'airfryer',
      icon: 'egg',
      prepTime: '5 min',
      cookTime: '10 min',
      servings: 1,
      ingredients: [{ name: 'ei', amount: '2', scalable: true }],
      steps: ['Bak de eieren'],
      tags: ['ontbijt', 'airfryer'],
    },
    {
      id: 'kip-salade',
      name: 'Kip salade',
      category: 'meal-prep',
      icon: 'salad',
      prepTime: '8 min',
      cookTime: '12 min',
      servings: 2,
      ingredients: [{ name: 'kip', amount: '300g', scalable: true }],
      steps: ['Meng alles'],
      tags: ['lunch', 'meal-prep', 'eiwitrijk'],
    },
    {
      id: 'tonijn-quick',
      name: 'Tonijn wrap',
      category: 'no-time',
      icon: 'fish',
      prepTime: '3 min',
      cookTime: '6 min',
      servings: 1,
      ingredients: [{ name: 'tonijn', amount: '1 blik', scalable: true }],
      steps: ['Vullen en rollen'],
      tags: ['avondeten', 'no-time'],
    },
  ];

  return {
    RECIPES: recipes,
    RECIPE_CATEGORIES: [
      { id: 'ontbijt', name: 'Ontbijt', icon: 'sunrise' },
      { id: 'lunch', name: 'Lunch', icon: 'sun' },
      { id: 'avondeten', name: 'Avondeten', icon: 'moon' },
      { id: 'airfryer', name: 'Airfryer', icon: 'zap' },
      { id: 'meal-prep', name: 'Meal Prep', icon: 'package' },
      { id: 'no-time', name: 'No-Time', icon: 'clock' },
    ],
  };
});

vi.mock('@/components/RecipeDetailModal', () => ({
  RecipeDetailModal: ({
    recipe,
    isOpen,
    onClose,
  }: {
    recipe: { name: string };
    isOpen: boolean;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div data-testid="recipe-modal">
        <p>{recipe.name}</p>
        <button onClick={onClose} type="button">
          Sluit modal
        </button>
      </div>
    ) : null,
}));

describe('RecipesList UI/UX', () => {
  it('filters recipes by search query and shows empty state', () => {
    render(<RecipesList favorites={[]} onToggleFavorite={vi.fn()} />);

    const searchInput = screen.getByPlaceholderText('Zoek recepten...');
    fireEvent.change(searchInput, { target: { value: 'kip' } });
    expect(screen.getByText('Kip salade')).toBeInTheDocument();
    expect(screen.queryByText('Tonijn wrap')).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'bestaat-niet' } });
    expect(screen.getByText('Geen recepten gevonden')).toBeInTheDocument();
    expect(screen.getByText('Probeer een andere zoekterm')).toBeInTheDocument();
  });

  it('filters by favorites and selected category', () => {
    render(<RecipesList favorites={['kip-salade']} onToggleFavorite={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Favorieten' }));
    expect(screen.getByText('Kip salade')).toBeInTheDocument();
    expect(screen.queryByText('Omelet bowl')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Lunch' }));
    expect(screen.getByText('Kip salade')).toBeInTheDocument();
    expect(screen.queryByText('Tonijn wrap')).not.toBeInTheDocument();
  });

  it('opens and closes recipe detail modal from card click', () => {
    render(<RecipesList favorites={[]} onToggleFavorite={vi.fn()} />);

    fireEvent.click(screen.getByTestId('recipe-card-tonijn-quick'));
    expect(screen.getByTestId('recipe-modal')).toBeInTheDocument();
    expect(within(screen.getByTestId('recipe-modal')).getByText('Tonijn wrap')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Sluit modal' }));
    expect(screen.queryByTestId('recipe-modal')).not.toBeInTheDocument();
  });

  it('renders recipes in a compact two-column grid with fixed three-badge meta row', () => {
    render(<RecipesList favorites={[]} onToggleFavorite={vi.fn()} />);

    const grid = screen.getByTestId('recipes-grid');
    expect(grid.className).toContain('grid');
    expect(grid.className).toContain('grid-cols-2');

    const card = screen.getByTestId('recipe-card-omelet');
    expect(card).toBeInTheDocument();

    const imageContainer = screen.getByTestId('recipe-image-omelet');
    expect(imageContainer.className).toContain('aspect-square');

    const metaRow = screen.getByTestId('recipe-meta-omelet');
    expect(within(metaRow).getByText('10 min')).toBeInTheDocument();
    expect(within(metaRow).getByText('1p')).toBeInTheDocument();
    expect(within(metaRow).getByText('Eiwit n.b.')).toBeInTheDocument();
    expect(within(metaRow).queryByText('medium')).not.toBeInTheDocument();
  });

  it('keeps compact filter chip sizing contract', () => {
    render(<RecipesList favorites={[]} onToggleFavorite={vi.fn()} />);

    const allFilterButton = screen.getByRole('button', { name: 'Alles' });
    expect(allFilterButton.className).toContain('h-10');
    expect(allFilterButton.className).toContain('rounded-full');
  });
});

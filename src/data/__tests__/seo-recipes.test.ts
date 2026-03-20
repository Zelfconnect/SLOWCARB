import { describe, it, expect } from 'vitest';
import { PUBLIC_RECIPES, PUBLIC_RECIPE_SLUGS, getRecipeBySlug } from '../seo-recipes';
import { recipes } from '../recipes';

describe('seo-recipes', () => {
  it('exports 15 public recipes', () => {
    expect(PUBLIC_RECIPES).toHaveLength(15);
  });

  it('all recipe IDs exist in recipes.ts', () => {
    const recipeIds = new Set(recipes.map(r => r.id));
    PUBLIC_RECIPES.forEach(pr => {
      expect(recipeIds.has(pr.id), `Recipe ID "${pr.id}" not found in recipes.ts`).toBe(true);
    });
  });

  it('all slugs are unique', () => {
    const slugs = new Set(PUBLIC_RECIPE_SLUGS);
    expect(slugs.size).toBe(PUBLIC_RECIPE_SLUGS.length);
  });

  it('getRecipeBySlug returns recipe data', () => {
    const first = PUBLIC_RECIPES[0];
    const result = getRecipeBySlug(first.slug);
    expect(result).toBeDefined();
    expect(result!.recipe.id).toBe(first.id);
  });

  it('getRecipeBySlug returns undefined for unknown slug', () => {
    expect(getRecipeBySlug('does-not-exist')).toBeUndefined();
  });
});

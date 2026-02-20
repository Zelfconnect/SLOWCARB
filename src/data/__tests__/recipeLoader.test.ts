import { describe, it, expect } from 'vitest';
import { loadRecipes, RECIPES } from '../recipeLoader';
import recipesJson from '../recipes.json';

type RecipesMetadata = {
  totalRecipes?: number;
  categories?: {
    airfryer?: number;
    mealPrep?: number;
    noTime?: number;
  };
};

const metadata = recipesJson as RecipesMetadata;
const expectedQuickCount = metadata.categories?.airfryer ?? 0;
const expectedMealPrepCount = metadata.categories?.mealPrep ?? 0;
const expectedNoTimeCount = metadata.categories?.noTime ?? 0;
const expectedRecipeTotal = metadata.totalRecipes ?? 0;

// ─── loadRecipes ──────────────────────────────────────────────────────────────

describe('loadRecipes', () => {
  it('returns all three categories', () => {
    const db = loadRecipes();
    expect(db.quick).toBeDefined();
    expect(db.mealPrep).toBeDefined();
    expect(db.noTime).toBeDefined();
  });

  it('has exactly the configured quick (airfryer) recipe count', () => {
    expect(loadRecipes().quick).toHaveLength(expectedQuickCount);
  });

  it('has exactly the configured meal-prep recipe count', () => {
    expect(loadRecipes().mealPrep).toHaveLength(expectedMealPrepCount);
  });

  it('has exactly the configured no-time recipe count', () => {
    expect(loadRecipes().noTime).toHaveLength(expectedNoTimeCount);
  });

  it('every quick recipe has the airfryer tag', () => {
    for (const recipe of loadRecipes().quick) {
      expect(recipe.tags).toContain('airfryer');
    }
  });

  it('every mealPrep recipe has the meal-prep tag', () => {
    for (const recipe of loadRecipes().mealPrep) {
      expect(recipe.tags).toContain('meal-prep');
    }
  });

  it('every noTime recipe has the no-time tag', () => {
    for (const recipe of loadRecipes().noTime) {
      expect(recipe.tags).toContain('no-time');
    }
  });

  it('every recipe in the db has id, title, ingredients, and steps', () => {
    const db = loadRecipes();
    const all = [...db.quick, ...db.mealPrep, ...db.noTime];
    for (const recipe of all) {
      expect(recipe.id, `recipe missing id`).toBeTruthy();
      expect(recipe.title, `${recipe.id} missing title`).toBeTruthy();
      expect(recipe.ingredients.length, `${recipe.id} has no ingredients`).toBeGreaterThan(0);
      expect(recipe.steps.length, `${recipe.id} has no steps`).toBeGreaterThan(0);
    }
  });
});

// ─── RECIPES (app recipe list) ────────────────────────────────────────────────

describe('RECIPES', () => {
  it('loads exactly the configured number of unique recipes', () => {
    expect(RECIPES).toHaveLength(expectedRecipeTotal);
  });

  it('every recipe has required fields', () => {
    for (const recipe of RECIPES) {
      expect(recipe.id, 'missing id').toBeTruthy();
      expect(recipe.name, `${recipe.id} missing name`).toBeTruthy();
      expect(recipe.ingredients.length, `${recipe.id} has no ingredients`).toBeGreaterThan(0);
      expect(recipe.steps.length, `${recipe.id} has no steps`).toBeGreaterThan(0);
      expect(recipe.icon, `${recipe.id} missing icon`).toBeTruthy();
      expect(typeof recipe.servings).toBe('number');
      expect(recipe.servings).toBeGreaterThan(0);
    }
  });

  it('recipe IDs are all unique', () => {
    const ids = RECIPES.map((r) => r.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('all cookTime strings end with " min"', () => {
    for (const recipe of RECIPES) {
      expect(recipe.cookTime, `${recipe.id} bad cookTime`).toMatch(/^\d+ min$/);
    }
  });

  it('all prepTime strings end with " min"', () => {
    for (const recipe of RECIPES) {
      expect(recipe.prepTime, `${recipe.id} bad prepTime`).toMatch(/^\d+ min$/);
    }
  });
});

// ─── parseIngredient (tested indirectly via RECIPES) ─────────────────────────

describe('parseIngredient (via RECIPES)', () => {
  const allIngredients = RECIPES.flatMap((r) => r.ingredients);

  it('every ingredient has a non-empty name string', () => {
    for (const ing of allIngredients) {
      expect(typeof ing.name).toBe('string');
      expect(ing.name.trim().length, `empty name found`).toBeGreaterThan(0);
    }
  });

  it('every ingredient has a non-empty amount string', () => {
    for (const ing of allIngredients) {
      expect(typeof ing.amount).toBe('string');
      expect(ing.amount.trim().length, `empty amount found`).toBeGreaterThan(0);
    }
  });

  it('every ingredient has a boolean scalable field', () => {
    for (const ing of allIngredients) {
      expect(typeof ing.scalable).toBe('boolean');
    }
  });

  it('scalable ingredients have an amount that starts with a digit', () => {
    const scalable = allIngredients.filter((i) => i.scalable);
    expect(scalable.length, 'expected at least some scalable ingredients').toBeGreaterThan(0);
    for (const ing of scalable) {
      expect(ing.amount, `scalable ingredient "${ing.name}" has non-numeric amount`).toMatch(/^\d/);
    }
  });

  it('non-scalable ingredients have "naar smaak" as amount', () => {
    const nonScalable = allIngredients.filter((i) => !i.scalable);
    expect(nonScalable.length, 'expected at least some non-scalable ingredients').toBeGreaterThan(0);
    for (const ing of nonScalable) {
      expect(ing.amount, `non-scalable ingredient "${ing.name}" has unexpected amount`).toBe('naar smaak');
    }
  });

  it('ingredient names do not contain leading/trailing whitespace', () => {
    for (const ing of allIngredients) {
      expect(ing.name).toBe(ing.name.trim());
    }
  });
});

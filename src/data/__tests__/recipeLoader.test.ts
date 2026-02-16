/// <reference types="node" />
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadRecipes, RECIPES } from '../recipeLoader';

test('loads exactly 35 recipes', () => {
  assert.equal(RECIPES.length, 35);
});

test('has correct category distribution', () => {
  const db = loadRecipes();
  assert.equal(db.quick.length, 15);
  assert.equal(db.mealPrep.length, 19);
  assert.equal(db.noTime.length, 14);
});

test('all recipes have required fields', () => {
  RECIPES.forEach((recipe) => {
    assert.ok(recipe.id);
    assert.ok(recipe.name);
    assert.ok(recipe.ingredients.length > 0);
    assert.ok(recipe.steps.length > 0);
  });
});

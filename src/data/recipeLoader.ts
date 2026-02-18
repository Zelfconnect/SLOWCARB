import recipesJson from './recipes.json';
import type { Recipe as ImportedRecipe, RecipeDatabase } from '../types/recipe';
import type { Ingredient, Recipe as AppRecipe, RecipeIconKey, MealTypeIconKey } from '@/types';

type RawRecipe = {
  id: string;
  title: string;
  subtitle?: string;
  time: number;
  tags: string[];
  ingredients: string[];
  steps: string[];
  macros?: {
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  mealPrepTip?: string;
  servings?: number;
  difficulty?: string;
  protein?: string;
};

type RawRecipeFile = {
  version?: string;
  createdAt?: string;
  totalRecipes?: number;
  categories?: Record<string, number>;
  recipes: RawRecipe[];
};

const CATEGORY_TAGS = {
  quick: 'airfryer',
  mealPrep: 'meal-prep',
  noTime: 'no-time',
} as const;

const CATEGORY_LABELS: Record<keyof typeof CATEGORY_TAGS, ImportedRecipe['category']> = {
  quick: 'Quick',
  mealPrep: 'Meal Prep',
  noTime: 'No-Time',
};

const RECIPE_CATEGORIES: Array<{ id: string; name: string; icon: MealTypeIconKey }> = [
  { id: CATEGORY_TAGS.quick, name: 'Quick', icon: 'flame' },
  { id: CATEGORY_TAGS.mealPrep, name: 'Meal Prep', icon: 'package' },
  { id: CATEGORY_TAGS.noTime, name: 'No-Time', icon: 'sun' },
];

const UNIT_TOKENS = new Set([
  'g',
  'kg',
  'ml',
  'l',
  'el',
  'tl',
  'stuks',
  'stuk',
  'teentjes',
  'teentje',
  'blikken',
  'blik',
  'kopje',
  'kopjes',
  'cup',
  'cups',
  'snufje',
  'snuf',
  'handje',
]);

const isQuantityToken = (token: string) => /^(\d+([.,]\d+)?|\d+\/\d+)(-\d+([.,]\d+)?)?$/.test(token);

const parseIngredient = (text: string): Ingredient => {
  const trimmed = text.trim();
  if (!trimmed) {
    return { name: 'Onbekend', amount: 'naar smaak', scalable: false };
  }

  const tokens = trimmed.split(/\s+/);
  if (tokens.length > 0 && isQuantityToken(tokens[0])) {
    let amount = tokens[0];
    let nameStart = 1;

    if (tokens[1] && UNIT_TOKENS.has(tokens[1].toLowerCase())) {
      amount = `${amount} ${tokens[1]}`;
      nameStart = 2;
    }

    const name = tokens.slice(nameStart).join(' ').trim() || trimmed;
    return {
      name,
      amount,
      scalable: true,
    };
  }

  const hasNaarSmaak = /naar\s+smaak/i.test(trimmed);
  return {
    name: trimmed.replace(/naar\s+smaak/i, '').trim() || trimmed,
    amount: 'naar smaak',
    scalable: false,
  };
};

const formatCookTime = (minutes: number) => `${Math.max(1, Math.round(minutes))} min`;

const derivePrepTime = (minutes: number) => {
  const total = Math.max(1, Math.round(minutes));
  if (total <= 5) return '2 min';
  return `${Math.max(3, Math.round(total * 0.3))} min`;
};

const getPrimaryCategory = (tags: string[]): AppRecipe['category'] => {
  if (tags.includes(CATEGORY_TAGS.mealPrep)) return 'meal-prep';
  if (tags.includes(CATEGORY_TAGS.noTime)) return 'no-time';
  if (tags.includes(CATEGORY_TAGS.quick)) return 'airfryer';
  return 'airfryer';
};

const getRecipeIcon = (raw: RawRecipe): RecipeIconKey => {
  const protein = (raw.protein || '').toLowerCase();
  if (protein.includes('vis') || protein.includes('zalm') || protein.includes('tonijn')) return 'fish';
  if (protein.includes('ei')) return 'egg';
  if (raw.tags.includes(CATEGORY_TAGS.quick)) return 'flame';
  if (raw.tags.includes(CATEGORY_TAGS.noTime)) return 'salad';
  if (raw.tags.includes(CATEGORY_TAGS.mealPrep)) return 'soup';
  return 'cooking-pot';
};

const assertValidRecipe = (recipe: RawRecipe) => {
  if (!recipe.id || !recipe.title) {
    throw new Error('Recipe is missing id or title');
  }
  if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
    throw new Error(`Recipe ${recipe.id} has no ingredients`);
  }
  if (!Array.isArray(recipe.steps) || recipe.steps.length === 0) {
    throw new Error(`Recipe ${recipe.id} has no steps`);
  }
  if (!Array.isArray(recipe.tags)) {
    throw new Error(`Recipe ${recipe.id} has no tags`);
  }
  if (typeof recipe.time !== 'number' || Number.isNaN(recipe.time)) {
    throw new Error(`Recipe ${recipe.id} has invalid time`);
  }
};

const toImportedRecipe = (raw: RawRecipe, category: ImportedRecipe['category']): ImportedRecipe => {
  return {
    id: raw.id,
    title: raw.title,
    category,
    protein: raw.protein || 'onbekend',
    cookTime: formatCookTime(raw.time),
    ingredients: raw.ingredients,
    steps: raw.steps,
    mealPrepTip: raw.mealPrepTip,
    tags: raw.tags,
  };
};

const toAppRecipe = (raw: RawRecipe): AppRecipe => {
  return {
    id: raw.id,
    name: raw.title,
    category: getPrimaryCategory(raw.tags),
    icon: getRecipeIcon(raw),
    prepTime: derivePrepTime(raw.time),
    cookTime: formatCookTime(raw.time),
    servings: raw.servings ?? 1,
    ingredients: raw.ingredients.map(parseIngredient),
    steps: raw.steps,
    tips: raw.mealPrepTip ? [raw.mealPrepTip] : undefined,
    tags: raw.tags,
  };
};

export const loadRecipes = (): RecipeDatabase => {
  const data = recipesJson as RawRecipeFile;

  if (!data || !Array.isArray(data.recipes)) {
    throw new Error('Recipes JSON is missing recipes array');
  }

  if (data.totalRecipes && data.recipes.length !== data.totalRecipes) {
    throw new Error(`Expected ${data.totalRecipes} recipes, got ${data.recipes.length}`);
  }

  data.recipes.forEach(assertValidRecipe);

  const quick = data.recipes
    .filter((recipe) => recipe.tags.includes(CATEGORY_TAGS.quick))
    .map((recipe) => toImportedRecipe(recipe, CATEGORY_LABELS.quick));
  const mealPrep = data.recipes
    .filter((recipe) => recipe.tags.includes(CATEGORY_TAGS.mealPrep))
    .map((recipe) => toImportedRecipe(recipe, CATEGORY_LABELS.mealPrep));
  const noTime = data.recipes
    .filter((recipe) => recipe.tags.includes(CATEGORY_TAGS.noTime))
    .map((recipe) => toImportedRecipe(recipe, CATEGORY_LABELS.noTime));

  if (quick.length !== 15) throw new Error(`Expected 15 Quick recipes, got ${quick.length}`);
  if (mealPrep.length !== 19) throw new Error(`Expected 19 Meal Prep recipes, got ${mealPrep.length}`);
  if (noTime.length !== 14) throw new Error(`Expected 14 No-Time recipes, got ${noTime.length}`);

  return { quick, mealPrep, noTime };
};

const recipeDatabase = loadRecipes();

export const RECIPES = ((): AppRecipe[] => {
  const unique = new Map<string, RawRecipe>();
  for (const recipe of (recipesJson as RawRecipeFile).recipes) {
    unique.set(recipe.id, recipe);
  }
  return Array.from(unique.values()).map(toAppRecipe);
})();

export { recipeDatabase as RECIPE_DATABASE, RECIPE_CATEGORIES };

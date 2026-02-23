export interface Recipe {
  id: string;
  title: string;
  image?: string;
  category: 'Quick' | 'Meal Prep' | 'No-Time';
  protein: string;
  cookTime: string;
  ingredients: string[];
  steps: string[];
  mealPrepTip?: string;
  tags?: string[];
}

export interface RecipeDatabase {
  quick: Recipe[];
  mealPrep: Recipe[];
  noTime: Recipe[];
}

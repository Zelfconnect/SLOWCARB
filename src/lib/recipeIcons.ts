import {
  Apple,
  CookingPot,
  Egg,
  Fish,
  Flame,
  Moon,
  Package,
  Salad,
  Soup,
  Sun,
  Sunrise,
  type LucideIcon,
} from 'lucide-react';

export const RECIPE_ICONS = {
  'cooking-pot': CookingPot,
  soup: Soup,
  flame: Flame,
  salad: Salad,
  fish: Fish,
  egg: Egg,
} as const;

export const MEAL_TYPE_ICONS = {
  sunrise: Sunrise,
  sun: Sun,
  moon: Moon,
  package: Package,
  flame: Flame,
  apple: Apple,
} as const;

export function getRecipeIcon(key: keyof typeof RECIPE_ICONS): LucideIcon {
  return RECIPE_ICONS[key];
}

export function getMealTypeIcon(key: keyof typeof MEAL_TYPE_ICONS): LucideIcon {
  return MEAL_TYPE_ICONS[key];
}

import type { Recipe } from '@/types';

/**
 * Visual variants for recipe cards.
 * Icon treatment intentionally mirrors website cards: sage container + sage icon.
 */

/** Category used for accent (loader only outputs these three). */
const ACCENT_CATEGORIES = ['airfryer', 'meal-prep', 'no-time'] as const;
export type RecipeCategoryAccent = (typeof ACCENT_CATEGORIES)[number];

const CATEGORY_LABELS: Record<RecipeCategoryAccent, string> = {
  'airfryer': 'Airfryer',
  'meal-prep': 'Meal Prep',
  'no-time': 'No-Time',
};

const MEAL_TYPE_LABELS: Record<string, string> = {
  ontbijt: 'Ontbijt',
  lunch: 'Lunch',
  avondeten: 'Avondeten',
  eiwitrijk: 'Eiwitrijk',
};

/** First tag that has a display label (meal type or category). */
export function getDisplayTag(
  category: Recipe['category'],
  tags: string[]
): { label: string; pillVariant: 'sage' | 'stone' } {
  const mealOrder: Array<keyof typeof MEAL_TYPE_LABELS> = ['ontbijt', 'lunch', 'avondeten'];
  for (const tag of mealOrder) {
    if (tags.includes(tag)) {
      return {
        label: MEAL_TYPE_LABELS[tag],
        pillVariant: tag === 'ontbijt' ? 'sage' : 'stone',
      };
    }
  }
  const accentCat = ACCENT_CATEGORIES.includes(category as RecipeCategoryAccent)
    ? (category as RecipeCategoryAccent)
    : 'airfryer';
  return {
    label: CATEGORY_LABELS[accentCat],
    pillVariant: accentCat === 'meal-prep' ? 'stone' : 'sage',
  };
}

/** Icon container + icon color for a branded modern look. */
export function getCategoryAccent(category: Recipe['category']): {
  iconBox: string;
  iconColor: string;
} {
  const iconBrandStyles = {
    iconBox:
      'border border-sage-300/70 bg-gradient-to-br from-sage-700 via-sage-700 to-sage-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_4px_12px_rgba(47,94,63,0.28)]',
    iconColor: 'text-cream',
  };

  if (!ACCENT_CATEGORIES.includes(category as RecipeCategoryAccent)) {
    return iconBrandStyles;
  }

  return iconBrandStyles;
}

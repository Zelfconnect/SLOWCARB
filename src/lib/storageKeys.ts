export const STORAGE_KEYS = {
  PROFILE: 'slowcarb_profile',
  PROGRESS: 'slowcarb_progress',
  RECIPES: 'slowcarb_recipes',
  CHEAT_DAYS: 'slowcarb_cheat_days',
  SHOPPING: 'slowcarb_shopping',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

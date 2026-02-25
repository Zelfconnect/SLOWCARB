export interface Ingredient {
  name: string;
  amount: string;
  scalable?: boolean;
}

export interface RecipeStep {
  text: string;
  note?: string;
}

export type RecipeIconKey = 'cooking-pot' | 'soup' | 'flame' | 'salad' | 'fish' | 'egg';
export type MealTypeIconKey = 'sunrise' | 'sun' | 'moon' | 'package' | 'flame' | 'apple' | 'zap' | 'clock';
export type CheatDay =
  | 'maandag'
  | 'dinsdag'
  | 'woensdag'
  | 'donderdag'
  | 'vrijdag'
  | 'zaterdag'
  | 'zondag';

export interface Recipe {
  id: string;
  name: string;
  image?: string;
  subtitle?: string;
  difficulty?: string;
  category: 'ontbijt' | 'lunch' | 'avond' | 'airfryer' | 'mealprep' | 'snack' | 'meal-prep' | 'no-time';
  icon: RecipeIconKey;
  prepTime: string;
  cookTime: string;
  servings: number;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  prepNote?: string;
  tips?: string[];
  isFavorite?: boolean;
  tags: string[];
}

export interface Journey {
  startDate: string | null;
  targetWeight?: number;
  cheatDay: CheatDay;
}

export interface MealEntry {
  date: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

export interface DayStatus {
  label: string;
  date: string;
  completed: boolean;
  isCheatDay: boolean;
  isToday: boolean;
  isFuture: boolean;
}

export interface DayTip {
  day: number;
  title: string;
  tips: string[];
  metabolicState: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: 'eiwit' | 'groente' | 'pantry' | 'overig';
  checked: boolean;
  recipeName?: string;
  amount: number;
  unit: string;
  packageLabel?: string;
  addedAt: string;
}

export interface PantryItem {
  id: string;
  name: string;
  category: 'eiwit' | 'groente' | 'pantry' | 'overig';
  amount: number;
  unit: string;
  addedAt: string;
  fromRecipes: string[]; // Track which recipes this item came from
}

// === NEW EDUCATION CARD TYPES ===

export type EducationCardType = 'concept' | 'rule' | 'faq';
export type EducationIconKey =
  | 'apple'
  | 'ban'
  | 'bean'
  | 'beef'
  | 'cake-slice'
  | 'calendar'
  | 'candy'
  | 'check-circle'
  | 'clipboard-list'
  | 'coffee'
  | 'cup-soda'
  | 'droplet'
  | 'droplets'
  | 'egg'
  | 'flame'
  | 'frown'
  | 'leaf'
  | 'milk'
  | 'nut'
  | 'party-popper'
  | 'pizza'
  | 'refresh-ccw'
  | 'rotate-ccw'
  | 'salad'
  | 'sliders-horizontal'
  | 'sparkles'
  | 'sprout'
  | 'target'
  | 'trending-down'
  | 'utensils'
  | 'wheat'
  | 'wine'
  | 'x-circle'
  | 'zap';

export interface EducationCardBase {
  id: string;
  type: EducationCardType;
  title: string;
  icon: EducationIconKey;
  color?: 'sage' | 'amber' | 'clay' | 'emerald' | 'blue' | 'purple'; // Optional - type determines styling
}

// Type 1: Concept Card - for explaining concepts like "How fat burning works"
export interface ConceptCard extends EducationCardBase {
  type: 'concept';
  subtitle?: string;
  content: {
    summary: string; // Max 140 chars
    keyPoints: {
      title: string;
      text: string;
    }[]; // Max 3 items
    funFact?: string; // Optional
    relatedCards?: string[]; // IDs of related cards
  };
}

// Type 2: Rule Card - for The 5 Rules
export interface RuleCard extends EducationCardBase {
  type: 'rule';
  ruleNumber?: number; // e.g., "Rule #2 of 5"
  content: {
    rule: string; // The direct rule statement
    science: string; // Max 50 words
    tips: string[]; // Exactly 3 tips
    exceptions?: string; // Optional
  };
}

// Type 3: FAQ Card - for short Q&A
export interface FAQCard extends EducationCardBase {
  type: 'faq';
  content: {
    answer: 'ja' | 'nee' | 'misschien';
    explanation: string; // Max 40 words
    nuance?: string[]; // Optional bullets
  };
}

export type EducationCard = ConceptCard | RuleCard | FAQCard;

export interface WeightEntry {
  date: string;
  weight: number;
}

export interface UserProfile {
  hasCompletedOnboarding: boolean;
  name: string;
  weightGoal: number;
  currentWeight?: number;
  desiredWeight?: number;
  isVegetarian: boolean;
  vegetarian: boolean;
  allergies: string;
  hasAirfryer: boolean;
  sportsRegularly: boolean;
  doesSport: boolean;
  cheatDay: CheatDay;
  createdAt: string;
}

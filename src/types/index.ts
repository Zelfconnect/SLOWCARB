export interface Ingredient {
  name: string;
  amount: string;
  scalable?: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  category: 'ontbijt' | 'lunch' | 'avond' | 'airfryer' | 'mealprep' | 'snack';
  emoji: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  ingredients: Ingredient[];
  steps: string[];
  tips?: string[];
  isFavorite?: boolean;
  tags: string[];
}

export interface Journey {
  startDate: string | null;
  targetWeight?: number;
  cheatDay: 'zaterdag' | 'zondag';
}

export interface MealEntry {
  date: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
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
  recipeId?: string;
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

export interface EducationCardBase {
  id: string;
  type: EducationCardType;
  title: string;
  icon: string; // emoji
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

// Legacy types (kept for backwards compatibility)
export interface Rule {
  id: number;
  title: string;
  shortDescription: string;
  fullDescription: string;
  science: string;
  emoji: string;
}

export interface ScienceTopic {
  id: string;
  title: string;
  emoji: string;
  summary: string;
  content: string[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface AppState {
  journey: Journey;
  favorites: string[];
  shoppingList: ShoppingItem[];
  stockChecklist: Record<string, boolean>;
  weightLog: WeightEntry[];
}

export interface WeightEntry {
  date: string;
  weight: number;
}

export type EducationCardType = 'rule' | 'concept' | 'reference';

export interface EducationTokens {
  background: string;
  text: string;
  icon: string;
  accent: string;
  borderRadius: string;
  maxHeight: string;
}

export const RULE_TOKENS: EducationTokens = {
  background: 'from-sage-600 to-sage-700',  // Primary green gradient
  text: '#FFFFFF',
  icon: '#FFFFFF',
  accent: 'bg-white/10',  // Light overlay for rule statement
  borderRadius: 'rounded-3xl',
  maxHeight: '85dvh',
};

export const CONCEPT_TOKENS: EducationTokens = {
  background: 'from-stone-600 to-stone-700',  // Neutral gradient
  text: '#FFFFFF',
  icon: '#FFFFFF',
  accent: 'bg-sage-50',  // For summary box
  borderRadius: 'rounded-3xl',
  maxHeight: '80vh',
};

export const REFERENCE_TOKENS = {
  background: 'bg-white',
  text: '#1F2937',
  icon: '#059669',
  border: 'border-stone-200',
  borderRadius: 'rounded-2xl',
  
  // Status colors binnen reference cards
  status: {
    allowed: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
    },
    forbidden: {
      bg: 'bg-red-50',
      text: 'text-red-800',
      border: 'border-red-200',
    },
    special: {
      bg: 'bg-purple-50',
      text: 'text-purple-800',
      border: 'border-purple-200',
    },
  },
};

export function getTokensForType(type: EducationCardType): EducationTokens {
  switch (type) {
    case 'rule':
      return RULE_TOKENS;
    case 'concept':
      return CONCEPT_TOKENS;
    case 'reference':
      return REFERENCE_TOKENS as unknown as EducationTokens;
    default:
      return RULE_TOKENS;
  }
}

export const VALIDATION_RULES = {
  rule: {
    maxWords: 120,
    requiredFields: ['rule', 'science', 'tips'],
    maxTips: 3,
    maxTipLength: 60,
    maxRuleLength: 60,
    maxScienceLength: 100,
  },
  concept: {
    maxWords: 150,
    requiredFields: ['summary', 'keyPoints'],
    maxKeyPoints: 3,
    maxSummaryLength: 140,
    maxKeyPointTitleLength: 30,
    maxKeyPointTextLength: 80,
  },
  reference: {
    maxItems: 12,
  },
};

export const ALLOWED_ICONS = {
  rule: ['ban', 'refresh-ccw', 'cup-soda', 'apple', 'party-popper', 'zap', 'beef', 'egg'],
  concept: ['flame', 'droplets', 'bean', 'sliders-horizontal'],
  faq: ['pizza', 'trending-down', 'coffee', 'cup-soda', 'frown', 'wine'],
  reference: ['check-circle', 'x-circle', 'party-popper', 'clipboard-list', 'utensils'],
};

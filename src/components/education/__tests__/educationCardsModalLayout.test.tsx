import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ConceptCard as ConceptCardType, FAQCard as FAQCardType, RuleCard as RuleCardType } from '@/types';
import { ConceptCard } from '@/components/education/ConceptCard';
import { FAQCard } from '@/components/education/FAQCard';
import { RuleCard } from '@/components/education/RuleCard';
import { RULE_TOKENS } from '@/data/educationTokens';

const sampleRuleCard: RuleCardType = {
  id: 'rule-test',
  type: 'rule',
  title: 'Rule test',
  icon: 'ban',
  ruleNumber: 1,
  content: {
    rule: 'Eet langzaam.',
    science: 'Rustig eten helpt je verzadiging voelen.',
    tips: ['Tip 1', 'Tip 2', 'Tip 3'],
  },
};

const sampleConceptCard: ConceptCardType = {
  id: 'concept-test',
  type: 'concept',
  title: 'Concept test',
  icon: 'flame',
  content: {
    summary: 'Korte samenvatting',
    keyPoints: [
      { title: 'Punt 1', text: 'Uitleg 1' },
      { title: 'Punt 2', text: 'Uitleg 2' },
      { title: 'Punt 3', text: 'Uitleg 3' },
    ],
  },
};

const sampleFaqCard: FAQCardType = {
  id: 'faq-test',
  type: 'faq',
  title: 'FAQ test',
  icon: 'coffee',
  content: {
    answer: 'ja',
    explanation: 'Ja, dat kan.',
    nuance: ['Eerste nuance'],
  },
};

const noop = () => undefined;

describe('Education card modal layout', () => {
  it('uses a shrinkable scroll area for RuleCard', () => {
    render(<RuleCard card={sampleRuleCard} isOpen onClose={noop} />);
    const scrollArea = document.body.querySelector('[data-slot="scroll-area"]');
    expect(scrollArea).toHaveClass('flex-1');
    expect(scrollArea).toHaveClass('min-h-0');
  });

  it('uses a shrinkable scroll area for ConceptCard', () => {
    render(<ConceptCard card={sampleConceptCard} isOpen onClose={noop} />);
    const scrollArea = document.body.querySelector('[data-slot="scroll-area"]');
    expect(scrollArea).toHaveClass('flex-1');
    expect(scrollArea).toHaveClass('min-h-0');
  });

  it('uses a shrinkable scroll area for FAQCard', () => {
    render(<FAQCard card={sampleFaqCard} isOpen onClose={noop} />);
    const scrollArea = document.body.querySelector('[data-slot="scroll-area"]');
    expect(scrollArea).toHaveClass('flex-1');
    expect(scrollArea).toHaveClass('min-h-0');
  });

  it('keeps premium dialog visual treatment', () => {
    render(<RuleCard card={sampleRuleCard} isOpen onClose={noop} />);
    const dialogContent = document.body.querySelector('[data-slot="dialog-content"]');
    expect(dialogContent).toHaveClass('border-stone-100');
    expect(dialogContent).toHaveClass('bg-gradient-to-b');
  });

  it('uses enlarged rule card max height token', () => {
    expect(RULE_TOKENS.maxHeight).toBe('85dvh');
  });
});

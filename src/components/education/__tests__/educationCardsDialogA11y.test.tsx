import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { RuleCard as RuleCardType } from '@/types';
import { RuleCard } from '@/components/education/RuleCard';

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

describe('Education card dialog accessibility', () => {
  it('exposes the rule card title as the dialog accessible name', () => {
    render(<RuleCard card={sampleRuleCard} isOpen onClose={() => undefined} />);
    expect(screen.getByRole('dialog', { name: sampleRuleCard.title })).toBeInTheDocument();
  });
});

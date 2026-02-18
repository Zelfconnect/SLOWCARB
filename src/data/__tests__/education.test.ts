import { describe, it, expect } from 'vitest';
import {
  ruleCards,
  conceptCards,
  faqCards,
  allEducationCards,
  validateEducationCard,
} from '../education';
import { ALLOWED_ICONS } from '../educationTokens';

// ─── Dataset counts ───────────────────────────────────────────────────────────

describe('education card counts', () => {
  it('has 6 rule cards (5 rules + 30/30)', () => {
    expect(ruleCards).toHaveLength(6);
  });

  it('has 4 concept cards', () => {
    expect(conceptCards).toHaveLength(4);
  });

  it('has 6 FAQ cards', () => {
    expect(faqCards).toHaveLength(6);
  });

  it('allEducationCards combines all three arrays', () => {
    expect(allEducationCards).toHaveLength(ruleCards.length + conceptCards.length + faqCards.length);
  });
});

// ─── ID uniqueness ────────────────────────────────────────────────────────────

describe('card IDs', () => {
  it('every card has a non-empty id', () => {
    for (const card of allEducationCards) {
      expect(card.id, 'missing id').toBeTruthy();
    }
  });

  it('all card IDs are unique across the full dataset', () => {
    const ids = allEducationCards.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ─── Required base fields ──────────────────────────────────────────────────────

describe('required base fields', () => {
  it('every card has a non-empty title', () => {
    for (const card of allEducationCards) {
      expect(card.title, `${card.id} missing title`).toBeTruthy();
    }
  });

  it('every card has a valid type (rule | concept | faq)', () => {
    const validTypes = new Set(['rule', 'concept', 'faq']);
    for (const card of allEducationCards) {
      expect(validTypes.has(card.type), `${card.id} has invalid type "${card.type}"`).toBe(true);
    }
  });

  it('every card has a non-empty icon', () => {
    for (const card of allEducationCards) {
      expect(card.icon, `${card.id} missing icon`).toBeTruthy();
    }
  });
});

// ─── Icon validation against ALLOWED_ICONS ────────────────────────────────────

describe('icon validation', () => {
  it('every rule card uses an allowed icon', () => {
    for (const card of ruleCards) {
      expect(
        ALLOWED_ICONS.rule,
        `${card.id}: icon "${card.icon}" not in ALLOWED_ICONS.rule`,
      ).toContain(card.icon);
    }
  });

  it('every concept card uses an allowed icon', () => {
    for (const card of conceptCards) {
      expect(
        ALLOWED_ICONS.concept,
        `${card.id}: icon "${card.icon}" not in ALLOWED_ICONS.concept`,
      ).toContain(card.icon);
    }
  });

  it('every FAQ card uses an allowed icon', () => {
    for (const card of faqCards) {
      expect(
        ALLOWED_ICONS.faq,
        `${card.id}: icon "${card.icon}" not in ALLOWED_ICONS.faq`,
      ).toContain(card.icon);
    }
  });
});

// ─── validateEducationCard (the built-in validator) ───────────────────────────

describe('validateEducationCard', () => {
  it('every card in the dataset passes validation with zero errors', () => {
    for (const card of allEducationCards) {
      const errors = validateEducationCard(card);
      expect(errors, `${card.id} failed validation: ${errors.join('; ')}`).toHaveLength(0);
    }
  });
});

// ─── Rule card structure ──────────────────────────────────────────────────────

describe('rule card structure', () => {
  it('every rule card has a rule, science, and tips', () => {
    for (const card of ruleCards) {
      expect(card.content.rule, `${card.id} missing rule`).toBeTruthy();
      expect(card.content.science, `${card.id} missing science`).toBeTruthy();
      expect(card.content.tips, `${card.id} missing tips`).toBeDefined();
    }
  });

  it('every rule card has exactly 3 tips', () => {
    for (const card of ruleCards) {
      expect(card.content.tips, `${card.id} does not have 3 tips`).toHaveLength(3);
    }
  });

  it('no individual tip is empty', () => {
    for (const card of ruleCards) {
      for (const tip of card.content.tips) {
        expect(tip.trim().length, `${card.id} has an empty tip`).toBeGreaterThan(0);
      }
    }
  });
});

// ─── Concept card structure ───────────────────────────────────────────────────

describe('concept card structure', () => {
  it('every concept card has a summary and keyPoints', () => {
    for (const card of conceptCards) {
      expect(card.content.summary, `${card.id} missing summary`).toBeTruthy();
      expect(card.content.keyPoints.length, `${card.id} has no keyPoints`).toBeGreaterThan(0);
    }
  });

  it('every concept card has at most 3 keyPoints', () => {
    for (const card of conceptCards) {
      expect(
        card.content.keyPoints.length,
        `${card.id} has more than 3 keyPoints`,
      ).toBeLessThanOrEqual(3);
    }
  });

  it('every keyPoint has a non-empty title and text', () => {
    for (const card of conceptCards) {
      for (const kp of card.content.keyPoints) {
        expect(kp.title.trim().length, `${card.id} keyPoint missing title`).toBeGreaterThan(0);
        expect(kp.text.trim().length, `${card.id} keyPoint missing text`).toBeGreaterThan(0);
      }
    }
  });
});

// ─── FAQ card structure ───────────────────────────────────────────────────────

describe('FAQ card structure', () => {
  it('every FAQ card has a valid answer (ja | nee | misschien)', () => {
    const validAnswers = new Set(['ja', 'nee', 'misschien']);
    for (const card of faqCards) {
      expect(
        validAnswers.has(card.content.answer),
        `${card.id} has invalid answer "${card.content.answer}"`,
      ).toBe(true);
    }
  });

  it('every FAQ card has a non-empty explanation', () => {
    for (const card of faqCards) {
      expect(card.content.explanation.trim().length, `${card.id} missing explanation`).toBeGreaterThan(0);
    }
  });
});

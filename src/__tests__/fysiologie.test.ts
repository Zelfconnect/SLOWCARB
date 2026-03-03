import { describe, it, expect } from 'vitest';
import { getCurrentDayTip } from '../data/journey';

describe('84-day Physiology Feature', () => {
  describe('Phase Calculation Logic', () => {
    it('correctly calculates the phase for various days', () => {
      // Logic requirement: ((day - 1) % 7) + 1
      // Note: This logic returns the day within the current week (1-7)
      
      const calculatePhaseDay = (day: number) => ((day - 1) % 7) + 1;

      // Days 1-7 (Phase 1/Week 1)
      expect(calculatePhaseDay(1)).toBe(1);
      expect(calculatePhaseDay(7)).toBe(7);

      // Days 8-14 (Phase 2/Week 2)
      expect(calculatePhaseDay(8)).toBe(1);
      expect(calculatePhaseDay(14)).toBe(7);

      // Days 15-21 (Phase 3/Week 3)
      expect(calculatePhaseDay(15)).toBe(1);
      expect(calculatePhaseDay(21)).toBe(7);
      
      // Specifically testing if it returns 1 for start of any week
      expect(calculatePhaseDay(1)).toBe(1);
      expect(calculatePhaseDay(8)).toBe(1);
      expect(calculatePhaseDay(15)).toBe(1);
      expect(calculatePhaseDay(22)).toBe(1);
    });
    
    it('verifies week calculation as well', () => {
      const calculateWeek = (day: number) => Math.ceil(day / 7);
      
      expect(calculateWeek(1)).toBe(1);
      expect(calculateWeek(7)).toBe(1);
      expect(calculateWeek(8)).toBe(2);
      expect(calculateWeek(14)).toBe(2);
      expect(calculateWeek(15)).toBe(3);
    });
  });

  describe('getCurrentDayTip', () => {
    it('returns the correct tip for Day 1 (journey started today)', () => {
      const today = new Date().toISOString();
      const result = getCurrentDayTip(today);

      expect(result.day).toBe(1);
      expect(result.tip).toBeDefined();
      expect(result.tip?.day).toBe(1);
      expect(result.tip?.title).toBe('De Eerste Stap');
    });

    it('verifies the tip object has required fields', () => {
      const today = new Date().toISOString();
      const { tip } = getCurrentDayTip(today);

      expect(tip).toBeDefined();
      if (tip) {
        expect(tip).toHaveProperty('day');
        expect(tip).toHaveProperty('title');
        expect(tip).toHaveProperty('tips');
        expect(Array.isArray(tip.tips)).toBe(true);
        expect(tip).toHaveProperty('metabolicState');
      }
    });

    it('verifies metabolicState for Day 1 contains meaningful content', () => {
      const today = new Date().toISOString();
      const { tip } = getCurrentDayTip(today);

      expect(tip?.metabolicState).toBeDefined();
      expect(tip?.metabolicState.length).toBeGreaterThan(10);
      expect(tip?.metabolicState).toContain('glycogeenvoorraden');
    });
    
    it('returns tips for a middle day (e.g., Day 10)', () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 9); // 9 days ago makes today Day 10
      
      const result = getCurrentDayTip(startDate.toISOString());
      
      expect(result.day).toBe(10);
      expect(result.tip?.day).toBe(10);
      expect(result.tip?.title).toBe('Honger vs. Gewoonte');
      expect(result.weekTip?.title).toBe('Week 2: De Omschakeling');
    });
  });
});

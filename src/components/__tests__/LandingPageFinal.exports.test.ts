import { describe, expect, it } from 'vitest';
import * as LandingPageFinalModule from '@/components/LandingPageFinal';

describe('LandingPageFinal module exports', () => {
  it('exposes only a default export', () => {
    expect(typeof LandingPageFinalModule.default).toBe('function');
    expect(Object.keys(LandingPageFinalModule)).toEqual(['default']);
  });
});

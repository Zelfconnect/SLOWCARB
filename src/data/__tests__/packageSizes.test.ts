import { describe, expect, it } from 'vitest';
import { getDefaultPackage, getPackageSizes, roundToPackage } from '../packageSizes';

describe('getPackageSizes', () => {
  it('returns exact match when ingredient exists', () => {
    const packageConfig = getPackageSizes('kipfilet');
    expect(packageConfig?.unit).toBe('gram');
    expect(packageConfig?.category).toBe('eiwit');
  });

  it('returns specific prefix match before generic prefix match', () => {
    const packageConfig = getPackageSizes('kipfilet blokjes');
    expect(packageConfig?.packages[0].label).toBe('300g');
  });

  it('returns generic prefix match when only generic key applies', () => {
    const packageConfig = getPackageSizes('kip dij');
    expect(packageConfig?.packages[0].label).toBe('500g');
  });

  it('does not match ambiguous contains-based ingredient names', () => {
    const packageConfig = getPackageSizes('olie');
    expect(packageConfig).toBeNull();
  });
});

describe('roundToPackage', () => {
  it('returns smallest package that covers requirement', () => {
    const roundedPackage = roundToPackage('kipfilet', 420);
    expect(roundedPackage?.label).toBe('500g');
  });

  it('returns largest package when requirement exceeds all options', () => {
    const roundedPackage = roundToPackage('eieren', 40);
    expect(roundedPackage?.label).toBe('20 stuks (voordeelpak)');
  });

  it('returns null for unknown ingredients', () => {
    const roundedPackage = roundToPackage('onbekend ingredient', 2);
    expect(roundedPackage).toBeNull();
  });
});

describe('getDefaultPackage', () => {
  it('returns same package selection as roundToPackage', () => {
    const defaultPackage = getDefaultPackage('eieren', 11);
    expect(defaultPackage?.label).toBe('12 stuks (dozijn)');
  });

  it('returns null for unknown ingredients', () => {
    const defaultPackage = getDefaultPackage('onbekend ingredient', 3);
    expect(defaultPackage).toBeNull();
  });
});

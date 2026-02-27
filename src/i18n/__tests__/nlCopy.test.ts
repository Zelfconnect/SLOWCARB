import { describe, expect, it } from 'vitest';
import nl from '../nl.json';
import { dayTips } from '@/data/journey';
import { categories } from '@/data/recipes';

describe('Nederlandse copy', () => {
  it('gebruikt Nederlandse landingspagina-teksten', () => {
    expect(nl.landing.ctaPrimary).toBe('Start nu • €29 vroege vogel');
    expect(nl.landing.pricingTitle).toBe('SlowCarb levenslange toegang');
    expect(nl.landing.faqTitle).toBe('Veelgestelde vragen');
    expect(nl.landing.footerLinks).toEqual([
      { label: 'Privacybeleid', href: '/privacy-policy' },
      { label: 'Algemene voorwaarden', href: '/terms-of-service' },
      { label: 'Refundbeleid', href: '/refund-policy' },
    ]);
    expect(nl.landing.footerContactLabel).toBe('Contact opnemen');
    expect(nl.landing.footerContactEmail).toBe('hello@slowcarb.nl');
  });

  it('gebruikt Nederlandse instellingen-teksten', () => {
    expect(nl.settings.dataPrivacyTitle).toBe('Gegevens en privacy');
    expect(nl.settings.resetJourneyTitle).toBe('Traject resetten');
    expect(nl.settings.resetJourneyDialogTitle).toBe('Traject resetten?');
    expect(nl.settings.reset).toBe('Resetten');
  });

  it('gebruikt Nederlandse journey-teksten', () => {
    expect(dayTips[5]?.title).toBe('Dag Voor Cheatdag');
    expect(dayTips[6]?.title).toBe('Cheatdag!');
  });

  it('gebruikt Nederlandse receptcategorie-teksten', () => {
    const mealPrepCategory = categories.find((category) => category.id === 'mealprep');
    expect(mealPrepCategory?.name).toBe('Mealprep');
  });
});

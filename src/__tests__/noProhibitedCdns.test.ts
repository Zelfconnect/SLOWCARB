import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const htmlFiles = ['index.html', 'docs/icon-migration-mockup.html'];

const prohibitedCdnPatterns = [
  /cdn\.tailwindcss\.com/i,
  /font-awesome/i,
  /fontawesome/i,
  /cdn(?:js|)\.[^"'\s]*swiper/i,
  /unpkg\.com\/swiper/i,
];

describe('HTML files', () => {
  it('do not reference Tailwind, Font Awesome, or Swiper CDNs', () => {
    for (const htmlFile of htmlFiles) {
      const html = readFileSync(htmlFile, 'utf8');

      for (const pattern of prohibitedCdnPatterns) {
        expect(html).not.toMatch(pattern);
      }
    }
  });
});

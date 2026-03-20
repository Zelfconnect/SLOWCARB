import { describe, expect, it } from 'vitest';
import { SeoRecipeStoryCatalog } from '@/data/SeoRecipeStoryCatalog';
import { PUBLIC_RECIPE_SLUGS } from '@/data/seo-recipes';

describe('SeoRecipeStoryCatalog', () => {
  it('covers every public recipe slug with at least one paragraph', () => {
    for (const slug of PUBLIC_RECIPE_SLUGS) {
      const paragraphs = SeoRecipeStoryCatalog.getParagraphs(slug);
      expect(paragraphs.length, slug).toBeGreaterThanOrEqual(2);
      for (const p of paragraphs) {
        expect(p.trim().length, slug).toBeGreaterThan(40);
      }
    }
  });
});

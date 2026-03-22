import { describe, expect, it } from 'vitest';
import { ALL_ARTICLES, type SEOArticle } from '@/data/seo-content';

function collectArticleStrings(article: SEOArticle): string[] {
  const out: string[] = [
    article.title,
    article.kicker,
    article.metaTitle,
    article.metaDescription,
    article.author,
    article.readingTime,
  ];
  for (const section of article.sections) {
    out.push(section.heading, section.content);
    if (section.subsections) {
      for (const sub of section.subsections) {
        out.push(sub.heading, sub.content);
      }
    }
  }
  if (article.faq) {
    for (const item of article.faq) {
      out.push(item.question, item.answer);
    }
  }
  return out;
}

describe('seo-content', () => {
  it('contains no em dash (U+2014) in user-facing strings', () => {
    for (const article of ALL_ARTICLES) {
      for (const chunk of collectArticleStrings(article)) {
        expect(chunk, article.slug).not.toContain('\u2014');
      }
    }
  });
});

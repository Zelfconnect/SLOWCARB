import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { SEOHead } from '../SEOHead';

describe('SEOHead', () => {
  afterEach(() => {
    document.querySelectorAll('meta[data-seo]').forEach(el => el.remove());
    document.querySelectorAll('link[data-seo]').forEach(el => el.remove());
    document.querySelectorAll('script[data-seo]').forEach(el => el.remove());
  });

  it('sets document title', () => {
    render(
      <SEOHead
        title="Test Title"
        description="Test description"
        canonical="https://eatslowcarb.com/test"
      />
    );
    expect(document.title).toBe('Test Title');
  });

  it('sets meta description', () => {
    render(
      <SEOHead
        title="Test"
        description="My description"
        canonical="https://eatslowcarb.com/test"
      />
    );
    const meta = document.querySelector('meta[name="description"]');
    expect(meta?.getAttribute('content')).toBe('My description');
  });

  it('sets canonical URL', () => {
    render(
      <SEOHead
        title="Test"
        description="Desc"
        canonical="https://eatslowcarb.com/gids/slow-carb-dieet"
      />
    );
    const link = document.querySelector('link[rel="canonical"]');
    expect(link?.getAttribute('href')).toBe('https://eatslowcarb.com/gids/slow-carb-dieet');
  });

  it('injects JSON-LD script', () => {
    const jsonLd = { '@context': 'https://schema.org', '@type': 'Article', headline: 'Test' };
    render(
      <SEOHead
        title="Test"
        description="Desc"
        canonical="https://eatslowcarb.com/test"
        jsonLd={jsonLd}
      />
    );
    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    expect(JSON.parse(script!.textContent!)).toEqual(jsonLd);
  });

  it('sets noindex when specified', () => {
    render(
      <SEOHead
        title="Test"
        description="Desc"
        canonical="https://eatslowcarb.com/test"
        noindex
      />
    );
    const meta = document.querySelector('meta[name="robots"]');
    expect(meta?.getAttribute('content')).toBe('noindex, nofollow');
  });

  it('sets OG tags', () => {
    render(
      <SEOHead
        title="OG Test"
        description="OG desc"
        canonical="https://eatslowcarb.com/test"
        ogType="article"
      />
    );
    const ogTitle = document.querySelector('meta[property="og:title"]');
    expect(ogTitle?.getAttribute('content')).toBe('OG Test');
    const ogType = document.querySelector('meta[property="og:type"]');
    expect(ogType?.getAttribute('content')).toBe('article');
  });
});

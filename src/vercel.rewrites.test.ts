import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('Vercel SPA rewrites', () => {
  it('rewrites app routes to index.html to prevent legal-page 404s', () => {
    const vercelConfigPath = resolve(process.cwd(), 'vercel.json');
    const configText = readFileSync(vercelConfigPath, 'utf-8');
    const config = JSON.parse(configText) as {
      rewrites?: Array<{ source?: string; destination?: string }>;
    };

    expect(config.rewrites).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: '/(.*)',
          destination: '/index.html',
        }),
      ])
    );
  });
});

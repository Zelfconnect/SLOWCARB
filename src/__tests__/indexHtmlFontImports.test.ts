import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('index.html font imports', () => {
  it('includes Fraunces, Satoshi, and Oswald imports', () => {
    const html = readFileSync('index.html', 'utf-8');

    expect(html).toContain('fonts.googleapis.com/css2');
    expect(html).toContain('family=Fraunces');
    expect(html).toContain('family=Oswald');
    expect(html).toContain('api.fontshare.com/v2/css?f[]=satoshi');
  });
});

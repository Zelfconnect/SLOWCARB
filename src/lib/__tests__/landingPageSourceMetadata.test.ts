import { describe, expect, it } from 'vitest';
import { LANDING_PAGE_SOURCE_METADATA } from '@/lib/landingPageSourceMetadata';

describe('LANDING_PAGE_SOURCE_METADATA', () => {
  it('captures the reviewed external landing page source file details', () => {
    expect(LANDING_PAGE_SOURCE_METADATA.path).toBe('~/projects/LANDINGPAGE-slow-carb/index.html');
    expect(LANDING_PAGE_SOURCE_METADATA.lineCount).toBe(2447);
    expect(LANDING_PAGE_SOURCE_METADATA.byteCount).toBe(103785);
    expect(LANDING_PAGE_SOURCE_METADATA.sha256).toBe(
      'bed8e264b435720a2ea4f45213ebbc0441ba60a32fa947ac4a5b37e1980c9048',
    );
  });
});

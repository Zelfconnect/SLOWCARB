import { describe, expect, it } from 'vitest';

function hexToRelativeLuminance(hex: string): number {
  const channels = hex.replace('#', '').match(/.{2}/g);
  if (!channels || channels.length !== 3) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  const [r, g, b] = channels
    .map((value) => Number.parseInt(value, 16) / 255)
    .map((channel) =>
      channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
    );

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(foregroundHex: string, backgroundHex: string): number {
  const foregroundLuminance = hexToRelativeLuminance(foregroundHex);
  const backgroundLuminance = hexToRelativeLuminance(backgroundHex);
  const [lighter, darker] =
    foregroundLuminance >= backgroundLuminance
      ? [foregroundLuminance, backgroundLuminance]
      : [backgroundLuminance, foregroundLuminance];

  return (lighter + 0.05) / (darker + 0.05);
}

describe('LandingPageFinal contrast guards', () => {
  it('keeps pricing old-price text readable on white background', () => {
    const ratio = contrastRatio('#78716c', '#ffffff'); // stone-500 on white
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('keeps final CTA badges readable on the gradient section', () => {
    const ratio = contrastRatio('#c5d8c5', '#314f31'); // sage-200 on sage-700
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});

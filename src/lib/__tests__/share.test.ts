import { describe, expect, it, vi, afterEach } from 'vitest';
import { shareText } from '@/lib/share';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('shareText', () => {
  it('uses native share when available', async () => {
    const nativeShare = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: nativeShare,
    });

    const outcome = await shareText({ text: 'Mijn cheatday is zaterdag', url: 'https://slowcarb.nl' });

    expect(outcome).toBe('native');
    expect(nativeShare).toHaveBeenCalledWith({
      title: undefined,
      text: 'Mijn cheatday is zaterdag',
      url: 'https://slowcarb.nl',
    });
  });

  it('returns aborted when native share is cancelled', async () => {
    const nativeShare = vi.fn().mockRejectedValue(new DOMException('Cancelled', 'AbortError'));
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: nativeShare,
    });

    const outcome = await shareText({ text: 'Resultaat gedeeld' });

    expect(outcome).toBe('aborted');
  });

  it('falls back to clipboard API when native share is unavailable', async () => {
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: undefined,
    });
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    const outcome = await shareText({ text: 'Mijn cheatday is zondag', url: 'https://slowcarb.nl?app=1' });

    expect(outcome).toBe('clipboard');
    expect(writeText).toHaveBeenCalledWith('Mijn cheatday is zondag\nhttps://slowcarb.nl?app=1');
  });

  it('uses execCommand fallback when clipboard API rejects', async () => {
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: undefined,
    });
    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    const execCommand = vi.fn().mockReturnValue(true);
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: execCommand,
    });

    const outcome = await shareText({ text: 'Deel deze tekst' });

    expect(outcome).toBe('clipboard');
    expect(execCommand).toHaveBeenCalledWith('copy');
  });
});

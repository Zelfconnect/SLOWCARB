import { beforeEach, describe, expect, it, vi } from 'vitest';
import { captureLandingEmail } from '@/lib/emailCapture';

const STORAGE_KEY = 'slowcarb-email-captures';

describe('captureLandingEmail', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useRealTimers();
  });

  it('stores normalized landing email in localStorage', async () => {
    const now = new Date('2026-03-14T08:00:00.000Z');
    vi.useFakeTimers();
    vi.setSystemTime(now);

    await captureLandingEmail(' Test@Example.com ');

    const stored = window.localStorage.getItem(STORAGE_KEY);
    expect(stored).not.toBeNull();
    expect(JSON.parse(String(stored))).toEqual([
      {
        email: 'test@example.com',
        source: 'landing_page',
        createdAt: now.toISOString(),
      },
    ]);
  });

  it('does not duplicate an existing email', async () => {
    await captureLandingEmail('test@example.com');
    await captureLandingEmail('Test@Example.com');

    const stored = window.localStorage.getItem(STORAGE_KEY);
    expect(JSON.parse(String(stored))).toHaveLength(1);
  });

  it('throws for invalid email', async () => {
    await expect(captureLandingEmail('not-an-email')).rejects.toThrow('Invalid email');
  });

  it('recovers from corrupted localStorage', async () => {
    window.localStorage.setItem(STORAGE_KEY, '{broken-json');
    await captureLandingEmail('hello@example.com');

    const stored = window.localStorage.getItem(STORAGE_KEY);
    expect(JSON.parse(String(stored))).toHaveLength(1);
  });
});

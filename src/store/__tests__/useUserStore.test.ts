import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from '../useUserStore';
import { STORAGE_KEYS } from '@/lib/storageKeys';
import type { UserProfile } from '@/types';

const validProfile: UserProfile = {
  hasCompletedOnboarding: true,
  name: 'Testgebruiker',
  weightGoal: 8,
  isVegetarian: false,
  vegetarian: false,
  allergies: '',
  hasAirfryer: true,
  sportsRegularly: false,
  doesSport: false,
  cheatDay: 'zaterdag',
  createdAt: '2024-01-01T00:00:00.000Z',
};

beforeEach(() => {
  // Reset only the data properties — do NOT pass `true` (replace-all) because
  // that would strip the action functions from the state.
  useUserStore.setState({ profile: null, isLoaded: false });
  window.localStorage.clear();
});

// ─── loadProfile ──────────────────────────────────────────────────────────────

describe('loadProfile', () => {
  it('sets isLoaded=true and profile=null when nothing is stored', () => {
    useUserStore.getState().loadProfile();
    const { profile, isLoaded } = useUserStore.getState();
    expect(isLoaded).toBe(true);
    expect(profile).toBeNull();
  });

  it('parses and sets a valid stored profile', () => {
    window.localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(validProfile));
    useUserStore.getState().loadProfile();
    const { profile, isLoaded } = useUserStore.getState();
    expect(isLoaded).toBe(true);
    expect(profile).toEqual(validProfile);
  });

  it('sets profile=null and isLoaded=true on corrupted JSON (no hang)', () => {
    window.localStorage.setItem(STORAGE_KEYS.PROFILE, '{{invalid-json}}');
    useUserStore.getState().loadProfile();
    const { profile, isLoaded } = useUserStore.getState();
    expect(isLoaded).toBe(true);  // critical: must not get stuck in loading
    expect(profile).toBeNull();
  });

  it('sets profile=null and isLoaded=true when stored value is an empty string', () => {
    window.localStorage.setItem(STORAGE_KEYS.PROFILE, '');
    useUserStore.getState().loadProfile();
    const { profile, isLoaded } = useUserStore.getState();
    // Empty string is falsy: the stored branch is not entered, falls to else
    expect(isLoaded).toBe(true);
    expect(profile).toBeNull();
  });
});

// ─── updateProfile ────────────────────────────────────────────────────────────

describe('updateProfile', () => {
  it('writes the profile to localStorage', () => {
    useUserStore.getState().updateProfile(validProfile);
    const stored = window.localStorage.getItem(STORAGE_KEYS.PROFILE);
    expect(JSON.parse(stored!)).toEqual(validProfile);
  });

  it('updates the in-memory Zustand state', () => {
    useUserStore.getState().updateProfile(validProfile);
    expect(useUserStore.getState().profile).toEqual(validProfile);
  });

  it('overwrites a previously stored profile', () => {
    useUserStore.getState().updateProfile(validProfile);
    const updated = { ...validProfile, name: 'Updated' };
    useUserStore.getState().updateProfile(updated);
    expect(useUserStore.getState().profile?.name).toBe('Updated');
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.PROFILE)!);
    expect(stored.name).toBe('Updated');
  });
});

// ─── logout ───────────────────────────────────────────────────────────────────

describe('logout', () => {
  it('clears all localStorage entries', () => {
    window.localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(validProfile));
    window.localStorage.setItem('some-other-key', 'value');
    useUserStore.getState().logout();
    expect(window.localStorage.length).toBe(0);
  });

  it('sets profile to null in state', () => {
    useUserStore.setState({ profile: validProfile });
    useUserStore.getState().logout();
    expect(useUserStore.getState().profile).toBeNull();
  });

  it('sets isLoaded to true after logout', () => {
    useUserStore.getState().logout();
    expect(useUserStore.getState().isLoaded).toBe(true);
  });
});

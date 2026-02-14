import { create } from 'zustand';
import type { UserProfile } from '@/types';
import { STORAGE_KEYS } from '@/lib/storageKeys';

interface UserState {
  profile: UserProfile | null;
  isLoaded: boolean;
  loadProfile: () => void;
  updateProfile: (profile: UserProfile) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  isLoaded: false,

  loadProfile: () => {
    if (typeof window === 'undefined') {
      set({ isLoaded: true });
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (stored) {
      try {
        set({ profile: JSON.parse(stored), isLoaded: true });
      } catch (error) {
        console.warn('Failed to parse stored profile', error);
        set({ profile: null, isLoaded: true });
      }
    } else {
      set({ profile: null, isLoaded: true });
    }
  },

  updateProfile: (profile) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    }
    set({ profile });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
    }
    set({ profile: null, isLoaded: true });
  },
}));

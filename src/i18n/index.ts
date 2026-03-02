import { useCallback, useEffect, useMemo, useState } from 'react';
import en from './en.json';
import nl from './nl.json';

type Locale = 'en' | 'nl';

const STORAGE_KEY = 'slowcarb-locale';
const LOCALE_EVENT = 'slowcarb-locale-change';

const dictionaries = { en, nl } as const;

function isLocale(value: string | null): value is Locale {
  return value === 'en' || value === 'nl';
}

function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'nl';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isLocale(stored) ? stored : 'nl';
}

function getNestedValue(source: unknown, key: string): unknown {
  return key.split('.').reduce<unknown>((acc, part) => {
    if (!acc || typeof acc !== 'object' || !(part in acc)) {
      return undefined;
    }

    return (acc as Record<string, unknown>)[part];
  }, source);
}

export function useTranslation() {
  const [locale, setLocaleState] = useState<Locale>(getStoredLocale);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      const next = isLocale(event.newValue) ? event.newValue : 'nl';
      setLocaleState(next);
    };

    const handleLocaleEvent = (event: Event) => {
      const detail = (event as CustomEvent<Locale>).detail;
      if (isLocale(detail)) {
        setLocaleState(detail);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(LOCALE_EVENT, handleLocaleEvent);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(LOCALE_EVENT, handleLocaleEvent);
    };
  }, []);

  const setLocale = useCallback((nextLocale: string) => {
    const next = isLocale(nextLocale) ? nextLocale : 'nl';
    setLocaleState(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next);
      window.dispatchEvent(new CustomEvent<Locale>(LOCALE_EVENT, { detail: next }));
    }
  }, []);

  const t = useCallback(
    (key: string) => {
      const value = getNestedValue(dictionaries[locale], key);
      if (value === undefined) return key;
      return value;
    },
    [locale]
  );

  return useMemo(
    () => ({ t, locale, setLocale }),
    [t, locale, setLocale]
  );
}

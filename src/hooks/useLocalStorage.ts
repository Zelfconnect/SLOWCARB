import { useState, useEffect, useCallback } from 'react';

const LOCAL_STORAGE_SYNC_EVENT = 'local-storage-sync';

interface LocalStorageSyncDetail {
  key: string;
  newValue: string;
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      setStoredValue(prev => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        
        if (typeof window !== 'undefined') {
          const serialized = JSON.stringify(valueToStore);
          window.localStorage.setItem(key, serialized);
          window.dispatchEvent(
            new CustomEvent<LocalStorageSyncDetail>(LOCAL_STORAGE_SYNC_EVENT, {
              detail: { key, newValue: serialized },
            })
          );
        }
        
        return valueToStore;
      });
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          setStoredValue(JSON.parse(event.newValue));
        } catch {
          console.warn(`Error parsing localStorage key "${key}" from storage event`);
        }
      }
    };

    const handleSameTabSync = (event: Event) => {
      const detail = (event as CustomEvent<LocalStorageSyncDetail>).detail;
      if (detail.key === key) {
        try {
          setStoredValue(JSON.parse(detail.newValue));
        } catch {
          console.warn(`Error parsing localStorage key "${key}" from sync event`);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(LOCAL_STORAGE_SYNC_EVENT, handleSameTabSync);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(LOCAL_STORAGE_SYNC_EVENT, handleSameTabSync);
    };
  }, [key]);

  return [storedValue, setValue];
}

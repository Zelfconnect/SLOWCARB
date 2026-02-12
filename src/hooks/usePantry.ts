import { useLocalStorage } from './useLocalStorage';
import type { PantryItem } from '@/types';
import { useCallback } from 'react';
import { STANDARD_PANTRY_ITEMS } from '@/data/packageSizes';

export function usePantry() {
  const [pantryItems, setPantryItems] = useLocalStorage<PantryItem[]>('slowcarb-pantry', []);
  const [standardChecked, setStandardChecked] = useLocalStorage<Record<string, boolean>>('slowcarb-pantry-standard', {});

  // Add item to pantry (from shopping list)
  const addToPantry = useCallback((item: PantryItem) => {
    setPantryItems(prev => {
      // Check if already exists
      const existingIndex = prev.findIndex(p => p.name.toLowerCase() === item.name.toLowerCase());
      
      if (existingIndex >= 0) {
        // Update existing
        const updated = [...prev];
        const existing = updated[existingIndex];
        
        // Merge recipes
        const mergedRecipes = [...new Set([...existing.fromRecipes, ...item.fromRecipes])];
        
        updated[existingIndex] = {
          ...existing,
          amount: existing.amount + item.amount,
          addedAt: new Date().toISOString(),
          fromRecipes: mergedRecipes,
        };
        return updated;
      }
      
      // Add new
      return [...prev, { ...item, addedAt: new Date().toISOString() }];
    });
  }, [setPantryItems]);

  // Remove item from pantry
  const removeFromPantry = useCallback((id: string) => {
    setPantryItems(prev => prev.filter(item => item.id !== id));
  }, [setPantryItems]);

  // Toggle standard pantry item
  const toggleStandardItem = useCallback((itemId: string) => {
    setStandardChecked(prev => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  }, [setStandardChecked]);

  // Get items that need restocking (checked in standard list but not in pantry)
  const getRestockSuggestions = useCallback((): Array<{ id: string; name: string; emoji: string; category: string }> => {
    const suggestions: Array<{ id: string; name: string; emoji: string; category: string }> = [];
    
    STANDARD_PANTRY_ITEMS.forEach(item => {
      if (standardChecked[item.id]) {
        // Check if it's NOT in pantry (meaning it needs restocking)
        const inPantry = pantryItems.some(p => p.name.toLowerCase() === item.name.toLowerCase());
        if (!inPantry) {
          suggestions.push(item);
        }
      }
    });
    
    return suggestions;
  }, [pantryItems, standardChecked]);

  // Get pantry items grouped by category
  const getByCategory = useCallback(() => {
    const grouped: Record<string, PantryItem[]> = {
      eiwit: [],
      groente: [],
      pantry: [],
      overig: [],
    };
    
    pantryItems.forEach(item => {
      if (grouped[item.category]) {
        grouped[item.category].push(item);
      } else {
        grouped.overig.push(item);
      }
    });
    
    return grouped;
  }, [pantryItems]);

  // Get standard items with their checked status
  const getStandardItems = useCallback(() => {
    return STANDARD_PANTRY_ITEMS.map(item => ({
      ...item,
      checked: !!standardChecked[item.id],
    }));
  }, [standardChecked]);

  // Clear all pantry items
  const clearPantry = useCallback(() => {
    setPantryItems([]);
  }, [setPantryItems]);

  // Get total count
  const getTotalCount = useCallback(() => {
    return pantryItems.length;
  }, [pantryItems]);

  return {
    pantryItems,
    addToPantry,
    removeFromPantry,
    toggleStandardItem,
    getRestockSuggestions,
    getByCategory,
    getStandardItems,
    clearPantry,
    getTotalCount,
  };
}

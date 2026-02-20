import { useLocalStorage } from './useLocalStorage';
import type { ShoppingItem, PantryItem } from '@/types';
import { useCallback } from 'react';
import { getPackageSizes, roundToPackage } from '@/data/packageSizes';
import { getCategoryForIngredient } from '@/lib/ingredientCategory';
import { getIconKeyForIngredient } from '@/lib/ingredientIcons';

export function useShoppingList() {
  const [items, setItems] = useLocalStorage<ShoppingItem[]>('slowcarb-shopping-v2', []);

  // Add items from package selector with consolidation
  const addItemsFromPackage = useCallback((
    recipeName: string,
    selections: Array<{
      ingredient: { name: string; amount: string };
      selectedPackage: { amount: number; label: string };
    }>
  ) => {
    setItems(prev => {
      const newItems = [...prev];
      
      selections.forEach(selection => {
        const { ingredient, selectedPackage } = selection;
        const category = getCategoryForIngredient(ingredient.name);
        const unit = getPackageSizes(ingredient.name)?.unit || 'stuks';
        
        // Check if item already exists (consolidation)
        const existingIndex = newItems.findIndex(
          item =>
            item.name.toLowerCase() === ingredient.name.toLowerCase() &&
            !item.checked &&
            item.unit === unit
        );
        
        if (existingIndex >= 0) {
          // Consolidate: add amounts and update recipe names
          const existing = newItems[existingIndex];
          const existingRecipes = existing.recipeName 
            ? existing.recipeName.split(' + ') 
            : [];
          
          if (!existingRecipes.includes(recipeName)) {
            existingRecipes.push(recipeName);
          }
          
          const consolidatedAmount = existing.amount + selectedPackage.amount;
          const matchedPackage = roundToPackage(ingredient.name, consolidatedAmount);

          newItems[existingIndex] = {
            ...existing,
            amount: consolidatedAmount,
            recipeName: existingRecipes.join(' + '),
            packageLabel: matchedPackage?.label ?? `${consolidatedAmount} ${unit}`,
          };
        } else {
          // Add new item
          newItems.push({
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: ingredient.name,
            category,
            checked: false,
            recipeName,
            amount: selectedPackage.amount,
            unit,
            packageLabel: selectedPackage.label,
            addedAt: new Date().toISOString(),
          });
        }
      });
      
      return newItems;
    });
  }, [setItems]);

  // Add a custom item (from user input)
  const addCustomItem = useCallback((name: string) => {
    setItems(prev => {
      const category = getCategoryForIngredient(name);
      const packages = getPackageSizes(name);
      const unit = packages?.unit || 'stuks';
      
      // Use first (smallest) package as default, or 1 if no packages defined
      const defaultPackage = packages?.packages[0];
      const defaultAmount = defaultPackage?.amount || 1;
      const defaultLabel = defaultPackage?.label || (unit === 'stuks' ? `${defaultAmount} stuks` : undefined);
      
      // Check if already exists
      const existingIndex = prev.findIndex(
        item => item.name.toLowerCase() === name.toLowerCase() && !item.checked
      );
      
      if (existingIndex >= 0) {
        // Just return existing, don't duplicate
        return prev;
      }
      
      return [...prev, {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        category,
        checked: false,
        recipeName: 'Eigen item',
        amount: defaultAmount,
        unit,
        packageLabel: defaultLabel,
        addedAt: new Date().toISOString(),
      }];
    });
  }, [setItems]);

  // Add from restock suggestion
  const addFromSuggestion = useCallback((item: { id: string; name: string; icon: string; category: string }) => {
    setItems(prev => {
      // Check if already exists
      const existingIndex = prev.findIndex(
        i => i.name.toLowerCase() === item.name.toLowerCase() && !i.checked
      );
      
      if (existingIndex >= 0) {
        return prev;
      }
      
      const unit = getPackageSizes(item.name)?.unit || 'stuks';
      const packages = getPackageSizes(item.name);
      const defaultAmount = packages?.packages[0]?.amount || 1;
      
      return [...prev, {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: item.name,
        category: item.category as 'eiwit' | 'groente' | 'pantry' | 'overig',
        checked: false,
        recipeName: 'Van voorraad',
        amount: defaultAmount,
        unit,
        packageLabel: packages?.packages[0]?.label,
        addedAt: new Date().toISOString(),
      }];
    });
  }, [setItems]);

  const toggleItem = useCallback((id: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  }, [setItems]);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, [setItems]);

  const clearChecked = useCallback(() => {
    setItems(prev => prev.filter(item => !item.checked));
  }, [setItems]);

  // Move item to pantry (returns the item to be added to pantry)
  const moveToPantry = useCallback((id: string): PantryItem | null => {
    const itemToMove = items.find(item => item.id === id);
    if (!itemToMove) {
      return null;
    }

    setItems(prev => prev.filter(item => item.id !== id));

    return {
      id: itemToMove.id,
      name: itemToMove.name,
      category: itemToMove.category,
      amount: itemToMove.amount,
      unit: itemToMove.unit,
      addedAt: new Date().toISOString(),
      fromRecipes: itemToMove.recipeName ? itemToMove.recipeName.split(' + ') : [],
    };
  }, [items, setItems]);

  const getByCategory = useCallback(() => {
    const grouped: Record<string, ShoppingItem[]> = {
      eiwit: [],
      groente: [],
      pantry: [],
      overig: [],
    };
    
    items.filter(item => !item.checked).forEach(item => {
      if (grouped[item.category]) {
        grouped[item.category].push(item);
      } else {
        grouped.overig.push(item);
      }
    });
    
    return grouped;
  }, [items]);

  const getCheckedItems = useCallback(() => {
    return items.filter(item => item.checked);
  }, [items]);

  const getTotalCount = useCallback(() => {
    return items.filter(item => !item.checked).length;
  }, [items]);

  return {
    items,
    addItemsFromPackage,
    addCustomItem,
    addFromSuggestion,
    toggleItem,
    removeItem,
    clearChecked,
    moveToPantry,
    getByCategory,
    getCheckedItems,
    getTotalCount,
    getIconKeyForIngredient,
  };
}

import { useLocalStorage } from './useLocalStorage';
import type { ShoppingItem, PantryItem } from '@/types';
import { useCallback } from 'react';
import { getPackageSizes } from '@/data/packageSizes';

// Map old categories to new simplified categories
function normalizeCategory(category: string): 'eiwit' | 'groente' | 'pantry' | 'overig' {
  const lower = category.toLowerCase();
  
  if (/ei|kip|vlees|gehakt|bacon|ham|worst|zalm|vis|tonijn|garnaal|scampi|hüttenkäse|cottage|kaas|mozzarella|feta|parmezaan|pecorino/.test(lower)) {
    return 'eiwit';
  }
  
  if (/spinazie|broccoli|komkommer|tomaat|paprika|ui|knoflook|sla|wortel|courgette|aubergine|prei|selder|asperges|bloemkool|spruitjes|boerenkool|andijvie|paksoi|sperzieboon|doperwt|mais|avocado|groente/.test(lower)) {
    return 'groente';
  }
  
  if (/bonen|linzen|kikkererwten|kidney|olie|azijn|mayo|mosterd|ketchup|sesam|tahini|pindakaas|noten|walnoot|amandel|cashew|pinda|chia|lijnzaad|kokos|quinoa|kaneel|komijn|paprikapoeder|curry|kurkuma|peper|zout|tomatenblokjes|kokosmelk/.test(lower)) {
    return 'pantry';
  }
  
  return 'overig';
}

// Get category from ingredient name
function getCategoryForIngredient(name: string): 'eiwit' | 'groente' | 'pantry' | 'overig' {
  const packages = getPackageSizes(name);
  if (packages) {
    return packages.category;
  }
  return normalizeCategory(name);
}

// Get emoji for ingredient
function getEmojiForIngredient(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('ei')) return '🥚';
  if (lower.includes('kip') || lower.includes('vlees') || lower.includes('gehakt')) return '🥩';
  if (lower.includes('bonen') || lower.includes('linzen')) return '🫘';
  if (lower.includes('tomaat')) return '🍅';
  if (lower.includes('spinazie') || lower.includes('groente') || lower.includes('sla')) return '🥬';
  if (lower.includes('broccoli')) return '🥦';
  if (lower.includes('ui')) return '🧅';
  if (lower.includes('knoflook')) return '🧄';
  if (lower.includes('avocado')) return '🥑';
  if (lower.includes('tonijn') || lower.includes('zalm') || lower.includes('vis')) return '🐟';
  if (lower.includes('kaas') || lower.includes('huttenkase')) return '🧀';
  if (lower.includes('olie')) return '🫒';
  if (lower.includes('noten') || lower.includes('walnoot') || lower.includes('amandel')) return '🥜';
  return '📦';
}

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
          item => item.name.toLowerCase() === ingredient.name.toLowerCase() && !item.checked
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
          
          newItems[existingIndex] = {
            ...existing,
            amount: existing.amount + selectedPackage.amount,
            recipeName: existingRecipes.join(' + '),
            packageLabel: `${existing.amount + selectedPackage.amount} ${unit}`,
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
  const addFromSuggestion = useCallback((item: { id: string; name: string; emoji: string; category: string }) => {
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
    let movedItem: PantryItem | null = null;
    
    setItems(prev => {
      const item = prev.find(i => i.id === id);
      if (item) {
        movedItem = {
          id: item.id,
          name: item.name,
          category: item.category,
          amount: item.amount,
          unit: item.unit,
          addedAt: new Date().toISOString(),
          fromRecipes: item.recipeName ? item.recipeName.split(' + ') : [],
        };
      }
      return prev.filter(i => i.id !== id);
    });
    
    return movedItem;
  }, [setItems]);

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
    getEmojiForIngredient,
  };
}

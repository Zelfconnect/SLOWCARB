import { useLocalStorage } from './useLocalStorage';
import { basicStock } from '@/data/stock';

export function useStock() {
  const [checkedItems, setCheckedItems] = useLocalStorage<Record<string, boolean>>('slowcarb-stock', {});

  const toggleItem = (itemName: string) => {
    setCheckedItems(prev => ({ ...prev, [itemName]: !prev[itemName] }));
  };

  const resetAll = () => setCheckedItems({});

  const checkAll = () => {
    const allChecked: Record<string, boolean> = {};
    Object.values(basicStock).forEach(category => {
      category.forEach(item => { allChecked[item.name] = true; });
    });
    setCheckedItems(allChecked);
  };

  const getProgress = () => {
    let total = 0, checked = 0;
    Object.values(basicStock).forEach(category => {
      category.forEach(item => {
        total++;
        if (checkedItems[item.name]) checked++;
      });
    });
    return { total, checked, percentage: total > 0 ? (checked / total) * 100 : 0 };
  };

  const getEssentialProgress = () => {
    let total = 0, checked = 0;
    Object.values(basicStock).forEach(category => {
      category.forEach(item => {
        if (item.essential) {
          total++;
          if (checkedItems[item.name]) checked++;
        }
      });
    });
    return { total, checked, percentage: total > 0 ? (checked / total) * 100 : 0 };
  };

  return {
    checkedItems,
    toggleItem,
    resetAll,
    checkAll,
    getProgress,
    getEssentialProgress,
  };
}

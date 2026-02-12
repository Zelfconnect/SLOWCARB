import { useLocalStorage } from './useLocalStorage';

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>('slowcarb-favorites', []);

  const toggleFavorite = (recipeId: string) => {
    setFavorites(prev => {
      if (prev.includes(recipeId)) {
        return prev.filter(id => id !== recipeId);
      }
      return [...prev, recipeId];
    });
  };

  const isFavorite = (recipeId: string) => favorites.includes(recipeId);

  return { favorites, toggleFavorite, isFavorite };
}

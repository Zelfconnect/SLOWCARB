export function getIconKeyForIngredient(ingredientName: string): string {
  const lowerCaseIngredientName = ingredientName.toLowerCase();
  if (lowerCaseIngredientName.includes('ei')) return 'egg';
  if (lowerCaseIngredientName.includes('kip')) return 'drumstick';
  if (lowerCaseIngredientName.includes('vlees') || lowerCaseIngredientName.includes('gehakt')) return 'beef';
  if (lowerCaseIngredientName.includes('bonen') || lowerCaseIngredientName.includes('linzen')) return 'bean';
  if (
    lowerCaseIngredientName.includes('tomaat') ||
    lowerCaseIngredientName.includes('spinazie') ||
    lowerCaseIngredientName.includes('groente') ||
    lowerCaseIngredientName.includes('sla') ||
    lowerCaseIngredientName.includes('broccoli') ||
    lowerCaseIngredientName.includes('ui') ||
    lowerCaseIngredientName.includes('knoflook') ||
    lowerCaseIngredientName.includes('avocado')
  ) {
    return 'salad';
  }
  if (
    lowerCaseIngredientName.includes('tonijn') ||
    lowerCaseIngredientName.includes('zalm') ||
    lowerCaseIngredientName.includes('vis')
  ) {
    return 'fish';
  }
  return 'package';
}

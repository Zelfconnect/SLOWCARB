import { getPackageSizes } from '@/data/packageSizes';

export type IngredientCategory = 'eiwit' | 'groente' | 'pantry' | 'overig';

export function normalizeCategory(categoryName: string): IngredientCategory {
  const lowerCaseCategoryName = categoryName.toLowerCase();

  if (
    /ei|kip|vlees|gehakt|bacon|ham|worst|zalm|vis|tonijn|garnaal|scampi|hüttenkäse|cottage|kaas|mozzarella|feta|parmezaan|pecorino/.test(
      lowerCaseCategoryName
    )
  ) {
    return 'eiwit';
  }

  if (
    /spinazie|broccoli|komkommer|tomaat|paprika|ui|knoflook|sla|wortel|courgette|aubergine|prei|selder|asperges|bloemkool|spruitjes|boerenkool|andijvie|paksoi|sperzieboon|doperwt|mais|avocado|groente/.test(
      lowerCaseCategoryName
    )
  ) {
    return 'groente';
  }

  if (
    /bonen|linzen|kikkererwten|kidney|olie|azijn|mayo|mosterd|ketchup|sesam|tahini|pindakaas|noten|walnoot|amandel|cashew|pinda|chia|lijnzaad|kokos|quinoa|kaneel|komijn|paprikapoeder|curry|kurkuma|peper|zout|tomatenblokjes|kokosmelk/.test(
      lowerCaseCategoryName
    )
  ) {
    return 'pantry';
  }

  return 'overig';
}

export function getCategoryForIngredient(ingredientName: string): IngredientCategory {
  const packageConfig = getPackageSizes(ingredientName);
  if (packageConfig) {
    return packageConfig.category;
  }

  return normalizeCategory(ingredientName);
}

// Hardcoded package sizes for the Package Selector
// These are typical supermarket package sizes in the Netherlands

export interface PackageSize {
  amount: number;
  label: string;
}

export interface IngredientPackages {
  unit: 'stuks' | 'gram' | 'kg' | 'blikken' | 'zakken' | 'flessen' | 'pakken';
  packages: PackageSize[];
  category: 'eiwit' | 'groente' | 'pantry';
}

export const PACKAGE_SIZES: Record<string, IngredientPackages> = {
  // EIwit
  'eieren': {
    unit: 'stuks',
    packages: [
      { amount: 6, label: '6 stuks (klein)' },
      { amount: 10, label: '10 stuks (standaard)' },
      { amount: 12, label: '12 stuks (dozijn)' },
      { amount: 20, label: '20 stuks (voordeelpak)' },
    ],
    category: 'eiwit',
  },
  'rundergehakt': {
    unit: 'gram',
    packages: [
      { amount: 300, label: '300g' },
      { amount: 500, label: '500g' },
      { amount: 750, label: '750g' },
      { amount: 1000, label: '1kg' },
    ],
    category: 'eiwit',
  },
  'kipfilet': {
    unit: 'gram',
    packages: [
      { amount: 300, label: '300g' },
      { amount: 500, label: '500g' },
      { amount: 1000, label: '1kg' },
    ],
    category: 'eiwit',
  },
  'kip': {
    unit: 'gram',
    packages: [
      { amount: 500, label: '500g' },
      { amount: 1000, label: '1kg' },
    ],
    category: 'eiwit',
  },
  'varkensgehakt': {
    unit: 'gram',
    packages: [
      { amount: 300, label: '300g' },
      { amount: 500, label: '500g' },
      { amount: 750, label: '750g' },
      { amount: 1000, label: '1kg' },
    ],
    category: 'eiwit',
  },
  'bacon': {
    unit: 'gram',
    packages: [
      { amount: 150, label: '150g' },
      { amount: 300, label: '300g (familiepak)' },
    ],
    category: 'eiwit',
  },
  'ham': {
    unit: 'gram',
    packages: [
      { amount: 100, label: '100g' },
      { amount: 200, label: '200g (familiepak)' },
    ],
    category: 'eiwit',
  },
  'zalm': {
    unit: 'gram',
    packages: [
      { amount: 200, label: '200g' },
      { amount: 400, label: '400g' },
    ],
    category: 'eiwit',
  },
  'tonijn': {
    unit: 'blikken',
    packages: [
      { amount: 1, label: '1 blik (145g)' },
      { amount: 4, label: '4-pack (145g)' },
    ],
    category: 'eiwit',
  },
  'huttenkase': {
    unit: 'gram',
    packages: [
      { amount: 200, label: '200g' },
      { amount: 400, label: '400g' },
    ],
    category: 'eiwit',
  },
  'cottage cheese': {
    unit: 'gram',
    packages: [
      { amount: 200, label: '200g' },
      { amount: 400, label: '400g' },
    ],
    category: 'eiwit',
  },

  // GROENTE
  'spinazie': {
    unit: 'gram',
    packages: [
      { amount: 150, label: 'Vers (150g)' },
      { amount: 250, label: 'Vers (250g)' },
      { amount: 400, label: 'Vers (400g)' },
      { amount: 450, label: 'Diepvries (450g)' },
      { amount: 750, label: 'Diepvries (750g)' },
    ],
    category: 'groente',
  },
  'broccoli': {
    unit: 'stuks',
    packages: [
      { amount: 1, label: '1 stuk (~400g)' },
      { amount: 2, label: '2 stuks (~800g)' },
    ],
    category: 'groente',
  },
  'cherry tomaten': {
    unit: 'gram',
    packages: [
      { amount: 250, label: '1 bakje (250g)' },
      { amount: 500, label: '2 bakjes (500g)' },
    ],
    category: 'groente',
  },
  'tomaat': {
    unit: 'gram',
    packages: [
      { amount: 500, label: '500g' },
      { amount: 1000, label: '1kg' },
    ],
    category: 'groente',
  },
  'komkommer': {
    unit: 'stuks',
    packages: [
      { amount: 1, label: '1 stuk' },
      { amount: 3, label: '3 stuks (voordeel)' },
    ],
    category: 'groente',
  },
  'paprika': {
    unit: 'stuks',
    packages: [
      { amount: 3, label: '3-pack' },
      { amount: 6, label: '6-pack' },
    ],
    category: 'groente',
  },
  'ui': {
    unit: 'kg',
    packages: [
      { amount: 1, label: '1kg net' },
      { amount: 2, label: '2kg net' },
    ],
    category: 'groente',
  },
  'knoflook': {
    unit: 'stuks',
    packages: [
      { amount: 1, label: '1 bol' },
      { amount: 3, label: '3 bollen' },
    ],
    category: 'groente',
  },
  'avocado': {
    unit: 'stuks',
    packages: [
      { amount: 2, label: '2 stuks (net)' },
      { amount: 4, label: '4 stuks (net)' },
    ],
    category: 'groente',
  },
  'courgette': {
    unit: 'stuks',
    packages: [
      { amount: 1, label: '1 stuk' },
      { amount: 2, label: '2 stuks' },
    ],
    category: 'groente',
  },
  'aubergine': {
    unit: 'stuks',
    packages: [
      { amount: 1, label: '1 stuk' },
      { amount: 2, label: '2 stuks' },
    ],
    category: 'groente',
  },
  'sla': {
    unit: 'stuks',
    packages: [
      { amount: 1, label: '1 krop' },
      { amount: 2, label: '2 kropen' },
    ],
    category: 'groente',
  },

  // PANTRY / BONEN
  'zwarte bonen': {
    unit: 'blikken',
    packages: [
      { amount: 1, label: '1 blik (400g)' },
      { amount: 3, label: '3-pack (400g)' },
    ],
    category: 'pantry',
  },
  'kidney bonen': {
    unit: 'blikken',
    packages: [
      { amount: 1, label: '1 blik (400g)' },
      { amount: 3, label: '3-pack (400g)' },
    ],
    category: 'pantry',
  },
  'linzen': {
    unit: 'gram',
    packages: [
      { amount: 400, label: '1 blik (400g)' },
      { amount: 500, label: '1 pak gedroogd (500g)' },
    ],
    category: 'pantry',
  },
  'kikkererwten': {
    unit: 'blikken',
    packages: [
      { amount: 1, label: '1 blik (400g)' },
      { amount: 3, label: '3-pack (400g)' },
    ],
    category: 'pantry',
  },
  'tomatenblokjes': {
    unit: 'blikken',
    packages: [
      { amount: 1, label: '1 blik (400g)' },
      { amount: 3, label: '3-pack (400g)' },
    ],
    category: 'pantry',
  },
  'tomatenpuree': {
    unit: 'gram',
    packages: [
      { amount: 70, label: '1 tube (70g)' },
      { amount: 140, label: '2 tubes (140g)' },
    ],
    category: 'pantry',
  },
  'kokosmelk': {
    unit: 'blikken',
    packages: [
      { amount: 1, label: '1 blik (400ml)' },
      { amount: 4, label: '4-pack (400ml)' },
    ],
    category: 'pantry',
  },
  'olijfolie': {
    unit: 'flessen',
    packages: [
      { amount: 1, label: '1 fles (500ml)' },
      { amount: 2, label: '2 flessen (1L)' },
    ],
    category: 'pantry',
  },
  'chiazaad': {
    unit: 'gram',
    packages: [
      { amount: 200, label: '1 pak (200g)' },
      { amount: 400, label: '2 pakken' },
    ],
    category: 'pantry',
  },
  'walnoten': {
    unit: 'gram',
    packages: [
      { amount: 200, label: '1 zak (200g)' },
      { amount: 400, label: '2 zakken (400g)' },
    ],
    category: 'pantry',
  },
  'amandelen': {
    unit: 'gram',
    packages: [
      { amount: 200, label: '1 zak (200g)' },
      { amount: 400, label: '2 zakken (400g)' },
    ],
    category: 'pantry',
  },
  'cashewnoten': {
    unit: 'gram',
    packages: [
      { amount: 200, label: '1 zak (200g)' },
      { amount: 400, label: '2 zakken (400g)' },
    ],
    category: 'pantry',
  },
  'pindakaas': {
    unit: 'gram',
    packages: [
      { amount: 350, label: '1 pot (350g)' },
      { amount: 650, label: '1 pot (650g)' },
    ],
    category: 'pantry',
  },
  'tahini': {
    unit: 'gram',
    packages: [
      { amount: 300, label: '1 pot (300g)' },
      { amount: 500, label: '1 pot (500g)' },
    ],
    category: 'pantry',
  },

  // KRUIDEN
  'komijn': {
    unit: 'gram',
    packages: [
      { amount: 20, label: '1 potje (20g)' },
      { amount: 40, label: '1 potje (40g)' },
    ],
    category: 'pantry',
  },
  'paprikapoeder': {
    unit: 'gram',
    packages: [
      { amount: 20, label: '1 potje (20g)' },
      { amount: 40, label: '1 potje (40g)' },
    ],
    category: 'pantry',
  },
  'kurkuma': {
    unit: 'gram',
    packages: [
      { amount: 20, label: '1 potje (20g)' },
      { amount: 40, label: '1 potje (40g)' },
    ],
    category: 'pantry',
  },
  'kaneel': {
    unit: 'gram',
    packages: [
      { amount: 20, label: '1 potje (20g)' },
      { amount: 40, label: '1 potje (40g)' },
    ],
    category: 'pantry',
  },
  'zout': {
    unit: 'gram',
    packages: [
      { amount: 500, label: '1 pot (500g)' },
      { amount: 1000, label: '1 pot (1kg)' },
    ],
    category: 'pantry',
  },
  'peper': {
    unit: 'gram',
    packages: [
      { amount: 50, label: '1 potje (50g)' },
      { amount: 100, label: '1 potje (100g)' },
    ],
    category: 'pantry',
  },
};

// Standard pantry items that users might want to always keep stocked
export const STANDARD_PANTRY_ITEMS = [
  { id: 'eieren', name: 'Eieren', icon: 'egg', category: 'eiwit' as const },
  { id: 'rundergehakt', name: 'Rundergehakt', icon: 'beef', category: 'eiwit' as const },
  { id: 'kipfilet', name: 'Kipfilet', icon: 'drumstick', category: 'eiwit' as const },
  { id: 'zwarte bonen', name: 'Zwarte bonen', icon: 'bean', category: 'pantry' as const },
  { id: 'kidney bonen', name: 'Kidney bonen', icon: 'bean', category: 'pantry' as const },
  { id: 'linzen', name: 'Linzen', icon: 'bean', category: 'pantry' as const },
  { id: 'tomatenblokjes', name: 'Tomatenblokjes', icon: 'package', category: 'pantry' as const },
  { id: 'tonijn', name: 'Tonijn', icon: 'fish', category: 'eiwit' as const },
  { id: 'spinazie', name: 'Spinazie', icon: 'salad', category: 'groente' as const },
  { id: 'broccoli', name: 'Broccoli', icon: 'salad', category: 'groente' as const },
  { id: 'ui', name: 'Uien', icon: 'salad', category: 'groente' as const },
  { id: 'knoflook', name: 'Knoflook', icon: 'salad', category: 'groente' as const },
];

// Helper function to find package sizes for an ingredient
export function getPackageSizes(ingredientName: string): IngredientPackages | null {
  // Try exact match first
  if (PACKAGE_SIZES[ingredientName.toLowerCase()]) {
    return PACKAGE_SIZES[ingredientName.toLowerCase()];
  }

  // Try partial match
  const key = Object.keys(PACKAGE_SIZES).find(k =>
    ingredientName.toLowerCase().includes(k) ||
    k.includes(ingredientName.toLowerCase())
  );

  return key ? PACKAGE_SIZES[key] : null;
}

// Helper to round up to the smallest package that covers the needed amount
export function roundToPackage(ingredientName: string, amountNeeded: number): PackageSize | null {
  const packages = getPackageSizes(ingredientName);
  if (!packages) return null;

  const sortedPackages = [...packages.packages].sort((a, b) => a.amount - b.amount);

  for (const pkg of sortedPackages) {
    if (pkg.amount >= amountNeeded) {
      return pkg;
    }
  }

  return sortedPackages[sortedPackages.length - 1] ?? null;
}

// Helper to get default package (smallest that meets requirement)
export function getDefaultPackage(ingredientName: string, requiredAmount: number): PackageSize | null {
  const packages = getPackageSizes(ingredientName);
  if (!packages) return null;

  // Find smallest package that meets or exceeds requirement
  for (const pkg of packages.packages) {
    if (pkg.amount >= requiredAmount) {
      return pkg;
    }
  }

  // If none meet requirement, return largest
  return packages.packages[packages.packages.length - 1];
}

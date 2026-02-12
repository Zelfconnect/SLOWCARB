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
      { amount: 3, label: '3 stuks' },
      { amount: 6, label: '6 stuks' },
      { amount: 12, label: '12 stuks (dozijn)' },
    ],
    category: 'eiwit',
  },
  'rundergehakt': {
    unit: 'gram',
    packages: [
      { amount: 500, label: '500g' },
      { amount: 1000, label: '1kg' },
      { amount: 2000, label: '2kg bulk' },
    ],
    category: 'eiwit',
  },
  'kipfilet': {
    unit: 'gram',
    packages: [
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
      { amount: 500, label: '500g' },
      { amount: 1000, label: '1kg' },
    ],
    category: 'eiwit',
  },
  'bacon': {
    unit: 'gram',
    packages: [
      { amount: 150, label: '150g' },
      { amount: 300, label: '300g' },
    ],
    category: 'eiwit',
  },
  'ham': {
    unit: 'gram',
    packages: [
      { amount: 100, label: '100g' },
      { amount: 200, label: '200g' },
    ],
    category: 'eiwit',
  },
  'zalm': {
    unit: 'gram',
    packages: [
      { amount: 250, label: '250g' },
      { amount: 500, label: '500g' },
    ],
    category: 'eiwit',
  },
  'tonijn': {
    unit: 'blikken',
    packages: [
      { amount: 1, label: '1 blik' },
      { amount: 4, label: '4 blikken' },
    ],
    category: 'eiwit',
  },
  'huttenkase': {
    unit: 'gram',
    packages: [
      { amount: 250, label: '250g' },
      { amount: 500, label: '500g' },
    ],
    category: 'eiwit',
  },
  'cottage cheese': {
    unit: 'gram',
    packages: [
      { amount: 250, label: '250g' },
      { amount: 500, label: '500g' },
    ],
    category: 'eiwit',
  },

  // GROENTE
  'spinazie': {
    unit: 'gram',
    packages: [
      { amount: 75, label: '1 zak (75g)' },
      { amount: 150, label: '2 zakken (150g)' },
      { amount: 400, label: 'Diepvries (400g)' },
    ],
    category: 'groente',
  },
  'broccoli': {
    unit: 'gram',
    packages: [
      { amount: 300, label: '1 stuk (~300g)' },
      { amount: 600, label: '2 stuks (~600g)' },
    ],
    category: 'groente',
  },
  'cherry tomaten': {
    unit: 'stuks',
    packages: [
      { amount: 10, label: '1 bakje (10 stuks)' },
      { amount: 20, label: '2 bakjes (20 stuks)' },
    ],
    category: 'groente',
  },
  'tomaat': {
    unit: 'stuks',
    packages: [
      { amount: 4, label: '4 stuks' },
      { amount: 8, label: '8 stuks' },
    ],
    category: 'groente',
  },
  'komkommer': {
    unit: 'stuks',
    packages: [
      { amount: 1, label: '1 stuk' },
      { amount: 3, label: '3 stuks' },
    ],
    category: 'groente',
  },
  'paprika': {
    unit: 'stuks',
    packages: [
      { amount: 2, label: '2 stuks' },
      { amount: 4, label: '4 stuks' },
    ],
    category: 'groente',
  },
  'ui': {
    unit: 'stuks',
    packages: [
      { amount: 3, label: '3 stuks' },
      { amount: 6, label: '6 stuks (netje)' },
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
      { amount: 1, label: '1 stuk' },
      { amount: 3, label: '3 stuks (rijp)' },
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
      { amount: 1, label: '1 blik' },
      { amount: 6, label: '6 blikken (voordeel)' },
    ],
    category: 'pantry',
  },
  'kidney bonen': {
    unit: 'blikken',
    packages: [
      { amount: 1, label: '1 blik' },
      { amount: 6, label: '6 blikken (voordeel)' },
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
      { amount: 1, label: '1 blik' },
      { amount: 6, label: '6 blikken (voordeel)' },
    ],
    category: 'pantry',
  },
  'tomatenblokjes': {
    unit: 'blikken',
    packages: [
      { amount: 1, label: '1 blik' },
      { amount: 4, label: '4 blikken' },
    ],
    category: 'pantry',
  },
  'tomatenpuree': {
    unit: 'gram',
    packages: [
      { amount: 140, label: '1 tube (140g)' },
      { amount: 280, label: '2 tubes' },
    ],
    category: 'pantry',
  },
  'kokosmelk': {
    unit: 'blikken',
    packages: [
      { amount: 1, label: '1 blik' },
      { amount: 4, label: '4 blikken' },
    ],
    category: 'pantry',
  },
  'olijfolie': {
    unit: 'flessen',
    packages: [
      { amount: 1, label: '1 fles (500ml)' },
      { amount: 2, label: '2 flessen' },
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
      { amount: 100, label: '1 zak (100g)' },
      { amount: 250, label: '1 zak (250g)' },
    ],
    category: 'pantry',
  },
  'amandelen': {
    unit: 'gram',
    packages: [
      { amount: 100, label: '1 zak (100g)' },
      { amount: 250, label: '1 zak (250g)' },
    ],
    category: 'pantry',
  },
  'cashewnoten': {
    unit: 'gram',
    packages: [
      { amount: 100, label: '1 zak (100g)' },
      { amount: 250, label: '1 zak (250g)' },
    ],
    category: 'pantry',
  },
  'pindakaas': {
    unit: 'gram',
    packages: [
      { amount: 350, label: '1 pot (350g)' },
      { amount: 700, label: '1 pot (700g)' },
    ],
    category: 'pantry',
  },
  'tahini': {
    unit: 'gram',
    packages: [
      { amount: 250, label: '1 pot (250g)' },
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
      { amount: 250, label: '1 pot (250g)' },
      { amount: 500, label: '1 pot (500g)' },
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
  { id: 'eieren', name: 'Eieren', emoji: '🥚', category: 'eiwit' as const },
  { id: 'rundergehakt', name: 'Rundergehakt', emoji: '🥩', category: 'eiwit' as const },
  { id: 'kipfilet', name: 'Kipfilet', emoji: '🍗', category: 'eiwit' as const },
  { id: 'zwarte bonen', name: 'Zwarte bonen', emoji: '🫘', category: 'pantry' as const },
  { id: 'kidney bonen', name: 'Kidney bonen', emoji: '🫘', category: 'pantry' as const },
  { id: 'linzen', name: 'Linzen', emoji: '🫘', category: 'pantry' as const },
  { id: 'tomatenblokjes', name: 'Tomatenblokjes', emoji: '🥫', category: 'pantry' as const },
  { id: 'tonijn', name: 'Tonijn', emoji: '🐟', category: 'eiwit' as const },
  { id: 'spinazie', name: 'Spinazie', emoji: '🥬', category: 'groente' as const },
  { id: 'broccoli', name: 'Broccoli', emoji: '🥦', category: 'groente' as const },
  { id: 'ui', name: 'Uien', emoji: '🧅', category: 'groente' as const },
  { id: 'knoflook', name: 'Knoflook', emoji: '🧄', category: 'groente' as const },
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

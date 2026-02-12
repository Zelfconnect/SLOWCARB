# PRD: Ammo Check

## Overview
Replace the complex shopping list with a simple "Ammo Check" — a zone-based inventory system that matches how users actually store food.

## Philosophy
- **No calculations** — Binary check: full or not full
- **Zone-based** — Matches physical storage locations (vriezer, kast, koelkast, tools)
- **Bulk-proof** — Based on actual slow-carb consumption patterns
- **Military framing** — "Locked and loaded" when ready

## User Flow
1. User opens Boodschappen tab
2. Sees 4 collapsed accordion panels (zones)
3. Expands a zone → sees checklist items
4. Checks items they have in stock
5. Panel header shows status: 🟢 green (all checked) or 🔴 red (something missing)
6. When all 4 zones green → "Locked and loaded. Go prep."

## Implementation

### Replace ShoppingListSection with AmmoCheck component

```tsx
// New component: src/components/AmmoCheck.tsx

interface AmmoZone {
  id: string;
  name: string;
  emoji: string;
  items: AmmoItem[];
}

interface AmmoItem {
  id: string;
  name: string;
  checked: boolean;
}

const DEFAULT_ZONES: AmmoZone[] = [
  {
    id: 'vriezer',
    name: 'De Vriezer',
    emoji: '🧊',
    items: [
      { id: 'kip', name: '2kg kipfilet (of 1 grote zak diepvries)', checked: false },
      { id: 'broccoli', name: '4 zakken diepvries broccoli (1kg)', checked: false },
      { id: 'spinazie-vries', name: '2 zakken diepvries spinazie', checked: false },
      { id: 'edamame', name: '1 zak edamame/sojabonen (optioneel)', checked: false },
    ],
  },
  {
    id: 'voorraadkast',
    name: 'De Voorraadkast',
    emoji: '🥫',
    items: [
      { id: 'bonen', name: '12 blikken zwarte bonen (minimum)', checked: false },
      { id: 'tonijn', name: '6 blikken tonijn (emergency dagen)', checked: false },
      { id: 'tomaten', name: '6 blikken tomatenblokjes', checked: false },
      { id: 'olie', name: 'Grote pot kokosolie of olijfolie', checked: false },
      { id: 'kruiden', name: 'Peper, zout, komijn, chili flakes', checked: false },
      { id: 'azijn', name: 'Balsamico/azijn (optioneel)', checked: false },
    ],
  },
  {
    id: 'koelkast',
    name: 'De Koelkast',
    emoji: '🥶',
    items: [
      { id: 'eieren', name: '2 dozijn eieren (24 stuks)', checked: false },
      { id: 'spinazie-vers', name: '1 zak verse spinazie (zondag recovery)', checked: false },
      { id: 'sambal', name: 'Sambal & knoflook', checked: false },
    ],
  },
  {
    id: 'tools',
    name: 'Airfryer Station',
    emoji: '🍳',
    items: [
      { id: 'bakpapier', name: 'Bakpapier (voor airfryer mandje)', checked: false },
      { id: 'oliespray', name: 'Olie spray fles (geen spuitbus)', checked: false },
      { id: 'mengkom', name: 'Grote mengkom (marineren)', checked: false },
      { id: 'bakjes', name: '5 vershoudbakjes (mealprep)', checked: false },
    ],
  },
];
```

### UI Design

```
┌─────────────────────────────────────┐
│  🎯 Ammo Check                      │
│  Check je zones. Iets leeg? Restock.│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 🟢 🧊 De Vriezer              ▼    │
├─────────────────────────────────────┤
│ ☑️ 2kg kipfilet                     │
│ ☑️ 4 zakken diepvries broccoli      │
│ ☑️ 2 zakken diepvries spinazie      │
│ ☐ 1 zak edamame (optioneel)         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 🔴 🥫 De Voorraadkast         ▼    │
├─────────────────────────────────────┤
│ ☐ 12 blikken zwarte bonen           │  ← RED: niet gecheckt
│ ☑️ 6 blikken tonijn                 │
│ ...                                 │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 🟢 🥶 De Koelkast             ▸    │  ← Collapsed
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 🟢 🍳 Airfryer Station        ▸    │  ← Collapsed
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  ⚠️ Voorraadkast laag               │
│  Tijd voor een groothandel run      │
└─────────────────────────────────────┘

        ─── OR when all green ───

┌─────────────────────────────────────┐
│  ✅ Locked and loaded               │
│  Je bent klaar voor de komende      │
│  2 weken. Go prep.                  │
└─────────────────────────────────────┘
```

### State Management

Use localStorage hook (same pattern as existing):

```typescript
const [zones, setZones] = useLocalStorage<AmmoZone[]>('slowcarb-ammo-v1', DEFAULT_ZONES);
```

### Status Logic

```typescript
function getZoneStatus(zone: AmmoZone): 'green' | 'red' {
  // Optioneel items niet meerekenen voor rode status
  const requiredItems = zone.items.filter(i => !i.name.includes('optioneel'));
  return requiredItems.every(i => i.checked) ? 'green' : 'red';
}

function getAllZonesStatus(zones: AmmoZone[]): 'locked' | 'restock' {
  return zones.every(z => getZoneStatus(z) === 'green') ? 'locked' : 'restock';
}
```

### Files to Modify

1. **Create:** `src/components/AmmoCheck.tsx` — New component
2. **Modify:** `src/pages/Shopping.tsx` — Replace ShoppingListSection with AmmoCheck
3. **Delete:** Can remove complex shopping hooks if not used elsewhere:
   - `src/hooks/useShoppingList.ts` — Remove if unused
   - `src/components/ShoppingListSection.tsx` — Remove
   - `src/components/StockSection.tsx` — Remove (merged into AmmoCheck)
4. **Keep:** `src/data/packageSizes.ts` — Might be useful for future features

### Styling

- Use existing card-premium class for accordion panels
- Sage green for checked items, stone for unchecked
- Red accent (rose-500) for warning states
- Collapsed panels: rounded-2xl, subtle shadow
- Expanded: smooth animation (Framer Motion if desired)

### Mobile Considerations

- Touch targets: 44px minimum (h-11)
- Full-width accordions
- Clear visual distinction between zones
- Bottom padding for nav bar (pb-24)

## Success Criteria

1. ✅ 4 accordion panels render correctly
2. ✅ Checkboxes persist in localStorage
3. ✅ Panel headers show green/red status
4. ✅ "Locked and loaded" message when all complete
5. ✅ Mobile responsive (works on iPhone)
6. ✅ No complex calculations — just checkboxes

## Out of Scope

- Package size calculations
- Recipe integration
- Restock reminders/notifications
- Sharing lists
- Grocery delivery integration

## Timeline

Single Codex run — estimated 15-20 minutes.

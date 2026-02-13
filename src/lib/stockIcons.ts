import {
  Bean,
  Beef,
  Drumstick,
  Egg,
  Fish,
  Leaf,
  Package,
  Salad,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

export type StockIconKey =
  | 'bean'
  | 'beef'
  | 'drumstick'
  | 'egg'
  | 'fish'
  | 'leaf'
  | 'package'
  | 'salad'
  | 'sparkles';

const STOCK_ICONS: Record<StockIconKey, { Icon: LucideIcon; label: string }> = {
  bean: { Icon: Bean, label: 'Bonen' },
  beef: { Icon: Beef, label: 'Vlees' },
  drumstick: { Icon: Drumstick, label: 'Kip' },
  egg: { Icon: Egg, label: 'Eieren' },
  fish: { Icon: Fish, label: 'Vis' },
  leaf: { Icon: Leaf, label: 'Kruiden' },
  package: { Icon: Package, label: 'Voorraadkast' },
  salad: { Icon: Salad, label: 'Groenten' },
  sparkles: { Icon: Sparkles, label: 'Extra' },
};

export function getStockIconInfo(key: string) {
  const normalized = key.trim().toLowerCase() as StockIconKey;
  return STOCK_ICONS[normalized] ?? STOCK_ICONS.package;
}

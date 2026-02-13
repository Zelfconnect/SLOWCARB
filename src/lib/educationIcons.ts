import {
  Apple,
  Ban,
  Bean,
  Beef,
  CakeSlice,
  Calendar,
  Candy,
  CheckCircle2,
  ClipboardList,
  Coffee,
  CupSoda,
  Droplet,
  Droplets,
  Egg,
  Flame,
  Frown,
  Leaf,
  Milk,
  Nut,
  PartyPopper,
  Pizza,
  RefreshCcw,
  RotateCcw,
  Salad,
  SlidersHorizontal,
  Sparkles,
  Sprout,
  Target,
  TrendingDown,
  Utensils,
  Wheat,
  Wine,
  XCircle,
  Zap,
  type LucideIcon,
} from 'lucide-react';

export type EducationIconKey =
  | 'check-circle'
  | 'clipboard-list'
  | 'apple'
  | 'ban'
  | 'bean'
  | 'beef'
  | 'cake-slice'
  | 'calendar'
  | 'candy'
  | 'coffee'
  | 'cup-soda'
  | 'droplet'
  | 'droplets'
  | 'egg'
  | 'flame'
  | 'frown'
  | 'leaf'
  | 'milk'
  | 'nut'
  | 'party-popper'
  | 'pizza'
  | 'refresh-ccw'
  | 'rotate-ccw'
  | 'salad'
  | 'sliders-horizontal'
  | 'sparkles'
  | 'sprout'
  | 'target'
  | 'trending-down'
  | 'utensils'
  | 'wheat'
  | 'wine'
  | 'x-circle'
  | 'zap';

const EDUCATION_ICONS: Record<EducationIconKey, LucideIcon> = {
  'check-circle': CheckCircle2,
  'clipboard-list': ClipboardList,
  apple: Apple,
  ban: Ban,
  bean: Bean,
  beef: Beef,
  'cake-slice': CakeSlice,
  calendar: Calendar,
  candy: Candy,
  coffee: Coffee,
  'cup-soda': CupSoda,
  droplet: Droplet,
  droplets: Droplets,
  egg: Egg,
  flame: Flame,
  frown: Frown,
  leaf: Leaf,
  milk: Milk,
  nut: Nut,
  'party-popper': PartyPopper,
  pizza: Pizza,
  'refresh-ccw': RefreshCcw,
  'rotate-ccw': RotateCcw,
  salad: Salad,
  'sliders-horizontal': SlidersHorizontal,
  sparkles: Sparkles,
  sprout: Sprout,
  target: Target,
  'trending-down': TrendingDown,
  utensils: Utensils,
  wheat: Wheat,
  wine: Wine,
  'x-circle': XCircle,
  zap: Zap,
};

export function getEducationIcon(key: string): LucideIcon | null {
  const normalized = key.trim().toLowerCase() as EducationIconKey;
  return EDUCATION_ICONS[normalized] ?? null;
}

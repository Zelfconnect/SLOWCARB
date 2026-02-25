import type { CheatDay } from '@/types';

export const CHEAT_DAY_OPTIONS: CheatDay[] = [
  'maandag',
  'dinsdag',
  'woensdag',
  'donderdag',
  'vrijdag',
  'zaterdag',
  'zondag',
];

export const CHEAT_DAY_LABELS: Record<CheatDay, string> = {
  maandag: 'Maandag',
  dinsdag: 'Dinsdag',
  woensdag: 'Woensdag',
  donderdag: 'Donderdag',
  vrijdag: 'Vrijdag',
  zaterdag: 'Zaterdag',
  zondag: 'Zondag',
};

// JavaScript getDay(): zondag=0, maandag=1, ... zaterdag=6
export const CHEAT_DAY_TO_JS_DAY_INDEX: Record<CheatDay, number> = {
  maandag: 1,
  dinsdag: 2,
  woensdag: 3,
  donderdag: 4,
  vrijdag: 5,
  zaterdag: 6,
  zondag: 0,
};

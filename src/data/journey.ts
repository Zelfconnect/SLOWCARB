import type { DayTip } from '@/types';

export const dayTips: DayTip[] = [
  {
    day: 1,
    title: 'De Laatste Maaltijd',
    tips: [
      'Waarschijnlijk geen verschil merkbaar',
      'Motivatie is hoog — gebruik dit!',
      'Bereid je voorraad voor',
      'Plan je eerste week maaltijden',
    ],
    metabolicState: 'Laatste koolhydraatmaaltijd wordt verwerkt. Glycogeenopslag is vol.',
  },
  {
    day: 2,
    title: 'De Overschakeling Begint',
    tips: [
      'Mogelijk lichte hoofdpijn — drink extra water',
      'Meer dorst dan normaal',
      'Energie: lichte dip mogelijk',
      'Vaker plassen (water volgt glycogeen)',
    ],
    metabolicState: 'Glycogeen begint te dalen. Lever start gluconeogenese.',
  },
  {
    day: 3,
    title: 'De Moeilijkste Dag',
    tips: [
      'Drink veel (2-3 liter)',
      'Zout je eten extra (elektrolyten)',
      'Eet genoeg — dit is niet het moment voor restrictie',
      'Ga vroeg naar bed',
      'Dit is tijdelijk — morgen is beter!',
    ],
    metabolicState: 'Glycogeen is significant gedaald. Hersenen schreeuwen om glucose.',
  },
  {
    day: 4,
    title: 'Het Keerpunt',
    tips: [
      'Hoofdpijn neemt af',
      'Energie begint te stabiliseren',
      'Minder cravings',
      'Langer vol gevoel na maaltijden',
    ],
    metabolicState: 'Lever is efficiënter in gluconeogenese. Ketonen stijgen verder.',
  },
  {
    day: 5,
    title: 'Eerste Glimp',
    tips: [
      'Energie merkbaar stabieler',
      'Geen mid-afternoon crash',
      'Slaap mogelijk beter',
      'Je kunt verder komen tussen maaltijden',
    ],
    metabolicState: '~50% van je energie komt nu uit vetzuren/ketonen.',
  },
  {
    day: 6,
    title: 'Dag Voor Cheatdag',
    tips: [
      'Energie is goed',
      'Mogelijk wat loom (leptine is gedaald)',
      'Je kijkt uit naar morgen — dat is de bedoeling!',
      'Kleren voelen al anders',
    ],
    metabolicState: 'Leptine is gedaald door calorietekort. Dit is PRECIES waarom je morgen cheatdag hebt.',
  },
  {
    day: 7,
    title: 'Cheatdag!',
    tips: [
      'Geniet van ELKE hap',
      'Geen schuldgevoel — dit is onderdeel van het plan',
      'Merk op hoe je lichaam reageert op koolhydraten',
      'Morgen: direct terug naar protocol',
    ],
    metabolicState: 'Insuline spiket HARD. Leptine reset. Glycogeen wordt aangevuld.',
  },
];

export const weekTips: Record<number, { title: string; tips: string[]; warning?: string }> = {
  1: {
    title: 'Week 1: de aanpassing',
    tips: [
      'Dag 3 is het moeilijkst — verwacht hoofdpijn',
      'Drink 2-3 liter water per dag',
      'Zout je eten extra',
      'Eet genoeg — geen caloriebeperking',
      'Verwacht 2-4kg verlies (grotendeels water)',
    ],
    warning: 'Week 1 is de moeilijkste. Het wordt beter!',
  },
  2: {
    title: 'Week 2: de omschakeling',
    tips: [
      'Eerste cheat day kan zwaar vallen — dit is normaal',
      'Energie begint te stabiliseren',
      'Honger neemt merkbaar af',
      'Mogelijk betere slaap',
    ],
  },
  3: {
    title: 'Week 3: in het ritme',
    tips: [
      'Gewicht kan stilstaan — dit is het Whoosh Effect',
      'Je verliest WEL vet, maar vetcellen vullen met water',
      'Meet je buikomtrek — die daalt vaak wél',
      'Geduld — de whoosh komt',
    ],
    warning: 'Plateau in week 3 is NORMAAL. Vertrouw het proces.',
  },
};

export const getDayTip = (day: number): DayTip | undefined => dayTips.find(tip => tip.day === day);

export const getWeekTip = (week: number) => weekTips[week];

export const getCurrentDayTip = (startDate: string | null) => {
  if (!startDate) return { day: 0, tip: undefined, weekTip: undefined };
  
  const start = new Date(startDate);
  const now = new Date();
  const diffTime = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  
  const day = Math.min(diffDays, 84);
  const week = Math.ceil(day / 7);
  
  return {
    day,
    tip: getDayTip(day),
    weekTip: getWeekTip(week),
  };
};

import type { DayTip } from '@/types';

const baseWeekDayTips: Omit<DayTip, 'day'>[] = [
  {
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
    title: 'Pre-Cheat Day',
    tips: [
      'Energie is goed',
      'Mogelijk wat loom (leptine is gedaald)',
      'Je kijkt uit naar morgen — dat is de bedoeling!',
      'Kleren voelen al anders',
    ],
    metabolicState: 'Leptine is gedaald door calorietekort. Dit is PRECIES waarom je morgen cheat day hebt.',
  },
  {
    title: 'Cheat Day!',
    tips: [
      'Geniet van ELKE hap',
      'Geen schuldgevoel — dit is onderdeel van het plan',
      'Merk op hoe je lichaam reageert op koolhydraten',
      'Morgen: direct terug naar protocol',
    ],
    metabolicState: 'Insuline spiket HARD. Leptine reset. Glycogeen wordt aangevuld.',
  },
];

export const dayTips: DayTip[] = Array.from({ length: 84 }, (_, index) => {
  const day = index + 1;
  const baseTip = baseWeekDayTips[index % baseWeekDayTips.length];

  return {
    day,
    title: baseTip.title,
    tips: [...baseTip.tips],
    metabolicState: baseTip.metabolicState,
  };
});

export const getCurrentPhase = (day: number): Omit<DayTip, 'day'> | undefined => {
  if (!Number.isInteger(day) || day < 1 || day > dayTips.length) return undefined;
  return baseWeekDayTips[(day - 1) % baseWeekDayTips.length];
};

export const weekTips: Record<number, { title: string; tips: string[]; warning?: string }> = {
  1: {
    title: 'Week 1: De Aanpassing',
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
    title: 'Week 2: De Omschakeling',
    tips: [
      'Eerste cheat day kan zwaar vallen — dit is normaal',
      'Energie begint te stabiliseren',
      'Honger neemt merkbaar af',
      'Mogelijk betere slaap',
    ],
  },
  3: {
    title: 'Week 3: De Groove',
    tips: [
      'Gewicht kan stilstaan — dit is het Whoosh Effect',
      'Je verliest WEL vet, maar vetcellen vullen met water',
      'Meet je buikomtrek — die daalt vaak wél',
      'Geduld — de whoosh komt',
    ],
    warning: 'Week 3 plateau is NORMAAL. Vertrouw het proces.',
  },
  4: {
    title: 'Week 4: Eerste Versnelling',
    tips: [
      'Je routine wordt automatischer',
      'Focus op consistente porties peulvruchten',
      'Blijf krachttraining of wandelen volhouden',
      'Maak je cheat day vooraf bewust, niet impulsief',
    ],
  },
  5: {
    title: 'Week 5: Stabiliteit',
    tips: [
      'Energie is vaak stabiel gedurende de dag',
      'Houd vaste eetmomenten aan',
      'Varieer je recepten om verveling te voorkomen',
      'Bekijk progressie per maand, niet per dag',
    ],
  },
  6: {
    title: 'Week 6: Middenpunt',
    tips: [
      'Je zit op de helft van de 12 weken',
      'Controleer je slaap en stressniveau extra',
      'Hydratatie blijft een hefboom voor resultaat',
      'Neem nieuwe foto en taillemeting voor vergelijking',
    ],
    warning: 'Motivatiedip rond week 6 komt vaak voor. Blijf op systeem vertrouwen.',
  },
  7: {
    title: 'Week 7: Verfijning',
    tips: [
      'Scherp je standaard ontbijt/lunch verder aan',
      'Minimaliseer vloeibare calorieen buiten cheat day',
      'Plan boodschappen voor 3-4 dagen vooruit',
      'Let op genoeg eiwit bij elke maaltijd',
    ],
  },
  8: {
    title: 'Week 8: Doorpakken',
    tips: [
      'Kleine plateaus blijven normaal',
      'Check naleving van alle 5 regels eerlijk',
      'Houd je cheat day op dezelfde weekdag',
      'Focus op trend: energie, taille, kleding',
    ],
  },
  9: {
    title: 'Week 9: Nieuwe Baseline',
    tips: [
      'Je nieuwe eetpatroon voelt steeds normaler',
      'Blijf maaltijden simpel en herhaalbaar houden',
      'Bescherm je slaaproutine',
      'Gebruik meal prep om drukke dagen op te vangen',
    ],
  },
  10: {
    title: 'Week 10: Eindfase Inzetten',
    tips: [
      'Consistentie wint nu van perfectie',
      'Vermijd experimenten met nieuwe uitzonderingen',
      'Houd water- en zoutinname stabiel',
      'Vergelijk met week 1: zichtbaar verschil motiveert',
    ],
  },
  11: {
    title: 'Week 11: Bijna Daar',
    tips: [
      'Laatste loodjes: blijf protocol strikt volgen',
      'Plan sociale momenten rond je cheat day',
      'Blijf dagelijkse beweging prioriteren',
      'Evalueer welke gewoontes je wilt behouden na dag 84',
    ],
  },
  12: {
    title: 'Week 12: Afronding',
    tips: [
      'Maak je 84-dagen reflectie compleet',
      'Vier progressie in gedrag, niet alleen gewicht',
      'Kies een onderhoudsstrategie voor de komende maand',
      'Behoud je ankers: ontbijt, meal prep, slaap',
    ],
    warning: 'Einde traject is start van onderhoud. Blijf je basisregels gebruiken.',
  },
};

export const getDayTip = (day: number): DayTip | undefined => {
  if (!Number.isInteger(day) || day < 1 || day > dayTips.length) return undefined;
  return dayTips[day - 1];
};

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

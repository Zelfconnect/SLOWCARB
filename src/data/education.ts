import type { EducationCard, ConceptCard, RuleCard, FAQCard } from '@/types';
import { VALIDATION_RULES, ALLOWED_ICONS } from './educationTokens';

// ============================================
// EDUCATION CARDS - Structured Content
// Semantisch kleur systeem: type bepaalt styling
// ============================================

// Helper to count words
function countWords(text: string): number {
  return text.split(/\s+/).filter(w => w.length > 0).length;
}

// ============================================
// TYPE 1: RULE CARDS (The 5 Rules + 30/30)
// Kleur: Primary Green (consistent voor alle regels)
// ============================================

export const ruleCards: RuleCard[] = [
  {
    id: 'regel-1-witte-koolhydraten',
    type: 'rule',
    title: 'Vermijd "witte" koolhydraten',
    ruleNumber: 1,
    icon: '🚫',
    content: {
      rule: 'Elimineer alle geraffineerde koolhydraten: brood, pasta, rijst, aardappelen, granen.',
      science: 'Witte koolhydraten hebben een hoge glycemische index. Ze worden snel afgebroken tot glucose, wat een insulinepiek veroorzaakt.',
      tips: [
        'Vervang rijst door bloemkoolrijst',
        'Gebruik sla als wrap in plaats van tortilla',
        'Eet extra bonen om vol te blijven',
      ],
    },
  },
  {
    id: 'regel-2-zelfde-maaltijden',
    type: 'rule',
    title: 'Eet dezelfde maaltijden',
    ruleNumber: 2,
    icon: '🔄',
    content: {
      rule: 'Kies 3-4 ontbijten, 3-4 lunches, 3-4 avondeten en roteer deze.',
      science: 'Willpower is een eindige resource. Door keuzes te elimineren, bewaar je mentale energie voor waar het telt.',
      tips: [
        'Maak een lijstje van je favoriete maaltijden',
        'Kook in het weekend voor de hele week',
        'Houd het simpel: eiwit + groente + bonen',
      ],
    },
  },
  {
    id: 'regel-3-geen-calorieen-drinken',
    type: 'rule',
    title: 'Drink geen calorieën',
    ruleNumber: 3,
    icon: '🥤',
    content: {
      rule: 'Geen frisdrank, vruchtensap, melk, bier. Wel: water, thee, koffie.',
      science: 'Vloeibare calorieën triggeren geen verzadiging maar veroorzaken wel insulinepieken.',
      tips: [
        'Drink minstens 2 liter water per dag',
        'Koffie max 2 koppen, zwart of met kleine splash room',
        'Gebruik kruidenthee als je zoete trek hebt',
      ],
    },
  },
  {
    id: 'regel-4-geen-fruit',
    type: 'rule',
    title: 'Eet geen fruit',
    ruleNumber: 4,
    icon: '🍎',
    content: {
      rule: 'Geen fruit, behalve tomaten en avocado\'s.',
      science: 'Fructose wordt direct door de lever verwerkt en omgezet in vet. Het remt ook leptine, je verzadigingshormoon.',
      tips: [
        'Vervang fruit door groente (komkommer, paprika)',
        'Eet extra vet als je zoete trek hebt',
        'Cheat day is je uitlaatklep voor fruit',
      ],
      exceptions: 'Op cheat day mag je fruit eten.',
    },
  },
  {
    id: 'regel-5-cheat-day',
    type: 'rule',
    title: 'Neem één cheat day per week',
    ruleNumber: 5,
    icon: '🎉',
    content: {
      rule: 'Eén dag per week mag je alles eten wat je wilt.',
      science: 'Leptine reset: Na dagen van calorierestrictie daalt leptine. Een dag van overvloed reset dit.',
      tips: [
        'Begin cheat day met SCD-ontbijt (30g eiwit)',
        'Geniet, maar stop als je vol zit',
        'Volgende dag: direct terug naar protocol',
      ],
    },
  },
  {
    id: 'regel-30-30',
    type: 'rule',
    title: 'De 30/30 Regel',
    ruleNumber: 0, // Special rule, not part of the 5
    icon: '⚡',
    content: {
      rule: 'Eet 30 gram eiwit binnen 30 minuten na het opstaan.',
      science: 'Stopt katabolisme, stabiliseert bloedsuiker, verhoogt thermogenese, en onderdrukt honger.',
      tips: [
        '3-4 eieren = ~25-30g eiwit',
        '250g Hüttenkäse = ~30g eiwit',
        'Restjes van gisteren werken ook prima',
      ],
    },
  },
];

// ============================================
// TYPE 2: CONCEPT CARDS
// Kleur: Amber/Orange (warm, informatief)
// ============================================

export const conceptCards: ConceptCard[] = [
  {
    id: 'vetverbranding',
    type: 'concept',
    title: 'Hoe Vetverbranding Werkt',
    subtitle: 'Wetenschap achter Slow-Carb',
    icon: '🔥',
    content: {
      summary: 'Door insuline laag te houden, schakel je over van suiker- naar vetverbranding.',
      keyPoints: [
        {
          title: 'Glucose stijgt',
          text: 'Na het eten van koolhydraten komt glucose in je bloed.',
        },
        {
          title: 'Insuline reactie',
          text: 'Je alvleesklier maakt insuline om suiker op te slaan.',
        },
        {
          title: 'Vet schakelaar',
          text: 'Hoge insuline = opslag, lage insuline = verbranding.',
        },
      ],
      funFact: 'Vetcellen legen eerst, vullen zich dan met water (whoosh effect).',
      relatedCards: ['whoosh-effect', 'insuline-101'],
    },
  },
  {
    id: 'whoosh-effect',
    type: 'concept',
    title: 'Het Whoosh Effect',
    subtitle: 'Waarom je gewicht soms stilstaat',
    icon: '💧',
    content: {
      summary: 'Je verliest WEL vet, maar je vetcellen vullen zich tijdelijk met water.',
      keyPoints: [
        {
          title: 'Week 1-2',
          text: 'Snel gewichtsverlies (2-4 kg) door glycogeen en water.',
        },
        {
          title: 'Week 3',
          text: 'Gewicht staat stil. Vetcellen vullen met water.',
        },
        {
          title: 'Week 4',
          text: 'Whoosh! Water verdwijnt, gewicht daalt plotseling.',
        },
      ],
      funFact: 'Drink extra water om het whoosh effect te versnellen.',
      relatedCards: ['vetverbranding'],
    },
  },
  {
    id: 'bonen-waarom',
    type: 'concept',
    title: 'Waarom Bonen Cruciaal Zijn',
    subtitle: 'Het geheim van peulvruchten',
    icon: '🫘',
    content: {
      summary: 'Bonen, linzen en kikkererwten zijn essentieel voor succes op Slow-Carb.',
      keyPoints: [
        {
          title: 'Resistent zetmeel',
          text: 'Je lichaam kan het niet afbreken, dus geen glucose-piek.',
        },
        {
          title: 'Verzadiging',
          text: 'Bonen houden je vol tot de volgende maaltijd.',
        },
        {
          title: 'Second Meal Effect',
          text: 'Bonen bij lunch = betere bloedsuiker bij avondeten.',
        },
      ],
      funFact: 'Bonen bevatten meer eiwit dan de meeste mensen denken!',
    },
  },
  {
    id: 'insuline-101',
    type: 'concept',
    title: 'Insuline: De Vet-Schakelaar',
    subtitle: 'Begrijp dit hormoon',
    icon: '🎚️',
    content: {
      summary: 'Insuline bepaalt of je lichaam vet opslaat of verbrandt.',
      keyPoints: [
        {
          title: 'Hoge insuline',
          text: 'Body is in "opslag modus". Vetverbranding stopt.',
        },
        {
          title: 'Lage insuline',
          text: 'Body schakelt over naar "verbrandings modus".',
        },
        {
          title: 'Koolhydraten triggeren',
          text: 'Koolhydraten verhogen insuline het meest.',
        },
      ],
    },
  },
];

// ============================================
// TYPE 3: FAQ CARDS (Short Q&A)
// ============================================

export const faqCards: FAQCard[] = [
  {
    id: 'faq-cheat-alles',
    type: 'faq',
    title: 'Mag ik echt ALLES op cheat day?',
    icon: '🍕',
    content: {
      answer: 'ja',
      explanation: 'Ja, letterlijk alles. De cheat day is essentieel voor je metabole reset.',
      nuance: [
        'Pizza, ijs, donuts — het hoort er allemaal bij',
        'Begin wel met een SCD-ontbijt (30g eiwit)',
      ],
    },
  },
  {
    id: 'faq-plateau',
    type: 'faq',
    title: 'Mijn gewicht staat al 2 weken stil. Wat nu?',
    icon: '📉',
    content: {
      answer: 'misschien',
      explanation: 'Dit is waarschijnlijk het Whoosh Effect. Je verliest WEL vet.',
      nuance: [
        'Vetcellen vullen zich tijdelijk met water',
        'Blijf volhouden, het "whoosht" opeens',
      ],
    },
  },
  {
    id: 'faq-koffie-melk',
    type: 'faq',
    title: 'Mag ik koffie met melk?',
    icon: '☕',
    content: {
      answer: 'nee',
      explanation: 'Melk bevat lactose (suiker) die insuline kan triggeren.',
      nuance: [
        'Een kleine splash room is oké',
        'Zwarte koffie of met kaneel is beste optie',
      ],
    },
  },
  {
    id: 'faq-cola-zero',
    type: 'faq',
    title: 'Mag ik Cola Zero?',
    icon: '🥤',
    content: {
      answer: 'misschien',
      explanation: 'Technisch gezien ja, maar het kan bij sommigen honger triggeren.',
      nuance: [
        'Zoetstoffen kunnen insuline-respons veroorzaken',
        'Test het: drink Cola Zero en kijk of je meer honger krijgt',
      ],
    },
  },
  {
    id: 'faq-honger',
    type: 'faq',
    title: 'Ik heb honger tussen maaltijden. Wat nu?',
    icon: '😰',
    content: {
      answer: 'misschien',
      explanation: 'Eet meer bij elke maaltijd, vooral meer bonen en vet.',
      nuance: [
        'Slow-Carb is geen calorierestrictie',
        'Eet tot je vol zit, niet tot je "genoeg" hebt',
      ],
    },
  },
  {
    id: 'faq-alcohol',
    type: 'faq',
    title: 'Mag ik alcohol?',
    icon: '🍷',
    content: {
      answer: 'misschien',
      explanation: 'Droge rode wijn (max 2 glazen) is toegestaan.',
      nuance: [
        'Vermijd bier en witte wijn (suikers)',
        'Alcohol remt vetverbranding tijdelijk',
      ],
    },
  },
];

// ============================================
// ALL CARDS COMBINED
// ============================================

export const allEducationCards: EducationCard[] = [
  ...ruleCards,
  ...conceptCards,
  ...faqCards,
];

// ============================================
// VALIDATION FUNCTION
// ============================================

export function validateEducationCard(card: EducationCard): string[] {
  const errors: string[] = [];

  // Check required fields
  if (!card.id) errors.push('Card mist id');
  if (!card.type) errors.push('Card mist type (rule/concept/reference)');
  if (!card.title) errors.push('Card mist title');
  if (!card.icon) errors.push('Card mist icon');

  // Check type validity
  if (card.type && !['rule', 'concept', 'faq'].includes(card.type)) {
    errors.push(`Ongeldig type "${card.type}". Gebruik: rule, concept, faq`);
  }

  // Check icon validity
  if (card.type && card.icon) {
    const allowedForType = ALLOWED_ICONS[card.type as keyof typeof ALLOWED_ICONS];
    if (allowedForType && !allowedForType.includes(card.icon)) {
      errors.push(`Icon "${card.icon}" niet toegestaan voor type "${card.type}". Gebruik: ${allowedForType.join(', ')}`);
    }
  }

  if (card.type === 'rule') {
    const c = card as RuleCard;
    const rules = VALIDATION_RULES.rule;
    
    if (!c.content.rule) errors.push('Rule card mist "rule" veld');
    if (!c.content.science) errors.push('Rule card mist "science" veld');
    if (!c.content.tips || c.content.tips.length === 0) {
      errors.push('Rule card mist tips');
    }
    if (c.content.tips && c.content.tips.length > rules.maxTips) {
      errors.push(`Te veel tips (${c.content.tips.length}, max ${rules.maxTips})`);
    }

    // Count words
    let wordCount = countWords(c.content.rule);
    wordCount += countWords(c.content.science);
    c.content.tips.forEach((tip: string) => wordCount += countWords(tip));
    if (c.content.exceptions) wordCount += countWords(c.content.exceptions);

    if (wordCount > rules.maxWords) {
      errors.push(`Te veel woorden (${wordCount}, max ${rules.maxWords})`);
    }
  }

  if (card.type === 'concept') {
    const c = card as ConceptCard;
    const rules = VALIDATION_RULES.concept;
    
    if (!c.content.summary) errors.push('Concept card mist "summary" veld');
    if (c.content.summary && c.content.summary.length > rules.maxSummaryLength) {
      errors.push(`Summary te lang (${c.content.summary.length} chars, max ${rules.maxSummaryLength})`);
    }
    if (!c.content.keyPoints || c.content.keyPoints.length === 0) {
      errors.push('Concept card mist keyPoints');
    }
    if (c.content.keyPoints && c.content.keyPoints.length > rules.maxKeyPoints) {
      errors.push(`Te veel keyPoints (${c.content.keyPoints.length}, max ${rules.maxKeyPoints})`);
    }

    // Count words
    let wordCount = countWords(c.content.summary);
    c.content.keyPoints.forEach((kp: { title: string; text: string }) => {
      wordCount += countWords(kp.title);
      wordCount += countWords(kp.text);
    });
    if (c.content.funFact) wordCount += countWords(c.content.funFact);

    if (wordCount > rules.maxWords) {
      errors.push(`Te veel woorden (${wordCount}, max ${rules.maxWords})`);
    }
  }

  if (card.type === 'faq') {
    const f = card as FAQCard;
    if (!f.content.answer) errors.push('FAQ card mist "answer" veld');
    if (!f.content.explanation) errors.push('FAQ card mist "explanation" veld');

    // Count words
    let wordCount = countWords(f.content.explanation);
    if (f.content.nuance) f.content.nuance.forEach((n: string) => wordCount += countWords(n));

    if (wordCount > VALIDATION_RULES.reference.maxItems * 10) {
      errors.push(`Te veel woorden (${wordCount}, max ~80)`);
    }
  }

  return errors;
}

// Validate all cards on load
const allErrors: string[] = [];
allEducationCards.forEach(card => {
  const errors = validateEducationCard(card);
  if (errors.length > 0) {
    allErrors.push(`[${card.id}] ${errors.join(', ')}`);
  }
});

if (allErrors.length > 0) {
  console.error('Education card validation errors:', allErrors);
}

// ============================================
// QUICK REFERENCE DATA (for Learn tab)
// ============================================

export const yesNoList = {
  yes: [
    { item: 'Alle vlees en vis', emoji: '🥩' },
    { item: 'Eieren', emoji: '🥚' },
    { item: 'Alle groenten', emoji: '🥦' },
    { item: 'Alle bonen en linzen', emoji: '🫘' },
    { item: 'Kruiden en specerijen', emoji: '🌿' },
    { item: 'Olijfolie, kokosolie', emoji: '🫒' },
    { item: 'Avocado', emoji: '🥑' },
    { item: 'Hüttenkäse', emoji: '🧀' },
    { item: 'Noten (max 10 per dag)', emoji: '🥜' },
  ],
  no: [
    { item: 'Brood, pasta, rijst', emoji: '🍞' },
    { item: 'Alle granen', emoji: '🌾' },
    { item: 'Fruit (behalve tomaat)', emoji: '🍎' },
    { item: 'Zuivel (behalve cottage)', emoji: '🥛' },
    { item: 'Frisdrank, sap, bier', emoji: '🥤' },
    { item: 'Toegevoegde suiker', emoji: '🍬' },
  ],
  cheat: [
    { item: 'Alles mag', emoji: '🍕' },
    { item: 'Geen schuld', emoji: '✨' },
    { item: 'Volgende dag: terug', emoji: '🔄' },
  ],
};

export const commonMistakes = [
  { mistake: 'Te weinig eten', explanation: 'Slow-carb is geen calorierestrictie.', emoji: '🍽️' },
  { mistake: 'Bonen overslaan', explanation: 'Bonen zijn essentieel voor verzadiging.', emoji: '🫘' },
  { mistake: 'Te weinig eiwit bij ontbijt', explanation: 'De 30/30 regel is de anker van je dag.', emoji: '🍳' },
  { mistake: 'Cheat day skippen', explanation: 'Je hebt de metabole reset nodig.', emoji: '🎉' },
];

import type { Rule, ScienceTopic, FAQ } from '@/types';

export const fiveRules: Rule[] = [
  {
    id: 1,
    title: 'Vermijd "witte" koolhydraten',
    shortDescription: 'Geen brood, pasta, rijst, aardappelen, granen, tortilla\'s, pannenkoeken.',
    fullDescription: 'Elimineer alle geraffineerde koolhydraten die snel worden omgezet in glucose. Dit zijn de grootste boosdoeners van insulinepieken.',
    science: 'Witte koolhydraten hebben een hoge glycemische index (GI). Ze worden snel afgebroken tot glucose, wat een insulinepiek veroorzaakt. Na de piek volgt een crash, waardoor je weer honger krijgt.',
    emoji: '🚫',
  },
  {
    id: 2,
    title: 'Eet dezelfde maaltijden steeds opnieuw',
    shortDescription: 'Kies 3-4 ontbijten, 3-4 lunches, 3-4 avondeten en roteer.',
    fullDescription: 'Beslissingsmoeheid is de vijand van consistentie. Hoe minder je hoeft na te denken, hoe groter de kans dat je volhoudt.',
    science: 'Willpower is een eindige resource (ego depletion). Door keuzes te elimineren, bewaar je mentale energie voor waar het telt.',
    emoji: '🔄',
  },
  {
    id: 3,
    title: 'Drink geen calorieën',
    shortDescription: 'Geen frisdrank, vruchtensap, melk, bier. Wel: water, thee, koffie (zwart of met kleine splash room).',
    fullDescription: 'Vloeibare calorieën triggeren geen verzadiging maar veroorzaken wel insulinepieken.',
    science: 'Je maag heeft geen "volume-sensor" voor vloeistoffen op dezelfde manier als voor vast voedsel.',
    emoji: '🥤',
  },
  {
    id: 4,
    title: 'Eet geen fruit',
    shortDescription: 'Geen fruit, behalve tomaten en avocado\'s (technisch gezien vruchten, maar laag in fructose).',
    fullDescription: 'Fructose wordt direct door de lever verwerkt en omgezet in vet. Het remt ook leptine (je verzadigingshormoon).',
    science: 'Fructose volgt een unieke metabolische route. Anders dan glucose, dat door alle cellen kan worden gebruikt, gaat fructose rechtstreeks naar de lever.',
    emoji: '🍎',
  },
  {
    id: 5,
    title: 'Neem één cheat day per week',
    shortDescription: 'Eén dag per week (meestal zaterdag of zondag) mag je alles eten wat je wilt. Letterlijk alles.',
    fullDescription: 'Dit voorkomt metabole aanpassing, reset leptine, en houdt je mentaal gezond.',
    science: 'Leptine reset: Na dagen van calorierestrictie daalt leptine. Een dag van overvloed reset dit. Metabole boost: Je lichaam past zich aan aan lagere calorie-inname door je metabolisme te vertragen.',
    emoji: '🎉',
  },
];

export const thirtyRule = {
  title: 'De 30/30 Regel',
  description: 'Eet 30 gram eiwit binnen 30 minuten na het opstaan.',
  why: [
    'Stopt katabolisme: \'s Nachts verbruikt je lichaam aminozuren. Eiwit \'s ochtends stopt spierafbraak.',
    'Stabiliseert bloedsuiker: Eiwit veroorzaakt een langzame, gestage energie-release.',
    'Verhoogt thermogenese: Je lichaam verbrandt 20-30% van eiwitcalorieën bij de vertering.',
    'Onderdrukt honger: Eiwit stimuleert verzadigingshormonen.',
  ],
  examples: [
    '3-4 eieren = ~25-30g eiwit',
    '250g Hüttenkäse = ~30g eiwit',
    'Restjes van gisteren werken ook',
  ],
  emoji: '⚡',
};

export const yesNoList = {
  yes: [
    { item: 'Alle vlees en vis', emoji: '🥩' },
    { item: 'Eieren', emoji: '🥚' },
    { item: 'Alle groenten', emoji: '🥦' },
    { item: 'Alle bonen en linzen', emoji: '🫘' },
    { item: 'Kruiden en specerijen', emoji: '🌿' },
    { item: 'Olijfolie, kokosolie', emoji: '🫒' },
    { item: 'Avocado', emoji: '🥑' },
    { item: 'Hüttenkäse (cottage cheese)', emoji: '🧀' },
    { item: 'Noten (max 10 per dag)', emoji: '🥜' },
  ],
  no: [
    { item: 'Brood, pasta, rijst, aardappelen', emoji: '🍞' },
    { item: 'Alle granen', emoji: '🌾' },
    { item: 'Fruit (behalve tomaat, avocado)', emoji: '🍎' },
    { item: 'Zuivel (behalve cottage cheese)', emoji: '🥛' },
    { item: 'Frisdrank, sap, bier', emoji: '🥤' },
    { item: 'Alles met toegevoegde suiker', emoji: '🍬' },
  ],
  cheat: [
    { item: 'Alles mag', emoji: '🍕' },
    { item: 'Eet waar je zin in hebt', emoji: '🍰' },
    { item: 'Geen schuld', emoji: '✨' },
    { item: 'Volgende dag: terug naar protocol', emoji: '🔄' },
  ],
};

export const scienceTopics: ScienceTopic[] = [
  {
    id: 'vetverbranding',
    title: 'Hoe Vetverbranding Werkt',
    emoji: '🔥',
    summary: 'Door insuline laag te houden, schakel je over van suiker- naar vetverbranding.',
    content: [
      'Vet Opslaan (Lipogenese)\n\n1. Je eet koolhydraten → glucose in bloed\n2. Pancreas maakt insuline\n3. Insuline activeert LPL op vetcellen\n4. LPL trekt vetzuren uit bloed naar vetcel\n5. Vetcel groeit',
      'Vet Vrijmaken (Lipolyse)\n\n1. Insuline is laag\n2. Glucagon en adrenaline stijgen\n3. HSL wordt actief\n4. HSL breekt opgeslagen vet af\n5. Vetzuren gaan naar mitochondriën → verbranding',
    ],
  },
  {
    id: 'whoosh',
    title: 'Het Whoosh Effect',
    emoji: '💧',
    summary: 'Waarom je gewicht soms stilstaat terwijl je wel vet verliest.',
    content: [
      'Wat je ziet:\n\n- Week 1-2: Snel gewichtsverlies (2-4 kg)\n- Week 3: Gewicht staat stil\n- Week 4: Plotseling 1-2 kg erbij kwijt',
      'Wat er gebeurt:\n\n1. Vetcel leegt, vult met water\n   Wanneer een vetcel zijn vet vrijgeeft, vult de cel zich tijdelijk met water.',
    ],
  },
  {
    id: 'bonen',
    title: 'Waarom Bonen Cruciaal Zijn',
    emoji: '🫘',
    summary: 'Bonen, linzen en kikkererwten zijn essentieel voor succes.',
    content: [
      'Resistente Zetmeel\n\nPeulvruchten bevatten resistente zetmeel — koolhydraten die je dunne darm niet kan afbreken.',
      'Second Meal Effect\n\nPeulvruchten bij lunch → betere bloedsuiker bij avondeten.',
    ],
  },
];

export const faqs: FAQ[] = [
  {
    id: 'cheat-1',
    question: 'Mag ik echt ALLES op cheat day?',
    answer: 'Ja, letterlijk alles. De cheat day is essentieel voor je metabole reset. Pizza, ijs, donuts — het hoort er allemaal bij.',
    category: 'cheat',
  },
  {
    id: 'plateau-1',
    question: 'Mijn gewicht staat al 2 weken stil. Wat nu?',
    answer: 'Dit is waarschijnlijk het Whoosh Effect. Je verliest WEL vet, maar je vetcellen vullen zich tijdelijk met water.',
    category: 'plateau',
  },
  {
    id: 'practical-1',
    question: 'Mag ik koffie met melk?',
    answer: 'Een kleine splash room (niet melk) is oké. Melk bevat lactose (suiker) en kan een insuline-respons triggeren.',
    category: 'practical',
  },
];

export const commonMistakes = [
  { mistake: 'Te weinig eten', explanation: 'Slow-carb is geen calorierestrictie. Eet tot je vol zit.', emoji: '🍽️' },
  { mistake: 'Bonen overslaan', explanation: 'Bonen zijn essentieel voor verzadiging, darmgezondheid, en langdurige energie.', emoji: '🫘' },
  { mistake: 'Te weinig eiwit bij ontbijt', explanation: 'De 30/30 regel is niet optioneel. Dit is de anker van je dag.', emoji: '🍳' },
  { mistake: 'Cheat day skippen', explanation: 'Je hebt de metabole reset nodig. Skippen werkt tegen je.', emoji: '🎉' },
  { mistake: 'Cheat day wordt cheat weekend', explanation: 'Eén dag. Niet twee. Niet "vanaf vrijdagavond".', emoji: '📅' },
];

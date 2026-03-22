export interface ArticleSection {
  heading: string;
  content: string;
  subsections?: { heading: string; content: string }[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SEOArticle {
  slug: string;
  basePath: string;
  title: string;
  kicker: string;
  metaTitle: string;
  metaDescription: string;
  author: string;
  readingTime: string;
  publishDate: string;
  lastModified: string;
  sections: ArticleSection[];
  faq?: FAQItem[];
}

export const pillarPage: SEOArticle = {
  slug: 'slow-carb-dieet',
  basePath: '/gids',
  title: 'Slow Carb Dieet: De Complete Gids',
  kicker: 'Complete gids',
  metaTitle: 'Slow Carb Dieet: Complete Gids (2026)',
  metaDescription:
    'Alles over het slow carb dieet van Tim Ferriss. 5 regels, geen calorieën tellen, 1 cheatday per week. 8-10 kg in zes weken is voor veel mensen haalbaar. Inclusief recepten en weekplanning.',
  author: 'Jesper',
  readingTime: '12 min',
  publishDate: '2026-03-17',
  lastModified: '2026-03-17',
  sections: [
    {
      heading: 'Wat is het slow carb dieet?',
      content: `
        <p>Het slow carb dieet is een eetprotocol uit <em>The 4-Hour Body</em> van Tim Ferriss. Het draait om vijf simpele regels die je zes dagen per week volgt, en één dag per week waarin je alles mag eten. Alles.</p>
        <p>Geen calorieën tellen. Geen macro's bijhouden. Geen punten, geen fases, geen progressief schema dat steeds strenger wordt. Vijf regels. Dat is het.</p>
        <p>Het protocol is ontworpen voor mensen die structuur nodig hebben maar geen zin hebben in complexiteit. Je leert in vijf minuten wat je wel en niet mag eten. De rest is herhaling.</p>
        <p>In de praktijk verliezen veel mensen 8 tot 10 kilo in de eerste zes weken. Zonder honger, zonder sportschool, zonder de constante twijfel of je het "goed doet".</p>
      `,
    },
    {
      heading: 'Hoe werkt het slow carb dieet?',
      content: `
        <p>Het slow carb dieet werkt door twee dingen tegelijk te doen: je insulinespiegel laag houden en je metabolisme actief houden.</p>
        <p><strong>Insuline laag houden</strong> doe je door witte koolhydraten en suikers te vermijden. Zonder de constante insulinepieken van brood, pasta en frisdrank schakelt je lichaam over op vetverbranding als primaire energiebron. Je eet eiwitten, peulvruchten en groenten: voedsel dat langzaam verteert en je lang vol houdt.</p>
        <p><strong>Metabolisme actief houden</strong> doe je met de wekelijkse cheatday. Die ene dag per week waarin je alles eet zorgt voor een leptine-spike. Leptine is het hormoon dat je metabolisme reguleert. Door één dag flink te eten voorkom je dat je lichaam in de spaarstand gaat, het plateau waar de meeste diëten op vastlopen.</p>
        <p>Dit is geen trucje. Het is fysiologie. Tim Ferriss at op zijn cheatdays soms meer dan 4.000 kilocalorieën en viel toch consequent af. De cheatday is geen beloning; het is een onderdeel van het systeem.</p>
      `,
    },
    {
      heading: 'De 5 regels van het slow carb dieet',
      content:
        '<p>Het slow carb dieet bestaat uit vijf regels die je zes dagen per week volgt. De regels zijn simpel, maar de combinatie is krachtig.</p>',
      subsections: [
        {
          heading: 'Regel 1: Vermijd "witte" koolhydraten',
          content: `
            <p>Geen brood, pasta, rijst, aardappelen, gebak of granen. Dit zijn snelle koolhydraten die je bloedsuiker laten pieken en vetopslag stimuleren.</p>
            <p>Wat mag er wél? Peulvruchten (linzen, kidneybonen, kikkererwten), groenten, eieren, vis en vlees. Deze voedingsmiddelen verteren langzaam. Vandaar "slow carb". Ze houden je uren vol.</p>
            <p><strong>Praktisch:</strong> als het wit is of wit zou zijn als je het niet zou verven, eet het dan niet. Bloemkool en karnemelk zijn uitzonderingen; die mag je wél.</p>
          `,
        },
        {
          heading: 'Regel 2: Eet steeds dezelfde maaltijden',
          content: `
            <p>Kies drie tot vier maaltijden die je lekker vindt en eet ze op herhaling. Klinkt saai, maar het is de krachtigste regel van het protocol.</p>
            <p>Waarom? Omdat keuzestress de grootste vijand van elk dieet is. Als je elke maaltijd opnieuw moet nadenken over wat je mag eten, houdt niemand het vol. Door te herhalen hoef je maar één keer na te denken. De rest gaat op de automatische piloot.</p>
            <p>De meeste succesvolle slow carbers hebben drie tot vier maaltijden die ze door de week roteren. Denk aan: chili con carne, roerbak met kip en zwarte bonen, scrambled eggs met spinazie, of een stevige linzensoep.</p>
          `,
        },
        {
          heading: 'Regel 3: Drink geen calorieën',
          content: `
            <p>Water, zwarte koffie en thee: dat zijn je dranken. Geen sap, geen frisdrank, geen smoothies, geen havermelk-latte's.</p>
            <p>Vloeibare calorieën zijn onzichtbaar. Een glas sinaasappelsap bevat evenveel suiker als een glas cola. Het verschil is dat je je na het sap niet vol voelt, waardoor je gewoon dooreet.</p>
            <p><strong>Uitzondering:</strong> één tot twee glazen rode wijn per dag mag. Droge witte wijn in beperkte hoeveelheid ook. Bier niet.</p>
          `,
        },
        {
          heading: 'Regel 4: Eet geen fruit',
          content: `
            <p>Ja, ook geen bananen. En ook geen druiven, mango of ananas. Fruit bevat fructose, en fructose remt vetverbranding.</p>
            <p>Dit is de regel waar mensen het meest moeite mee hebben, omdat fruit "gezond" voelt. En fruit bevat inderdaad vitaminen. Maar voor het doel van vetverbranding werkt fructose tegen je. Zes weken zonder fruit is geen gezondheidsrisico. De vitaminen haal je uit groenten en peulvruchten.</p>
            <p><strong>Uitzonderingen:</strong> avocado en tomaat mogen wél. Technisch gezien zijn het vruchten, maar ze bevatten minimaal fructose.</p>
          `,
        },
        {
          heading: 'Regel 5: Eén cheatday per week',
          content: `
            <p>Elke week kies je één dag waarop je alles eet. Pizza, pannenkoeken, chocola, chips. Zonder limiet, zonder schuldgevoel.</p>
            <p>Dit is niet "je belonen omdat je braaf bent geweest." Dit is het protocol. De cheatday zorgt voor een metabole reset: je leptineproductie schiet omhoog, je metabolisme blijft actief, en psychologisch heb je iets om naar uit te kijken.</p>
            <p><strong>Tip:</strong> kies een vaste dag. De meeste mensen kiezen zaterdag. Zo weet je altijd: "Over X dagen mag alles weer."</p>
          `,
        },
      ],
    },
    {
      heading: 'Wat mag je eten met slow carb? (boodschappenlijst)',
      content: `
        <p><strong>Eiwitten:</strong> Kip, rund, varken, vis (alle soorten), eieren, garnalen, tonijn (blik). Doel: minstens 20 gram eiwit per maaltijd.</p>
        <p><strong>Peulvruchten:</strong> Linzen (bruin, rood, groen), zwarte bonen, kidneybonen, kikkererwten, witte bonen. Dit zijn je koolhydraten. Ze verteren langzaam en houden je vol.</p>
        <p><strong>Groenten:</strong> Spinazie, broccoli, snijbonen, sperziebonen, koolsoorten, paprika, courgette, komkommer, champignons, tomaat, ui, knoflook. Eet zoveel je wilt.</p>
        <p><strong>Vetten en smaakmakers:</strong> Olijfolie, roomboter, avocado, noten (beperkt, max een handvol per dag), mosterd, kruiden, specerijen, salsa, sojasaus.</p>
        <p><strong>Niet eten (doordeweeks):</strong> Brood, pasta, rijst, aardappelen, suiker, fruit, sap, frisdrank, zuivel (beperkt; een beetje kaas mag), alcohol (behalve rode wijn).</p>
      `,
    },
    {
      heading: 'Slow carb weekplanning: zo ziet een typische week eruit',
      content: `
        <p><strong>Maandag t/m vrijdag:</strong></p>
        <ul>
          <li><strong>Ontbijt:</strong> scrambled eggs met zwarte bonen en spinazie</li>
          <li><strong>Lunch:</strong> kip met broccoli en linzen</li>
          <li><strong>Avondeten:</strong> chili con carne met kidneybonen en groenten</li>
          <li><strong>Tussendoor:</strong> handvol noten, gekookt ei, of rauwkost met hummus</li>
        </ul>
        <p><strong>Zaterdag (cheatday):</strong> Alles. Broodjes, pizza, ijs, pannenkoeken. Geen limieten.</p>
        <p><strong>Zondag:</strong> Terug naar de regels. De meeste mensen merken dat ze na de cheatday vanzelf minder trek hebben. Dat is het leptine-effect.</p>
      `,
    },
    {
      heading: 'Slow carb vs. andere diëten',
      content:
        '<p>Slow carb verschilt op belangrijke punten van andere populaire diëten. Hier zijn de drie meest gevraagde vergelijkingen.</p>',
      subsections: [
        {
          heading: 'Slow carb vs. keto',
          content: `
            <p>Keto en slow carb lijken op elkaar: beide vermijden brood en suiker. Maar er zijn belangrijke verschillen:</p>
            <p><strong>Keto</strong> is streng. Je moet onder de 20-30 gram koolhydraten per dag blijven. Dat betekent: geen peulvruchten, bijna geen groenten, en constant meten of je "in ketose" bent.</p>
            <p><strong>Slow carb</strong> staat peulvruchten toe (die bevatten koolhydraten, maar verteren langzaam). Je hoeft geen macro's te tellen. En je hebt een wekelijkse cheatday. Bij keto doorbreek je de ketose als je dat doet.</p>
            <p>Voor de meeste mensen is slow carb makkelijker vol te houden. Keto levert soms sneller resultaat in de eerste twee weken (watergewicht), maar de uitval na drie maanden is aanzienlijk hoger.</p>
          `,
        },
        {
          heading: 'Slow carb vs. intermittent fasting',
          content: `
            <p>Intermittent fasting (IF) gaat over <em>wanneer</em> je eet. Slow carb gaat over <em>wat</em> je eet. Ze sluiten elkaar niet uit. Sommige mensen combineren ze.</p>
            <p>Het voordeel van slow carb ten opzichte van IF: je hoeft niet te hongeren. Er is geen "vasten-window" waarin je niets mag eten. Je eet drie maaltijden per dag, tot je vol zit.</p>
          `,
        },
        {
          heading: 'Slow carb vs. calorieën tellen',
          content: `
            <p>Calorieën tellen werkt. Maar het probleem is compliance: de meeste mensen houden het geen zes weken vol. Elke maaltijd wegen, loggen en berekenen kost cognitieve energie die je niet hebt als je een druk leven leidt.</p>
            <p>Slow carb vermijdt dat volledig. Je volgt vijf regels. Of iets mag, is een ja/nee-vraag. Geen grijsgebied, geen berekeningen, geen "mag ik dit als ik vanavond minder eet?"</p>
          `,
        },
      ],
    },
    {
      heading: 'Hoeveel val je af met slow carb?',
      content: `
        <p>De resultaten variëren per persoon, maar dit sluit aan bij wat je op SlowCarb leest (8-10 kg in zes weken voor veel mensen):</p>
        <ul>
          <li><strong>Week 1:</strong> 1-2 kilo (deels watergewicht door minder koolhydraten)</li>
          <li><strong>Week 2-3:</strong> 0,5-1 kilo per week (stabiel vetverlies)</li>
          <li><strong>Week 4-6:</strong> 0,5-1 kilo per week (consistent als je de regels volgt)</li>
          <li><strong>Totaal na 6 weken:</strong> 8-10 kilo is voor veel mensen haalbaar</li>
        </ul>
        <p>Sommige mensen verliezen iets minder, anderen meer. Hoe meer startgewicht je hebt, hoe sneller de eerste kilo's eraf kunnen gaan. Jesper, oprichter van SlowCarb en ex-militair, verloor 8 kilo in vier weken, startend op 111 kilo.</p>
        <p>Belangrijk: je weegt jezelf alleen op vaste momenten (bijvoorbeeld elke vrijdagochtend, voor de cheatday). Niet dagelijks: je gewicht fluctueert te veel door vocht en voedsel.</p>
      `,
    },
    {
      heading: 'Beginnen met slow carb',
      content: `
        <p>Het mooie aan slow carb is dat je vandaag kunt beginnen. Je hoeft niets te berekenen, geen app in te stellen, geen voedingsschema te laten maken. De regels passen op een Post-it.</p>
        <p>Maar als je het jezelf makkelijker wilt maken, met recepten die gegarandeerd aan de regels voldoen, een boodschappenlijst die je niet zelf hoeft samen te stellen en dagelijkse uitleg over wat er in je lichaam gebeurt, dan is de SlowCarb app er voor je.</p>
        <p>Vijf regels. Zes weken. Geen excuses.</p>
      `,
    },
  ],
  faq: [
    {
      question: 'Is slow carb gezond op de lange termijn?',
      answer:
        'Het slow carb dieet bevat eiwitten, peulvruchten, groenten en gezonde vetten. Dat is een voedingspatroon dat de meeste voedingsdeskundigen ondersteunen. Het ontbreken van fruit is het enige potentiële aandachtspunt, maar de vitaminen die je uit fruit haalt zitten ook in groenten. Raadpleeg een arts als je twijfelt.',
    },
    {
      question: 'Kan ik slow carb combineren met sporten?',
      answer:
        'Ja. Het protocol werkt zonder sport, maar bewegen versnelt het resultaat. Voor intensieve krachttraining kan het nodig zijn om meer peulvruchten te eten voor extra energie.',
    },
    {
      question: 'Wat als ik een dag de regels breek?',
      answer:
        'Eén dag valt mee. Ga de volgende dag gewoon verder. Het probleem begint als één dag een week wordt. Daarom bestaat de cheatday: je hoeft nooit langer dan zes dagen te wachten.',
    },
    {
      question: 'Is slow carb geschikt bij ADHD?',
      answer:
        'Juist. De vijf regels zijn zo simpel dat ze geen cognitieve ruimte kosten. Geen bijhouden, geen tellen, geen dagelijkse keuzes. Herhalende maaltijden + simpele ja/nee-regels passen goed bij een brein dat moeite heeft met complexe systemen.',
    },
    {
      question: 'Waar vind ik slow carb recepten?',
      answer:
        'De SlowCarb app bevat 50+ recepten die aan alle vijf regels voldoen, met boodschappenlijst en filters op bereidingstijd. Je kunt ook zoeken op "slow carb recipes" (Engels). De internationale community is groot.',
    },
  ],
};

export const ketoComparisonArticle: SEOArticle = {
  slug: 'slow-carb-vs-keto',
  basePath: '/gids',
  title: 'Slow Carb vs Keto: Welk Dieet Past bij Jou?',
  kicker: 'Vergelijking',
  metaTitle: 'Slow Carb vs Keto: Welk Dieet Past?',
  metaDescription:
    'Eerlijke vergelijking tussen slow carb en keto. Slow carb: 8-10 kg in zes weken voor veel mensen. Welk dieet houd je vol? Zonder hype, met feiten.',
  author: 'Jesper',
  readingTime: '8 min',
  publishDate: '2026-03-17',
  lastModified: '2026-03-17',
  sections: [
    {
      heading: 'Wat is het verschil?',
      content: `
        <p>Twee diëten die allebei koolhydraten beperken. Twee compleet verschillende aanpakken. En twee heel verschillende ervaringen als je ze echt probeert.</p>
        <p>Ik heb beide gedaan. Keto duurde drie weken. Slow carb houd ik al maanden vol. Niet omdat ik meer discipline heb, maar omdat het ene systeem mijn brein overbelast en het andere het juist rust geeft.</p>
        <p>Dit is geen "welk dieet is beter"-artikel. Het hangt af van wie je bent, hoe je leeft, en wat je volhoudt. Dit is wat je moet weten om die keuze te maken.</p>
      `,
      subsections: [
        {
          heading: 'Slow carb in het kort',
          content: `
            <p>Vijf regels. Geen witte koolhydraten, eet steeds dezelfde maaltijden, drink geen calorieën, geen fruit, en één cheatday per week. Je eet eiwitten, peulvruchten en groenten. Je telt niets. Of iets mag is een ja-of-nee-vraag.</p>
            <p>Het protocol komt uit <em>The 4-Hour Body</em> van Tim Ferriss en is ontworpen voor mensen die het simpel willen houden.</p>
          `,
        },
        {
          heading: 'Keto in het kort',
          content: `
            <p>Maximaal 20-30 gram koolhydraten per dag. Geen brood, geen rijst, maar ook geen peulvruchten, minimaal groenten, en geen cheatday. Je lichaam schakelt over op vetverbranding via ketose: een metabole toestand waarbij je lichaam ketonen als brandstof gebruikt in plaats van glucose.</p>
            <p>Keto vereist dat je dagelijks je macro's bijhoudt (vet, eiwit, koolhydraten) om in ketose te blijven.</p>
          `,
        },
      ],
    },
    {
      heading: 'De 5 grootste verschillen',
      content:
        '<p>Op vijf punten verschillen slow carb en keto fundamenteel van elkaar. Die verschillen bepalen voor wie elk dieet geschikt is.</p>',
      subsections: [
        {
          heading: '1. Peulvruchten: wel of niet?',
          content: `
            <p><strong>Slow carb:</strong> peulvruchten zijn de basis. Linzen, zwarte bonen, kikkererwten: ze zijn je hoofdbron van langzame koolhydraten. Ze vullen, zijn goedkoop, en verteren traag.</p>
            <p><strong>Keto:</strong> peulvruchten zijn verboden. Ze bevatten te veel koolhydraten om onder de 20-30 gram per dag te blijven.</p>
            <p><strong>Waarom dit uitmaakt:</strong> peulvruchten zijn de reden dat je bij slow carb vol zit na elke maaltijd. Zonder ze moet je bij keto je verzadiging halen uit vet, en dat is voor veel mensen moeilijker en duurder.</p>
          `,
        },
        {
          heading: '2. Cheatday: wel of niet?',
          content: `
            <p><strong>Slow carb:</strong> één dag per week alles eten. Dit is geen beloning maar een onderdeel van het protocol. De cheatday zorgt voor een leptin-spike die je metabolisme actief houdt.</p>
            <p><strong>Keto:</strong> geen cheatday. Eén dag "alles eten" haalt je uit ketose, en het duurt 2-5 dagen om er weer in te komen. Dat betekent dat je effectief een halve week kwijt bent.</p>
            <p><strong>Waarom dit uitmaakt:</strong> de cheatday is psychologisch enorm. Je hoeft nooit langer dan zes dagen te wachten voor je weer alles mag. Bij keto is er geen einde: het is elke dag dezelfde restrictie, oneindig.</p>
          `,
        },
        {
          heading: '3. Bijhouden en meten',
          content: `
            <p><strong>Slow carb:</strong> je hoeft niets te meten. Geen calorieën, geen macro's, geen ketonen. Of iets mag eten, is een simpele ja/nee-check. Mag dit product? Ja of nee. Klaar.</p>
            <p><strong>Keto:</strong> je moet je koolhydraat-inname bijhouden om te weten of je in ketose blijft. Veel mensen gebruiken keto-strips (urine of bloed) om te meten. Zonder tracking weet je niet of het werkt.</p>
            <p><strong>Waarom dit uitmaakt:</strong> als je ADHD hebt, een druk leven leidt, of gewoon een hekel hebt aan administratie, dan is "niets bijhouden" niet een leuke bonus; het is het verschil tussen volhouden en opgeven.</p>
          `,
        },
        {
          heading: '4. Snelheid van resultaat',
          content: `
            <p><strong>Keto:</strong> de eerste 1-2 weken kun je 2-4 kilo verliezen. Dat is grotendeels watergewicht (koolhydraten binden water), niet vet. Het voelt spectaculair maar vlakt snel af.</p>
            <p><strong>Slow carb:</strong> de eerste week verlies je 1-2 kilo. Daarna 0,5-1 kilo per week, consistent. Minder dramatisch in het begin, maar stabieler over zes weken.</p>
            <p><strong>Over 6 weken:</strong> het verschil in kilo's is vaak klein. Slow carb levert voor veel mensen 8-10 kilo op in die periode; keto kan in dezelfde tijd vergelijkbare schommelingen laten zien. Het verschil zit hem vooral in wat je daarna volhoudt.</p>
          `,
        },
        {
          heading: '5. Volhouden op lange termijn',
          content: `
            <p><strong>Keto:</strong> de uitval is hoog. Studies laten zien dat de meeste mensen keto niet langer dan 3-6 maanden volhouden. De restricties zijn streng, de sociale situaties lastig (geen bier, geen brood, geen aardappelen bij het avondeten met familie), en er is geen pauze-mechanisme.</p>
            <p><strong>Slow carb:</strong> de cheatday functioneert als ingebouwde pauze. Je kunt bij elk familiediner, elke verjaardag, elke barbecue normaal mee-eten, mits je het op je cheatday plant. Dat maakt het sociaal haalbaar.</p>
          `,
        },
      ],
    },
    {
      heading: 'Wanneer kies je keto?',
      content: `
        <p>Keto is een optie als je bereid bent om dagelijks je macro's bij te houden, je niet gestoord wordt door het ontbreken van een cheatday, en je snelle resultaten in de eerste weken wilt zien voor motivatie. Het werkt goed voor mensen die al ervaring hebben met diëten en die de discipline hebben om streng te zijn zonder eindpunt.</p>
        <p>Keto kan ook beter passen als je medische redenen hebt, bijvoorbeeld bij epilepsie (keto wordt soms therapeutisch ingezet) of bij type 2 diabetes bij sommige mensen. Raadpleeg altijd een arts.</p>
      `,
    },
    {
      heading: 'Wanneer kies je slow carb?',
      content: `
        <p>Slow carb past beter als je een van deze dingen herkent:</p>
        <ul>
          <li>Je hebt geen zin om elke dag macro's bij te houden</li>
          <li>Je hebt ADHD of moeite met complexe systemen</li>
          <li>Je wilt een cheatday, niet als luxe maar als noodzaak om het vol te houden</li>
          <li>Je wilt een systeem dat werkt zonder dat je erover nadenkt</li>
          <li>Je vindt het belangrijk om sociaal normaal te kunnen eten (op je cheatday)</li>
          <li>Je hebt eerder diëten geprobeerd die te streng waren en bent gestopt</li>
        </ul>
        <p>Dit is geen waardeoordeel. Het is een praktische check.</p>
      `,
    },
    {
      heading: 'De eerlijke samenvatting',
      content: `
        <p>Beide diëten beperken koolhydraten maar pakken dat op een fundamenteel andere manier aan. De keuze hangt af van jouw leefstijl, discipline-stijl en of je een ingebouwd pauze-mechanisme nodig hebt.</p>
        <table>
          <thead><tr><th></th><th>Slow Carb</th><th>Keto</th></tr></thead>
          <tbody>
            <tr><td><strong>Koolhydraten</strong></td><td>Peulvruchten toegestaan</td><td>Max 20-30g per dag</td></tr>
            <tr><td><strong>Cheatday</strong></td><td>1x per week, alles mag</td><td>Niet mogelijk (breekt ketose)</td></tr>
            <tr><td><strong>Tracking</strong></td><td>Niets bijhouden</td><td>Dagelijks macro's + eventueel ketonen</td></tr>
            <tr><td><strong>Resultaat week 1</strong></td><td>1-2 kg</td><td>2-4 kg (grotendeels water)</td></tr>
            <tr><td><strong>Resultaat 6 weken</strong></td><td>8-10 kg (veel mensen)</td><td>5-9 kg</td></tr>
            <tr><td><strong>Volhouden</strong></td><td>Hoog (cheatday helpt)</td><td>Laag-matig (streng, geen pauze)</td></tr>
            <tr><td><strong>Complexiteit</strong></td><td>5 regels, ja/nee</td><td>Macro berekeningen, ketose-meting</td></tr>
            <tr><td><strong>Kosten</strong></td><td>Laag (bonen en eieren)</td><td>Hoger (veel vet en vlees)</td></tr>
            <tr><td><strong>Sociaal eten</strong></td><td>Op cheatday alles</td><td>Altijd beperkt</td></tr>
            <tr><td><strong>Geschikt bij ADHD</strong></td><td>Ja (simpele regels)</td><td>Moeilijk (veel bijhouden)</td></tr>
          </tbody>
        </table>
      `,
    },
  ],
  faq: [
    {
      question: 'Kan ik slow carb en keto combineren?',
      answer:
        'In theorie kun je doordeweeks keto eten en op je cheatday koolhydraten laden. Maar dat doorbreekt ketose, en het kost 2-5 dagen om er weer in te komen. Je bent dan effectief maar 1-2 dagen per week in ketose. De meeste experts raden het af.',
    },
    {
      question: 'Welk dieet is gezonder?',
      answer:
        'Beide zijn op korte termijn veilig voor gezonde volwassenen. Slow carb bevat meer vezel (door peulvruchten), keto bevat meer verzadigd vet. Raadpleeg een arts als je twijfelt.',
    },
    {
      question: 'Ik doe al keto en het werkt. Moet ik switchen?',
      answer:
        'Nee. Als keto werkt en je houdt het vol, blijf erbij. Switch alleen als je merkt dat je het niet meer volhoudt of als de restricties je sociale leven beperken.',
    },
    {
      question: 'Ik heb beide geprobeerd en geen van beide werkt. Wat nu?',
      answer:
        'Dan is het waarschijnlijk geen dieet-probleem maar een gewoonteprobleem. Begin met één regel (bijvoorbeeld "geen vloeibare calorieën") en bouw langzaam op. Of zoek een professional die je kan begeleiden.',
    },
  ],
};

export const ALL_ARTICLES: SEOArticle[] = [pillarPage, ketoComparisonArticle];

export function getArticlesByBasePath(basePath: string): SEOArticle[] {
  return ALL_ARTICLES.filter((article) => article.basePath === basePath);
}

export function getArticleBySlug(basePath: string, slug: string): SEOArticle | undefined {
  return ALL_ARTICLES.find(a => a.basePath === basePath && a.slug === slug);
}

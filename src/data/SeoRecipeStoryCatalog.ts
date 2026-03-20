/**
 * Editorial intro copy for public recipe URLs (/recepten/:slug).
 * App recipe steps stay compact; this layer adds a readable, story-style lead for SEO pages.
 */
export class SeoRecipeStoryCatalog {
  private static readonly stories: Readonly<Record<string, readonly string[]>> = {
    'chili-con-carne': [
      'Chili con carne is zo’n gerecht dat je op een druilerige zondag één keer groot maakt en de rest van de week rustig van leeft. Rundergehakt, bonen en tomaten vullen zonder dat je aan rijst of brood hoeft te denken — precies wat je zoekt op slow carb.',
      'De sleutel is geduld: eerst de ui zacht fruiten, het gehakt goed rul bakken en de specerijen even laten meeveren voordat de tomaten erbij gaan. Wat je dan overhoudt is een pan vol diepte, scherpte en comfort — ideaal om in porties te vriezen.',
    ],
    shakshuka: [
      'Shakshuka voelt als ontbijt uit een straatcafé in Tel Aviv, maar past net zo goed als snelle lunch als je zin hebt in iets warms en hartigs. De tomatensaus mag best pittig; de eieren brengen rust en eiwit in één pan.',
      'Je bouwt eerst smaak met ui, paprika en tomaten, laat het inkoken tot een dikke saus en breekt dan de eieren erboven. Deksel erop, even wachten tot de eieren net gestold zijn — brood is overbodig als de saus al rijk genoeg is.',
    ],
    linzensoep: [
      'Rode linzen koken snel open en geven vanzelf een romige soep zonder aardappel of room. Met spinazie en een vleug kurkuma wordt het een kom die zowel licht als vullend aanvoelt — handig als je plantaardig wilt eten binnen de regels.',
      'Houd het simpel: groenten aanfruiten, linzen en bouillon erbij, twintig minuten zacht laten pruttelen. Even pureren als je zijdezacht wilt, of grof laten voor meer bite. Een scheut citroen maakt het pas echt fris.',
    ],
    'burrito-bowl': [
      'Een burrito bowl is het antwoord als je trek hebt in Mexicaanse smaken zonder tortilla of rijst. Je stapelt smaken: gekruid gehakt, bonen, groente en een frisse topping — alles wat je in een wrap zou stoppen, maar dan rechtstreeks uit de kom.',
      'De truc is contrast: warm en kruidig tegen koel en zuur. Maak de kom in losse onderdelen klaar en meng pas op het laatst, dan blijft de structuur levendig en eet je het in kwartiertje echt op.',
    ],
    'roerbak-kip': [
      'Roerbak is geen hogeschoolchemie: hoge hitte, korte tijd, ingrediënten die elkaar niet verdringen. Kipfilet blijft sappig als je hem niet te lang laat liggen; courgetti en edamame geven volume zonder zware koolhydraten.',
      'Begin met de kip tot hij net gaar is, haal hem even uit de pan en roerbak de groenten apart. Terug in de pan, saus eromheen, één minuut alles samen — dan proef je nog echte wokaroma in plaats van een slappe mix.',
    ],
    frittata: [
      'Een frittata is quiche zonder schuldgevoel: eieren houden alles bij elkaar, groenten geven kleur en vezels. Handig voor mealprep: bak in één keer een grote plaat, snijd in blokjes en je hebt dagenlang een snelle lunch.',
      'Klopt de eieren los, bak de groenten tot het vocht verdampt is — anders wordt de bodem waterig — en giet het mengsel erover. Zacht laten stollen in de pan of even onder de grill voor een gouden korst. Koud uit de koelkast smaakt hij soms zelfs beter.',
    ],
    'huttenkase-power-bowl': [
      'Geen zin in eieren of tijd om te koken? Hüttenkäse is je snelste bondgenoot: romig, hoog in eiwit en in twee minuten op tafel. Chia en walnoten geven bite en gezonde vetten zodat je niet een uur later weer honger hebt.',
      'Roer chia door de kwark zodat het even kan opzwellen — dat maakt de textuur rustiger. Kaneel werkt verrassend goed tegen de zure noot; als je het te gewaagd vindt, begin met een halve snuf en bouw op.',
    ],
    'ferriss-klassieker': [
      'Dit is het ontbijt dat het slow carb verhaal voor veel mensen begonnen is: eieren, eiwit en zwarte bonen in één bord. Het klinkt recht-toe-recht-aan, maar het werkt omdat het simpel vol te houden is — geen ingewikkelde lijstjes vóór acht uur ’s ochtends.',
      'Bak de eieren zoals je zelf lekker vindt, warm de bonen kort mee en drink water of koffie erbij. Het gaat om het ritme: binnen dertig minuten na opstaan genoeg eiwit binnen — dit gerecht is daar een eerlijke shortcut voor.',
    ],
    'mexicaanse-bonenschotel': [
      'Een bonenschotel uit één pan is gezinsvriendelijk en past perfect in een week waarin je geen zin hebt in afwasbergen. Kip, kidneybonen en tomaten worden een dikke, kruidige stoof waar je zo aan wilt schaven.',
      'Laat de stoof even sudderen nadat alles in de pan zit: dan trekken de smaken in elkaar en wordt de saus dikker. Serveer met een frisse topping als je extra contrast wilt — zonder tortillachips blijft het netjes binnen het protocol.',
    ],
    'tonijn-bonen-salade': [
      'Tonijn uit blik en witte bonen zijn de stille krachtpatseren van de snelle lunch: omega-3, eiwit en vezels zonder fornuis. Rucola en een lichte dressing maken er een salade van die je koud uit de koelkast kunt eten.',
      'Laat de bonen uitlekken en spoel ze even af tegen het zetmeelachtige mondgevoel. Meng pas op het laatst met de dressing zodat de blaadjes knapperig blijven — zo blijft het een lunch die voelt alsof je moeite hebt gedaan, terwijl het acht minuten werk is.',
    ],
    'spinazie-ei-bowl': [
      'Spinazie en ei zijn een klassieke combinatie om een reden: snel, goedkoop en vol nutriënten. Zwarte bonen erbij maken het een volwaardige maaltijd in plaats van een bijgerecht — handig als je weinig tijd hebt maar wel wilt vullen.',
      'Bak de spinazie eerst tot hij slinkt, dan de eieren erdoor tot ze net gestold zijn. Bonen warm mee — klaar. Een snuf chilivlokken of citroen kan het frisser maken zonder de simpliciteit te breken.',
    ],
    'kip-kokos-curry': [
      'Kokoscurry hoeft niet zwaar te zijn: tomaten en kruiden geven diepte, light kokosmelk maakt het romig zonder dat je in calorieën wegzakt. Kip pakt de smaken op en wordt mals als je hem niet te hard laat koken.',
      'Begin met de aromaten — ui, knoflook, gember — voordat je de vloeistoffen toevoegt. Laat het zacht pruttelen tot de olie loskomt; dan weet je dat de curry echt klaar is. Rijst mist je nauwelijks als de saus dik genoeg is.',
    ],
    'eiwitrijke-omelet': [
      'Een omelet is je canvas: eieren als basis, groenten als kleur, kruiden als accent. Spinazie en cherrytomaten geven zoetzure tegenstelling zonder dat je ingewikkelde sauzen nodig hebt — ideaal voor het 30/30 ontbijt.',
      'Verhit de pan goed voordat je het ei giet; vouw pas dicht als de onderkant net stevig is. Te vroeg dichtvouwen scheurt de structuur; te laat en hij wordt droog. Een minuut oefenen en je voelt vanzelf het juiste moment.',
    ],
    'mediterrane-kip-salade': [
      'Deze salade ruikt naar zon en oregano: kip, olijven en frisse groente in één kom. Perfect als lunch die je ’s ochtends mee kunt nemen — houd dressing en sla gescheiden tot het moment van eten.',
      'Kip mag koud van de vorige dag; snijd hem in plakken zodat elke hap wat kruid meekrijgt. Een scheut goede olijfolie en citroen volstaan; je hoeft geen zware crèmes te gebruiken om smaak te krijgen.',
    ],
    'groentecreme-soep': [
      'Broccoli en bloemkool worden samen een zachte, romige soep zonder aardappel — pure smaak, weinig theater. Handig om in grote hoeveelheid te maken en de helft in te vriezen voor drukke dagen.',
      'Kook de groenten tot ze heel zacht zijn, blend met een deel van het kookvocht en voeg bouillon toe tot de dikte die jij wilt. Peper, nootmuskaat of een druppel citroen maakt het af zonder room.',
    ],
  };

  static getParagraphs(slug: string): readonly string[] {
    return SeoRecipeStoryCatalog.stories[slug] ?? [];
  }
}

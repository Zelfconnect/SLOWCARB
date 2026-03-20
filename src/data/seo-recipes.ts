import { recipes } from './recipes';

interface PublicRecipe {
  id: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  targetKeyword: string;
}

export const PUBLIC_RECIPES: PublicRecipe[] = [
  {
    id: 'mega-chili',
    slug: 'chili-con-carne',
    metaTitle: 'Slow-Carb Chili Con Carne Recept',
    metaDescription:
      'Maak de beste slow-carb chili con carne met rundergehakt en bonen. Eiwitrijk, mealprep-vriendelijk en super vullend. Tim Ferriss-proof!',
    targetKeyword: 'slow carb chili con carne',
  },
  {
    id: 'shakshuka',
    slug: 'shakshuka',
    metaTitle: 'Slow-Carb Shakshuka Recept',
    metaDescription:
      'Hartige shakshuka met gepocheerde eieren in tomatensaus. Hét 30/30 ontbijt voor slow-carb dieet. Klaar in 25 minuten.',
    targetKeyword: 'slow carb shakshuka',
  },
  {
    id: 'linzensoep',
    slug: 'linzensoep',
    metaTitle: 'Rode Linzensoep Slow-Carb Recept',
    metaDescription:
      'Vullende rode linzensoep met spinazie en kurkuma. Vegan, eiwitrijk en perfect voor mealprep. Ideaal slow-carb dieetrecept.',
    targetKeyword: 'slow carb linzensoep',
  },
  {
    id: 'mexicaanse-burrito-bowl',
    slug: 'burrito-bowl',
    metaTitle: 'Slow-Carb Burrito Bowl Recept',
    metaDescription:
      'Mexicaanse burrito bowl zonder rijst of tortilla. Rundergehakt, zwarte bonen en guacamole. Snel slow-carb lunch onder 15 minuten.',
    targetKeyword: 'slow carb burrito bowl',
  },
  {
    id: 'aziatische-stir-fry',
    slug: 'roerbak-kip',
    metaTitle: 'Aziatische Roerbak Kip Recept',
    metaDescription:
      'Snelle aziatische stir-fry met kipfilet, courgetti en edamame. Low-carb wokdiner dat past binnen het slow-carb protocol.',
    targetKeyword: 'slow carb roerbak kip',
  },
  {
    id: 'frittata',
    slug: 'frittata',
    metaTitle: 'Slow-Carb Groenten Frittata Recept',
    metaDescription:
      'Eiwitrijke frittata met spinazie en paprika. Makkelijk ontbijt of lunch voor het slow-carb dieet. Maak vooraf voor de hele week.',
    targetKeyword: 'slow carb frittata',
  },
  {
    id: 'huttenkase-bowl',
    slug: 'huttenkase-power-bowl',
    metaTitle: 'Hüttenkäse Power Bowl Slow-Carb',
    metaDescription:
      'Snelle hüttenkäse power bowl met chiazaad en walnoten. 30g eiwit in 3 minuten. Hét slow-carb ontbijt zonder eieren.',
    targetKeyword: 'slow carb huttenkase ontbijt',
  },
  {
    id: 'de-ferriss-klassieker',
    slug: 'ferriss-klassieker',
    metaTitle: 'De Ferriss Klassieker – 30/30 Ontbijt',
    metaDescription:
      'Het originele 30/30 ontbijt van Tim Ferriss: eieren, vloeibaar eiwit en zwarte bonen. Start je dag met 35g eiwit in 12 minuten.',
    targetKeyword: 'ferriss klassieker slow carb ontbijt',
  },
  {
    id: 'mexicaanse-bonenschotel',
    slug: 'mexicaanse-bonenschotel',
    metaTitle: 'Mexicaanse Bonenschotel Slow-Carb',
    metaDescription:
      'Hartige mexicaanse bonenschotel met kip en kidneybonen. Kruidige one-pan maaltijd die past in het slow-carb dieet.',
    targetKeyword: 'mexicaanse bonenschotel slow carb',
  },
  {
    id: 'tonijn-witte-bonen-salade',
    slug: 'tonijn-bonen-salade',
    metaTitle: 'Tonijn-Witte Bonen Salade Slow-Carb',
    metaDescription:
      'Snelle tonijn salade met witte bonen en rucola. Koud slow-carb lunch klaar in 8 minuten. Hoog in eiwit en omega-3.',
    targetKeyword: 'slow carb tonijn salade',
  },
  {
    id: 'spinazie-ei-bowl',
    slug: 'spinazie-ei-bowl',
    metaTitle: 'Spinazie en Ei Bowl Slow-Carb',
    metaDescription:
      'Simpele spinazie en ei bowl met zwarte bonen. Vullend slow-carb ontbijt vol eiwit en vezels. In 10 minuten op tafel.',
    targetKeyword: 'slow carb spinazie ei ontbijt',
  },
  {
    id: 'kokos-curry',
    slug: 'kip-kokos-curry',
    metaTitle: 'Kip Kokos Curry Slow-Carb Recept',
    metaDescription:
      'Romige kip kokos curry met tomaten en specerijen. Slow-carb diner vol smaak. Gebruik light kokosmelk voor een lichtere versie.',
    targetKeyword: 'slow carb curry kip',
  },
  {
    id: 'eiwit-omelet',
    slug: 'eiwitrijke-omelet',
    metaTitle: 'Eiwitrijke Omelet – Slow-Carb Ontbijt',
    metaDescription:
      'Snel eiwitrijke omelet met spinazie en cherry tomaten. Perfect 30/30 slow-carb ontbijt klaar in 13 minuten. Simpel en lekker.',
    targetKeyword: 'slow carb omelet ontbijt',
  },
  {
    id: 'kip-salade',
    slug: 'mediterrane-kip-salade',
    metaTitle: 'Mediterrane Kip Salade Slow-Carb',
    metaDescription:
      'Frisse mediterrane kip salade met olijven en oregano. Lichte slow-carb lunch vol smaak en eiwitten. Snel te maken.',
    targetKeyword: 'slow carb kip salade',
  },
  {
    id: 'groentecreme-soep',
    slug: 'groentecreme-soep',
    metaTitle: 'Slow-Carb Groentecreme Soep Recept',
    metaDescription:
      'Romige groentecreme soep met broccoli en bloemkool. Lichte slow-carb soep als lunch of voorgerecht. Maak in bulk voor meerdere dagen.',
    targetKeyword: 'slow carb groenten soep',
  },
];

export const PUBLIC_RECIPE_SLUGS = PUBLIC_RECIPES.map(r => r.slug);

export function getRecipeBySlug(slug: string) {
  const publicRecipe = PUBLIC_RECIPES.find(pr => pr.slug === slug);
  if (!publicRecipe) return undefined;
  const recipe = recipes.find(r => r.id === publicRecipe.id);
  if (!recipe) return undefined;
  return { ...publicRecipe, recipe };
}

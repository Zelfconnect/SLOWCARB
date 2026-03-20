import { useParams, Navigate, Link } from 'react-router-dom';
import { useDocumentScroll } from '@/hooks/useDocumentScroll';
import { SEOHead } from '@/components/seo/SEOHead';
import { ContentPageHeader } from '@/components/seo/ContentPageHeader';
import { AuthorCard } from '@/components/seo/AuthorCard';
import { CTABand } from '@/components/seo/CTABand';
import { Footer } from '@/components/landing/Footer';
import { SeoRecipeStoryCatalog } from '@/data/SeoRecipeStoryCatalog';
import { getRecipeBySlug, PUBLIC_RECIPES } from '@/data/seo-recipes';
import '@/styles/content.css';

function toIsoDuration(time: string): string {
  const match = time.match(/(\d+)\s*(min|uur)/i);
  if (!match) return 'PT0M';
  const [, num, unit] = match;
  return unit.toLowerCase() === 'uur' ? `PT${Number(num) * 60}M` : `PT${num}M`;
}

function portiesLabel(count: number): string {
  return count === 1 ? '1 portie' : `${count} porties`;
}

export function RecipeDetailPage() {
  useDocumentScroll();
  const { slug } = useParams<{ slug: string }>();
  const data = slug ? getRecipeBySlug(slug) : undefined;

  if (!data) return <Navigate to="/404" replace />;

  const { recipe, metaTitle, metaDescription, targetKeyword } = data;
  const storyParagraphs = slug ? SeoRecipeStoryCatalog.getParagraphs(slug) : [];

  const recipeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.name,
    description: metaDescription,
    author: { '@type': 'Organization', name: 'SlowCarb' },
    datePublished: '2026-03-17',
    prepTime: toIsoDuration(recipe.prepTime),
    cookTime: toIsoDuration(recipe.cookTime),
    recipeYield: `${recipe.servings} porties`,
    recipeCuisine: 'Nederlands',
    keywords: `slow carb recept, ${targetKeyword}`,
    recipeIngredient: recipe.ingredients.map(
      (ing) => `${ing.amount} ${ing.name}`.trim()
    ),
    recipeInstructions: recipe.steps.map((step) => ({
      '@type': 'HowToStep',
      text: step,
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://eatslowcarb.com' },
      { '@type': 'ListItem', position: 2, name: 'Recepten', item: 'https://eatslowcarb.com/recepten' },
      { '@type': 'ListItem', position: 3, name: recipe.name, item: `https://eatslowcarb.com/recepten/${slug}` },
    ],
  };

  const related = PUBLIC_RECIPES.filter(r => r.slug !== slug).slice(0, 3);

  const headerByline = `SlowCarb · ${recipe.prepTime} bereiden · ${recipe.cookTime} koken · ${portiesLabel(recipe.servings)}`;

  return (
    <div className="content-page min-h-screen bg-cream">
      <SEOHead
        title={metaTitle}
        description={metaDescription}
        canonical={`https://eatslowcarb.com/recepten/${slug}`}
        ogType="article"
        jsonLd={[recipeSchema, breadcrumbSchema]}
      />

      <ContentPageHeader
        kicker={recipe.category}
        title={recipe.name}
        author="SlowCarb"
        readingTime=""
        byline={headerByline}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Recepten', to: '/recepten' },
          { label: recipe.name, to: `/recepten/${slug}` },
        ]}
        heroImage="/images/landing/HEROBREAKFAST.webp"
      />

      <main className="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12">
        {storyParagraphs.length > 0 && (
          <div className="mb-10 space-y-4 editorial-body text-stone-700">
            {storyParagraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        )}

        <div className="callout-card mb-10 text-stone-700">
          <p className="text-sm font-semibold text-sage-800">Slow carb checklist</p>
          <p className="mt-1 text-sm leading-relaxed">
            Dit recept volgt de vijf regels: geen witte koolhydraten, herhaal dezelfde maaltijden gerust,
            geen frisdrank of sap, geen fruit (behalve op cheatdag) en plan één dag per week om los te laten.
          </p>
        </div>

        <div className="md:flex md:gap-10">
          <div className="mb-10 md:mb-0 md:w-64 md:flex-shrink-0">
            <div className="rounded-2xl border border-sage-100 bg-white p-5 shadow-sm md:sticky md:top-4">
              <h2 className="mb-3 font-display text-lg font-bold text-stone-900">Wat je nodig hebt</h2>
              <ul className="space-y-2.5 text-sm text-stone-700">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="border-b border-stone-100 pb-2.5 last:border-0 last:pb-0">
                    <span className="font-medium text-stone-800">{ing.name}</span>
                    <span className="mt-0.5 block text-stone-500">{ing.amount}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="mb-2 font-display text-2xl font-bold text-stone-900">Aan de slag</h2>
            <p className="mb-6 text-stone-600 editorial-body">
              Volg de stappen in je eigen tempo — alles staat in de volgorde waarin wij het in de keuken doen.
            </p>
            <ol className="space-y-5">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-sage-100 text-xs font-bold text-sage-800"
                    aria-hidden
                  >
                    {i + 1}
                  </span>
                  <p className="pt-1 editorial-body text-stone-700">{step}</p>
                </li>
              ))}
            </ol>

            {recipe.tips && recipe.tips.length > 0 && (
              <div className="callout-card mt-10">
                <h3 className="mb-2 font-display text-lg font-bold text-stone-900">Extra tips</h3>
                <ul className="space-y-2 text-sm text-stone-600">
                  {recipe.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {recipe.tags && recipe.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {recipe.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-sage-50 px-3 py-1 text-xs font-medium text-sage-800 ring-1 ring-sage-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12">
          <AuthorCard />
        </div>

        {related.length > 0 && (
          <nav className="mt-12 border-t border-sage-100 pt-8">
            <p className="editorial-kicker mb-4 text-sage-600">Meer recepten</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map(r => (
                <Link
                  key={r.slug}
                  to={`/recepten/${r.slug}`}
                  className="rounded-2xl border border-sage-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <p className="font-bold text-stone-900">{r.metaTitle.split('–')[0].trim()}</p>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </main>

      <CTABand />
      <Footer />
    </div>
  );
}

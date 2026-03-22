import { useDocumentScroll } from '@/hooks/useDocumentScroll';
import { SEOHead } from '@/components/seo/SEOHead';
import { ContentPageHeader } from '@/components/seo/ContentPageHeader';
import { EditorialIndexCard } from '@/components/seo/EditorialIndexCard';
import { CTABand } from '@/components/seo/CTABand';
import { Footer } from '@/components/landing/Footer';
import { PUBLIC_RECIPES, getRecipeBySlug, getRecipeImage } from '@/data/seo-recipes';
import '@/styles/content.css';

export function RecipeIndexPage() {
  useDocumentScroll();
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '50+ Slow Carb Recepten',
    description: '15 gratis slow carb recepten. Allemaal voldoen ze aan de 5 slow carb regels van Tim Ferriss.',
    url: 'https://eatslowcarb.com/recepten',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://eatslowcarb.com' },
      { '@type': 'ListItem', position: 2, name: 'Recepten', item: 'https://eatslowcarb.com/recepten' },
    ],
  };

  return (
    <div className="content-page min-h-screen bg-cream">
      <SEOHead
        title="50+ Slow Carb Recepten | SlowCarb"
        description="15 gratis slow carb recepten. Allemaal voldoen ze aan de 5 slow carb regels van Tim Ferriss."
        canonical="https://eatslowcarb.com/recepten"
        jsonLd={[collectionSchema, breadcrumbSchema]}
      />

      <ContentPageHeader
        kicker="Recepten"
        title="Slow Carb Recepten"
        author="SlowCarb"
        readingTime=""
        byline={`SlowCarb · ${PUBLIC_RECIPES.length} recepten`}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Recepten', to: '/recepten' },
        ]}
        heroImage={{ mobile: '/images/landing/gids/recepten-mobile.webp', desktop: '/images/landing/gids/recepten-desktop.webp' }}
      />

      <main className="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12">
        <p className="mb-8 editorial-body text-stone-600">
          Dit zijn {PUBLIC_RECIPES.length} van onze 50+ recepten. Elk gerecht volgt de vijf slow carb regels; hier lees je ze
          zoals we ze op de site uitschrijven, met een korte intro vóór de ingrediënten en stappen.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {PUBLIC_RECIPES.map(pr => {
            const data = getRecipeBySlug(pr.slug);
            const recipe = data?.recipe;
            const image = getRecipeImage(pr.id);
            
            const metaParts = [];
            if (recipe?.prepTime) metaParts.push(`Bereiden: ${recipe.prepTime}`);
            if (recipe?.cookTime) metaParts.push(`Koken: ${recipe.cookTime}`);
            const metaLine = metaParts.join(' · ');

            return (
              <EditorialIndexCard
                key={pr.slug}
                to={`/recepten/${pr.slug}`}
                kicker={recipe?.category}
                title={recipe?.name || pr.slug}
                metaLine={metaLine || undefined}
                imageSrc={image || undefined}
                imageAlt={recipe?.name || pr.slug}
              />
            );
          })}
        </div>
      </main>

      <CTABand />
      <Footer />
    </div>
  );
}

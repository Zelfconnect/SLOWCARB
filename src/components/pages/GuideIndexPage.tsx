import { useDocumentScroll } from '@/hooks/useDocumentScroll';
import { SEOHead } from '@/components/seo/SEOHead';
import { ContentPageHeader } from '@/components/seo/ContentPageHeader';
import { EditorialIndexCard } from '@/components/seo/EditorialIndexCard';
import { CTABand } from '@/components/seo/CTABand';
import { Footer } from '@/components/landing/Footer';
import { getArticlesByBasePath } from '@/data/seo-content';
import '@/styles/content.css';

const GUIDE_BASE_PATH = '/gids';
const guideArticles = getArticlesByBasePath(GUIDE_BASE_PATH);

export function GuideIndexPage() {
  useDocumentScroll();
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Slow Carb Gids',
    description: 'Praktische gidsen over het slow carb dieet, vergelijkingen en de beste startartikelen.',
    url: 'https://eatslowcarb.com/gids',
    hasPart: guideArticles.map((article) => ({
      '@type': 'Article',
      headline: article.title,
      url: `https://eatslowcarb.com${article.basePath}/${article.slug}`,
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://eatslowcarb.com' },
      { '@type': 'ListItem', position: 2, name: 'Gids', item: 'https://eatslowcarb.com/gids' },
    ],
  };

  return (
    <div className="content-page min-h-screen bg-cream">
      <SEOHead
        title="Slow Carb Gids | SlowCarb"
        description="Praktische gidsen over het slow carb dieet, vergelijkingen en de beste startartikelen."
        canonical="https://eatslowcarb.com/gids"
        jsonLd={[collectionSchema, breadcrumbSchema]}
      />

      <ContentPageHeader
        kicker="Gids"
        title="Slow Carb Gids"
        author="SlowCarb"
        readingTime=""
        byline={`SlowCarb · ${guideArticles.length} artikelen`}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Gids', to: '/gids' },
        ]}
        heroImage={{ mobile: '/images/landing/gids/gids-mobile.webp', desktop: '/images/landing/gids/gids-desktop.webp' }}
      />

      <main className="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12">
        <p className="mb-8 editorial-body text-stone-600">
          Lees onze startgids en verdiepende vergelijkingen over het slow carb dieet.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {guideArticles.map((article) => (
            <EditorialIndexCard
              key={`${article.basePath}/${article.slug}`}
              to={`${article.basePath}/${article.slug}`}
              kicker={article.kicker}
              title={article.title}
              description={article.metaDescription}
              metaLine={
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-sage-700">
                  {article.readingTime} leestijd
                </span>
              }
            />
          ))}
        </div>
      </main>

      <CTABand />
      <Footer />
    </div>
  );
}

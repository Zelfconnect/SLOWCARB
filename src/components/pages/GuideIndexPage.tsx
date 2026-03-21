import { Link } from 'react-router-dom';
import { useDocumentScroll } from '@/hooks/useDocumentScroll';
import { SEOHead } from '@/components/seo/SEOHead';
import { ContentPageHeader } from '@/components/seo/ContentPageHeader';
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
        heroImage="/images/landing/MEALPREP.webp"
      />

      <main className="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12">
        <p className="mb-8 editorial-body text-stone-600">
          Lees onze startgids en verdiepende vergelijkingen over het slow carb dieet.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {guideArticles.map((article) => (
            <Link
              key={`${article.basePath}/${article.slug}`}
              to={`${article.basePath}/${article.slug}`}
              className="group rounded-2xl border border-sage-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="mb-2 inline-block rounded-full bg-sage-50 px-2.5 py-0.5 text-xs font-semibold text-sage-700">
                {article.kicker}
              </span>
              <h2 className="font-display text-lg font-bold text-stone-900 group-hover:text-sage-700">
                {article.title}
              </h2>
              <p className="mt-2 text-sm text-stone-600">{article.metaDescription}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-sage-700">
                {article.readingTime} leestijd
              </p>
            </Link>
          ))}
        </div>
      </main>

      <CTABand />
      <Footer />
    </div>
  );
}

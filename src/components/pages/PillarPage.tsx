import { SEOHead } from '@/components/seo/SEOHead';
import { ContentPageLayout } from '@/components/seo/ContentPageLayout';
import { pillarPage } from '@/data/seo-content';

export function PillarPage() {
  const article = pillarPage;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    author: { '@type': 'Person', name: article.author, url: 'https://eatslowcarb.com' },
    publisher: { '@type': 'Organization', name: 'SlowCarb', url: 'https://eatslowcarb.com' },
    datePublished: article.publishDate,
    dateModified: article.lastModified,
    mainEntityOfPage: `https://eatslowcarb.com${article.basePath}/${article.slug}`,
    inLanguage: 'nl',
  };

  const faqSchema = article.faq && article.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faq.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  } : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://eatslowcarb.com' },
      { '@type': 'ListItem', position: 2, name: 'Gids', item: 'https://eatslowcarb.com/gids' },
      { '@type': 'ListItem', position: 3, name: article.title, item: `https://eatslowcarb.com${article.basePath}/${article.slug}` },
    ],
  };

  const jsonLd = [articleSchema, breadcrumbSchema, ...(faqSchema ? [faqSchema] : [])];

  return (
    <>
      <SEOHead
        title={article.metaTitle}
        description={article.metaDescription}
        canonical={`https://eatslowcarb.com${article.basePath}/${article.slug}`}
        ogType="article"
        jsonLd={jsonLd}
      />
      <ContentPageLayout
        kicker={article.kicker}
        title={article.title}
        author={article.author}
        readingTime={article.readingTime}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Gids', to: '/gids' },
          { label: article.title, to: `${article.basePath}/${article.slug}` },
        ]}
        relatedLinks={[
          { label: 'Slow Carb vs Keto: Welk Dieet Past?', to: '/gids/slow-carb-vs-keto' },
          { label: 'Bekijk onze recepten', to: '/recepten' },
        ]}
        heroImage={{ mobile: '/images/landing/gids/gidsslow-carb-dieet-mobile.webp', desktop: '/images/landing/gids/gidsslow-carb-dieet-desktop.webp' }}
      >
        {article.sections.map((section, i) => (
          <section key={i} className="mb-8">
            <h2 className="mb-4 font-display text-2xl font-bold text-stone-900">{section.heading}</h2>
            <div dangerouslySetInnerHTML={{ __html: section.content }} />
            {section.subsections?.map((sub, j) => (
              <div key={j} className="mt-6">
                <h3 className="mb-2 font-display text-xl font-semibold text-stone-800">{sub.heading}</h3>
                <div dangerouslySetInnerHTML={{ __html: sub.content }} />
              </div>
            ))}
          </section>
        ))}

        {article.faq && article.faq.length > 0 && (
          <section className="mt-10 border-t border-sage-100 pt-8">
            <h2 className="mb-6 font-display text-2xl font-bold text-stone-900">Veelgestelde vragen</h2>
            <dl className="space-y-6">
              {article.faq.map((faq, i) => (
                <div key={i}>
                  <dt className="font-bold text-stone-900">{faq.question}</dt>
                  <dd className="mt-1 text-stone-600">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </ContentPageLayout>
    </>
  );
}

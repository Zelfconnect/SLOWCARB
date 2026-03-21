import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentScroll } from '@/hooks/useDocumentScroll';
import { ContentPageHeader } from './ContentPageHeader';
import { AuthorCard } from './AuthorCard';
import { CTABand } from './CTABand';
import { Footer } from '@/components/landing/Footer';
import '@/styles/content.css';

interface ContentPageLayoutProps {
  kicker: string;
  title: string;
  author: string;
  readingTime: string;
  breadcrumbs: { label: string; to: string }[];
  children: ReactNode;
  relatedLinks?: { label: string; to: string }[];
  heroImage?: string;
}

export function ContentPageLayout({
  kicker,
  title,
  author,
  readingTime,
  breadcrumbs,
  children,
  relatedLinks,
  heroImage,
}: ContentPageLayoutProps) {
  useDocumentScroll();
  return (
    <div className="content-page min-h-screen bg-cream">
      <ContentPageHeader
        kicker={kicker}
        title={title}
        author={author}
        readingTime={readingTime}
        breadcrumbs={breadcrumbs}
        heroImage={heroImage}
      />

      <main className="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12">
        <article className="editorial-body text-stone-700">
          {children}
        </article>

        <div className="mt-10">
          <AuthorCard />
        </div>

        {relatedLinks && relatedLinks.length > 0 && (
          <nav className="mt-8 border-t border-sage-100 pt-6">
            <p className="editorial-kicker mb-3 text-sage-600">Lees ook</p>
            <ul className="space-y-2">
              {relatedLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sage-700 font-semibold hover:underline">
                    {link.label} &rarr;
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </main>

      <CTABand />
      <Footer />
    </div>
  );
}

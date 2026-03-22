import { Link } from 'react-router-dom';
import { SiteHeader } from './SiteHeader';

interface HeroImage {
  mobile: string;
  desktop: string;
}

interface ContentPageHeaderProps {
  kicker: string;
  title: string;
  author: string;
  readingTime: string;
  byline?: string;
  breadcrumbs: { label: string; to: string }[];
  heroImage?: HeroImage;
}

export function ContentPageHeader({
  kicker,
  title,
  author,
  readingTime,
  byline,
  breadcrumbs,
  heroImage,
}: ContentPageHeaderProps) {
  return (
    <>
      <header className="relative flex min-h-[40vh] flex-col justify-end overflow-hidden bg-surface-dark md:min-h-[50vh]">
        <SiteHeader />

        {heroImage && (
          <div className="absolute inset-0 z-0">
            <picture>
              <source media="(min-width: 768px)" srcSet={heroImage.desktop} type="image/webp" />
              <img
                src={heroImage.mobile}
                alt=""
                className="h-full w-full object-cover object-center"
                loading="eager"
              />
            </picture>
            {/* Base dim: busy food photos need a stable floor under typography */}
            <div className="absolute inset-0 bg-black/45" aria-hidden />
            {/* Top scrim for nav + breadcrumbs */}
            <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/75 to-transparent" />
            {/* Bottom scrim for title + meta */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/45 to-black/90" />
          </div>
        )}

        {!heroImage && (
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-surface-dark via-sage-900 to-surface-dark" />
        )}

        <div className="relative z-10 mx-auto w-full max-w-3xl px-5 pb-8 pt-20 md:px-8 md:pb-10 md:pt-28">
          <nav
            className="mb-6 text-sm font-medium text-white/90 [text-shadow:0_1px_3px_rgba(0,0,0,0.85)]"
            aria-label="Breadcrumb"
          >
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.to}>
                {i > 0 && <span className="mx-1.5 text-white/70">&rsaquo;</span>}
                {i < breadcrumbs.length - 1 ? (
                  <Link to={crumb.to} className="transition-colors hover:text-white">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white/85">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>

          <p className="mb-3">
            <span className="inline-flex items-center rounded-full border border-white/25 bg-black/55 px-3 py-1.5 text-cream shadow-[0_4px_20px_rgba(0,0,0,0.45)] backdrop-blur-sm editorial-kicker">
              {kicker}
            </span>
          </p>

          <h1 className="font-heading text-4xl font-bold uppercase leading-tight tracking-tight text-cream [text-shadow:0_2px_20px_rgba(0,0,0,0.88),0_1px_4px_rgba(0,0,0,0.95)] md:text-6xl md:leading-tight">
            {title}
          </h1>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-bold text-cream ring-1 ring-white/25 backdrop-blur-sm">
              {author.charAt(0).toUpperCase()}
            </div>
            <p className="text-sm font-medium text-white/90 [text-shadow:0_1px_3px_rgba(0,0,0,0.85)]">
              {byline ?? (
                <>
                  {author} &middot; {readingTime} leestijd
                </>
              )}
            </p>
          </div>
        </div>
      </header>
    </>
  );
}

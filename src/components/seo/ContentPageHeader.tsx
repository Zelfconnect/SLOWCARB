import { Link } from 'react-router-dom';

interface ContentPageHeaderProps {
  kicker: string;
  title: string;
  author: string;
  /** Shown as "{author} · {readingTime} leestijd" when `byline` is omitted. */
  readingTime: string;
  /** When set, replaces the default author / reading time line (e.g. receptmetadata). */
  byline?: string;
  breadcrumbs: { label: string; to: string }[];
  heroImage?: string;
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
        {heroImage && (
          <div className="absolute inset-0 z-0">
            <img
              src={heroImage}
              alt=""
              className="h-full w-full object-cover object-center"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[rgb(28,25,23)]/60 via-[rgb(28,25,23)]/30 to-[rgb(28,25,23)]/80" />
          </div>
        )}

        {!heroImage && (
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-stone-900 via-sage-900 to-[rgb(28,25,23)]" />
        )}

        <div className="relative z-10 mx-auto w-full max-w-3xl px-5 pb-8 pt-16 md:px-8 md:pb-10 md:pt-24">
          <nav className="mb-6 text-xs text-white/50" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.to}>
                {i > 0 && <span className="mx-1.5">&rsaquo;</span>}
                {i < breadcrumbs.length - 1 ? (
                  <Link to={crumb.to} className="transition-colors hover:text-white/70">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white/35">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>

          <p className="editorial-kicker text-sage-400 mb-3">{kicker}</p>

          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-white drop-shadow-lg md:text-5xl md:leading-tight">
            {title}
          </h1>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white/80 backdrop-blur-sm">
              {author.charAt(0).toUpperCase()}
            </div>
            <p className="text-sm text-white/60">
              {byline ?? (
                <>
                  {author} &middot; {readingTime} leestijd
                </>
              )}
            </p>
          </div>
        </div>
      </header>

      <div className="content-header-gradient" />
    </>
  );
}

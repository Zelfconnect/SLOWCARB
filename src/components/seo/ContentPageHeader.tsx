import { Link } from 'react-router-dom';

interface ContentPageHeaderProps {
  kicker: string;
  title: string;
  author: string;
  /** Shown as “{author} · {readingTime} leestijd” when `byline` is omitted. */
  readingTime: string;
  /** When set, replaces the default author / reading time line (e.g. receptmetadata). */
  byline?: string;
  breadcrumbs: { label: string; to: string }[];
}

export function ContentPageHeader({
  kicker,
  title,
  author,
  readingTime,
  byline,
  breadcrumbs,
}: ContentPageHeaderProps) {
  return (
    <>
      <header className="bg-gradient-to-b from-stone-900 to-sage-800 px-4 pb-6 pt-8 md:px-8 md:pb-8 md:pt-12">
        <div className="mx-auto max-w-3xl">
          <nav className="mb-4 text-xs text-stone-400" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.to}>
                {i > 0 && <span className="mx-1.5">&rsaquo;</span>}
                {i < breadcrumbs.length - 1 ? (
                  <Link to={crumb.to} className="hover:text-stone-300 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-stone-500">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>

          <p className="editorial-kicker text-sage-400">{kicker}</p>

          <h1 className="mt-2 font-display text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
            {title}
          </h1>

          <div className="mt-4 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sage-700/50 text-xs font-bold text-sage-300">
              {author.charAt(0).toUpperCase()}
            </div>
            <p className="text-sm text-stone-400">
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

import { SEOHead } from '@/components/seo/SEOHead';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <>
      <SEOHead
        title="Pagina niet gevonden | SlowCarb"
        description="Deze pagina bestaat niet."
        canonical="https://eatslowcarb.com/404"
        noindex
      />
      <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center">
        <h1 className="font-display text-4xl font-bold text-stone-900">404</h1>
        <p className="mt-2 text-lg text-stone-600">Deze pagina bestaat niet.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/"
            className="rounded-full bg-sage-600 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Naar home
          </Link>
          <Link
            to="/recepten"
            className="rounded-full border border-sage-200 bg-white px-6 py-3 text-sm font-bold text-sage-700 shadow-sm transition hover:-translate-y-0.5"
          >
            Bekijk recepten
          </Link>
        </div>
      </div>
    </>
  );
}

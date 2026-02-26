import { cn } from '@/lib/utils';

type TrustFooterProps = {
  className?: string;
  includeOpenAppLink?: boolean;
  tone?: 'light' | 'dark';
  copy?: string;
};

const legalLinks = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Voorwaarden' },
  { href: '/refund-policy', label: 'Terugbetalingsbeleid' },
  { href: '/imprint', label: 'Imprint' },
] as const;

export function TrustFooter({
  className,
  includeOpenAppLink = false,
  tone = 'light',
  copy = '© 2026 SlowCarb. Alle rechten voorbehouden.',
}: TrustFooterProps) {
  const isDark = tone === 'dark';

  return (
    <footer
      className={cn(
        'py-8',
        isDark ? 'bg-stone-900 text-stone-400' : 'border-t border-stone-200 bg-cream text-stone-600',
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-4 px-4 text-sm sm:px-6 lg:flex-row lg:px-8">
        <div className="text-center lg:text-left">
          <p>{copy}</p>
          <p className={cn('text-xs', isDark ? 'text-stone-500' : 'text-stone-500')}>Imprint: Boostd B.V.</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          {includeOpenAppLink && (
            <a
              href="/?app=1"
              className={cn(
                'transition-colors',
                isDark ? 'text-sage-300 hover:text-sage-200' : 'text-sage-700 hover:text-sage-800'
              )}
            >
              Open je app →
            </a>
          )}
          {legalLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn('transition-colors', isDark ? 'hover:text-white' : 'hover:text-stone-900')}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

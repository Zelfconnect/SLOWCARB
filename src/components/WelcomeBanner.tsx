import { Sparkles, X } from 'lucide-react';
import { useState } from 'react';

const DISMISS_KEY = 'slowcarb-welcome-dismissed';
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

interface WelcomeBannerProps {
  userName: string;
  mealCount: number;
  journeyStartDate: string;
}

function startedWithinLast24Hours(journeyStartDate: string): boolean {
  if (!journeyStartDate) return false;

  const start = new Date(`${journeyStartDate}T00:00:00`);
  if (Number.isNaN(start.getTime())) return false;

  const elapsed = Date.now() - start.getTime();
  return elapsed >= 0 && elapsed < ONE_DAY_IN_MS;
}

export function WelcomeBanner({ userName, mealCount, journeyStartDate }: WelcomeBannerProps) {
  const [isDismissed, setIsDismissed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(DISMISS_KEY) === 'true';
  });

  if (isDismissed || mealCount > 0 || !startedWithinLast24Hours(journeyStartDate)) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    window.localStorage.setItem(DISMISS_KEY, 'true');
  };

  return (
    <section className="relative rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
      <button
        type="button"
        aria-label="Sluit welkomstbanner"
        className="absolute right-3 top-3 rounded-full p-1 text-emerald-700 transition hover:bg-emerald-100"
        onClick={handleDismiss}
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-3 pr-8">
        <Sparkles className="mt-0.5 h-5 w-5 text-emerald-700" aria-hidden="true" />
        <div className="space-y-3">
          <p className="text-sm font-medium text-emerald-900">
            Welkom {userName}! Je plan staat klaar. Log je eerste ontbijt om je streak te starten.
          </p>
          <button
            type="button"
            className="rounded-xl bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Log ontbijt
          </button>
        </div>
      </div>
    </section>
  );
}


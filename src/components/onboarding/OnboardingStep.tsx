import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface OnboardingStepProps {
  children: React.ReactNode;
  /** CTA button text */
  cta?: string;
  onNext?: () => void;
  onBack?: () => void;
  /** Disable CTA */
  disabled?: boolean;
  /** Current step (1-indexed). Hidden on screen 1 */
  step?: number;
  /** Total steps for progress bar */
  totalSteps?: number;
  /** Use dark theme (hero/summary screens) */
  dark?: boolean;
  /** Hide the progress bar and back button */
  hideChrome?: boolean;
  /** Extra class on the scrollable inner container */
  className?: string;
}

export function OnboardingStep({
  children,
  cta,
  onNext,
  onBack,
  disabled,
  step = 1,
  totalSteps = 10,
  dark = false,
  hideChrome = false,
  className = '',
}: OnboardingStepProps) {
  // 9 progress segments (screen 1 has no bar)
  const progressSegments = totalSteps - 1;
  // step 2 = segment 1, step 10 = segment 9
  const activeSegments = step - 1;

  return (
    <div
      className={`app-screen flex flex-col ${
        dark
          ? 'bg-gradient-to-b from-sage-700 via-sage-800 to-stone-900'
          : 'bg-gradient-to-b from-cream via-cream to-warm-100/70'
      }`}
    >
      <div
        className={`mx-auto flex w-full max-w-xl min-h-0 flex-1 flex-col overflow-y-auto px-6 pb-[calc(120px+env(safe-area-inset-bottom,0px))] pt-6 sm:px-8 ${className}`}
      >
        {/* Chrome: back button + progress bar */}
        {!hideChrome && (
          <div className="mb-6 flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onBack}
              className={`shrink-0 ${
                dark
                  ? 'text-white/70 hover:bg-white/10 hover:text-white'
                  : 'text-stone-700 hover:bg-transparent hover:text-stone-900'
              } ${step <= 2 ? 'invisible' : ''}`}
              aria-label="Vorige stap"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            {/* Segmented progress bar */}
            <div className="flex flex-1 gap-1.5">
              {Array.from({ length: progressSegments }, (_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                    i < activeSegments
                      ? dark
                        ? 'bg-white/90'
                        : 'bg-sage-600'
                      : dark
                        ? 'bg-white/20'
                        : 'bg-warm-200'
                  }`}
                />
              ))}
            </div>

            {/* Spacer to balance the back button */}
            <div className="h-10 w-10 shrink-0" />
          </div>
        )}

        {/* Step content */}
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>

        {/* CTA button */}
        {cta && onNext && (
          <div className="mt-auto shrink-0 pt-6">
            <Button
              type="button"
              onClick={onNext}
              disabled={disabled}
              className={`h-14 w-full shrink-0 rounded-xl text-lg font-semibold ${
                dark
                  ? 'bg-white text-sage-800 hover:bg-white/90'
                  : 'bg-sage-600 text-white hover:bg-sage-700'
              }`}
            >
              {cta}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

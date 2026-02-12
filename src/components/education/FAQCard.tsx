import { useRef, useEffect } from 'react';
import { X, Check, XCircle, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FAQCard as FAQCardType } from '@/types';

interface FAQCardProps {
  card: FAQCardType;
  isOpen: boolean;
  onClose: () => void;
}

const answerConfig = {
  ja: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    icon: Check,
    label: 'JA',
    iconBg: 'bg-emerald-500',
  },
  nee: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    icon: XCircle,
    label: 'NEE',
    iconBg: 'bg-red-500',
  },
  misschien: {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-200',
    icon: HelpCircle,
    label: 'MISSCHIEN',
    iconBg: 'bg-amber-500',
  },
};

export function FAQCard({ card, isOpen, onClose }: FAQCardProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const answerStyle = answerConfig[card.content.answer];
  const AnswerIcon = answerStyle.icon;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal - Smaller for FAQ */}
      <div
        className="fixed inset-x-4 top-24 bottom-auto z-50 animate-expand-up"
        style={{ maxHeight: '65vh' }}
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header - Neutral gray */}
          <div className="p-5 bg-gradient-to-br from-stone-600 to-stone-700 flex-shrink-0">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
                  {card.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-display text-white leading-tight">{card.title}</h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-white/10 text-white/70 hover:bg-white/20 transition-all duration-200 flex items-center justify-center flex-shrink-0"
                aria-label="Sluiten"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div
            ref={contentRef}
            className="p-5 space-y-4 overflow-y-auto"
            style={{
              paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {/* Direct Answer */}
            <div className={cn(
              'rounded-xl p-4 border-2 flex items-center gap-3',
              answerStyle.bg,
              answerStyle.border
            )}>
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                answerStyle.iconBg
              )}>
                <AnswerIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className={cn('text-sm font-semibold uppercase tracking-wide', answerStyle.text)}>
                  Antwoord: {answerStyle.label}
                </p>
              </div>
            </div>

            {/* Explanation */}
            <div>
              <p className="text-stone-700 leading-relaxed text-sm">
                {card.content.explanation}
              </p>
            </div>

            {/* Nuance - Optional */}
            {card.content.nuance && card.content.nuance.length > 0 && (
              <>
                <div className="border-t border-stone-200" />
                <div>
                  <h3 className="text-sm font-semibold text-stone-500 mb-2">
                    Let op
                  </h3>
                  <div className="space-y-2">
                    {card.content.nuance.map((n, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-stone-400 mt-0.5">•</span>
                        <p className="text-stone-600 text-sm">{n}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Bottom spacing */}
            <div className="h-2" />
          </div>

          {/* Scroll indicator gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-3xl" />
        </div>
      </div>
    </>
  );
}

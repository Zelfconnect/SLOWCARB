import { useRef } from 'react';
import { X, Check, XCircle, HelpCircle } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { FAQCard as FAQCardType } from '@/types';
import { getEducationIcon } from '@/lib/educationIcons';

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
    bg: 'bg-stone-100',
    text: 'text-stone-800',
    border: 'border-stone-200',
    icon: HelpCircle,
    label: 'MISSCHIEN',
    iconBg: 'bg-stone-500',
  },
};

export function FAQCard({ card, isOpen, onClose }: FAQCardProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const answerStyle = answerConfig[card.content.answer];
  const AnswerIcon = answerStyle.icon;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="sm:mx-auto max-w-lg max-h-[75dvh] rounded-3xl border border-stone-200 shadow-xl p-0 flex flex-col"
      >
        {/* Header - Neutral gray */}
        <div className="p-5 bg-gradient-to-br from-stone-600 to-stone-700 flex-shrink-0 rounded-t-3xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
                  {(() => {
                    const Icon = getEducationIcon(card.icon) ?? HelpCircle;
                    return <Icon className="w-6 h-6 text-white" aria-hidden="true" />;
                  })()}
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
          <ScrollArea className="flex-1">
            <div
              ref={contentRef}
              className="p-5 space-y-4"
              style={{
                paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
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
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-stone-800">Uitleg</h3>
              <p className="text-stone-700 text-sm leading-relaxed">
                {card.content.explanation}
              </p>
            </div>

            {/* Nuance - Optional */}
            {card.content.nuance && card.content.nuance.length > 0 && (
              <>
                <div className="border-t border-stone-200" />
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-stone-800">
                    Let op
                  </h3>
                  <div className="space-y-2">
                    {card.content.nuance.map((n, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-stone-400 mt-0.5">•</span>
                        <p className="text-stone-600 text-sm leading-relaxed">{n}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Bottom spacing */}
            <div className="h-2" />
            </div>
          </ScrollArea>

          {/* Scroll indicator gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-3xl" />
      </DialogContent>
    </Dialog>
  );
}

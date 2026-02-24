import { useRef } from 'react';
import { X, FlaskConical, Lightbulb, AlertCircle, HelpCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { RuleCard as RuleCardType } from '@/types';
import { RULE_TOKENS } from '@/data/educationTokens';
import { getEducationIcon } from '@/lib/educationIcons';

interface RuleCardProps {
  card: RuleCardType;
  isOpen: boolean;
  onClose: () => void;
}

export function RuleCard({ card, isOpen, onClose }: RuleCardProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const HeaderIcon = getEducationIcon(card.icon) ?? HelpCircle;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="sm:mx-auto max-w-lg max-h-[85dvh] rounded-3xl border-0 shadow-[0_28px_60px_-20px_rgba(15,23,42,0.35)] p-0 flex flex-col bg-gradient-to-b from-white to-stone-50"
        style={{ maxHeight: RULE_TOKENS.maxHeight }}
      >
        <DialogTitle className="sr-only">{card.title}</DialogTitle>
        {/* Header - ALWAYS Primary Green */}
        <div className={`p-5 bg-gradient-to-br ${RULE_TOKENS.background} flex-shrink-0 rounded-t-3xl`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
                  <HeaderIcon className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-display text-white leading-tight">{card.title}</h2>
                  {card.ruleNumber !== undefined && card.ruleNumber > 0 && (
                    <p className="text-sm text-white/80 mt-0.5">
                      Regel #{card.ruleNumber} van 5
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-2xl bg-white/10 text-white/70 hover:bg-white/20 transition-all duration-200 flex items-center justify-center flex-shrink-0"
                aria-label="Sluiten"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content - Scrollable */}
          <ScrollArea className="flex-1 min-h-0">
            <div
              ref={contentRef}
              className="p-5 space-y-5"
              style={{
                paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
              }}
            >
            {/* The Rule Statement - Prominent */}
            <div className="bg-stone-900 text-white rounded-2xl p-4 shadow-surface">
              <p className="font-medium text-base leading-relaxed">
                {card.content.rule}
              </p>
            </div>

            {/* Science Section */}
            <div>
              <div className="space-y-2">
                <h3 className="flex items-center gap-2 text-base font-semibold text-stone-700">
                  <FlaskConical className="w-4 h-4" />
                  De Wetenschap
                </h3>
                <p className="text-stone-700 text-sm leading-relaxed">
                  {card.content.science}
                </p>
              </div>
            </div>

            {/* Tips Section - Always 3 tips */}
            <div>
              <h3 className="flex items-center gap-2 text-base font-semibold text-stone-700 mb-3">
                <Lightbulb className="w-4 h-4" />
                Praktische Tips
              </h3>
              <div className="space-y-2">
                {card.content.tips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-br from-sage-50 to-sage-100/70 shadow-surface"
                  >
                    <span className="w-5 h-5 rounded-full bg-sage-500 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-stone-700 text-sm leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Exceptions - Optional */}
            {card.content.exceptions && (
              <>
                <div className="rounded-2xl p-4 bg-gradient-to-br from-stone-50 to-white shadow-surface">
                  <div className="space-y-2">
                    <h3 className="flex items-center gap-2 text-base font-semibold text-stone-800">
                      <AlertCircle className="w-4 h-4" />
                      Uitzonderingen
                    </h3>
                    <p className="text-stone-700 text-sm leading-relaxed">{card.content.exceptions}</p>
                  </div>
                </div>
              </>
            )}

            {/* Bottom spacing */}
            <div className="h-4" />
            </div>
          </ScrollArea>

          {/* Scroll indicator gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-3xl" />
      </DialogContent>
    </Dialog>
  );
}

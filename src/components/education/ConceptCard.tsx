import { useRef, useEffect } from 'react';
import { X, Zap, Lightbulb, ArrowRight } from 'lucide-react';
import type { ConceptCard as ConceptCardType } from '@/types';
import { CONCEPT_TOKENS } from '@/data/educationTokens';

interface ConceptCardProps {
  card: ConceptCardType;
  isOpen: boolean;
  onClose: () => void;
  onOpenRelated?: (cardId: string) => void;
}

export function ConceptCard({ card, isOpen, onClose, onOpenRelated }: ConceptCardProps) {
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

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed inset-x-4 top-20 bottom-28 z-50 animate-expand-up"
        style={{ maxHeight: CONCEPT_TOKENS.maxHeight }}
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden h-full flex flex-col">
          {/* Header - ALWAYS Amber/Orange */}
          <div className={`p-5 bg-gradient-to-br ${CONCEPT_TOKENS.background} flex-shrink-0`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
                  {card.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-display text-white leading-tight">{card.title}</h2>
                  {card.subtitle && (
                    <p className="text-sm text-white/80 mt-0.5">{card.subtitle}</p>
                  )}
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

          {/* Content - Scrollable */}
          <div
            ref={contentRef}
            className="flex-1 overflow-y-auto p-5 space-y-5"
            style={{
              paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {/* Summary Box - Always at top, amber background */}
            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-4">
              <p className="text-amber-900 font-medium text-sm leading-relaxed">
                {card.content.summary}
              </p>
            </div>

            {/* Key Points Section - Always 3 items */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-stone-500 mb-3">
                <Zap className="w-4 h-4" />
                Key Points
              </h3>
              <div className="space-y-3">
                {card.content.keyPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 p-3 bg-stone-50 rounded-xl"
                  >
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-medium text-stone-800 text-sm">{point.title}</p>
                      <p className="text-stone-600 text-xs mt-0.5">{point.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fun Fact - Optional */}
            {card.content.funFact && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-blue-800 mb-2">
                  <Lightbulb className="w-4 h-4" />
                  Wist je dat?
                </h3>
                <p className="text-blue-700 text-sm">{card.content.funFact}</p>
              </div>
            )}

            {/* Related Cards - Optional */}
            {card.content.relatedCards && card.content.relatedCards.length > 0 && onOpenRelated && (
              <div>
                <h3 className="text-sm font-semibold text-stone-500 mb-2">
                  Gerelateerd
                </h3>
                <div className="space-y-2">
                  {card.content.relatedCards.map((relatedId) => (
                    <button
                      key={relatedId}
                      onClick={() => onOpenRelated(relatedId)}
                      className="w-full flex items-center justify-between p-3 bg-stone-50 hover:bg-stone-100 rounded-xl transition-colors text-left"
                    >
                      <span className="text-stone-700 text-sm">{relatedId}</span>
                      <ArrowRight className="w-4 h-4 text-stone-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom spacing */}
            <div className="h-4" />
          </div>

          {/* Scroll indicator gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-3xl" />
        </div>
      </div>
    </>
  );
}

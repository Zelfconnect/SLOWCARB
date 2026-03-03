import { Lightbulb, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  progress: { day: number; week: number; totalDays: number; percentage: number };
  currentTip: {
    day: number;
    tip?: { title: string; tips: string[]; metabolicState: string };
    weekTip?: { title: string; tips: string[]; warning?: string };
  } | null;
}

export function TipDialog({ open, onOpenChange, progress, currentTip }: TipDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onOpenChange(false)}>
      <DialogContent
        showCloseButton={false}
        className="sm:mx-auto max-w-lg max-h-[75dvh] rounded-2xl border-0 shadow-[0_28px_60px_-20px_rgba(15,23,42,0.35)] p-0 flex flex-col"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{currentTip?.tip?.title ?? `Kalenderdag ${currentTip?.day ?? progress.day}`}</DialogTitle>
        </DialogHeader>
        <div className="flex-shrink-0 rounded-t-2xl bg-gradient-to-br from-sage-600 to-sage-700 p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center text-3xl shadow-sm">
                🧬
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-display text-lg font-semibold leading-tight text-white">
                  Metabole staat
                </h2>
                <p className="text-xs text-white/80 mt-0.5">
                  Dag {currentTip?.day ?? progress.day} — {currentTip?.tip?.title}
                </p>
              </div>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/20 text-white transition-all hover:bg-white/30"
              aria-label="Sluiten"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="p-4 space-y-4">
            <div className="rounded-lg border border-sage-100 bg-sage-50 p-4">
              <p className="text-sm leading-relaxed text-sage-900 font-medium">
                {currentTip?.tip?.metabolicState}
              </p>
            </div>

            <div>
              <h3 className="mb-3 flex items-center gap-2 font-display text-base font-semibold text-stone-800">
                <Lightbulb className="w-4 h-4 text-sage-600" />
                Tips voor vandaag
              </h3>
              <ul className="space-y-2">
                {currentTip?.tip?.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-stone-700">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-sage-200 text-[10px] font-bold text-sage-700">
                      {idx + 1}
                    </span>
                    <span className="text-sm leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {currentTip?.weekTip?.warning && (
              <div className="rounded-xl border border-clay-100 bg-clay-50 p-5">
                <h3 className="mb-2 flex items-center gap-2 font-display font-semibold text-clay-900">
                  <Lightbulb className="w-5 h-5" />
                  Let op
                </h3>
                <p className="text-sm leading-relaxed text-clay-800">
                  {currentTip.weekTip.warning}
                </p>
              </div>
            )}

            <div className="h-4" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-2xl" />
      </DialogContent>
    </Dialog>
  );
}

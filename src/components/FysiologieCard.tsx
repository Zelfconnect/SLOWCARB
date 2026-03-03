import { useState } from 'react';
import { getCurrentPhase } from '@/data/journey';
import { TipDialog } from './TipDialog';

interface FysiologieCardProps {
  progress: { day: number; week: number; totalDays: number; percentage: number };
  currentTip: {
    day: number;
    tip?: { title: string; tips: string[]; metabolicState: string };
    weekTip?: { title: string; tips: string[]; warning?: string };
  } | null;
  isCheatDay: boolean;
}

function getFirstSentence(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return '';
  const sentence = trimmed.match(/.+?[.!?](?=\s|$)/);
  return sentence ? sentence[0] : trimmed;
}

export function FysiologieCard({ progress, currentTip, isCheatDay }: FysiologieCardProps) {
  const [showTipDialog, setShowTipDialog] = useState(false);

  if (isCheatDay || !currentTip?.tip) {
    return null;
  }

  const currentPhase = getCurrentPhase(progress.day);
  const phaseNumber = ((progress.day - 1) % 7) + 1;
  const metabolicSummary = getFirstSentence(currentTip.tip.metabolicState);

  return (
    <>
      <section data-testid="fysiologie-card" className="rounded-xl border border-stone-100 bg-white p-2 shadow-sm">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-stone-50 px-2 py-0.5 text-[11px] font-medium text-stone-600">
            <span>🧬</span> Fase {phaseNumber}{currentPhase?.title ? ` — ${currentPhase.title}` : ''}
          </span>
          <span className="text-[11px] font-medium text-stone-400">Dag {progress.day}</span>
        </div>

        <div className="rounded-lg border border-stone-50 bg-stone-50/50 p-2">
          <p className="line-clamp-2 text-[12px] italic leading-relaxed text-stone-600">{metabolicSummary}</p>
        </div>

        <button
          type="button"
          onClick={() => setShowTipDialog(true)}
          className="mt-2 flex w-full items-center justify-center rounded-lg bg-stone-800 py-1.5 text-[11px] font-semibold text-white shadow-sm transition-all active:scale-[0.98]"
        >
          Ontdek je fysiologie
        </button>
      </section>

      <TipDialog
        open={showTipDialog}
        onOpenChange={setShowTipDialog}
        currentTip={currentTip}
        progress={progress}
      />
    </>
  );
}

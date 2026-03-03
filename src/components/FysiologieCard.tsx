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
      <section data-testid="fysiologie-card" className="rounded-2xl bg-white p-3 shadow-surface">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="inline-flex rounded-full bg-sage-50 px-2 py-0.5 text-[11px] font-medium text-sage-700">
            🧬 Fase {phaseNumber}{currentPhase?.title ? ` — ${currentPhase.title}` : ''}
          </span>
          <span className="text-[11px] font-medium text-stone-500">Dag {progress.day}</span>
        </div>

        <div className="rounded-xl border border-sage-100/50 bg-sage-50/50 p-2.5">
          <p className="line-clamp-2 text-[13px] italic leading-relaxed text-stone-700">{metabolicSummary}</p>
        </div>

        <button
          type="button"
          onClick={() => setShowTipDialog(true)}
          className="mt-3 flex w-full items-center justify-center rounded-xl bg-stone-100 py-2.5 text-[13px] font-semibold text-stone-800 shadow-sm transition-all active:scale-[0.98]"
        >
          Ontdek je fysiologie van vandaag
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

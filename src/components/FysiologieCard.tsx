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
      <div data-testid="fysiologie-card" className="rounded-2xl border border-sage-100 bg-sage-50/60 p-4 shadow-soft">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="inline-flex rounded-full bg-sage-100 px-2.5 py-1 text-xs font-medium text-sage-800">
            🧬 Fase {phaseNumber}{currentPhase?.title ? ` — ${currentPhase.title}` : ''}
          </span>
          <span className="text-xs font-medium text-sage-700">Dag {progress.day}</span>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-sage-900">{metabolicSummary}</p>

        <button
          type="button"
          onClick={() => setShowTipDialog(true)}
          className="mt-3 text-sm font-medium text-sage-700 transition-colors hover:text-sage-900"
        >
          Meer over dag {progress.day} →
        </button>
      </div>

      <TipDialog
        open={showTipDialog}
        onOpenChange={setShowTipDialog}
        currentTip={currentTip}
        progress={progress}
      />
    </>
  );
}

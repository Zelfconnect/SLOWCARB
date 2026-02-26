import { formatWeekEstimate } from '@/lib/formatWeekEstimate';
import { CHEAT_DAY_LABELS } from '@/lib/cheatDay';
import {
  LayoutDashboard,
  ChefHat,
  GraduationCap,
  ClipboardCheck,
  CheckCircle2,
} from 'lucide-react';
import type { OnboardingData } from '../OnboardingWizard';

interface SummaryLaunchProps {
  data: OnboardingData;
}

const appTour = [
  { icon: LayoutDashboard, label: 'Dashboard', desc: 'Voortgang & dagelijkse check' },
  { icon: ChefHat, label: 'Recepten', desc: 'Slow-carb maaltijden' },
  { icon: GraduationCap, label: 'Leren', desc: 'Regels, wetenschap & FAQ' },
  { icon: ClipboardCheck, label: 'AmmoCheck', desc: 'Dagelijkse 5-regels check' },
];

export function SummaryLaunch({ data }: SummaryLaunchProps) {
  const weightGoal = Math.round((data.currentWeight - data.targetWeight) * 10) / 10;
  const weekEstimate = Math.ceil(weightGoal * 0.6);
  const cheatDayLabel = CHEAT_DAY_LABELS[data.cheatDay];

  const preferenceLabel = data.vegetarian && data.hasAirfryer
    ? 'Vega + Airfryer'
    : data.vegetarian
      ? 'Vegetarisch'
      : data.hasAirfryer
        ? 'Airfryer'
        : 'Standaard';

  return (
    <section className="flex flex-1 flex-col">
      <div className="flex flex-col items-center space-y-3 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-100">
          <CheckCircle2 className="h-8 w-8 text-sage-600" strokeWidth={2} />
        </div>
        <h1 className="font-display text-3xl font-bold text-stone-900">
          Klaar, {data.name || 'jij'}!
        </h1>
        <p className="text-base text-stone-500">
          Dit wordt de beste beslissing van je jaar.
        </p>
      </div>

      {/* Summary grid */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-stone-200 bg-white/80 p-3.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">Start</p>
          <p className="mt-0.5 text-lg font-bold text-stone-900">{data.currentWeight} kg</p>
        </div>
        <div className="rounded-2xl border border-sage-200 bg-sage-50/60 p-3.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-sage-600">Doel</p>
          <p className="mt-0.5 text-lg font-bold text-sage-800">{data.targetWeight} kg</p>
          <p className="text-[10px] text-sage-600">
            &minus;{weightGoal} kg &middot; ~{formatWeekEstimate(weekEstimate)}
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white/80 p-3.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">Cheat day</p>
          <p className="mt-0.5 text-lg font-bold text-stone-900">{cheatDayLabel}</p>
        </div>
        <div className="rounded-2xl border border-sage-200 bg-sage-50/60 p-3.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-sage-600">Voorkeur</p>
          <p className="mt-0.5 text-base font-bold text-sage-800">{preferenceLabel}</p>
        </div>
      </div>

      {/* Mini app tour */}
      <div className="mt-6 rounded-2xl border border-stone-200 bg-white/80 p-4">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-wide text-stone-400">
          Jouw app
        </p>
        <div className="space-y-2.5">
          {appTour.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sage-100 text-sage-700">
                <item.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-800">{item.label}</p>
                <p className="text-xs text-stone-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

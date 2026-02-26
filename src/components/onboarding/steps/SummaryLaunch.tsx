import { formatWeekEstimate } from '@/lib/formatWeekEstimate';
import { CHEAT_DAY_LABELS } from '@/lib/cheatDay';
import {
  LayoutDashboard,
  ChefHat,
  GraduationCap,
  ClipboardCheck,
} from 'lucide-react';
import type { OnboardingData } from '../OnboardingWizard';

interface SummaryLaunchProps {
  data: OnboardingData;
}

const floatingDots = [
  { top: '8%', left: '6%', size: 5, opacity: 0.3 },
  { top: '15%', right: '10%', size: 7, opacity: 0.25 },
  { top: '55%', left: '10%', size: 4, opacity: 0.35 },
  { top: '70%', right: '6%', size: 6, opacity: 0.2 },
  { top: '85%', left: '18%', size: 3, opacity: 0.3 },
];

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
    <section className="relative flex flex-1 flex-col overflow-hidden">
      {/* Floating dots */}
      {floatingDots.map((dot, i) => (
        <div
          key={i}
          className="pointer-events-none absolute rounded-full bg-sage-400/50"
          style={{
            top: dot.top,
            left: dot.left,
            right: dot.right,
            width: dot.size,
            height: dot.size,
            opacity: dot.opacity,
          }}
        />
      ))}

      <div className="space-y-3 text-center">
        <span className="block text-5xl leading-none">&#x1F680;</span>
        <h1 className="font-display text-3xl font-bold text-stone-900">
          Klaar, {data.name || 'jij'}!
        </h1>
        <p className="text-base text-stone-600">
          Dit wordt de beste beslissing van je jaar.
        </p>
      </div>

      {/* Summary grid */}
      <div className="relative z-10 mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-stone-200 bg-warm-100/80 p-3.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-500">Start</p>
          <p className="mt-0.5 text-lg font-bold text-stone-900">{data.currentWeight} kg</p>
        </div>
        <div className="rounded-2xl border border-sage-200 bg-sage-50 p-3.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-sage-600">Doel</p>
          <p className="mt-0.5 text-lg font-bold text-sage-900">{data.targetWeight} kg</p>
          <p className="text-[10px] text-sage-600">
            &minus;{weightGoal} kg &middot; ~{formatWeekEstimate(weekEstimate)}
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-warm-100/80 p-3.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-500">Cheat day</p>
          <p className="mt-0.5 text-lg font-bold text-stone-900">{cheatDayLabel}</p>
        </div>
        <div className="rounded-2xl border border-sage-200 bg-sage-50 p-3.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-sage-600">Voorkeur</p>
          <p className="mt-0.5 text-base font-bold text-sage-900">{preferenceLabel}</p>
        </div>
      </div>

      {/* Mini app tour */}
      <div className="relative z-10 mt-6 rounded-2xl border border-stone-200 bg-white/80 p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-stone-500">
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

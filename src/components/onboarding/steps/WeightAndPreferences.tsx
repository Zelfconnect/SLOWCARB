import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { formatWeekEstimate } from '@/lib/formatWeekEstimate';

interface WeightAndPreferencesProps {
  currentWeightInput: string;
  targetWeightInput: string;
  currentWeight: number;
  targetWeight: number;
  vegetarian: boolean;
  hasAirfryer: boolean;
  sportsRegularly: boolean;
  onCurrentWeightChange: (value: string) => void;
  onTargetWeightChange: (value: string) => void;
  onPreferenceChange: (key: 'vegetarian' | 'hasAirfryer' | 'sportsRegularly', value: boolean) => void;
  onEnter: () => void;
}

export function WeightAndPreferences({
  currentWeightInput,
  targetWeightInput,
  currentWeight,
  targetWeight,
  vegetarian,
  hasAirfryer,
  sportsRegularly,
  onCurrentWeightChange,
  onTargetWeightChange,
  onPreferenceChange,
  onEnter,
}: WeightAndPreferencesProps) {
  const isWeightValid =
    currentWeight >= 40 && currentWeight <= 300 &&
    targetWeight >= 40 && targetWeight <= 300 &&
    currentWeight > targetWeight;

  const weightGoal = isWeightValid
    ? Math.round((currentWeight - targetWeight) * 10) / 10
    : 0;
  const weekEstimate = Math.ceil(weightGoal * 0.6);

  const preferences: { id: string; key: 'vegetarian' | 'hasAirfryer' | 'sportsRegularly'; label: string; checked: boolean }[] = [
    { id: 'veg', key: 'vegetarian', label: 'Ik ben vegetarisch', checked: vegetarian },
    { id: 'air', key: 'hasAirfryer', label: 'Ik heb een airfryer', checked: hasAirfryer },
    { id: 'spo', key: 'sportsRegularly', label: 'Ik sport regelmatig', checked: sportsRegularly },
  ];

  return (
    <section className="flex flex-1 flex-col">
      <div className="space-y-3 text-center">
        <h1 className="font-display text-3xl font-bold text-stone-900">
          Jouw gegevens
        </h1>
        <p className="text-base text-stone-600">
          Gewicht en voorkeuren in &eacute;&eacute;n stap
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {/* Weight inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-stone-200 bg-white/80 p-3 space-y-1.5">
            <Label htmlFor="onb-cw" className="text-xs font-medium text-stone-600">
              Huidig (kg)
            </Label>
            <Input
              id="onb-cw"
              type="number"
              min={40}
              max={300}
              step={0.1}
              value={currentWeightInput}
              onChange={(e) => onCurrentWeightChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onEnter()}
              placeholder="bv. 110"
              className="input-premium h-12 text-lg text-stone-900"
            />
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white/80 p-3 space-y-1.5">
            <Label htmlFor="onb-tw" className="text-xs font-medium text-stone-600">
              Streefgewicht (kg)
            </Label>
            <Input
              id="onb-tw"
              type="number"
              min={40}
              max={300}
              step={0.1}
              value={targetWeightInput}
              onChange={(e) => onTargetWeightChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onEnter()}
              placeholder="bv. 100"
              className="input-premium h-12 text-lg text-stone-900"
            />
          </div>
        </div>

        {isWeightValid && weightGoal > 0 && (
          <p className="text-center text-base font-semibold text-sage-700">
            {weightGoal} kg afvallen in ~{formatWeekEstimate(weekEstimate)}
          </p>
        )}

        {/* Preferences */}
        <div className="space-y-2.5 pt-2">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
            Voorkeuren
          </p>
          {preferences.map((pref) => (
            <Label
              key={pref.id}
              htmlFor={`onb-${pref.id}`}
              className={`flex min-h-[48px] cursor-pointer items-center gap-3 rounded-2xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                pref.checked
                  ? 'border-sage-200 bg-sage-50 text-sage-800'
                  : 'border-stone-200 bg-white/85 text-warm-800'
              }`}
            >
              <Checkbox
                id={`onb-${pref.id}`}
                checked={pref.checked}
                className="h-5 w-5 rounded-md border-stone-300 data-[state=checked]:border-sage-600 data-[state=checked]:bg-sage-600 data-[state=checked]:text-sage-50"
                onCheckedChange={(checked) => onPreferenceChange(pref.key, checked as boolean)}
              />
              <span>{pref.label}</span>
            </Label>
          ))}
        </div>
      </div>
    </section>
  );
}

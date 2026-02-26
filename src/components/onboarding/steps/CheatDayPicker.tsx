import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CHEAT_DAY_OPTIONS, CHEAT_DAY_LABELS } from '@/lib/cheatDay';
import type { CheatDay } from '@/types';

interface CheatDayPickerProps {
  cheatDay: CheatDay;
  onChange: (day: CheatDay) => void;
}

export function CheatDayPicker({ cheatDay, onChange }: CheatDayPickerProps) {
  return (
    <section className="flex flex-1 min-h-0 flex-col">
      <div className="space-y-3 text-center">
        <h1 className="font-display text-3xl font-bold text-stone-900">
          Kies je cheat day
        </h1>
        <p className="text-base text-stone-500">
          De meeste mensen kiezen zaterdag
        </p>
      </div>

      <RadioGroup
        value={cheatDay}
        className="mt-8 flex-1 gap-2.5 overflow-y-auto pb-4 pr-1"
        onValueChange={(value: string) => onChange(value as CheatDay)}
      >
        {CHEAT_DAY_OPTIONS.map((day) => (
          <Label
            key={day}
            htmlFor={`onb-${day}`}
            className={`flex min-h-[48px] cursor-pointer items-center gap-3 rounded-2xl border px-4 py-2.5 text-base font-semibold transition-colors ${
              cheatDay === day
                ? 'border-sage-600 bg-sage-50 text-sage-700'
                : 'border-stone-200 bg-white/85 text-warm-800'
            }`}
          >
            <RadioGroupItem
              value={day}
              id={`onb-${day}`}
              className="h-5 w-5 border-stone-300 text-sage-600"
            />
            <span>{CHEAT_DAY_LABELS[day]}</span>
          </Label>
        ))}
      </RadioGroup>
    </section>
  );
}

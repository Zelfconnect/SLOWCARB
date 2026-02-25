import { useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { formatWeekEstimate } from '@/lib/formatWeekEstimate';

export interface OnboardingData {
  name: string;
  currentWeight: number;
  targetWeight: number;
  vegetarian: boolean;
  hasAirfryer: boolean;
  sportsRegularly: boolean;
  cheatDay: 'zaterdag' | 'zondag';
}

interface OnboardingWizardProps {
  onComplete: (data: OnboardingData) => void;
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [currentWeightInput, setCurrentWeightInput] = useState('');
  const [targetWeightInput, setTargetWeightInput] = useState('');
  const [data, setData] = useState<OnboardingData>({
    name: '',
    currentWeight: 0,
    targetWeight: 0,
    vegetarian: false,
    hasAirfryer: false,
    sportsRegularly: false,
    cheatDay: 'zaterdag',
  });

  const isWeightStepValid =
    data.currentWeight >= 40 && data.currentWeight <= 300 &&
    data.targetWeight >= 40 && data.targetWeight <= 300 &&
    data.currentWeight > data.targetWeight;

  const weightGoal = isWeightStepValid
    ? Math.round((data.currentWeight - data.targetWeight) * 10) / 10
    : 0;
  const weekEstimate = Math.ceil(weightGoal * 0.6);
  const weekEstimateLabel = formatWeekEstimate(weekEstimate);
  const cheatDayLabel = data.cheatDay.charAt(0).toUpperCase() + data.cheatDay.slice(1);

  const handleCurrentWeightChange = (value: string) => {
    setCurrentWeightInput(value);
    const parsed = Number.parseFloat(value);
    setData(prev => ({
      ...prev,
      currentWeight: value === '' || !Number.isFinite(parsed) ? 0 : parsed,
    }));
  };

  const handleTargetWeightChange = (value: string) => {
    setTargetWeightInput(value);
    const parsed = Number.parseFloat(value);
    setData(prev => ({
      ...prev,
      targetWeight: value === '' || !Number.isFinite(parsed) ? 0 : parsed,
    }));
  };

  const handleNext = () => {
    if (currentStep === 1 && !data.name.trim()) return;
    if (currentStep === 2 && !isWeightStepValid) return;

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <DialogPrimitive.Root open>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          className="fixed inset-0 z-50 h-full w-full max-w-none border-none bg-cream p-0 outline-none"
          aria-describedby={undefined}
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogPrimitive.Title className="sr-only">Onboarding wizard</DialogPrimitive.Title>
          <div className="flex min-h-screen flex-col bg-gradient-to-b from-cream via-cream to-warm-100/70">
            <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-6 pb-8 pt-8 sm:px-8">
              <div className="mb-8 flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  className={`text-stone-700 hover:bg-transparent hover:text-stone-900 ${
                    currentStep === 1 ? 'invisible' : ''
                  }`}
                  aria-label={String(t('app.prevStep'))}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                <div className="flex justify-center gap-3">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div
                      key={step}
                      className={`h-3.5 w-3.5 rounded-full transition-colors ${
                        step <= currentStep ? 'bg-sage-600' : 'bg-warm-200'
                      }`}
                    />
                  ))}
                </div>

                <div className="h-10 w-10" />
              </div>

              <div className="flex flex-1 flex-col">
                {currentStep === 1 && (
                  <section className="flex flex-1 flex-col">
                    <div className="space-y-4 text-center">
                      <span className="block text-6xl leading-none">🌱</span>
                      <h1 className="font-display text-3xl font-bold text-stone-900">Hé, hoe heet je?</h1>
                      <p className="text-base text-stone-600">
                        We personaliseren jouw slow carb journey
                      </p>
                    </div>

                    <div className="mt-10 space-y-5">
                      <Label htmlFor="name" className="text-sm font-medium text-stone-700">
                        Je naam
                      </Label>
                      <Input
                        id="name"
                        placeholder={String(t('app.namePlaceholder'))}
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                        className="input-premium h-14 text-lg text-stone-900"
                      />
                    </div>

                    <div className="mt-auto pt-8">
                      <Button
                        type="button"
                        onClick={handleNext}
                        disabled={!data.name.trim()}
                        className="h-14 w-full rounded-xl bg-sage-600 text-lg font-semibold text-white hover:bg-sage-700"
                      >
                        Volgende
                      </Button>
                    </div>
                  </section>
                )}

                {currentStep === 2 && (
                  <section className="flex flex-1 flex-col">
                    <div className="space-y-4 text-center">
                      <span className="block text-6xl leading-none">⚖️</span>
                      <h1 className="font-display text-3xl font-bold text-stone-900">Jouw gewicht</h1>
                      <p className="text-base text-stone-600">
                        Vul je huidige en gewenste gewicht in
                      </p>
                    </div>

                    <div className="mt-10 space-y-4">
                      <div className="rounded-2xl border border-stone-200 bg-white/80 p-4 space-y-2">
                        <Label htmlFor="current-weight" className="text-sm font-medium text-stone-700">
                          Huidig gewicht (kg)
                        </Label>
                        <Input
                          id="current-weight"
                          type="number"
                          min={40}
                          max={300}
                          step={0.1}
                          value={currentWeightInput}
                          onChange={(e) => handleCurrentWeightChange(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                          placeholder="bv. 110"
                          className="input-premium h-14 text-lg text-stone-900"
                        />
                      </div>

                      <div className="rounded-2xl border border-stone-200 bg-white/80 p-4 space-y-2">
                        <Label htmlFor="target-weight" className="text-sm font-medium text-stone-700">
                          Streefgewicht (kg)
                        </Label>
                        <Input
                          id="target-weight"
                          type="number"
                          min={40}
                          max={300}
                          step={0.1}
                          value={targetWeightInput}
                          onChange={(e) => handleTargetWeightChange(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                          placeholder="bv. 100"
                          className="input-premium h-14 text-lg text-stone-900"
                        />
                      </div>

                      {isWeightStepValid && weightGoal > 0 && (
                        <p className="mt-2 text-center text-lg font-semibold text-sage-700">
                          {weightGoal} kg afvallen in ~{weekEstimateLabel}
                        </p>
                      )}
                    </div>

                    <div className="mt-auto pt-8">
                      <Button
                        type="button"
                        onClick={handleNext}
                        disabled={!isWeightStepValid}
                        className="h-14 w-full rounded-xl bg-sage-600 text-lg font-semibold text-white hover:bg-sage-700"
                      >
                        Volgende
                      </Button>
                    </div>
                  </section>
                )}

                {currentStep === 3 && (
                  <section className="flex flex-1 flex-col">
                    <div className="space-y-4 text-center">
                      <span className="block text-6xl leading-none">🍽️</span>
                      <h1 className="font-display text-3xl font-bold text-stone-900">Jouw voorkeuren</h1>
                      <p className="text-base text-stone-600">
                        Zo stemmen we recepten en tips beter af op jouw routine
                      </p>
                    </div>

                    <div className="mt-10 space-y-3">
                      <Label
                        htmlFor="vegetarian"
                        className={`flex min-h-[56px] cursor-pointer items-center gap-4 rounded-2xl border px-4 py-3 text-base font-medium transition-colors ${
                          data.vegetarian
                            ? 'border-sage-200 bg-sage-50 text-sage-800'
                            : 'border-stone-200 bg-white/85 text-warm-800'
                        }`}
                      >
                        <Checkbox
                          id="vegetarian"
                          checked={data.vegetarian}
                          className="h-6 w-6 rounded-md border-stone-300 data-[state=checked]:border-sage-600 data-[state=checked]:bg-sage-600 data-[state=checked]:text-sage-50"
                          onCheckedChange={(checked) =>
                            setData({ ...data, vegetarian: checked as boolean })
                          }
                        />
                        <span>Ik ben vegetarisch</span>
                      </Label>

                      <Label
                        htmlFor="airfryer"
                        className={`flex min-h-[56px] cursor-pointer items-center gap-4 rounded-2xl border px-4 py-3 text-base font-medium transition-colors ${
                          data.hasAirfryer
                            ? 'border-sage-200 bg-sage-50 text-sage-800'
                            : 'border-stone-200 bg-white/85 text-warm-800'
                        }`}
                      >
                        <Checkbox
                          id="airfryer"
                          checked={data.hasAirfryer}
                          className="h-6 w-6 rounded-md border-stone-300 data-[state=checked]:border-sage-600 data-[state=checked]:bg-sage-600 data-[state=checked]:text-sage-50"
                          onCheckedChange={(checked) =>
                            setData({ ...data, hasAirfryer: checked as boolean })
                          }
                        />
                        <span>Ik heb een airfryer</span>
                      </Label>

                      <Label
                        htmlFor="sports"
                        className={`flex min-h-[56px] cursor-pointer items-center gap-4 rounded-2xl border px-4 py-3 text-base font-medium transition-colors ${
                          data.sportsRegularly
                            ? 'border-sage-200 bg-sage-50 text-sage-800'
                            : 'border-stone-200 bg-white/85 text-warm-800'
                        }`}
                      >
                        <Checkbox
                          id="sports"
                          checked={data.sportsRegularly}
                          className="h-6 w-6 rounded-md border-stone-300 data-[state=checked]:border-sage-600 data-[state=checked]:bg-sage-600 data-[state=checked]:text-sage-50"
                          onCheckedChange={(checked) =>
                            setData({ ...data, sportsRegularly: checked as boolean })
                          }
                        />
                        <span>Ik sport regelmatig</span>
                      </Label>
                    </div>

                    <div className="mt-auto pt-8">
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="h-14 w-full rounded-xl bg-sage-600 text-lg font-semibold text-white hover:bg-sage-700"
                      >
                        Volgende
                      </Button>
                    </div>
                  </section>
                )}

                {currentStep === 4 && (
                  <section className="flex flex-1 flex-col">
                    <div className="space-y-4 text-center">
                      <span className="block text-6xl leading-none">🎉</span>
                      <h1 className="font-display text-3xl font-bold text-stone-900">Kies je cheat day</h1>
                      <p className="text-base text-stone-600">
                        Plan je vrije dag slim in zodat je de rest van de week consistent blijft
                      </p>
                    </div>

                    <RadioGroup
                      value={data.cheatDay}
                      className="mt-10 gap-3"
                      onValueChange={(value: 'zaterdag' | 'zondag') =>
                        setData({ ...data, cheatDay: value })
                      }
                    >
                      <Label
                        htmlFor="saturday"
                        className={`flex min-h-[56px] cursor-pointer items-center gap-4 rounded-2xl border px-4 py-3 text-base font-semibold transition-colors ${
                          data.cheatDay === 'zaterdag'
                            ? 'border-sage-600 bg-sage-50 text-sage-700'
                            : 'border-stone-200 bg-white/85 text-warm-800'
                        }`}
                      >
                        <RadioGroupItem
                          value="zaterdag"
                          id="saturday"
                          className="h-6 w-6 border-stone-300 text-sage-600"
                        />
                        <span>Zaterdag</span>
                      </Label>

                      <Label
                        htmlFor="sunday"
                        className={`flex min-h-[56px] cursor-pointer items-center gap-4 rounded-2xl border px-4 py-3 text-base font-semibold transition-colors ${
                          data.cheatDay === 'zondag'
                            ? 'border-sage-600 bg-sage-50 text-sage-700'
                            : 'border-stone-200 bg-white/85 text-warm-800'
                        }`}
                      >
                        <RadioGroupItem
                          value="zondag"
                          id="sunday"
                          className="h-6 w-6 border-stone-300 text-sage-600"
                        />
                        <span>Zondag</span>
                      </Label>
                    </RadioGroup>

                    <div className="mt-auto pt-8">
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="h-14 w-full rounded-xl bg-sage-600 text-lg font-semibold text-white hover:bg-sage-700"
                      >
                        Volgende
                      </Button>
                    </div>
                  </section>
                )}

                {currentStep === 5 && (
                  <section className="relative flex flex-1 flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-sage-50 via-warm-50 to-sage-100/60 p-4 sm:p-6">
                    <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-sage-200/40 blur-xl" />
                    <div className="pointer-events-none absolute left-6 top-12 h-3 w-3 rounded-full bg-warm-300/70" />
                    <div className="pointer-events-none absolute right-14 top-20 h-2.5 w-2.5 rounded-full bg-sage-400/70" />
                    <div className="pointer-events-none absolute bottom-16 left-10 h-2 w-2 rounded-full bg-warm-400/70" />
                    <div className="pointer-events-none absolute bottom-24 right-8 h-3 w-3 rounded-full bg-sage-300/80" />

                    <div className="space-y-4 text-center">
                      <span className="block text-6xl leading-none">🚀</span>
                      <h1 className="font-display text-3xl font-bold text-stone-900">Klaar, {data.name || 'jij'}!</h1>
                      <p className="text-base text-stone-600">Dit wordt de beste beslissing van je jaar.</p>
                    </div>

                    <div className="relative z-10 mt-10 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-stone-200 bg-warm-100/80 p-4">
                        <span className="mb-1 block text-2xl leading-none">⚖️</span>
                        <p className="text-xs font-semibold uppercase tracking-wide text-stone-600">Start</p>
                        <p className="mt-1 text-lg font-bold text-stone-900">{data.currentWeight} kg</p>
                      </div>
                      <div className="rounded-2xl border border-sage-200 bg-sage-50 p-4">
                        <span className="mb-1 block text-2xl leading-none">🎯</span>
                        <p className="text-xs font-semibold uppercase tracking-wide text-sage-700">Doel</p>
                        <p className="mt-1 text-lg font-bold text-sage-900">{data.targetWeight} kg</p>
                        <p className="mt-0.5 text-[10px] text-sage-600">−{weightGoal} kg · ~{weekEstimateLabel}</p>
                      </div>
                      <div className="rounded-2xl border border-stone-200 bg-warm-100/80 p-4">
                        <span className="mb-1 block text-2xl leading-none">🎉</span>
                        <p className="text-xs font-semibold uppercase tracking-wide text-stone-600">Cheat day</p>
                        <p className="mt-1 text-lg font-bold text-stone-900">{cheatDayLabel}</p>
                      </div>
                      <div className="rounded-2xl border border-sage-200 bg-sage-50 p-4">
                        <span className="mb-1 block text-2xl leading-none">🥗</span>
                        <p className="text-xs font-semibold uppercase tracking-wide text-sage-700">Voorkeur</p>
                        <p className="mt-1 text-base font-bold text-sage-900">
                          {data.vegetarian && data.hasAirfryer
                            ? 'Vegetarisch + Airfryer'
                            : data.vegetarian
                              ? 'Vegetarisch'
                              : data.hasAirfryer
                                ? 'Airfryer'
                                : 'Standaard'}
                        </p>
                      </div>
                    </div>

                    <div className="relative z-10 mt-auto pt-8">
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="h-14 w-full rounded-xl bg-sage-600 text-lg font-semibold text-white hover:bg-sage-700"
                      >
                        Start mijn journey →
                      </Button>
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

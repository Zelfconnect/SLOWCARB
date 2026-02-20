import { useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ChevronLeft } from 'lucide-react';

interface OnboardingData {
  name: string;
  weightGoal: number;
  vegetarian: boolean;
  hasAirfryer: boolean;
  sportsRegularly: boolean;
  cheatDay: 'zaterdag' | 'zondag';
}

interface OnboardingWizardProps {
  onComplete: (data: OnboardingData) => void;
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    weightGoal: 10,
    vegetarian: false,
    hasAirfryer: false,
    sportsRegularly: false,
    cheatDay: 'zaterdag',
  });

  const handleNext = () => {
    if (currentStep === 1 && !data.name.trim()) return;

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

  const weekEstimate = Math.ceil(data.weightGoal * 0.6);
  const cheatDayLabel = data.cheatDay.charAt(0).toUpperCase() + data.cheatDay.slice(1);

  return (
    <DialogPrimitive.Root open>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          className="fixed inset-0 z-50 h-full w-full max-w-none border-none bg-warm-50 p-0 outline-none"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <div className="flex min-h-screen flex-col bg-gradient-to-b from-cream via-warm-50 to-warm-100/70">
            <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-6 pb-8 pt-8 sm:px-8">
              <div className="mb-8 flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  className={`text-warm-700 hover:bg-transparent hover:text-warm-900 ${
                    currentStep === 1 ? 'invisible' : ''
                  }`}
                  aria-label="Vorige stap"
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
                      <h1 className="text-3xl font-bold text-warm-900">Hé, hoe heet je?</h1>
                      <p className="text-base text-warm-600">
                        We personaliseren jouw slow-carb journey
                      </p>
                    </div>

                    <div className="mt-10 space-y-5">
                      <Label htmlFor="name" className="text-sm font-medium text-warm-700">
                        Je naam
                      </Label>
                      <Input
                        id="name"
                        placeholder="Hoe mogen we je noemen?"
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                        className="h-14 rounded-2xl border-warm-300 bg-white/90 px-5 text-lg text-warm-900 placeholder:text-warm-400"
                      />
                    </div>

                    <div className="mt-auto pt-8">
                      <Button
                        type="button"
                        onClick={handleNext}
                        disabled={!data.name.trim()}
                        className="h-14 w-full rounded-2xl bg-sage-600 text-lg font-semibold text-white hover:bg-sage-700"
                      >
                        Volgende
                      </Button>
                    </div>
                  </section>
                )}

                {currentStep === 2 && (
                  <section className="flex flex-1 flex-col">
                    <div className="space-y-4 text-center">
                      <span className="block text-6xl leading-none">🎯</span>
                      <h1 className="text-3xl font-bold text-warm-900">Hoeveel wil je afvallen?</h1>
                      <p className="text-base text-warm-600">
                        Kies je doel, dan berekenen wij direct een realistische timeline
                      </p>
                    </div>

                    <div className="mt-10 rounded-3xl border border-warm-200 bg-white/80 p-6">
                      <Label htmlFor="weight-goal" className="text-sm font-medium text-warm-700">
                        Gewichtsdoel
                      </Label>
                      <Slider
                        id="weight-goal"
                        min={3}
                        max={20}
                        step={1}
                        value={[data.weightGoal]}
                        onValueChange={(value) => setData({ ...data, weightGoal: value[0] })}
                        className="mt-5"
                      />
                      <p className="mt-6 text-center text-2xl font-bold text-warm-900">
                        {data.weightGoal} kg in ~{weekEstimate} weken
                      </p>
                    </div>

                    <div className="mt-auto pt-8">
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="h-14 w-full rounded-2xl bg-sage-600 text-lg font-semibold text-white hover:bg-sage-700"
                      >
                        Volgende
                      </Button>
                    </div>
                  </section>
                )}

                {currentStep === 3 && (
                  <section className="flex flex-1 flex-col">
                    <div className="space-y-4 text-center">
                      <span className="block text-6xl leading-none">⚙️</span>
                      <h1 className="text-3xl font-bold text-warm-900">Jouw voorkeuren</h1>
                      <p className="text-base text-warm-600">
                        Zo stemmen we recepten en tips beter af op jouw routine
                      </p>
                    </div>

                    <div className="mt-10 space-y-3">
                      <Label
                        htmlFor="vegetarian"
                        className="flex min-h-[56px] cursor-pointer items-center gap-4 rounded-2xl border border-warm-200 bg-white/85 px-4 py-3 text-base font-medium text-warm-800"
                      >
                        <Checkbox
                          id="vegetarian"
                          checked={data.vegetarian}
                          className="h-6 w-6 rounded-md border-warm-300 data-[state=checked]:border-sage-600 data-[state=checked]:bg-sage-600"
                          onCheckedChange={(checked) =>
                            setData({ ...data, vegetarian: checked as boolean })
                          }
                        />
                        <span>Ik ben vegetarisch</span>
                      </Label>

                      <Label
                        htmlFor="airfryer"
                        className="flex min-h-[56px] cursor-pointer items-center gap-4 rounded-2xl border border-warm-200 bg-white/85 px-4 py-3 text-base font-medium text-warm-800"
                      >
                        <Checkbox
                          id="airfryer"
                          checked={data.hasAirfryer}
                          className="h-6 w-6 rounded-md border-warm-300 data-[state=checked]:border-sage-600 data-[state=checked]:bg-sage-600"
                          onCheckedChange={(checked) =>
                            setData({ ...data, hasAirfryer: checked as boolean })
                          }
                        />
                        <span>Ik heb een airfryer</span>
                      </Label>

                      <Label
                        htmlFor="sports"
                        className="flex min-h-[56px] cursor-pointer items-center gap-4 rounded-2xl border border-warm-200 bg-white/85 px-4 py-3 text-base font-medium text-warm-800"
                      >
                        <Checkbox
                          id="sports"
                          checked={data.sportsRegularly}
                          className="h-6 w-6 rounded-md border-warm-300 data-[state=checked]:border-sage-600 data-[state=checked]:bg-sage-600"
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
                        className="h-14 w-full rounded-2xl bg-sage-600 text-lg font-semibold text-white hover:bg-sage-700"
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
                      <h1 className="text-3xl font-bold text-warm-900">Kies je cheat day</h1>
                      <p className="text-base text-warm-600">
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
                            : 'border-warm-200 bg-white/85 text-warm-800'
                        }`}
                      >
                        <RadioGroupItem
                          value="zaterdag"
                          id="saturday"
                          className="h-6 w-6 border-warm-300 text-sage-600"
                        />
                        <span>Zaterdag</span>
                      </Label>

                      <Label
                        htmlFor="sunday"
                        className={`flex min-h-[56px] cursor-pointer items-center gap-4 rounded-2xl border px-4 py-3 text-base font-semibold transition-colors ${
                          data.cheatDay === 'zondag'
                            ? 'border-sage-600 bg-sage-50 text-sage-700'
                            : 'border-warm-200 bg-white/85 text-warm-800'
                        }`}
                      >
                        <RadioGroupItem
                          value="zondag"
                          id="sunday"
                          className="h-6 w-6 border-warm-300 text-sage-600"
                        />
                        <span>Zondag</span>
                      </Label>
                    </RadioGroup>

                    <div className="mt-auto pt-8">
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="h-14 w-full rounded-2xl bg-sage-600 text-lg font-semibold text-white hover:bg-sage-700"
                      >
                        Volgende
                      </Button>
                    </div>
                  </section>
                )}

                {currentStep === 5 && (
                  <section className="flex flex-1 flex-col">
                    <div className="space-y-4 text-center">
                      <span className="block text-6xl leading-none">🚀</span>
                      <h1 className="text-3xl font-bold text-warm-900">Klaar, {data.name || 'jij'}!</h1>
                      <p className="text-base text-warm-600">
                        Jouw slow-carb journey begint nu. Je zult het niet regret.
                      </p>
                    </div>

                    <div className="mt-10 rounded-3xl border border-warm-200 bg-white/85 p-6 text-center">
                      <p className="text-lg font-semibold text-warm-900">
                        Doel: {data.weightGoal} kg in ~{weekEstimate} weken · Cheat day: {cheatDayLabel}
                      </p>
                    </div>

                    <div className="mt-auto pt-8">
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="h-14 w-full rounded-2xl bg-sage-600 text-lg font-semibold text-white hover:bg-sage-700"
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

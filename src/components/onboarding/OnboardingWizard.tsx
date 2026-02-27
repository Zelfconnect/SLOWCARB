import { useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { OnboardingStep } from './OnboardingStep';
import { WelcomeHero } from './steps/WelcomeHero';
import { NameInput } from './steps/NameInput';
import { ThePromise } from './steps/ThePromise';
import { RulesOverview } from './steps/RulesOverview';
import { BodyTimeline } from './steps/BodyTimeline';
import { WhyItWorks } from './steps/WhyItWorks';
import { YesNoReference } from './steps/YesNoReference';
import { WeightAndPreferences } from './steps/WeightAndPreferences';
import { CheatDayPicker } from './steps/CheatDayPicker';
import { SummaryLaunch } from './steps/SummaryLaunch';
import type { CheatDay } from '@/types';

export interface OnboardingData {
  name: string;
  currentWeight: number;
  targetWeight: number;
  vegetarian: boolean;
  hasAirfryer: boolean;
  sportsRegularly: boolean;
  cheatDay: CheatDay;
}

interface OnboardingWizardProps {
  onComplete: (data: OnboardingData) => void;
}

const TOTAL_STEPS = 10;

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
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

  const goForward = () => {
    setDirection('forward');
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      onComplete(data);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setDirection('back');
      setStep(step - 1);
    }
  };

  const handleCurrentWeightChange = (value: string) => {
    setCurrentWeightInput(value);
    const parsed = Number.parseFloat(value);
    setData((prev) => ({
      ...prev,
      currentWeight: value === '' || !Number.isFinite(parsed) ? 0 : parsed,
    }));
  };

  const handleTargetWeightChange = (value: string) => {
    setTargetWeightInput(value);
    const parsed = Number.parseFloat(value);
    setData((prev) => ({
      ...prev,
      targetWeight: value === '' || !Number.isFinite(parsed) ? 0 : parsed,
    }));
  };

  // Step config: which CTA text and whether it's disabled
  const getStepConfig = () => {
    switch (step) {
      case 1: return { cta: 'Vertel me meer', disabled: false };
      case 2: return { cta: 'Volgende', disabled: !data.name.trim() };
      case 3: return { cta: 'Laat me de regels zien', disabled: false };
      case 4: return { cta: 'Wat doet mijn lichaam?', disabled: false };
      case 5: return { cta: 'Waarom werkt dit?', disabled: false };
      case 6: return { cta: 'Wat mag wel en niet?', disabled: false };
      case 7: return { cta: 'Nu mijn gegevens', disabled: false };
      case 8: return { cta: 'Volgende', disabled: !isWeightStepValid };
      case 9: return { cta: 'Volgende', disabled: false };
      case 10: return { cta: 'Start mijn journey \u2192', disabled: false };
      default: return { cta: 'Volgende', disabled: false };
    }
  };

  const config = getStepConfig();
  const isDark = step === 1;
  const hideChrome = step === 1;

  const renderStep = () => {
    switch (step) {
      case 1:
        return <WelcomeHero />;
      case 2:
        return (
          <NameInput
            name={data.name}
            onChange={(name) => setData((prev) => ({ ...prev, name }))}
            onEnter={() => data.name.trim() && goForward()}
          />
        );
      case 3:
        return <ThePromise name={data.name} />;
      case 4:
        return <RulesOverview />;
      case 5:
        return <BodyTimeline />;
      case 6:
        return <WhyItWorks />;
      case 7:
        return <YesNoReference />;
      case 8:
        return (
          <WeightAndPreferences
            currentWeightInput={currentWeightInput}
            targetWeightInput={targetWeightInput}
            currentWeight={data.currentWeight}
            targetWeight={data.targetWeight}
            vegetarian={data.vegetarian}
            hasAirfryer={data.hasAirfryer}
            sportsRegularly={data.sportsRegularly}
            onCurrentWeightChange={handleCurrentWeightChange}
            onTargetWeightChange={handleTargetWeightChange}
            onPreferenceChange={(key, value) =>
              setData((prev) => ({ ...prev, [key]: value }))
            }
            onEnter={() => isWeightStepValid && goForward()}
          />
        );
      case 9:
        return (
          <CheatDayPicker
            cheatDay={data.cheatDay}
            onChange={(day) => setData((prev) => ({ ...prev, cheatDay: day }))}
          />
        );
      case 10:
        return <SummaryLaunch data={data} />;
      default:
        return null;
    }
  };

  return (
    <DialogPrimitive.Root open>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          className="fixed inset-0 z-50 h-app-screen w-full max-w-none overflow-hidden border-none bg-cream p-0 outline-none"
          aria-describedby={undefined}
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogPrimitive.Title className="sr-only">
            Onboarding
          </DialogPrimitive.Title>

          <div
            key={step}
            className={`h-full ${
              direction === 'forward'
                ? 'animate-in fade-in slide-in-from-right-4'
                : 'animate-in fade-in slide-in-from-left-4'
            }`}
            style={{ animationDuration: '200ms' }}
          >
            <OnboardingStep
              step={step}
              totalSteps={TOTAL_STEPS}
              cta={config.cta}
              disabled={config.disabled}
              onNext={goForward}
              onBack={goBack}
              dark={isDark}
              hideChrome={hideChrome}
            >
              {renderStep()}
            </OnboardingStep>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

import { useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
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

  return (
    <Dialog open={true}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          className="fixed inset-0 z-50 w-full h-full max-w-none p-0 m-0 border-none bg-white outline-none"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <div className="flex flex-col h-full">
            {/* Progress indicator */}
            <div className="flex justify-center gap-2 pt-8 pb-4">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    step <= currentStep ? 'bg-sage-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-start justify-start pt-8 px-6">
            {currentStep === 1 && (
              <Card className="max-w-md w-full mx-auto">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Welkom bij SlowCarb</CardTitle>
                  <p className="text-center text-muted-foreground">Je persoonlijke slow-carb coach</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Label htmlFor="name">Je naam</Label>
                  <Input
                    id="name"
                    placeholder="Hoe mogen we je noemen?"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                  />
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={handleNext}
                    disabled={!data.name.trim()}
                  >
                    Volgende
                  </Button>
                </CardFooter>
              </Card>
            )}

            {currentStep === 2 && (
              <Card className="max-w-md w-full mx-auto">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Wat is je doel?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Label htmlFor="weight-goal">Hoeveel kilo wil je afvallen?</Label>
                  <Slider
                    id="weight-goal"
                    min={3}
                    max={20}
                    step={1}
                    value={[data.weightGoal]}
                    onValueChange={(value) => setData({ ...data, weightGoal: value[0] })}
                  />
                  <p className="text-center text-lg font-semibold">
                    {data.weightGoal} kg
                  </p>
                  <p className="text-center text-muted-foreground">
                    In ongeveer {weekEstimate} weken
                  </p>
                </CardContent>
                <CardFooter className="flex gap-3">
                  <Button variant="ghost" onClick={handleBack} className="shrink-0">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button className="flex-1" onClick={handleNext}>
                    Volgende
                  </Button>
                </CardFooter>
              </Card>
            )}

            {currentStep === 3 && (
              <Card className="max-w-md w-full mx-auto">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Jouw voorkeuren</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="vegetarian"
                      checked={data.vegetarian}
                      onCheckedChange={(checked) =>
                        setData({ ...data, vegetarian: checked as boolean })
                      }
                    />
                    <Label
                      htmlFor="vegetarian"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Ik ben vegetarisch
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="airfryer"
                      checked={data.hasAirfryer}
                      onCheckedChange={(checked) =>
                        setData({ ...data, hasAirfryer: checked as boolean })
                      }
                    />
                    <Label
                      htmlFor="airfryer"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Ik heb een airfryer
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sports"
                      checked={data.sportsRegularly}
                      onCheckedChange={(checked) =>
                        setData({ ...data, sportsRegularly: checked as boolean })
                      }
                    />
                    <Label
                      htmlFor="sports"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Ik sport regelmatig
                    </Label>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-3">
                  <Button variant="ghost" onClick={handleBack} className="shrink-0">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button className="flex-1" onClick={handleNext}>
                    Volgende
                  </Button>
                </CardFooter>
              </Card>
            )}

            {currentStep === 4 && (
              <Card className="max-w-md w-full mx-auto">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Kies je cheat day</CardTitle>
                  <p className="text-center text-muted-foreground">Dit is je wekelijkse vrije dag</p>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={data.cheatDay}
                    onValueChange={(value: 'zaterdag' | 'zondag') =>
                      setData({ ...data, cheatDay: value })
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="zaterdag" id="saturday" />
                      <Label htmlFor="saturday">Zaterdag</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="zondag" id="sunday" />
                      <Label htmlFor="sunday">Zondag</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
                <CardFooter className="flex gap-3">
                  <Button variant="ghost" onClick={handleBack} className="shrink-0">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button className="flex-1" onClick={handleNext}>
                    Volgende
                  </Button>
                </CardFooter>
              </Card>
            )}

            {currentStep === 5 && (
              <Card className="max-w-md w-full mx-auto">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Klaar om te starten!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p>
                      <span className="font-semibold">Naam:</span> {data.name}
                    </p>
                    <p>
                      <span className="font-semibold">Doel:</span> {data.weightGoal} kg afvallen
                    </p>
                    <p>
                      <span className="font-semibold">Tijdsindicatie:</span> {weekEstimate} weken
                    </p>
                    <p>
                      <span className="font-semibold">Cheat day:</span>{' '}
                      {data.cheatDay.charAt(0).toUpperCase() + data.cheatDay.slice(1)}
                    </p>
                    {(data.vegetarian || data.hasAirfryer || data.sportsRegularly) && (
                      <>
                        <p className="font-semibold">Voorkeuren:</p>
                        <ul className="list-disc list-inside text-sm">
                          {data.vegetarian && <li>Vegetarisch</li>}
                          {data.hasAirfryer && <li>Heeft airfryer</li>}
                          {data.sportsRegularly && <li>Sport regelmatig</li>}
                        </ul>
                      </>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex gap-3">
                  <Button variant="ghost" onClick={handleBack} className="shrink-0">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    className="flex-1 bg-sage-600 hover:bg-sage-700"
                    onClick={handleNext}
                  >
                    Start je Journey
                  </Button>
                </CardFooter>
              </Card>
            )}
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  );
}

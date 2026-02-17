import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useUserStore } from '@/store/useUserStore';
import { useJourney } from '@/hooks/useJourney';
import {
  User,
  Settings2,
  Shield,
  Info,
  Settings,
  RotateCcw,
  Trash2,
  Mail,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function SettingsTab() {
  const { profile, updateProfile, logout } = useUserStore();
  const { journey, resetJourney, startJourney } = useJourney();

  if (!profile) {
    return (
      <div className="space-y-4 pb-24">
        <div className="bg-gradient-to-br from-sage-600 to-sage-700 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6" />
            <h2 className="font-display font-semibold text-lg">Instellingen</h2>
          </div>
        </div>
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="pt-6">
            <p className="text-center text-stone-500">Geen profiel gevonden</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleNameChange = (name: string) => {
    updateProfile({ ...profile, name });
  };

  const handleWeightGoalChange = (value: number[]) => {
    updateProfile({ ...profile, weightGoal: value[0] });
  };

  const handleCheatDayChange = (cheatDay: 'zaterdag' | 'zondag') => {
    updateProfile({ ...profile, cheatDay });
    if (journey.startDate) {
      startJourney(journey.startDate, cheatDay, journey.targetWeight);
    }
  };

  const handleVegetarianToggle = (checked: boolean) => {
    updateProfile({ ...profile, vegetarian: checked });
  };

  const handleAirfryerToggle = (checked: boolean) => {
    updateProfile({ ...profile, hasAirfryer: checked });
  };

  const handleSportsToggle = (checked: boolean) => {
    updateProfile({ ...profile, sportsRegularly: checked });
  };

  const handleResetJourney = () => {
    resetJourney();
  };

  const handleClearAllData = () => {
    resetJourney();
    logout();
  };

  const currentCheatDay = profile.cheatDay || journey.cheatDay || 'zaterdag';

  return (
    <div className="space-y-4 pb-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-sage-600 to-sage-700 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg">Instellingen</h2>
            <p className="text-sage-100 text-sm">
              Beheer je profiel en voorkeuren
            </p>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <Card className="rounded-2xl shadow-sm border-stone-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-stone-800 flex items-center gap-2">
            <User className="w-5 h-5 text-sage-600" />
            Profiel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-stone-700">
              Naam
            </Label>
            <Input
              id="name"
              value={profile.name || ''}
              onChange={(e) => handleNameChange(e.target.value)}
              className="rounded-xl border-stone-200 focus:border-sage-400 focus:ring-sage-400"
              placeholder="Jouw naam"
            />
          </div>

          <Separator className="bg-stone-100" />

          {/* Weight Goal Slider */}
          <div className="space-y-3">
            <Label htmlFor="weight-goal" className="text-sm font-medium text-stone-700">
              Gewichtsdoel
            </Label>
            <Slider
              id="weight-goal"
              min={3}
              max={20}
              step={1}
              value={[profile.weightGoal || 10]}
              onValueChange={handleWeightGoalChange}
              className="py-2"
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-500">3 kg</span>
              <span className="text-sm font-semibold text-sage-700 bg-sage-50 px-3 py-1 rounded-full">
                {profile.weightGoal || 10} kg afvallen
              </span>
              <span className="text-sm text-stone-500">20 kg</span>
            </div>
          </div>

          <Separator className="bg-stone-100" />

          {/* Cheat Day Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-stone-700">Cheat day</Label>
            <div className="flex gap-2">
              {(['zaterdag', 'zondag'] as const).map((day) => (
                <button
                  key={day}
                  onClick={() => handleCheatDayChange(day)}
                  className={cn(
                    'flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200',
                    currentCheatDay === day
                      ? 'bg-sage-600 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  )}
                >
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences Section */}
      <Card className="rounded-2xl shadow-sm border-stone-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-stone-800 flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-sage-600" />
            Voorkeuren
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {/* Vegetarian Toggle */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                <span className="text-lg">🥗</span>
              </div>
              <div>
                <p className="text-sm font-medium text-stone-700">Vegetarisch</p>
                <p className="text-xs text-stone-500">Toon alleen veggie recepten</p>
              </div>
            </div>
            <Switch
              id="vegetarian"
              checked={profile.vegetarian || false}
              onCheckedChange={handleVegetarianToggle}
            />
          </div>

          <Separator className="bg-stone-100" />

          {/* Airfryer Toggle */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                <span className="text-lg">🍳</span>
              </div>
              <div>
                <p className="text-sm font-medium text-stone-700">Heeft airfryer</p>
                <p className="text-xs text-stone-500">Toon airfryer instructies</p>
              </div>
            </div>
            <Switch
              id="airfryer"
              checked={profile.hasAirfryer || false}
              onCheckedChange={handleAirfryerToggle}
            />
          </div>

          <Separator className="bg-stone-100" />

          {/* Sports Toggle */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <span className="text-lg">💪</span>
              </div>
              <div>
                <p className="text-sm font-medium text-stone-700">Sport regelmatig</p>
                <p className="text-xs text-stone-500">Pas voedingsadvies aan</p>
              </div>
            </div>
            <Switch
              id="sports"
              checked={profile.sportsRegularly || false}
              onCheckedChange={handleSportsToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy Section */}
      <Card className="rounded-2xl shadow-sm border-stone-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-stone-800 flex items-center gap-2">
            <Shield className="w-5 h-5 text-sage-600" />
            Data & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Reset Journey */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="w-full flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-stone-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-stone-200 flex items-center justify-center">
                    <RotateCcw className="w-4 h-4 text-stone-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-stone-700">Reset Journey</p>
                    <p className="text-xs text-stone-500">Begin opnieuw met dag 1</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-stone-600 transition-colors" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Journey?</AlertDialogTitle>
                <AlertDialogDescription>
                  Dit reset je voortgang maar behoudt je profiel en voorkeuren.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Annuleer</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleResetJourney}
                  className="rounded-xl bg-sage-600 hover:bg-sage-700"
                >
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Clear All Data */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="w-full flex items-center justify-between p-3 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-red-700">Wis alle data</p>
                    <p className="text-xs text-red-500/80">Verwijder alle gegevens</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-red-400 group-hover:text-red-600 transition-colors" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl border-red-200">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-red-700">Wis alle data?</AlertDialogTitle>
                <AlertDialogDescription>
                  Dit verwijdert ALLES - profiel, voortgang, voorkeuren. Dit kan niet ongedaan worden gemaakt.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Annuleer</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearAllData}
                  className="rounded-xl bg-red-600 hover:bg-red-700"
                >
                  Wis alles
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* About Section */}
      <Card className="rounded-2xl shadow-sm border-stone-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-stone-800 flex items-center gap-2">
            <Info className="w-5 h-5 text-sage-600" />
            Over SlowCarb
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-1">
            <span className="text-sm text-stone-500">Versie</span>
            <span className="text-sm font-medium text-stone-700">3.0.0</span>
          </div>
          <Separator className="bg-stone-100" />
          <a
            href="mailto:support@slowcarb.nl"
            className="flex items-center justify-between py-1 group"
          >
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-sage-600" />
              <span className="text-sm font-medium text-stone-700">Contact support</span>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-sage-600 transition-colors" />
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

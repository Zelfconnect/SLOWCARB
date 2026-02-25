import { useState } from 'react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
  CalendarIcon,
  Salad,
  Flame,
  Dumbbell,
  Save,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/i18n';
import { CHEAT_DAY_LABELS, CHEAT_DAY_OPTIONS } from '@/lib/cheatDay';
import type { CheatDay } from '@/types';

export function SettingsTab() {
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const { t, locale, setLocale } = useTranslation();
  const { profile, updateProfile, logout } = useUserStore();
  const { journey, resetJourney, startJourney } = useJourney();

  if (!profile) {
    return (
      <div className="space-y-3">
        <div className="bg-gradient-to-br from-sage-600 to-sage-700 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6" />
            <h2 className="font-display font-semibold text-lg">{String(t('settings.title'))}</h2>
          </div>
        </div>
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="pt-6">
            <p className="text-center text-stone-500">{String(t('settings.noProfile'))}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleNameChange = (name: string) => {
    updateProfile({ ...profile, name });
  };

  const handleWeightGoalChange = (value: number[]) => {
    const newGoal = value[0];
    updateProfile({ ...profile, weightGoal: newGoal });
    if (journey.startDate) {
      startJourney(journey.startDate, currentCheatDay, newGoal);
    }
  };

  const handleCheatDayChange = (cheatDay: CheatDay) => {
    updateProfile({ ...profile, cheatDay });
    if (journey.startDate) {
      startJourney(journey.startDate, cheatDay, journey.targetWeight);
    }
  };

  const handleStartDateChange = (selectedDate: Date | undefined) => {
    if (!selectedDate || !journey.startDate) return;
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    startJourney(formattedDate, currentCheatDay, journey.targetWeight);
    setShowStartDateCalendar(false);
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

  const handleSave = () => {
    if (!profile) return;
    updateProfile(profile);
    toast.success(String(t('settings.savedToast')));
  };

  const currentCheatDay = profile.cheatDay || journey.cheatDay || 'zaterdag';
  const journeyStartDateLabel = journey.startDate
    ? new Date(`${journey.startDate}T12:00:00`).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    : 'Nog niet gestart';

  return (
    <div className="space-y-3">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-sage-600 to-sage-700 rounded-2xl p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg">{String(t('settings.title'))}</h2>
            <p className="text-sage-100 text-sm">
              {String(t('settings.subtitle'))}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <Card className="rounded-2xl shadow-sm border-stone-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-stone-800 flex items-center gap-2">
            <User className="w-5 h-5 text-sage-600" />
            {String(t('settings.profileTitle'))}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Name Input */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-medium text-stone-700">
              {String(t('settings.nameLabel'))}
            </Label>
            <Input
              id="name"
              value={profile.name || ''}
              onChange={(e) => handleNameChange(e.target.value)}
              className="rounded-xl border-stone-200 focus:border-sage-400 focus:ring-sage-400"
              placeholder={String(t('settings.namePlaceholder'))}
            />
          </div>

          <Separator className="bg-stone-100" />

          {/* Weight Goal Slider */}
          <div className="space-y-2">
            <Label htmlFor="weight-goal" className="text-sm font-medium text-stone-700">
              {String(t('settings.weightGoalLabel'))}
            </Label>
            <Slider
              id="weight-goal"
              min={3}
              max={20}
              step={1}
              value={[profile.weightGoal || 10]}
              onValueChange={handleWeightGoalChange}
              className="py-1"
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-500">3 kg</span>
              <span className="text-sm font-semibold text-sage-700 bg-sage-50 px-3 py-1 rounded-full">
                {profile.weightGoal || 10} {String(t('settings.weightGoalValueSuffix'))}
              </span>
              <span className="text-sm text-stone-500">20 kg</span>
            </div>
          </div>

          <Separator className="bg-stone-100" />

          {/* Cheat Day Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-stone-700">{String(t('settings.cheatDayLabel'))}</Label>
            <p className="text-xs text-stone-500">Kies de dag die past bij je ritme (bijv. uit eten).</p>
            <div className="grid grid-cols-2 gap-2">
              {CHEAT_DAY_OPTIONS.map((day) => (
                <button
                  key={day}
                  onClick={() => handleCheatDayChange(day)}
                  className={cn(
                    'flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200',
                    currentCheatDay === day
                      ? 'bg-sage-600 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  )}
                >
                  {CHEAT_DAY_LABELS[day]}
                </button>
              ))}
            </div>
          </div>

          <Separator className="bg-stone-100" />

          <div className="space-y-2">
            <Label className="text-sm font-medium text-stone-700">Startdatum journey</Label>
            <p className="text-xs text-stone-500">Huidige startdatum: {journeyStartDateLabel}</p>
            {journey.startDate ? (
              <Popover open={showStartDateCalendar} onOpenChange={setShowStartDateCalendar}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex h-10 w-full items-center justify-between rounded-xl border border-stone-200 bg-white px-3 text-sm text-stone-700 transition-colors hover:bg-stone-50"
                  >
                    Startdatum wijzigen
                    <CalendarIcon className="h-4 w-4 text-stone-500" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="z-[60] w-auto rounded-xl border border-stone-200 bg-white p-0 shadow-soft [--cell-size:2.5rem]">
                  <Calendar
                    mode="single"
                    locale={nl}
                    selected={new Date(`${journey.startDate}T12:00:00`)}
                    defaultMonth={new Date(`${journey.startDate}T12:00:00`)}
                    onSelect={handleStartDateChange}
                    disabled={{ after: new Date() }}
                  />
                </PopoverContent>
              </Popover>
            ) : null}
          </div>

          <Separator className="bg-stone-100" />

          <div className="space-y-2">
            <Label htmlFor="language" className="text-sm font-medium text-stone-700">
              {String(t('settings.languageLabel'))}
            </Label>
            <select
              id="language"
              value={locale}
              onChange={(event) => setLocale(event.target.value)}
              className="h-10 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm text-stone-700 outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-200"
            >
              <option value="en">English</option>
              <option value="nl">Nederlands</option>
            </select>
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-sage-600 text-white font-medium text-sm hover:bg-sage-700 active:scale-[0.98] transition-colors"
            >
              <Save className="w-4 h-4" />
              {String(t('settings.saveButton'))}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Preferences Section */}
      <Card className="rounded-2xl shadow-sm border-stone-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-stone-800 flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-sage-600" />
            {String(t('settings.preferencesTitle'))}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {/* Vegetarian Toggle */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Salad className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-700">{String(t('settings.vegetarianLabel'))}</p>
                <p className="text-xs text-stone-500">{String(t('settings.vegetarianHint'))}</p>
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
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <Flame className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-700">{String(t('settings.airfryerLabel'))}</p>
                <p className="text-xs text-stone-500">{String(t('settings.airfryerHint'))}</p>
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
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-700">{String(t('settings.sportsLabel'))}</p>
                <p className="text-xs text-stone-500">{String(t('settings.sportsHint'))}</p>
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
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-stone-800 flex items-center gap-2">
            <Shield className="w-5 h-5 text-sage-600" />
            {String(t('settings.dataPrivacyTitle'))}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {/* Reset Journey */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="w-full flex items-center justify-between p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-200 flex items-center justify-center">
                    <RotateCcw className="w-4 h-4 text-stone-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-stone-700">{String(t('settings.resetJourneyTitle'))}</p>
                    <p className="text-xs text-stone-500">{String(t('settings.resetJourneyHint'))}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-stone-600 transition-colors" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>{String(t('settings.resetJourneyDialogTitle'))}</AlertDialogTitle>
                <AlertDialogDescription>
                  {String(t('settings.resetJourneyDialogDescription'))}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">{String(t('settings.cancel'))}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleResetJourney}
                  className="rounded-xl bg-sage-600 hover:bg-sage-700"
                >
                  {String(t('settings.reset'))}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Clear All Data */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="w-full flex items-center justify-between p-2.5 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-red-700">{String(t('settings.clearAllTitle'))}</p>
                    <p className="text-xs text-red-500/80">{String(t('settings.clearAllHint'))}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-red-400 group-hover:text-red-600 transition-colors" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl border-red-200">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-red-700">{String(t('settings.clearAllDialogTitle'))}</AlertDialogTitle>
                <AlertDialogDescription>
                  {String(t('settings.clearAllDialogDescription'))}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">{String(t('settings.cancel'))}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearAllData}
                  className="rounded-xl bg-red-600 hover:bg-red-700"
                >
                  {String(t('settings.clearAllAction'))}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* About Section */}
      <Card className="rounded-2xl shadow-sm border-stone-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-stone-800 flex items-center gap-2">
            <Info className="w-5 h-5 text-sage-600" />
            {String(t('settings.aboutTitle'))}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between py-1">
            <span className="text-sm text-stone-500">{String(t('settings.versionLabel'))}</span>
            <span className="text-sm font-medium text-stone-700">3.0.0</span>
          </div>
          <Separator className="bg-stone-100" />
          <a
            href="mailto:support@slowcarb.nl"
            className="flex items-center justify-between py-1 group"
          >
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-sage-600" />
              <span className="text-sm font-medium text-stone-700">{String(t('settings.contactSupport'))}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-sage-600 transition-colors" />
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

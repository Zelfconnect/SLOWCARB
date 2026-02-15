import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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

export function SettingsTab() {
  const { profile, updateProfile, logout } = useUserStore();
  const { journey, resetJourney, startJourney } = useJourney();

  if (!profile) {
    return (
      <div className="space-y-6 pb-24">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Geen profiel gevonden</p>
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
    // Also update journey cheat day
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

  return (
    <div className="space-y-6 pb-24">
      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profiel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Naam</Label>
            <Input
              id="name"
              value={profile.name || ''}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>

          <Separator />

          <div>
            <Label htmlFor="weight-goal">Gewichtsdoel (kg)</Label>
            <Slider
              id="weight-goal"
              min={3}
              max={20}
              value={[profile.weightGoal || 10]}
              onValueChange={handleWeightGoalChange}
            />
            <p className="text-sm text-muted-foreground mt-1">
              {profile.weightGoal || 10} kg afvallen
            </p>
          </div>

          <Separator />

          <div>
            <Label>Cheat day</Label>
            <RadioGroup
              value={profile.cheatDay || journey.cheatDay || 'zaterdag'}
              onValueChange={handleCheatDayChange}
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
          </div>
        </CardContent>
      </Card>

      {/* Preferences Section */}
      <Card>
        <CardHeader>
          <CardTitle>Voorkeuren</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="vegetarian">Vegetarisch</Label>
            <Switch
              id="vegetarian"
              checked={profile.vegetarian || false}
              onCheckedChange={handleVegetarianToggle}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label htmlFor="airfryer">Heeft airfryer</Label>
            <Switch
              id="airfryer"
              checked={profile.hasAirfryer || false}
              onCheckedChange={handleAirfryerToggle}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label htmlFor="sports">Sport regelmatig</Label>
            <Switch
              id="sports"
              checked={profile.sportsRegularly || false}
              onCheckedChange={handleSportsToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Section */}
      <Card>
        <CardHeader>
          <CardTitle>Data & Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full">
                Reset Journey
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Journey?</AlertDialogTitle>
                <AlertDialogDescription>
                  Dit reset je voortgang maar behoudt je profiel en voorkeuren.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuleer</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetJourney}>
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Separator />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                Wis alle data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Wis alle data?</AlertDialogTitle>
                <AlertDialogDescription>
                  Dit verwijdert ALLES - profiel, voortgang, voorkeuren. Dit kan niet ongedaan worden gemaakt.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuleer</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAllData}>
                  Wis alles
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle>Over SlowCarb</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">Versie 3.0.0</p>
          <a
            href="mailto:support@slowcarb.nl"
            className="text-sm text-sage-600 hover:underline block"
          >
            Contact support
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

# PRD: SettingsTab Component

## Component Path
`/src/components/SettingsTab.tsx`

## Requirements

Settings page as the 5th tab in the app. Clean list-style interface using shadcn Card components.

## Layout

```tsx
<div className="space-y-6 pb-24">
  {/* Profile Section */}
  {/* Preferences Section */}
  {/* Data Section */}
  {/* About Section */}
</div>
```

### Profile Section

```tsx
<Card>
  <CardHeader>
    <CardTitle>Profiel</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div>
      <Label htmlFor="name">Naam</Label>
      <Input id="name" value={profile.name} onChange={...} />
    </div>
    <div>
      <Label htmlFor="weight-goal">Gewichtsdoel (kg)</Label>
      <Slider 
        id="weight-goal"
        min={3} 
        max={20} 
        value={[profile.weightGoal]} 
        onValueChange={...} 
      />
      <p className="text-sm text-gray-500 mt-1">
        {profile.weightGoal} kg afvallen
      </p>
    </div>
    <div>
      <Label>Cheat day</Label>
      <RadioGroup value={profile.cheatDay} onValueChange={...}>
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
```

### Preferences Section

```tsx
<Card>
  <CardHeader>
    <CardTitle>Voorkeuren</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="flex items-center justify-between">
      <Label htmlFor="vegetarian">Vegetarisch</Label>
      <Switch 
        id="vegetarian" 
        checked={profile.vegetarian} 
        onCheckedChange={...} 
      />
    </div>
    <div className="flex items-center justify-between">
      <Label htmlFor="airfryer">Heeft airfryer</Label>
      <Switch 
        id="airfryer" 
        checked={profile.hasAirfryer} 
        onCheckedChange={...} 
      />
    </div>
    <div className="flex items-center justify-between">
      <Label htmlFor="sports">Sport regelmatig</Label>
      <Switch 
        id="sports" 
        checked={profile.sportsRegularly} 
        onCheckedChange={...} 
      />
    </div>
  </CardContent>
</Card>
```

### Data Section

```tsx
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
          <AlertDialogAction 
            className="bg-red-600 hover:bg-red-700"
            onClick={handleClearAllData}
          >
            Wis alles
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </CardContent>
</Card>
```

### About Section

```tsx
<Card>
  <CardHeader>
    <CardTitle>Over SlowCarb</CardTitle>
  </CardHeader>
  <CardContent className="space-y-2">
    <p className="text-sm text-gray-600">Versie 3.0.0</p>
    <a 
      href="mailto:support@slowcarb.nl" 
      className="text-sm text-sage-600 hover:underline"
    >
      Contact support
    </a>
  </CardContent>
</Card>
```

## State Management

- Get profile from `useUserStore`
- Get journey from `useJourney` 
- Update profile using `updateProfile` from store
- Reset journey using `resetJourney` from hook
- Clear all data: call both `logout()` from store and `resetJourney()`

## Props

```typescript
interface SettingsTabProps {
  // No props needed - uses hooks directly
}
```

## Imports Needed

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
```

## Implementation Notes

- All changes should update immediately (no save button)
- Use `onChange` handlers to update profile in real-time
- Make sure TypeScript is happy with all types
- Test that localStorage updates correctly
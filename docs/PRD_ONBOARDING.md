# PRD: OnboardingWizard Component

## Component Path
`/src/components/OnboardingWizard.tsx`

## Requirements

Full-screen modal wizard that blocks app until complete.

### Modal Properties
- Uses shadcn Dialog component
- Full-screen overlay
- Cannot be dismissed (no X button, no ESC key, no backdrop click)
- Mobile-first design: `max-w-md mx-auto`
- Progress indicator at top showing current step (1-5)

### Step 1: Welcome
```jsx
<h2>Welkom bij SlowCarb</h2>
<p>Je persoonlijke slow-carb coach</p>
<Input placeholder="Je naam" />
<Button>Volgende</Button>
```

### Step 2: Goal
```jsx
<h2>Wat is je doel?</h2>
<Label>Hoeveel kilo wil je afvallen?</Label>
<Slider min={3} max={20} step={1} />
<p>In ongeveer {Math.ceil(weightGoal * 0.6)} weken</p>
<Button>Volgende</Button>
```

### Step 3: Preferences
```jsx
<h2>Jouw voorkeuren</h2>
<Checkbox id="vegetarian">Ik ben vegetarisch</Checkbox>
<Checkbox id="airfryer">Ik heb een airfryer</Checkbox>
<Checkbox id="sports">Ik sport regelmatig</Checkbox>
<Button>Volgende</Button>
```

### Step 4: Cheat Day
```jsx
<h2>Kies je cheat day</h2>
<RadioGroup defaultValue="zaterdag">
  <RadioGroupItem value="zaterdag">Zaterdag</RadioGroupItem>
  <RadioGroupItem value="zondag">Zondag</RadioGroupItem>
</RadioGroup>
<p>Dit is je wekelijkse vrije dag</p>
<Button>Volgende</Button>
```

### Step 5: Start
```jsx
<h2>Klaar om te starten!</h2>
<div>Summary van keuzes:</div>
<ul>
  <li>Naam: {name}</li>
  <li>Doel: {weightGoal} kg</li>
  <li>Cheat day: {cheatDay}</li>
</ul>
<Button className="bg-sage-600 hover:bg-sage-700">
  Start je Journey
</Button>
```

## State Management

```typescript
interface OnboardingData {
  name: string;
  weightGoal: number;
  vegetarian: boolean;
  hasAirfryer: boolean;
  sportsRegularly: boolean;
  cheatDay: 'zaterdag' | 'zondag';
}
```

On completion:
1. Save to useUserStore:
   - `hasCompletedOnboarding: true`
   - All profile data
2. Call `startJourney` from useJourney hook with:
   - Current date as startDate
   - Selected cheatDay
   - weightGoal as targetWeight

## Props

```typescript
interface OnboardingWizardProps {
  onComplete: (data: OnboardingData) => void;
}
```

## Implementation Notes

- Use `useState` for current step (1-5)
- Use `useState` for form data
- Validate each step before allowing "Volgende"
- Dialog should have `open={true}` always (controlled)
- Use Tailwind classes for all styling
- Progress bar: 5 dots, current step highlighted

## Import all needed shadcn components:
- Dialog, DialogContent, DialogHeader, DialogTitle
- Input
- Button
- Slider
- Checkbox
- RadioGroup, RadioGroupItem
- Label
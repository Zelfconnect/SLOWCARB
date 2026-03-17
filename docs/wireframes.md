# SlowCarb — Screen flow (wireframes)

Mermaid flow from entry to every tab and overlay. Use with `docs/screen-map.md` for full screen list.

---

## 1. Entry and onboarding

```mermaid
flowchart TB
  subgraph entry["Entry"]
    URL["URL: /"]
    Q["?app=1 / token"]
    W["?welcome=1"]
  end

  URL --> Q
  URL --> W
  Q -->|no access| Landing["Landing"]
  Q -->|has access| AppCheck["Profile + onboarding check"]
  W --> Welcome["Welcome page"]

  Landing -->|token / CTA| AppCheck
  AppCheck -->|no profile or ?onboarding=1| Onboarding["Onboarding wizard"]
  AppCheck -->|profile complete| AppShell["App shell"]

  subgraph onboarding_steps["Onboarding (10 steps)"]
    S1["1. Welcome hero"]
    S2["2. Name input"]
    S3["3. The promise"]
    S4["4. Rules overview"]
    S5["5. Body timeline"]
    S6["6. Why it works"]
    S7["7. Yes/No reference"]
    S8["8. Weight & preferences"]
    S9["9. Cheat day picker"]
    S10["10. Summary & launch"]
  end

  Onboarding --> S1
  S1 --> S2 --> S3 --> S4 --> S5 --> S6 --> S7 --> S8 --> S9 --> S10
  S10 -->|complete| AppShell
```

---

## 2. App shell and tabs

```mermaid
flowchart TB
  AppShell["App shell\n(header + main + bottom nav)"]
  Header["Header: SlowCarb + cog"]
  Nav["Bottom nav: Dashboard | Recepten | Leren | AmmoCheck"]
  Main["Main content area"]

  AppShell --> Header
  AppShell --> Main
  AppShell --> Nav

  Header -->|cog click| SettingsSheet["Settings sheet"]
  Nav -->|Dashboard| TabDashboard["Tab: Dashboard"]
  Nav -->|Recepten| TabRecipes["Tab: Recipes list"]
  Nav -->|Leren| TabLearn["Tab: Learn"]
  Nav -->|AmmoCheck| TabAmmo["Tab: AmmoCheck"]

  Main --> TabDashboard
  Main --> TabRecipes
  Main --> TabLearn
  Main --> TabAmmo
```

---

## 3. Dashboard flow (screens + overlays)

```mermaid
flowchart TB
  TabDashboard["Dashboard tab"]
  NoJourney["No journey: JourneyCard only"]
  WithJourney["Journey active: StreakHero, JourneyCard, WeeklyProgress, WeightProgress, DailyMealTracker"]

  TabDashboard --> NoJourney
  TabDashboard --> WithJourney

  NoJourney -->|Start reis| StartDialog["Start reis dialog"]
  WithJourney -->|Start / reset| StartDialog
  WithJourney -->|Tip| TipDialog["Tip van de dag dialog"]
  WithJourney -->|Log weight| WeightDialog["Log je gewicht dialog"]

  StartDialog -->|confirm| WithJourney
  TipDialog -->|close| WithJourney
  WeightDialog -->|save/close| WithJourney
```

---

## 4. Recipes flow (screens + overlays)

```mermaid
flowchart TB
  TabRecipes["Recipes tab"]
  List["Recipes list"]
  Detail["Recipe detail modal\n(Ingrediënten | Bereiding)"]
  Package["Package selector modal"]

  TabRecipes --> List
  List -->|tap recipe| Detail
  Detail -->|Voeg toe aan boodschappen| Package
  Package -->|done| Detail
  Detail -->|close| List
```

---

## 5. Learn flow (tabs + overlays)

```mermaid
flowchart TB
  TabLearn["Learn tab"]
  QuickStart["Sub-tab: Quick Start\n(5 regels + startplan)"]
  Science["Sub-tab: Wetenschap\n(concept cards)"]
  FAQ["Sub-tab: FAQ\n(FAQ + reference cards)"]
  RuleDialog["Rule card dialog"]
  ConceptDialog["Concept card dialog"]
  FaqDialog["FAQ card dialog"]

  TabLearn --> QuickStart
  TabLearn --> Science
  TabLearn --> FAQ

  QuickStart -->|tap rule| RuleDialog
  Science -->|tap concept| ConceptDialog
  FAQ -->|tap faq| FaqDialog

  RuleDialog -->|close| QuickStart
  ConceptDialog -->|close| Science
  FaqDialog -->|close| FAQ
```

---

## 6. Settings sheet flow (overlays)

```mermaid
flowchart TB
  SettingsSheet["Settings sheet\n(profile, journey, prefs, danger zone)"]
  CalendarPopover["Start date calendar popover"]
  ResetAlert["Reset journey AlertDialog"]
  ClearAlert["Clear all data AlertDialog"]

  SettingsSheet -->|start date picker| CalendarPopover
  SettingsSheet -->|reset journey| ResetAlert
  SettingsSheet -->|clear all| ClearAlert

  CalendarPopover -->|select/close| SettingsSheet
  ResetAlert -->|confirm/cancel| SettingsSheet
  ClearAlert -->|confirm| Logout["Logout / app exit"]
  ClearAlert -->|cancel| SettingsSheet
```

---

## 7. Full app overview (simplified)

```mermaid
flowchart LR
  subgraph external["External"]
    Landing["Landing"]
    Welcome["Welcome"]
  end

  subgraph onboarding["Onboarding"]
    O["10-step wizard"]
  end

  subgraph app["App"]
    D["Dashboard"]
    R["Recipes"]
    L["Learn"]
    A["AmmoCheck"]
    S["Settings sheet"]
  end

  Landing --> O
  Welcome --> app
  O --> D
  D --> R
  D --> L
  D --> A
  D --> S
  R --> D
  L --> D
  A --> D
  S --> D
```

---

For a flat list of every screen and overlay with "opened from", see **`docs/screen-map.md`**.

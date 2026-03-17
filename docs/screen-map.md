# SlowCarb — Screen map

Complete list of screens, sub-views, and overlays for context and wireframe reference.

---

## Entry (outside main app)


| Screen         | Component          | Purpose                                         | Leads to                          |
| -------------- | ------------------ | ----------------------------------------------- | --------------------------------- |
| **Landing**    | `LandingPageFinal` | Marketing/access gate; default when no `?app=1` | App (with token/access), or stay  |
| **Welcome**    | `WelcomePage`      | Shown when `?welcome=1`                         | Informational; link to app        |
| **Onboarding** | `OnboardingWizard` | First-time or `?onboarding=1`; 10 steps         | App shell (Dashboard) on complete |


---

## Main app chrome


| Element            | Description                                       |
| ------------------ | ------------------------------------------------- |
| **Header**         | Title "SlowCarb", cog icon (opens Settings sheet) |
| **Settings sheet** | Slide-out from right; contains `SettingsTab`      |
| **Bottom nav**     | 4 tabs: Dashboard, Recepten, Leren, AmmoCheck     |
| **Toaster**        | Top-center toast notifications                    |


---

## Tab: Dashboard


| Screen / state                 | Component                                                                                                    | Purpose                               | Leads to                                         |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------ | ------------------------------------- | ------------------------------------------------ |
| **Dashboard (no journey)**     | `Dashboard` + `JourneyCard` only                                                                             | Prompt to start 84-day journey        | Start-reis dialog                                |
| **Dashboard (journey active)** | `Dashboard`: `StreakHeroCard`, `JourneyCard`, `WeeklyProgressGrid`, `WeightProgressCard`, `DailyMealTracker` | Progress, tips, weight, meals, streak | Start-reis dialog, Tip dialog, Log-weight dialog |
| **Start reis dialog**          | `Dialog` in `JourneyCard`                                                                                    | Confirm start date and begin journey  | Closes → Dashboard                               |
| **Tip van de dag dialog**      | `Dialog` in `JourneyCard`                                                                                    | Day/week tip and metabolic state      | Closes → Dashboard                               |
| **Log je gewicht dialog**      | `Dialog` in `Dashboard`                                                                                      | Enter weight for today                | Closes → Dashboard                               |


---

## Tab: Recepten (Recipes)


| Screen / state             | Component              | Purpose                                                    | Leads to                       |
| -------------------------- | ---------------------- | ---------------------------------------------------------- | ------------------------------ |
| **Recipes list**           | `RecipesList`          | List of recipe cards (favorites, filter)                   | Recipe detail modal            |
| **Recipe detail modal**    | `RecipeDetailModal`    | Tabs: Ingrediënten, Bereiding; "Voeg toe aan boodschappen" | Package selector modal, close  |
| **Package selector modal** | `PackageSelectorModal` | Pick package sizes / "already have" for ingredients        | Closes → Recipe detail or list |


---

## Tab: Leren (Learn)


| Screen / state          | Component                         | Purpose                       | Leads to            |
| ----------------------- | --------------------------------- | ----------------------------- | ------------------- |
| **Learn — Quick Start** | `LearnSection`, tab "Quick Start" | Startplan + De 5 Regels cards | Rule card dialog    |
| **Learn — Wetenschap**  | `LearnSection`, tab "Wetenschap"  | Concept cards                 | Concept card dialog |
| **Learn — FAQ**         | `LearnSection`, tab "FAQ"         | FAQ + reference cards         | FAQ card dialog     |
| **Rule card dialog**    | `RuleCard` (Dialog)               | Full rule content             | Closes → Learn      |
| **Concept card dialog** | `ConceptCard` (Dialog)            | Full concept content          | Closes → Learn      |
| **FAQ card dialog**     | `FAQCard` (Dialog)                | Full FAQ/reference content    | Closes → Learn      |


---

## Tab: AmmoCheck


| Screen / state | Component   | Purpose                                        | Leads to |
| -------------- | ----------- | ---------------------------------------------- | -------- |
| **AmmoCheck**  | `AmmoCheck` | Daily checklist (eiwit, bonen, groenten, etc.) | —        |


---

## Settings (sheet overlay)


| Screen / state                  | Component              | Purpose                                    | Leads to                                                 |
| ------------------------------- | ---------------------- | ------------------------------------------ | -------------------------------------------------------- |
| **Settings sheet**              | `SettingsTab`          | Profile, journey, preferences, danger zone | Calendar popover, Reset journey dialog, Clear all dialog |
| **Start date calendar popover** | `Popover` + `Calendar` | Pick journey start date                    | Closes → Settings                                        |
| **Reset journey AlertDialog**   | `AlertDialog`          | Confirm reset journey                      | Closes → Settings                                        |
| **Clear all data AlertDialog**  | `AlertDialog`          | Confirm logout + clear data                | Closes → Landing / app exit                              |


---

## Onboarding (10 steps)


| Step | Screen                   | Component              | Purpose                                             | Leads to              |
| ---- | ------------------------ | ---------------------- | --------------------------------------------------- | --------------------- |
| 1    | **Welcome hero**         | `WelcomeHero`          | Intro                                               | Step 2                |
| 2    | **Name input**           | `NameInput`            | User name                                           | Step 3                |
| 3    | **The promise**          | `ThePromise`           | Value proposition                                   | Step 4                |
| 4    | **Rules overview**       | `RulesOverview`        | 5 rules summary                                     | Step 5                |
| 5    | **Body timeline**        | `BodyTimeline`         | Metabolic timeline                                  | Step 6                |
| 6    | **Why it works**         | `WhyItWorks`           | Science short                                       | Step 7                |
| 7    | **Yes/No reference**     | `YesNoReference`       | Allowed/not allowed                                 | Step 8                |
| 8    | **Weight & preferences** | `WeightAndPreferences` | Current/target weight, vegetarian, airfryer, sports | Step 9                |
| 9    | **Cheat day picker**     | `CheatDayPicker`       | Pick cheat day                                      | Step 10               |
| 10   | **Summary & launch**     | `SummaryLaunch`        | Recap + start                                       | App shell (Dashboard) |


---

## Wireframe references

- Flow diagram: `docs/wireframes.md`
- Optional: add `docs/wireframes/*.png` per screen and link from this table.


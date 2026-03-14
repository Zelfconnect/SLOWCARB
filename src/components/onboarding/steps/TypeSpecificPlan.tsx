import type { OnboardingData } from '../OnboardingWizard';

export interface PersonalizedType {
  title: string;
  summary: string;
  explanation: string;
  strategy: string[];
}

export function getPersonalizedType(data: OnboardingData): PersonalizedType {
  const weightGoal = Math.max(0, data.currentWeight - data.targetWeight);

  if (data.sportsRegularly) {
    return {
      title: 'Jouw type: Actieve Versneller',
      summary: 'Je beweegt al veel. SlowCarb werkt voor jou als stabiele brandstofbasis.',
      explanation: 'Met je huidige activiteit profiteer je vooral van minder schommelingen in energie en trek.',
      strategy: [
        'Plan je grootste maaltijd na training voor beter herstel.',
        'Houd je ontbijt eiwitrijk om snaaien later te voorkomen.',
        'Gebruik je cheatday als herstelmoment, niet als inhaalslag.',
      ],
    };
  }

  if (data.vegetarian) {
    return {
      title: 'Jouw type: Plantaardige Planner',
      summary: 'Je eet vegetarisch. SlowCarb werkt voor jou met slimme eiwit- en peulvruchtcombinaties.',
      explanation: 'Je resultaat hangt vooral af van structuur in je maaltijden en genoeg vulling per eetmoment.',
      strategy: [
        'Bouw elke maaltijd rond eieren, peulvruchten en groenten.',
        'Kook extra porties vooruit om snelle fallback-opties te hebben.',
        'Houd porties bonen consequent voor stabiele verzadiging.',
      ],
    };
  }

  if (weightGoal >= 20) {
    return {
      title: 'Jouw type: Sterke Reset',
      summary: 'Je hebt een groter doel. SlowCarb werkt voor jou via ritme, niet via perfectie.',
      explanation: 'Bij een grotere doelafstand telt vooral consistentie: veel herhaalbare dagen achter elkaar.',
      strategy: [
        'Herhaal 2-3 vaste ontbijt/lunch-opties voor minder keuzestress.',
        'Focus eerst op weekritme; details kun je later finetunen.',
        'Gebruik je cheatday gepland om volhouden makkelijker te maken.',
      ],
    };
  }

  return {
    title: 'Jouw type: Stabiele Starter',
    summary: 'Je doel is helder. SlowCarb werkt voor jou met simpele, herhaalbare routines.',
    explanation: 'Met een compacte set vaste maaltijden bouw je snel momentum zonder veel denkwerk.',
    strategy: [
      'Kies per dag 1 ontbijt en 1 lunch die je makkelijk herhaalt.',
      'Maak je omgeving simpel: haal verleidingen uit huis.',
      'Evalueer wekelijks op trend, niet op dagfluctuaties.',
    ],
  };
}

interface TypeSpecificPlanProps {
  data: OnboardingData;
}

export function TypeSpecificPlan({ data }: TypeSpecificPlanProps) {
  const profile = getPersonalizedType(data);

  return (
    <section className="flex flex-1 flex-col">
      <div className="space-y-3 text-center">
        <h1 className="font-display text-3xl font-bold text-stone-900">
          {profile.title}
        </h1>
        <p className="text-base text-stone-600">{profile.summary}</p>
      </div>

      <div className="mt-8 space-y-4">
        <div className="rounded-2xl border border-stone-200 bg-white/85 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Uitleg</p>
          <p className="mt-2 text-sm leading-relaxed text-stone-700">{profile.explanation}</p>
        </div>

        <div className="rounded-2xl border border-sage-200 bg-sage-50/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-sage-700">
            Hoe SlowCarb voor jou werkt
          </p>
          <ul className="mt-2 space-y-2">
            {profile.strategy.map((item) => (
              <li key={item} className="rounded-xl bg-white/80 px-3 py-2 text-sm text-stone-700">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {data.hasAirfryer && (
          <p className="text-center text-sm font-medium text-sage-700">
            Bonus: we laten je extra snelle airfryer-opties zien in je recepten.
          </p>
        )}
      </div>
    </section>
  );
}

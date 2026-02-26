import type { ReactNode } from 'react';
import { TrustFooter } from '@/components/TrustFooter';

type LegalPageProps = {
  title: string;
  updatedAt: string;
  children: ReactNode;
};

function LegalPageLayout({ title, updatedAt, children }: LegalPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12 md:py-16">
        <a
          href="/"
          className="mb-8 inline-flex text-sm font-medium text-sage-700 transition-colors hover:text-sage-800"
        >
          ← Terug naar SlowCarb
        </a>
        <h1 className="font-display text-3xl font-bold text-stone-900 md:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-stone-500">Laatst bijgewerkt: {updatedAt}</p>
        <div className="mt-8 space-y-6 text-sm leading-7 text-stone-700 md:text-base">{children}</div>
      </main>
      <TrustFooter />
    </div>
  );
}

export function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacyverklaring" updatedAt="26 februari 2026">
      <section>
        <h2 className="font-display text-xl font-semibold text-stone-900">1. Wie wij zijn</h2>
        <p className="mt-2">
          SlowCarb is een digitale voedingsapplicatie. In deze privacyverklaring leggen we uit welke
          gegevens we verwerken en waarom.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl font-semibold text-stone-900">2. Welke gegevens wij verwerken</h2>
        <p className="mt-2">Wij verwerken alleen gegevens die nodig zijn voor het gebruik van de app, zoals:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>profielgegevens (zoals naam en voorkeuren);</li>
          <li>voortgangsgegevens (zoals gewicht, maaltijdboxes en instellingen);</li>
          <li>technische gegevens die nodig zijn voor werking en beveiliging.</li>
        </ul>
      </section>
      <section>
        <h2 className="font-display text-xl font-semibold text-stone-900">3. Hoe gegevens worden opgeslagen</h2>
        <p className="mt-2">
          SlowCarb is client-side. Jouw gegevens worden primair lokaal in je browser opgeslagen via
          localStorage. Verwijder je browserdata, dan kunnen deze gegevens verdwijnen.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl font-semibold text-stone-900">4. Doel en grondslag</h2>
        <p className="mt-2">
          We gebruiken gegevens om de app te laten functioneren, je voortgang te tonen en de gebruikerservaring
          te verbeteren. De verwerking is noodzakelijk voor uitvoering van de overeenkomst en ons gerechtvaardigd
          belang om een goed werkend product te bieden.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl font-semibold text-stone-900">5. Delen met derden</h2>
        <p className="mt-2">
          Wij verkopen jouw persoonsgegevens niet. Als we externe diensten gebruiken, beperken we dit tot wat
          noodzakelijk is voor levering, analyse of beveiliging.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl font-semibold text-stone-900">6. Jouw rechten</h2>
        <p className="mt-2">
          Je hebt recht op inzage, correctie, verwijdering en bezwaar. Voor verzoeken kun je contact opnemen via
          support@slowcarb.nl.
        </p>
      </section>
    </LegalPageLayout>
  );
}

export function TermsPage() {
  return (
    <LegalPageLayout title="Algemene Voorwaarden" updatedAt="26 februari 2026">
      <section>
        <h2 className="font-display text-xl font-semibold text-stone-900">1. Toepasselijkheid</h2>
        <p className="mt-2">
          Deze voorwaarden zijn van toepassing op alle aankopen en het gebruik van SlowCarb.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl font-semibold text-stone-900">2. Dienstverlening</h2>
        <p className="mt-2">
          SlowCarb biedt voedingsinformatie, recepten en hulpmiddelen voor gedragsverandering. De inhoud is
          informatief en vervangt geen medisch advies.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl font-semibold text-stone-900">3. Account en toegang</h2>
        <p className="mt-2">
          Je bent zelf verantwoordelijk voor correcte gegevens en veilig gebruik van je apparaat. Toegang mag niet
          worden gedeeld op een manier die misbruik veroorzaakt.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl font-semibold text-stone-900">4. Betaling</h2>
        <p className="mt-2">
          Tenzij anders vermeld betreft het een eenmalige betaling voor toegang zoals op de verkooppagina
          beschreven.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl font-semibold text-stone-900">5. Aansprakelijkheid</h2>
        <p className="mt-2">
          Wij doen ons best om correcte informatie te bieden, maar geven geen garanties op individuele resultaten.
          Voor zover wettelijk toegestaan is aansprakelijkheid beperkt tot het aankoopbedrag.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl font-semibold text-stone-900">6. Wijzigingen</h2>
        <p className="mt-2">
          We kunnen deze voorwaarden aanpassen. De actuele versie staat altijd op deze pagina.
        </p>
      </section>
    </LegalPageLayout>
  );
}

export function RefundPolicyPage() {
  return (
    <LegalPageLayout title="Terugbetalingsbeleid" updatedAt="26 februari 2026">
      <section>
        <h2 className="font-display text-xl font-semibold text-stone-900">1. 30 dagen garantie</h2>
        <p className="mt-2">
          Je hebt recht op een volledige terugbetaling binnen 30 dagen na aankoop als je niet tevreden bent.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl font-semibold text-stone-900">2. Hoe je een verzoek indient</h2>
        <p className="mt-2">
          Stuur een e-mail naar support@slowcarb.nl met je bestelgegevens. Vermeld je naam en het e-mailadres dat
          je bij aankoop gebruikte.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl font-semibold text-stone-900">3. Verwerkingstermijn</h2>
        <p className="mt-2">
          We beoordelen je verzoek zo snel mogelijk. Bij goedkeuring betalen we terug via dezelfde betaalmethode
          als de oorspronkelijke transactie.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl font-semibold text-stone-900">4. Uitzonderingen</h2>
        <p className="mt-2">
          We behouden ons het recht voor om terugbetaling te weigeren bij misbruik, fraude of aantoonbaar
          oneigenlijk gebruik van het beleid.
        </p>
      </section>
    </LegalPageLayout>
  );
}

export function ImprintPage() {
  return (
    <LegalPageLayout title="Imprint" updatedAt="26 februari 2026">
      <section>
        <h2 className="font-display text-xl font-semibold text-stone-900">1. Bedrijfsgegevens</h2>
        <p className="mt-2">
          SlowCarb wordt aangeboden door Boostd B.V.
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl font-semibold text-stone-900">2. Contact</h2>
        <p className="mt-2">
          E-mail: support@slowcarb.nl
        </p>
        <p className="mt-2">
          Website: www.eatslowcarb.com
        </p>
      </section>
      <section>
        <h2 className="font-display text-xl font-semibold text-stone-900">3. Juridische informatie</h2>
        <p className="mt-2">
          Voor aanvullende juridische of bedrijfsinformatie kun je contact opnemen via support@slowcarb.nl.
        </p>
      </section>
    </LegalPageLayout>
  );
}

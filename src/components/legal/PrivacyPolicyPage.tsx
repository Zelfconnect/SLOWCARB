import { LegalLayout } from '@/components/legal/LegalLayout';

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacybeleid"
      intro="We gaan zorgvuldig om met je gegevens. Hieronder lees je welke data we verwerken en waarom."
    >
      <section className="space-y-3">
        <h2>Welke data verzamelen we?</h2>
        <p>Tijdens onboarding vragen we alleen de gegevens die nodig zijn voor het gebruik van de app:</p>
        <ul>
          <li>Naam</li>
          <li>E-mailadres</li>
          <li>Gewicht</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2>Betalingen via Stripe</h2>
        <p>
          Voor betalingen gebruiken we Stripe. Betalingsgegevens worden verwerkt door Stripe volgens hun
          privacybeleid.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Wat we niet doen</h2>
        <ul>
          <li>Geen trackingcookies voor marketing of advertenties</li>
          <li>Geen verkoop van jouw persoonsgegevens aan derden</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2>Contact</h2>
        <p>
          Vragen over privacy? Mail ons via <a href="mailto:hello@slowcarb.nl">hello@slowcarb.nl</a>.
        </p>
      </section>
    </LegalLayout>
  );
}

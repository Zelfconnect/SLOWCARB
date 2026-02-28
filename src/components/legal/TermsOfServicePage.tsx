import { LegalLayout } from '@/components/legal/LegalLayout';

export default function TermsOfServicePage() {
  return (
    <LegalLayout
      title="Algemene voorwaarden"
      intro="Door SlowCarb te gebruiken ga je akkoord met deze voorwaarden."
    >
      <section className="space-y-3">
        <h2>Wat is SlowCarb?</h2>
        <p>
          SlowCarb is een PWA web-app met praktische begeleiding voor het volgen van de Slow Carb-methode. Na
          aankoop krijg je lifetime access tot de app voor persoonlijk gebruik.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Eenmalige betaling</h2>
        <p>
          Toegang tot SlowCarb wordt aangeboden via een eenmalige betaling. Er is geen maandabonnement of
          automatische verlenging.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Intellectueel eigendom</h2>
        <p>
          Alle inhoud, teksten, schema&apos;s en onderdelen van de app blijven eigendom van SlowCarb. Je mag de inhoud
          niet kopieren, verspreiden of commercieel hergebruiken zonder schriftelijke toestemming.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Aansprakelijkheid</h2>
        <p>
          SlowCarb biedt algemene informatie over voeding en leefstijl en is geen medisch advies. Raadpleeg bij
          klachten, twijfel of medische aandoeningen altijd een arts of andere gekwalificeerde zorgverlener.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Beeindiging</h2>
        <p>Bij misbruik, fraude of schending van deze voorwaarden kan toegang tot de app worden beeindigd.</p>
      </section>
    </LegalLayout>
  );
}

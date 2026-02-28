import { LegalLayout } from '@/components/legal/LegalLayout';

export default function RefundPolicyPage() {
  return (
    <LegalLayout title="Refundbeleid" intro="We bieden een 30 dagen geld-terug garantie. Geen vragen, geen gedoe.">
      <section className="space-y-3">
        <h2>30 dagen geld-terug garantie</h2>
        <p>Je kunt binnen 30 dagen na aankoop een volledige terugbetaling aanvragen.</p>
      </section>

      <section className="space-y-3">
        <h2>Geen vragen</h2>
        <p>We geloven in een laagdrempelig proces: je hoeft geen reden op te geven.</p>
      </section>

      <section className="space-y-3">
        <h2>Hoe vraag je een refund aan?</h2>
        <p>
          Stuur een e-mail naar <a href="mailto:hello@slowcarb.nl">hello@slowcarb.nl</a> met het e-mailadres waarmee
          je hebt gekocht.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Verwerkingstijd</h2>
        <p>Na je aanvraag verwerken we de refund binnen 5-7 werkdagen.</p>
      </section>
    </LegalLayout>
  );
}

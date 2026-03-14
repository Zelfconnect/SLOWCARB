const rules = [
  {
    number: 1,
    kicker: 'Regel 1 · De basis van vetverbranding',
    title: 'Vermijd "witte" koolhydraten',
    body: 'Geen brood, pasta, rijst, aardappelen of gebak. Klinkt heftig, maar als je ontdekt wat er wél mag, mis je het niet.',
    image: '/images/landing/regels/regel1-cutout-shadow.png',
    imageAlt: 'White Carbs',
    imageClass: 'scale-125 md:scale-150',
    maxW: 'max-w-[500px] md:max-w-[800px]',
    mediaLeft: true,
  },
  {
    number: 2,
    kicker: 'Regel 2 · Herhaling verslaat variatie',
    title: 'Eet steeds dezelfde maaltijden',
    body: 'Kies 3-4 maaltijden die je lekker vindt en eet ze op repeat. Klinkt saai, is het niet. Het neemt álle beslissingsstress weg. Variatie voeg je later toe.',
    image: '/images/landing/regels/regel2-cutout-shadow.png',
    imageAlt: 'Chili con carne',
    imageClass: 'scale-95 md:scale-105',
    maxW: 'max-w-[350px] md:max-w-[550px]',
    mediaLeft: false,
  },
  {
    number: 3,
    kicker: 'Regel 3 · Vloeibare suiker is onzichtbaar',
    title: 'Drink geen calorieën',
    body: 'Water, koffie (zwart), thee. Geen sap, geen frisdrank, geen havermelk-latte. Eén glas rode wijn per dag mag. De rest niet.',
    image: '/images/landing/regels/regel3-cutout-shadow.png',
    imageAlt: 'Cola glass',
    imageClass: 'scale-[1.65] md:scale-[1.9]',
    maxW: 'max-w-[500px] md:max-w-[750px]',
    mediaLeft: true,
    extraImageWrapper: 'mt-16 md:mt-24',
  },
  {
    number: 4,
    kicker: 'Regel 4 · Fructose is suiker in vermomming',
    title: 'Eet geen fruit',
    body: 'Ja, ook bananen en druiven. Fruit bevat fructose en dat remt vetverbranding. Avocado en tomaat mogen wél, die bevatten nauwelijks fructose.',
    image: '/images/landing/regels/regel4-cutout-shadow.png',
    imageAlt: 'Fruit',
    imageClass: 'scale-125 md:scale-150',
    maxW: 'max-w-[500px] md:max-w-[800px]',
    mediaLeft: false,
  },
  {
    number: 5,
    kicker: 'Regel 5 · De dag die het dieet laat werken',
    title: 'Eén cheatday per week',
    body: 'Elke week één dag alles eten. Alles. Dit is geen beloning maar een metabole reset. De leptin-spike voorkomt dat je lichaam in de spaarstand gaat. Tim Ferriss at 4.000+ kcal op zijn cheatdays en viel toch af.',
    image: '/images/landing/regels/regel5-cutout-shadow.png',
    imageAlt: 'Cheatday Junkfood',
    imageClass: 'scale-150 md:scale-[1.8]',
    maxW: 'max-w-[600px] md:max-w-[900px]',
    mediaLeft: true,
    isLast: true,
  },
];

export function RulesSection() {
  return (
    <section id="method" className="py-24 bg-surface-paper overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-20 scroll-animate">
          <h2 className="text-4xl md:text-5xl font-bold font-display text-ink-strong mb-6 tracking-tight">De 5 regels. Dat is alles.</h2>
          <p className="editorial-body text-ink-body max-w-2xl mx-auto">Geen schema&apos;s, geen fases, geen uitzonderingen doordeweeks. Vijf regels volgen, één dag per week vrij.</p>
        </div>

        {rules.map((rule) => (
          <div
            key={rule.number}
            className={`grid md:grid-cols-2 gap-16 md:gap-32 items-center ${rule.isLast ? 'mb-16 md:mb-24' : 'mb-32 md:mb-48'} scroll-animate`}
          >
            <div className={`${rule.mediaLeft ? 'order-2 md:order-1' : 'order-1 md:order-1'} relative flex justify-center ${rule.extraImageWrapper ?? ''}`}>
              <img
                src={rule.image}
                alt={rule.imageAlt}
                className={`w-full ${rule.maxW} h-auto object-contain drop-shadow-2xl ${rule.imageClass}`}
                loading="lazy"
              />
            </div>
            <div className={`${rule.mediaLeft ? 'order-1 md:order-2' : 'order-2 md:order-2'} text-center md:text-left z-10`}>
              <span className="editorial-kicker text-ink-strong mb-3 block">{rule.kicker}</span>
              <h3 className="text-4xl md:text-5xl font-bold font-display text-ink-strong mb-6 leading-tight">{rule.title}</h3>
              <p className="editorial-body text-ink-body">{rule.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

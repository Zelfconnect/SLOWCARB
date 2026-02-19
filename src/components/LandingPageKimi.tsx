import { useEffect, useRef, useState } from 'react';
import { 
  ChefHat, 
  Smartphone, 
  ShoppingCart, 
  BookOpen, 
  PartyPopper, 
  TrendingUp,
  Check,
  ChevronDown,
  ArrowRight,
  RotateCcw,
  Calculator,
  Clock,
  WheatOff,
  Egg,
  GlassWater,
  Apple,
  Bean,
  Quote
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Animation hook using Intersection Observer
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// Animated section wrapper
function AnimatedSection({ 
  children, 
  className = '',
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
}

// FAQ Accordion Item
function FaqItem({ question, answer, isOpen, onClick }: { 
  question: string; 
  answer: string; 
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-b border-stone-200 last:border-0">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="font-display font-semibold text-stone-800 text-lg pr-4 group-hover:text-sage-700 transition-colors">
          {question}
        </span>
        <ChevronDown 
          className={`w-5 h-5 text-stone-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-out ${isOpen ? 'max-h-48 opacity-100 pb-5' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-stone-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ 
  icon: Icon, 
  title, 
  description,
  delay = 0 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  delay?: number;
}) {
  return (
    <AnimatedSection delay={delay}>
      <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-card hover:shadow-card-hover transition-all duration-300 h-full group">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sage-100 to-sage-50 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
          <Icon className="w-6 h-6 text-sage-700" strokeWidth={2} />
        </div>
        <h3 className="font-display font-semibold text-stone-800 text-lg mb-2">{title}</h3>
        <p className="text-stone-600 text-sm leading-relaxed">{description}</p>
      </div>
    </AnimatedSection>
  );
}

// Rule Card Component
function RuleCard({ 
  number, 
  icon: Icon, 
  title, 
  description,
  delay = 0 
}: { 
  number: number;
  icon: React.ElementType; 
  title: string; 
  description: string;
  delay?: number;
}) {
  return (
    <AnimatedSection delay={delay}>
      <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-card hover:shadow-card-hover transition-all duration-300 group">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sage-600 text-white flex items-center justify-center font-display font-bold text-sm">
            {number}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-5 h-5 text-sage-600" strokeWidth={2} />
              <h3 className="font-display font-semibold text-stone-800">{title}</h3>
            </div>
            <p className="text-stone-600 text-sm leading-relaxed">{description}</p>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

// Pain Point Card
function PainPointCard({ 
  icon: Icon, 
  text,
  delay = 0 
}: { 
  icon: React.ElementType; 
  text: string;
  delay?: number;
}) {
  return (
    <AnimatedSection delay={delay}>
      <div className="flex items-center gap-4 bg-stone-50 rounded-xl p-4 border border-stone-100">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-soft flex-shrink-0">
          <Icon className="w-5 h-5 text-clay-600" strokeWidth={2} />
        </div>
        <p className="text-stone-700 font-medium text-sm">{text}</p>
      </div>
    </AnimatedSection>
  );
}

// Testimonial Card
function TestimonialCard({ 
  quote, 
  name, 
  result,
  delay = 0 
}: { 
  quote: string; 
  name: string; 
  result: string;
  delay?: number;
}) {
  return (
    <AnimatedSection delay={delay}>
      <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-card h-full">
        <Quote className="w-8 h-8 text-sage-200 mb-4" strokeWidth={2} />
        <p className="text-stone-700 leading-relaxed mb-6 italic">"{quote}"</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display font-semibold text-stone-800">{name}</p>
            <p className="text-sage-600 text-sm font-medium">{result}</p>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

export default function LandingPageKimi() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  const faqs = [
    {
      question: "Is dit veilig?",
      answer: "Ja, absoluut. Het slow-carb dieet is gebaseerd op volwaardige voeding zoals eieren, groenten, peulvruchten en mager vlees. Het is geen crashdieet — je eet gewoon voedzame maaltijden die je langer verzadigen."
    },
    {
      question: "Wat mag ik op een cheatday?",
      answer: "Alles! De cheatday is essentieel voor het protocol. Op zaterdag (of jouw gekozen dag) eet je wat je wilt — pizza, ijs, chips. Dit reset je stofwisseling en maakt het dieet mentaal haalbaar."
    },
    {
      question: "Moet ik calorieën tellen?",
      answer: "Nee. Dat is precies het punt van SlowCarb. Je volgt de 5 simpele regels en eet tot je verzadigd bent. Geen apps, geen weegschalen, geen gestres over cijfers."
    },
    {
      question: "Hoe lang heb ik toegang?",
      answer: "Levenslang. Je betaalt één keer en krijgt voor altijd toegang tot alle recepten, de boodschappenlijst, en toekomstige updates. Geen verborgen kosten."
    },
    {
      question: "Wat als het niet werkt?",
      answer: "We bieden een 30-dagen-geld-terug-garantie. Als je niet tevreden bent, stuur ons een mailtje en je krijgt het volledige bedrag terug. Geen vragen gesteld."
    }
  ];

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sage-600 via-sage-600 to-sage-700" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-32 md:pb-40">
          <AnimatedSection>
            <div className="text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-6 backdrop-blur-sm border border-white/10">
                🎯 Gebaseerd op het 4-Hour Body protocol
              </span>
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 text-shadow">
                8-10 kg kwijt<br />in 6 weken
              </h1>
              <p className="text-xl md:text-2xl text-sage-100 max-w-2xl mx-auto mb-10 leading-relaxed">
                Geen calorie-tellen. Geen bullshit. Gewoon eten wat werkt.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                <Button
                  onClick={scrollToPricing}
                  size="xl"
                  className="bg-white text-sage-700 hover:bg-stone-50 shadow-elevated rounded-xl px-8 text-lg font-semibold h-14"
                >
                  Start nu — €49 lifetime
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
              
              <p className="text-sage-200 text-sm font-medium">
                Eenmalige betaling • Geen abonnement • Direct toegang
              </p>
            </div>
          </AnimatedSection>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#FAFAF9"/>
          </svg>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-12">
            <span className="text-clay-600 font-medium text-sm uppercase tracking-wider">Herkenbaar?</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-stone-800 mt-2">
              Dienen die het altijd over een nieuw dieet hebben
            </h2>
          </div>
        </AnimatedSection>
        
        <div className="grid md:grid-cols-3 gap-4 mb-16">
          <PainPointCard 
            icon={RotateCcw}
            text="Elke maandag opnieuw beginnen met een dieet"
            delay={100}
          />
          <PainPointCard 
            icon={Calculator}
            text="Calorie-apps die het erger maken dan het probleem"
            delay={200}
          />
          <PainPointCard 
            icon={Clock}
            text="Geen tijd om elke dag te bedenken wat je eet"
            delay={300}
          />
        </div>
        
        <AnimatedSection>
          <div className="bg-gradient-to-br from-sage-50 to-stone-50 rounded-3xl p-8 md:p-12 border border-sage-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-sage-600 flex items-center justify-center">
                <Check className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
              <h3 className="font-display text-2xl font-bold text-stone-800">SlowCarb is anders.</h3>
            </div>
            <p className="text-stone-600 text-lg leading-relaxed max-w-3xl">
              Geen calorieën tellen, geen honger, geen verwarring. Gewoon 5 simpele regels die je leven veranderen. 
              Onze gebruikers verliezen gemiddeld 8-10 kg in de eerste 6 weken — zonder de sportschool te zien.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* The 5 Rules Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12">
              <span className="text-sage-600 font-medium text-sm uppercase tracking-wider">De Methode</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-stone-800 mt-2">
                De 5 Regels
              </h2>
              <p className="text-stone-600 mt-4 max-w-2xl mx-auto">
                Dat is alles. Geen ingewikkelde berekeningen, geen dure supplementen.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <RuleCard 
              number={1}
              icon={WheatOff}
              title="Geen witte koolhydraten"
              description="Geen brood, pasta, rijst, aardappelen of suiker. Geen uitzonderingen tijdens de week."
              delay={100}
            />
            <RuleCard 
              number={2}
              icon={Egg}
              title="30g eiwit binnen 30 min"
              description="Eet binnen 30 minuten na opstaan minimaal 30 gram eiwit voor een kickstart van je metabolisme."
              delay={200}
            />
            <RuleCard 
              number={3}
              icon={GlassWater}
              title="Geen vloeibare calorieën"
              description="Drink water, koffie en thee. Geen frisdrank, vruchtensap, melk of alcohol (behalve op cheatday)."
              delay={300}
            />
            <RuleCard 
              number={4}
              icon={Apple}
              title="Geen fruit"
              description="Fructose remt vetverbranding. Avocado en tomaat zijn wel toegestaan in beperkte hoeveelheden."
              delay={400}
            />
            <RuleCard 
              number={5}
              icon={Bean}
              title="Peulvruchten bij elke maaltijd"
              description="Bonen, linzen en kikkererwten geven langdurige energie en houden je verzadigd."
              delay={500}
            />
            <AnimatedSection delay={600}>
              <div className="bg-gradient-to-br from-clay-500 to-clay-600 rounded-2xl p-6 text-white h-full flex flex-col justify-center">
                <PartyPopper className="w-8 h-8 mb-4 opacity-80" />
                <h3 className="font-display font-bold text-xl mb-2">+ De Cheatday</h3>
                <p className="text-clay-100 text-sm leading-relaxed">
                  Één dag per week eet je wat je wilt. Dit is niet optioneel — het reset je hormonen en houdt het volhoudbaar.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-12">
            <span className="text-sage-600 font-medium text-sm uppercase tracking-wider">Wat je krijgt</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-stone-800 mt-2">
              Alles wat je nodig hebt
            </h2>
            <p className="text-stone-600 mt-4 max-w-2xl mx-auto">
              Geen extra apps, geen dure coaches. Gewoon een compleet systeem dat werkt.
            </p>
          </div>
        </AnimatedSection>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCard 
            icon={ChefHat}
            title="35+ recepten"
            description="Ontbijt, lunch, diner en snacks — allemaal getest, allemaal lekker, allemaal binnen 20 minuten klaar."
            delay={100}
          />
          <FeatureCard 
            icon={Smartphone}
            title="Werkt als een app"
            description="Voeg SlowCarb toe aan je homescreen. Geen download uit de app store nodig."
            delay={200}
          />
          <FeatureCard 
            icon={ShoppingCart}
            title="Slimme boodschappenlijst"
            description="Genereer automatisch je boodschappenlijst voor de week. Gegroepeerd per winkelafdeling."
            delay={300}
          />
          <FeatureCard 
            icon={BookOpen}
            title="Wekelijkse educatie"
            description="Begrijp de wetenschap achter het protocol. Waarom werkt het? Wat gebeurt er in je lichaam?"
            delay={400}
          />
          <FeatureCard 
            icon={PartyPopper}
            title="Cheatday protocol"
            description="De complete handleiding voor jouw cheatday — inclusief tips om schade te beperken."
            delay={500}
          />
          <FeatureCard 
            icon={TrendingUp}
            title="Voortgang tracking"
            description="Houd je gewicht en meetingen bij. Zie visueel hoe je lichaam verandert."
            delay={600}
          />
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-stone-50">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12">
              <span className="text-sage-600 font-medium text-sm uppercase tracking-wider">Resultaten</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-stone-800 mt-2">
                Wat gebruikers zeggen
              </h2>
            </div>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard 
              quote="Ik heb 5 jaar geprobeerd om af te vallen. Met SlowCarb lukte het in 6 weken. Het voelde niet eens als dieeten."
              name="Mark de Vries"
              result="-9 kg in 5 weken"
              delay={100}
            />
            <TestimonialCard 
              quote="Eindelijk geen geklooi meer met calorieën. Ik eet mezelf vol en val nog steeds af. De cheatday maakt het vol te houden."
              name="Lisa van den Berg"
              result="-11 kg in 8 weken"
              delay={200}
            />
            <TestimonialCard 
              quote="De recepten zijn simpel en snel. Als drukke ondernemer heb ik geen tijd voor ingewikkeld gedoe. Dit werkt perfect."
              name="Thomas Jansen"
              result="-7 kg in 6 weken"
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <AnimatedSection>
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-elevated">
              <div className="text-center mb-8">
                <span className="inline-block px-3 py-1 rounded-full bg-sage-100 text-sage-700 text-sm font-medium mb-4">
                  Limited time offer
                </span>
                <h3 className="font-display text-2xl font-bold text-stone-800 mb-2">
                  SlowCarb Lifetime Access
                </h3>
                <p className="text-stone-600 text-sm">Eenmalige betaling, levenslange toegang</p>
              </div>
              
              <div className="flex items-baseline justify-center gap-3 mb-8">
                <span className="text-3xl font-display font-semibold text-stone-400 line-through">€79</span>
                <span className="text-5xl font-display font-bold text-stone-800">€49</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                {[
                  "35+ slow-carb recepten",
                  "Slimme boodschappenlijst",
                  "Voortgang tracking",
                  "Wekelijkse educatie",
                  "Cheatday protocol",
                  "Toekomstige updates",
                  "30 dagen geld-terug garantie"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-sage-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-sage-600" strokeWidth={3} />
                    </div>
                    <span className="text-stone-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                onClick={scrollToPricing}
                size="xl"
                className="w-full bg-sage-600 hover:bg-sage-700 text-white rounded-xl h-14 text-lg font-semibold shadow-soft"
              >
                Direct toegang →
              </Button>
              
              <p className="text-center text-stone-500 text-sm mt-4">
                30 dagen geld-terug garantie
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-2xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12">
              <span className="text-sage-600 font-medium text-sm uppercase tracking-wider">Veelgestelde vragen</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-stone-800 mt-2">
                FAQ
              </h2>
            </div>
          </AnimatedSection>
          
          <AnimatedSection>
            <div className="bg-stone-50 rounded-2xl p-6 md:p-8 border border-stone-100">
              {faqs.map((faq, index) => (
                <FaqItem 
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFaq === index}
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sage-700 to-sage-800" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <AnimatedSection>
            <div className="text-center">
              <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6 text-shadow">
                Klaar om te beginnen?
              </h2>
              <p className="text-xl text-sage-200 mb-10 max-w-xl mx-auto">
                Join 500+ mensen die hun lichaam al hebben getransformeerd met SlowCarb.
              </p>
              
              <Button
                onClick={scrollToPricing}
                size="xl"
                className="bg-white text-sage-700 hover:bg-stone-50 shadow-elevated rounded-xl px-10 text-lg font-semibold h-14"
              >
                Start nu — €49 lifetime
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sage-300 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>500+ recepten bekeken</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Direct toegang</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Geen abonnement</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">© 2025 SlowCarb. Alle rechten voorbehouden.</p>
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Voorwaarden</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

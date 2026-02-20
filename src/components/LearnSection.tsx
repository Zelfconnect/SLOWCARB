import { createElement, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FlaskConical,
  HelpCircle,
  PartyPopper,
  Target,
  XCircle,
  Zap,
} from 'lucide-react';
import { ruleCards, conceptCards, faqCards, yesNoList, commonMistakes } from '@/data/education';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ConceptCard } from './education/ConceptCard';
import { RuleCard } from './education/RuleCard';
import { FAQCard } from './education/FAQCard';
import type { EducationCard } from '@/types';
import { getEducationIcon } from '@/lib/educationIcons';

function renderEducationIcon(iconKey: string, className: string) {
  const IconComponent = getEducationIcon(iconKey as Parameters<typeof getEducationIcon>[0]);
  if (!IconComponent) {
    return <HelpCircle className={className} aria-hidden="true" />;
  }

  return createElement(IconComponent, { className, 'aria-hidden': true });
}

// Card preview component for the list view
// Gebruikt semantisch type-based styling systeem
function CardPreview({
  card,
  onClick
}: {
  card: EducationCard;
  onClick: () => void;
}) {
  const isRule = card.type === 'rule';

  // Type-based styling - geen hardcoded colors meer!
  // Rule = groen, Concept = neutraal, FAQ/Reference = neutraal
  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'rule':
        // Match CompactRecipeCard style: white bg, specific shadow, no border
        return 'bg-white border-transparent shadow-[0_6px_18px_rgba(47,94,63,0.08)] hover:shadow-[0_10px_24px_rgba(47,94,63,0.14)]';
      case 'concept':
        return 'from-stone-100 to-stone-50 border-stone-200 shadow-[0_8px_20px_-16px_rgba(30,41,59,0.35)] hover:border-stone-300';
      case 'faq':
      case 'reference':
        return 'from-stone-100 to-stone-50 border-stone-200 shadow-[0_8px_20px_-16px_rgba(30,41,59,0.35)] hover:border-stone-300';
      default:
        return 'from-stone-100 to-stone-50 border-stone-200';
    }
  };

  // Type label voor visuele consistentie
  const getTypeLabel = () => {
    switch (card.type) {
      case 'rule':
        return 'Regel';
      case 'concept':
        return 'Concept';
      case 'faq':
        return 'FAQ';
      default:
        return '';
    }
  };

  const getSubtitle = () => {
    if (card.type === 'rule') {
      const ruleCard = card as Extract<typeof card, { type: 'rule' }>;
      if (ruleCard.ruleNumber && ruleCard.ruleNumber > 0) {
        return `Regel #${ruleCard.ruleNumber} van 5`;
      }
    }
    if (card.type === 'concept') {
      const conceptCard = card as Extract<typeof card, { type: 'concept' }>;
      return conceptCard.subtitle;
    }
    return getTypeLabel();
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full rounded-2xl text-left transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400/60',
        // Rules don't use border-2, others do
        isRule ? '' : 'border-2 bg-gradient-to-br',
        getTypeStyle(card.type)
      )}
    >
      <div className={cn("flex items-center gap-3", isRule ? "px-3.5 py-3" : "p-4")}>
        <div className={cn(
          "flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-[1.03]",
          isRule 
            ? "w-10 h-10 rounded-full bg-sage-100" 
            : "w-12 h-12 rounded-xl bg-white/80 shadow-sm text-2xl"
        )}>
          {renderEducationIcon(
            card.icon, 
            isRule ? 'w-5 h-5 text-sage-600' : 'w-6 h-6 text-stone-600'
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-display font-semibold leading-tight transition-colors",
            isRule ? "text-stone-800 text-sm group-hover:text-sage-700" : "text-stone-800"
          )}>
            {card.title}
          </h3>
          {getSubtitle() && (
            <p className={cn(
              "mt-0.5",
              isRule ? "text-xs text-stone-500" : "text-sm text-stone-600"
            )}>{getSubtitle()}</p>
          )}
        </div>
        <ChevronRight className={cn(
          "transition-transform flex-shrink-0",
          isRule ? "w-4 h-4 text-stone-300 group-hover:text-sage-500" : "w-5 h-5 text-stone-500 group-hover:translate-x-1"
        )} />
      </div>
    </button>
  );
}

export function LearnSection() {
  const [openCardId, setOpenCardId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'quickstart' | 'science' | 'faq'>('quickstart');

  // Find the currently open card
  const openCard = openCardId
    ? [...ruleCards, ...conceptCards, ...faqCards].find(c => c.id === openCardId)
    : null;

  return (
  <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'quickstart' | 'science' | 'faq')}>
      {/* Tabs */}
      <TabsList className="mb-4 h-auto w-full rounded-2xl bg-stone-100 p-1.5">
        <TabsTrigger value="quickstart" className="flex-1 gap-2 rounded-xl px-4 py-2.5 text-stone-500 data-[state=active]:bg-white data-[state=active]:text-sage-700 data-[state=active]:shadow-soft">
          <Zap className="w-4 h-4" />Quick Start
        </TabsTrigger>
        <TabsTrigger value="science" className="flex-1 gap-2 rounded-xl px-4 py-2.5 text-stone-500 data-[state=active]:bg-white data-[state=active]:text-sage-700 data-[state=active]:shadow-soft">
          <FlaskConical className="w-4 h-4" />Wetenschap
        </TabsTrigger>
        <TabsTrigger value="faq" className="flex-1 gap-2 rounded-xl px-4 py-2.5 text-stone-500 data-[state=active]:bg-white data-[state=active]:text-sage-700 data-[state=active]:shadow-soft">
          <HelpCircle className="w-4 h-4" />FAQ
        </TabsTrigger>
      </TabsList>

      <TabsContent value="quickstart" className="pb-4">
        <div className="space-y-5">
          {/* Progress Indicator */}
          <div className="rounded-2xl bg-gradient-to-br from-sage-600 to-sage-700 p-6 text-white shadow-soft">
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-6 h-6" />
              <h2 className="font-display font-semibold text-lg">Jouw Startplan</h2>
            </div>
            <p className="text-sage-100 text-sm mb-4">
              Doorloop de 5 regels om het dieet te begrijpen. Klik op een regel voor de volledige uitleg.
            </p>
          </div>

          {/* The 5 Rules */}
          <div className="space-y-4 rounded-3xl border border-sage-100 bg-gradient-to-b from-white to-sage-50/40 p-5 shadow-soft">
            <h2 className="text-lg font-semibold text-stone-800 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-sage-600" />
              De 5 Regels
            </h2>
            {ruleCards
              .filter(card => card.type === 'rule' && (card as Extract<typeof card, { type: 'rule' }>).ruleNumber && (card as Extract<typeof card, { type: 'rule' }>).ruleNumber! > 0)
              .sort((a, b) => ((a as Extract<typeof a, { type: 'rule' }>).ruleNumber || 0) - ((b as Extract<typeof b, { type: 'rule' }>).ruleNumber || 0))
              .map((card) => (
                <CardPreview
                  key={card.id}
                  card={card}
                  onClick={() => setOpenCardId(card.id)}
                />
              ))}
          </div>

          {/* 30/30 Rule */}
          <div className="rounded-2xl bg-gradient-to-br from-sage-600 to-sage-700 p-6 text-white shadow-soft">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
                <Zap className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-lg">De 30/30 Regel</h2>
                <p className="text-sage-100 text-sm">De gouden regel voor ontbijt</p>
              </div>
            </div>
            <p className="text-white/90 mb-4">
              Eet 30 gram eiwit binnen 30 minuten na het opstaan.
            </p>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-sm font-medium text-white mb-2">Waarom dit werkt:</p>
              <ul className="space-y-1">
                <li className="text-sm text-white/80 flex items-start gap-2">
                  <span className="text-sage-200">•</span>Stopt spierafbraak
                </li>
                <li className="text-sm text-white/80 flex items-start gap-2">
                  <span className="text-sage-200">•</span>Stabiliseert bloedsuiker
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-sm font-medium text-white mb-2">Voorbeelden:</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-white/20 text-white px-3 py-1.5 rounded-full font-medium">
                  3-4 eieren
                </span>
                <span className="text-xs bg-white/20 text-white px-3 py-1.5 rounded-full font-medium">
                  250g Hüttenkäse
                </span>
              </div>
            </div>
          </div>

          {/* Quick Reference */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-3 text-stone-800 flex items-center gap-2">
              <Zap className="w-5 h-5 text-sage-600" />
              Quick Reference
            </h2>
            
            {/* YES List */}
            <div className="rounded-2xl border border-sage-200 bg-gradient-to-br from-sage-50 to-sage-100/30 p-5 shadow-soft">
              <h3 className="mb-4 flex items-center gap-2 font-display font-semibold text-sage-900">
                <CheckCircle2 className="w-5 h-5" />
                JA - Eet onbeperkt
              </h3>
              <div className="grid grid-cols-1 min-[460px]:grid-cols-2 gap-2.5">
                {yesNoList.yes.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2.5 text-sm text-sage-800">
                    {renderEducationIcon(item.icon, 'w-5 h-5 text-sage-700')}
                    <span className="leading-tight font-medium">{item.item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* NO List */}
            <div className="rounded-2xl border border-clay-200 bg-gradient-to-br from-clay-50 to-clay-100/30 p-5 shadow-soft">
              <h3 className="mb-4 flex items-center gap-2 font-display font-semibold text-clay-900">
                <XCircle className="w-5 h-5" />
                NEE - Vermijden
              </h3>
              <div className="grid grid-cols-1 min-[460px]:grid-cols-2 gap-2.5">
                {yesNoList.no.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2.5 text-sm text-clay-800">
                    {renderEducationIcon(item.icon, 'w-5 h-5 text-clay-700')}
                    <span className="leading-tight font-medium">{item.item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CHEAT DAY */}
            <div className="rounded-2xl border border-stone-200 bg-gradient-to-br from-stone-50 to-stone-100/40 p-5 shadow-soft">
              <h3 className="mb-4 flex items-center gap-2 font-display font-semibold text-stone-900">
                <PartyPopper className="w-5 h-5" />
                CHEAT DAY
              </h3>
              <div className="grid grid-cols-1 min-[460px]:grid-cols-2 gap-2.5">
                {yesNoList.cheat.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2.5 text-sm text-stone-800">
                    {renderEducationIcon(item.icon, 'w-5 h-5 text-stone-700')}
                    <span className="leading-tight font-medium">{item.item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="rounded-2xl border border-stone-200 bg-gradient-to-br from-stone-50 to-stone-100/40 p-5 shadow-soft">
            <h3 className="text-lg font-semibold mb-3 text-stone-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />Veelgemaakte Fouten
            </h3>
            <div className="space-y-3">
              {commonMistakes.slice(0, 4).map((mistake, idx) => (
                <div key={idx} className="rounded-xl bg-white/75 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    {renderEducationIcon(mistake.icon, 'w-5 h-5 text-stone-500')}
                    <p className="font-medium text-stone-800 text-sm">{mistake.mistake}</p>
                  </div>
                  <p className="text-stone-600 text-xs ml-7">{mistake.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="science" className="pb-4">
        <div className="space-y-5">
          {/* Intro */}
          <div className="bg-gradient-to-br from-stone-700 to-stone-800 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-3 mb-3">
              <FlaskConical className="w-6 h-6" />
              <h2 className="font-display font-semibold text-lg">De Wetenschap</h2>
            </div>
            <p className="text-stone-300 text-sm">
              Begrijp waarom dit werkt. Klik op een topic voor de volledige uitleg.
            </p>
          </div>

          {/* Science Topics */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-3 text-stone-800 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-stone-600" />
              Onderwerpen
            </h2>
            {conceptCards.map((card) => (
              <CardPreview
                key={card.id}
                card={card}
                onClick={() => setOpenCardId(card.id)}
              />
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="faq" className="pb-4">
        <div className="space-y-5">
          {/* Intro */}
          <div className="bg-gradient-to-br from-sage-600 to-sage-700 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-3 mb-3">
              <HelpCircle className="w-6 h-6" />
              <h2 className="font-display font-semibold text-lg">Veelgestelde Vragen</h2>
            </div>
            <p className="text-sage-100 text-sm">
              Antwoorden op de meest voorkomende vragen over dit protocol.
            </p>
          </div>

          {/* FAQ Cards */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-3 text-stone-800 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-sage-600" />
              Veelgestelde Vragen
            </h2>
            {faqCards.map((card) => (
              <CardPreview
                key={card.id}
                card={card}
                onClick={() => setOpenCardId(card.id)}
              />
            ))}
          </div>
        </div>
      </TabsContent>
      </Tabs>

      {/* Render the appropriate card modal */}
      {openCard && openCard.type === 'concept' && (
        <ConceptCard
          card={openCard}
          isOpen={true}
          onClose={() => setOpenCardId(null)}
          onOpenRelated={(id) => setOpenCardId(id)}
        />
      )}
      {openCard && openCard.type === 'rule' && (
        <RuleCard
          card={openCard}
          isOpen={true}
          onClose={() => setOpenCardId(null)}
        />
      )}
      {openCard && openCard.type === 'faq' && (
        <FAQCard
          card={openCard}
          isOpen={true}
          onClose={() => setOpenCardId(null)}
        />
      )}
    </div>
  );
}

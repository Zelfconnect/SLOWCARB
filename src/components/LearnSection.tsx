import { useState } from 'react';
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
import { ConceptCard } from './education/ConceptCard';
import { RuleCard } from './education/RuleCard';
import { FAQCard } from './education/FAQCard';
import type { EducationCard } from '@/types';
import { getEducationIcon } from '@/lib/educationIcons';

const learnTabs = [
  { id: 'quick', label: 'Quick Start', icon: Zap },
  { id: 'science', label: 'Wetenschap', icon: FlaskConical },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
];

// Card preview component for the list view
// Gebruikt semantisch type-based styling systeem
function CardPreview({
  card,
  onClick
}: {
  card: EducationCard;
  onClick: () => void;
}) {
  // Type-based styling - geen hardcoded colors meer!
  // Rule = groen, Concept = neutraal, FAQ/Reference = neutraal
  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'rule':
        return 'from-sage-100 to-sage-50 border-sage-200 hover:border-sage-300';
      case 'concept':
        return 'from-stone-100 to-stone-50 border-stone-200 hover:border-stone-300';
      case 'faq':
      case 'reference':
        return 'from-stone-100 to-stone-50 border-stone-200 hover:border-stone-300';
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
        'w-full p-4 rounded-2xl border-2 bg-gradient-to-br text-left transition-all duration-200 hover:shadow-md group',
        getTypeStyle(card.type)
      )}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-white/70 flex items-center justify-center text-2xl shadow-sm">
          {(() => {
            const Icon = getEducationIcon(card.icon) ?? HelpCircle;
            return <Icon className="w-6 h-6 text-stone-600" aria-hidden="true" />;
          })()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-stone-800 leading-tight">
            {card.title}
          </h3>
          {getSubtitle() && (
            <p className="text-sm text-stone-500 mt-0.5">{getSubtitle()}</p>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-stone-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
      </div>
    </button>
  );
}

export function LearnSection() {
  const [activeTab, setActiveTab] = useState('quick');
  const [openCardId, setOpenCardId] = useState<string | null>(null);

  // Find the currently open card
  const openCard = openCardId 
    ? [...ruleCards, ...conceptCards, ...faqCards].find(c => c.id === openCardId)
    : null;

  return (
    <div className="space-y-6 pb-24">
      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-stone-100 rounded-2xl">
        {learnTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex-1',
                activeTab === tab.id ? 'bg-white text-sage-700 shadow-soft' : 'text-stone-500 hover:text-stone-700'
              )}
            >
              <Icon className="w-4 h-4" />{tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'quick' && (
        <div className="space-y-5">
          {/* Progress Indicator */}
          <div className="bg-gradient-to-br from-sage-600 to-sage-700 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-6 h-6" />
              <h2 className="font-display font-semibold text-lg">Jouw Slow-Carb Journey</h2>
            </div>
            <p className="text-sage-100 text-sm mb-4">
              Doorloop de 5 regels om het dieet te begrijpen. Klik op een regel voor de volledige uitleg.
            </p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((num) => (
                <div 
                  key={num}
                  className="h-2 flex-1 rounded-full bg-white/30"
                />
              ))}
            </div>
          </div>

          {/* The 5 Rules */}
          <div className="space-y-3">
            <h2 className="font-display font-semibold text-stone-800 text-lg flex items-center gap-2">
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
          <div className="rounded-2xl p-5 bg-gradient-to-br from-sage-600 to-sage-700 text-white">
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
          <div className="space-y-3">
            <h2 className="font-display font-semibold text-stone-800 text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-sage-600" />
              Quick Reference
            </h2>
            
            {/* YES List */}
            <div className="rounded-2xl p-5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200">
              <h3 className="font-display font-semibold text-emerald-900 flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5" />
                JA - Eet onbeperkt
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {yesNoList.yes.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-emerald-800 bg-white/60 rounded-lg p-2">
                    {(() => {
                      const Icon = getEducationIcon(item.icon) ?? HelpCircle;
                      return <Icon className="w-5 h-5 text-emerald-700" aria-hidden="true" />;
                    })()}
                    <span className="leading-tight font-medium">{item.item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* NO List */}
            <div className="rounded-2xl p-5 bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200">
              <h3 className="font-display font-semibold text-red-900 flex items-center gap-2 mb-4">
                <XCircle className="w-5 h-5" />
                NEE - Vermijden
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {yesNoList.no.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-red-800 bg-white/60 rounded-lg p-2">
                    {(() => {
                      const Icon = getEducationIcon(item.icon) ?? HelpCircle;
                      return <Icon className="w-5 h-5 text-red-700" aria-hidden="true" />;
                    })()}
                    <span className="leading-tight font-medium">{item.item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CHEAT DAY */}
            <div className="rounded-2xl p-5 bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200">
              <h3 className="font-display font-semibold text-purple-900 flex items-center gap-2 mb-4">
                <PartyPopper className="w-5 h-5" />
                CHEAT DAY
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {yesNoList.cheat.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-purple-800 bg-white/60 rounded-lg p-2">
                    {(() => {
                      const Icon = getEducationIcon(item.icon) ?? HelpCircle;
                      return <Icon className="w-5 h-5 text-purple-700" aria-hidden="true" />;
                    })()}
                    <span className="leading-tight font-medium">{item.item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="rounded-2xl p-5 bg-gradient-to-br from-stone-50 to-stone-100/50 border border-stone-200">
            <h3 className="font-display font-semibold text-stone-800 flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5" />Veelgemaakte Fouten
            </h3>
            <div className="space-y-3">
              {commonMistakes.slice(0, 4).map((mistake, idx) => (
                <div key={idx} className="bg-white/60 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    {(() => {
                      const Icon = getEducationIcon(mistake.icon) ?? HelpCircle;
                      return <Icon className="w-5 h-5 text-stone-500" aria-hidden="true" />;
                    })()}
                    <p className="font-medium text-stone-800 text-sm">{mistake.mistake}</p>
                  </div>
                  <p className="text-stone-600 text-xs ml-7">{mistake.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'science' && (
        <div className="space-y-5">
          {/* Intro */}
          <div className="bg-gradient-to-br from-stone-700 to-stone-800 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-3 mb-3">
              <FlaskConical className="w-6 h-6" />
              <h2 className="font-display font-semibold text-lg">De Wetenschap</h2>
            </div>
            <p className="text-stone-300 text-sm">
              Begrijp waarom Slow-Carb werkt. Klik op een topic voor de volledige uitleg.
            </p>
          </div>

          {/* Science Topics */}
          <div className="space-y-3">
            {conceptCards.map((card) => (
              <CardPreview
                key={card.id}
                card={card}
                onClick={() => setOpenCardId(card.id)}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'faq' && (
        <div className="space-y-5">
          {/* Intro */}
          <div className="bg-gradient-to-br from-sage-600 to-sage-700 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-3 mb-3">
              <HelpCircle className="w-6 h-6" />
              <h2 className="font-display font-semibold text-lg">Veelgestelde Vragen</h2>
            </div>
            <p className="text-sage-100 text-sm">
              Antwoorden op de meest voorkomende vragen over Slow-Carb.
            </p>
          </div>

          {/* FAQ Cards */}
          <div className="space-y-3">
            {faqCards.map((card) => (
              <CardPreview
                key={card.id}
                card={card}
                onClick={() => setOpenCardId(card.id)}
              />
            ))}
          </div>
        </div>
      )}

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

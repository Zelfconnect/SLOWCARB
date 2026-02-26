import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LearnSection } from '@/components/LearnSection';

vi.mock('@/components/ui/tabs', async () => {
  const ReactModule = await import('react');
  const TabsContext = ReactModule.createContext<{
    value: string;
    setValue: (next: string) => void;
  } | null>(null);

  function Tabs({
    value,
    onValueChange,
    children,
  }: {
    value: string;
    onValueChange: (next: string) => void;
    children: React.ReactNode;
  }) {
    return <TabsContext.Provider value={{ value, setValue: onValueChange }}>{children}</TabsContext.Provider>;
  }

  function TabsList({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
  }

  function TabsTrigger({
    value,
    children,
  }: {
    value: string;
    children: React.ReactNode;
  }) {
    const context = ReactModule.useContext(TabsContext);
    return (
      <button role="tab" type="button" onClick={() => context?.setValue(value)}>
        {children}
      </button>
    );
  }

  function TabsContent({
    value,
    children,
  }: {
    value: string;
    children: React.ReactNode;
  }) {
    const context = ReactModule.useContext(TabsContext);
    if (!context || context.value !== value) {
      return null;
    }
    return <div>{children}</div>;
  }

  return {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
  };
});

vi.mock('@/data/education', () => ({
  ruleCards: [
    {
      id: 'rule-1',
      type: 'rule',
      title: 'Geen suiker',
      icon: 'ban',
      ruleNumber: 1,
      content: { rule: 'Nee', science: 'Test', tips: ['Tip'] },
    },
  ],
  conceptCards: [
    {
      id: 'concept-1',
      type: 'concept',
      title: 'Insuline basis',
      icon: 'flame',
      subtitle: 'Waarom dit werkt',
      content: { summary: 'Kort', keyPoints: [] },
    },
  ],
  faqCards: [
    {
      id: 'faq-1',
      type: 'faq',
      title: 'Mag ik koffie?',
      icon: 'coffee',
      content: { answer: 'Ja', explanation: 'Zonder suiker', nuance: [] },
    },
  ],
  yesNoList: { yes: [], no: [], cheat: [] },
  commonMistakes: [],
}));

vi.mock('@/lib/educationIcons', () => ({
  getEducationIcon: () => null,
}));

vi.mock('@/components/education/RuleCard', () => ({
  RuleCard: ({ card, isOpen }: { card: { title: string }; isOpen: boolean }) =>
    isOpen ? <div>RuleModal:{card.title}</div> : null,
}));

vi.mock('@/components/education/ConceptCard', () => ({
  ConceptCard: ({ card, isOpen }: { card: { title: string }; isOpen: boolean }) =>
    isOpen ? <div>ConceptModal:{card.title}</div> : null,
}));

vi.mock('@/components/education/FAQCard', () => ({
  FAQCard: ({ card, isOpen }: { card: { title: string }; isOpen: boolean }) =>
    isOpen ? <div>FaqModal:{card.title}</div> : null,
}));

describe('LearnSection UI/UX', () => {
  it('uses unified section spacing on the root container', () => {
    const { container } = render(<LearnSection />);
    expect(container.firstElementChild).toHaveClass('space-y-8');
  });

  it('switches tab content between quick start, science and faq', () => {
    render(<LearnSection />);

    expect(screen.getByText('Jouw Startplan')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: /Wetenschap/i }));
    expect(screen.getByText('De Wetenschap')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: /FAQ/i }));
    expect(screen.getAllByText('Veelgestelde Vragen').length).toBeGreaterThan(0);
  });

  it('opens rule card modal from quickstart list', () => {
    render(<LearnSection />);
    fireEvent.click(screen.getByRole('button', { name: /Geen suiker/i }));
    expect(screen.getByText('RuleModal:Geen suiker')).toBeInTheDocument();
  });

  it('opens concept and faq modals from their tabs', () => {
    render(<LearnSection />);

    fireEvent.click(screen.getByRole('tab', { name: /Wetenschap/i }));
    fireEvent.click(screen.getByRole('button', { name: /Insuline basis/i }));
    expect(screen.getByText('ConceptModal:Insuline basis')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: /FAQ/i }));
    fireEvent.click(screen.getByRole('button', { name: /Mag ik koffie/i }));
    expect(screen.getByText('FaqModal:Mag ik koffie?')).toBeInTheDocument();
  });
});

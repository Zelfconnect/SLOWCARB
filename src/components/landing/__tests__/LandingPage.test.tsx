import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock IntersectionObserver globally (jsdom doesn't provide it)
class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  constructor(_cb: IntersectionObserverCallback, _opts?: IntersectionObserverInit) {}
}

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

  // Prevent jsdom scrollTo errors
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;

  // Mock matchMedia for prefers-reduced-motion
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  });

  localStorage.clear();
});

// ---------------------------------------------------------------------------
// Imports — LandingPage is default, rest are named
// ---------------------------------------------------------------------------
import LandingPage from '@/components/landing/LandingPage';
import { LandingHero } from '@/components/landing/LandingHero';
import { RecognitionSection } from '@/components/landing/RecognitionSection';
import { SolutionSection } from '@/components/landing/SolutionSection';
import { AppShowcase } from '@/components/landing/AppShowcase';
import { RulesSection } from '@/components/landing/RulesSection';
import { FounderSection } from '@/components/landing/FounderSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { Footer } from '@/components/landing/Footer';
import { StickyCTA } from '@/components/landing/StickyCTA';

// ---------------------------------------------------------------------------
// LandingPage (parent)
// ---------------------------------------------------------------------------
describe('LandingPage', () => {
  it('renders without crash', () => {
    render(<LandingPage />);
    // The hero heading should be present in the composed page
    expect(screen.getByText(/8 tot 10/)).toBeInTheDocument();
  });

  it('calls window.open with the Stripe URL when a CTA is clicked', () => {
    const mockOpen = vi.fn(() => ({ focus: vi.fn() }));
    vi.stubGlobal('open', mockOpen);

    render(<LandingPage />);
    // Click the first "Begin met de 5 regels" button (hero bottom CTA)
    const ctaButtons = screen.getAllByRole('button', { name: /begin/i });
    fireEvent.click(ctaButtons[0]);

    expect(mockOpen).toHaveBeenCalledWith(
      'https://buy.stripe.com/5kQ28t0JQ9Geaht9Kb5Rm00',
      '_blank',
    );
  });

  it('falls back to window.location.href when popup is blocked', () => {
    // window.open returns null → popup blocked
    vi.stubGlobal('open', vi.fn(() => null));

    // We need to spy on location.href assignment. jsdom doesn't allow direct
    // assignment easily, so we use Object.defineProperty.
    const hrefSetter = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, href: '' },
    });
    Object.defineProperty(window.location, 'href', {
      set: hrefSetter,
      get: () => '',
      configurable: true,
    });

    render(<LandingPage />);
    const ctaButtons = screen.getAllByRole('button', { name: /begin/i });
    fireEvent.click(ctaButtons[0]);

    expect(hrefSetter).toHaveBeenCalledWith(
      'https://buy.stripe.com/5kQ28t0JQ9Geaht9Kb5Rm00',
    );
  });

  it('shows "Ga naar de app" button when slowcarb_profile exists in localStorage', () => {
    localStorage.setItem('slowcarb_profile', JSON.stringify({ name: 'test' }));
    render(<LandingPage />);
    expect(screen.getByText('Ga naar de app')).toBeInTheDocument();
  });

  it('hides "Ga naar de app" button when no profile in localStorage', () => {
    render(<LandingPage />);
    expect(screen.queryByText('Ga naar de app')).not.toBeInTheDocument();
  });

  it('does not crash when localStorage.getItem throws', () => {
    const originalGetItem = Storage.prototype.getItem;
    Storage.prototype.getItem = vi.fn(() => {
      throw new Error('Storage unavailable');
    });

    expect(() => render(<LandingPage />)).not.toThrow();

    Storage.prototype.getItem = originalGetItem;
  });
});

// ---------------------------------------------------------------------------
// LandingHero
// ---------------------------------------------------------------------------
describe('LandingHero', () => {
  const onCheckout = vi.fn();

  beforeEach(() => {
    onCheckout.mockClear();
  });

  it('renders hero heading "8 tot 10"', () => {
    render(<LandingHero onCheckout={onCheckout} />);
    expect(screen.getByText(/8 tot 10/)).toBeInTheDocument();
  });

  it('renders 5 nav links', () => {
    render(<LandingHero onCheckout={onCheckout} />);
    const links = screen.getAllByText(
      /De methode|Hoe werkt de app|Bewijs|Prijs|FAQ/,
    );
    // Desktop + mobile duplicates = 10, but at minimum 5 unique labels
    expect(links.length).toBeGreaterThanOrEqual(5);
  });

  it('opens the mobile menu on hamburger click', () => {
    render(<LandingHero onCheckout={onCheckout} />);
    const hamburger = screen.getByLabelText('Menu openen');
    fireEvent.click(hamburger);
    // After opening, the close button should be visible
    expect(screen.getByLabelText('Menu sluiten')).toBeInTheDocument();
  });

  it('closes the mobile menu on X button click', () => {
    render(<LandingHero onCheckout={onCheckout} />);
    fireEvent.click(screen.getByLabelText('Menu openen'));
    const closeBtn = screen.getByLabelText('Menu sluiten');
    fireEvent.click(closeBtn);

    // After closing, the mobile menu container should be aria-hidden="true"
    const mobileMenu = document.querySelector('[aria-hidden="true"]');
    expect(mobileMenu).toBeTruthy();
  });

  it('closes the mobile menu on Escape key', () => {
    render(<LandingHero onCheckout={onCheckout} />);
    fireEvent.click(screen.getByLabelText('Menu openen'));
    // Menu is open
    expect(screen.getByLabelText('Menu sluiten')).toBeInTheDocument();

    // Press Escape
    fireEvent.keyDown(document, { key: 'Escape' });

    // After escape, the mobile nav container should be aria-hidden="true"
    const mobileMenu = document.querySelector('[aria-hidden="true"]');
    expect(mobileMenu).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// RecognitionSection
// ---------------------------------------------------------------------------
describe('RecognitionSection', () => {
  it('renders "Herkenbaar?" heading', () => {
    render(<RecognitionSection />);
    expect(screen.getByText('Herkenbaar?')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// SolutionSection
// ---------------------------------------------------------------------------
describe('SolutionSection', () => {
  it('renders "Wat als afvallen simpeler was?" heading', () => {
    render(<SolutionSection />);
    expect(
      screen.getByText('Wat als afvallen simpeler was?'),
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// AppShowcase
// ---------------------------------------------------------------------------
describe('AppShowcase', () => {
  it('renders all 4 step titles', () => {
    render(<AppShowcase />);
    expect(screen.getAllByText('Open je dashboard').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Kies een recept').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Leer waarom het werkt').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Hou AmmoCheck bij').length).toBeGreaterThanOrEqual(1);
  });

  it('renders 4 pagination buttons', () => {
    render(<AppShowcase />);
    const pagBtns = screen.getAllByRole('button', { name: /Ga naar stap/ });
    expect(pagBtns).toHaveLength(4);
  });

  it('updates active state when pagination button is clicked', () => {
    render(<AppShowcase />);
    const pagBtns = screen.getAllByRole('button', { name: /Ga naar stap/ });

    // Initially first button is active
    expect(pagBtns[0].dataset.active).toBe('true');
    expect(pagBtns[2].dataset.active).toBe('false');

    // Click third button
    fireEvent.click(pagBtns[2]);

    expect(pagBtns[2].dataset.active).toBe('true');
    expect(pagBtns[0].dataset.active).toBe('false');
  });
});

// ---------------------------------------------------------------------------
// RulesSection
// ---------------------------------------------------------------------------
describe('RulesSection', () => {
  it('renders all 5 rule titles', () => {
    render(<RulesSection />);
    expect(screen.getByText(/Vermijd "witte" koolhydraten/)).toBeInTheDocument();
    expect(screen.getByText('Eet steeds dezelfde maaltijden')).toBeInTheDocument();
    expect(screen.getByText(/Drink geen calorieën/)).toBeInTheDocument();
    expect(screen.getByText('Eet geen fruit')).toBeInTheDocument();
    expect(screen.getByText(/Eén cheatday per week/)).toBeInTheDocument();
  });

  it('all rule images have .webp extension', () => {
    render(<RulesSection />);
    const ruleImages = screen.getAllByRole('img').filter((img) =>
      (img as HTMLImageElement).src.includes('/regels/'),
    );
    expect(ruleImages.length).toBe(5);
    ruleImages.forEach((img) => {
      expect((img as HTMLImageElement).src).toMatch(/\.webp$/);
    });
  });
});

// ---------------------------------------------------------------------------
// FounderSection
// ---------------------------------------------------------------------------
describe('FounderSection', () => {
  it('renders founder name "Jesper"', () => {
    render(<FounderSection />);
    expect(screen.getByText('Jesper')).toBeInTheDocument();
  });

  it('renders before/after slider with range input', () => {
    render(<FounderSection />);
    const rangeInput = screen.getByRole('slider', {
      name: /voor en na/i,
    });
    expect(rangeInput).toBeInTheDocument();
  });

  it('updates split value when range input changes', () => {
    render(<FounderSection />);
    const rangeInput = screen.getByRole('slider') as HTMLInputElement;
    expect(rangeInput.value).toBe('75'); // default

    fireEvent.change(rangeInput, { target: { value: '30' } });
    expect(rangeInput.value).toBe('30');
  });
});

// ---------------------------------------------------------------------------
// PricingSection
// ---------------------------------------------------------------------------
describe('PricingSection', () => {
  const onCheckout = vi.fn();

  beforeEach(() => {
    onCheckout.mockClear();
  });

  it('renders price text containing "47"', () => {
    render(<PricingSection onCheckout={onCheckout} />);
    // Multiple instances of €47 on the page
    const priceElements = screen.getAllByText(/€47/);
    expect(priceElements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders all 4 competitor names', () => {
    render(<PricingSection onCheckout={onCheckout} />);
    expect(screen.getByText('Diëtist')).toBeInTheDocument();
    expect(screen.getByText('Noom')).toBeInTheDocument();
    expect(screen.getByText('WeightWatchers')).toBeInTheDocument();
    expect(screen.getByText('Personal trainer')).toBeInTheDocument();
  });

  it('calls onCheckout when CTA button is clicked', () => {
    render(<PricingSection onCheckout={onCheckout} />);
    const ctaButton = screen.getByText('Start het protocol');
    fireEvent.click(ctaButton.closest('button')!);
    expect(onCheckout).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// FAQSection
// ---------------------------------------------------------------------------
describe('FAQSection', () => {
  it('renders all 6 FAQ questions', () => {
    render(<FAQSection />);
    expect(screen.getByText('Is dit een abonnement?')).toBeInTheDocument();
    expect(screen.getByText('Moet ik naar de sportschool?')).toBeInTheDocument();
    expect(screen.getByText(/Werkt dit ook met ADHD/)).toBeInTheDocument();
    expect(screen.getByText(/Wat als het niet werkt/)).toBeInTheDocument();
    expect(screen.getByText(/Is dit gewoon een kookboek-app/)).toBeInTheDocument();
    expect(screen.getByText('Hoe snel zie ik resultaat?')).toBeInTheDocument();
  });

  it('toggles answer visibility on click', () => {
    render(<FAQSection />);
    const firstQuestion = screen.getByText('Is dit een abonnement?');

    // Answer not visible initially
    expect(screen.queryByText(/Je betaalt één keer/)).not.toBeInTheDocument();

    // Click to open
    fireEvent.click(firstQuestion.closest('button')!);
    expect(screen.getByText(/Je betaalt één keer/)).toBeInTheDocument();

    // Click to close
    fireEvent.click(firstQuestion.closest('button')!);
    expect(screen.queryByText(/Je betaalt één keer/)).not.toBeInTheDocument();
  });

  it('only allows one answer open at a time', () => {
    render(<FAQSection />);

    // Open first question
    const firstQ = screen.getByText('Is dit een abonnement?');
    fireEvent.click(firstQ.closest('button')!);
    expect(screen.getByText(/Je betaalt één keer/)).toBeInTheDocument();

    // Open second question — first should close
    const secondQ = screen.getByText('Moet ik naar de sportschool?');
    fireEvent.click(secondQ.closest('button')!);
    expect(screen.getByText(/SlowCarb is puur voeding/)).toBeInTheDocument();
    expect(screen.queryByText(/Je betaalt één keer/)).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// FinalCTA
// ---------------------------------------------------------------------------
describe('FinalCTA', () => {
  const onCheckout = vi.fn();

  beforeEach(() => {
    onCheckout.mockClear();
  });

  it('renders heading "5 regels. 6 weken."', () => {
    render(<FinalCTA onCheckout={onCheckout} />);
    expect(screen.getByText(/5 regels\. 6 weken\./)).toBeInTheDocument();
  });

  it('uses a local background image (not unsplash.com)', () => {
    const { container } = render(<FinalCTA onCheckout={onCheckout} />);
    // The bg image has alt="" (decorative), so query the DOM directly
    const bgImage = container.querySelector('img[src*="final-cta"]') as HTMLImageElement;
    expect(bgImage).toBeTruthy();
    expect(bgImage.src).not.toContain('unsplash.com');
  });

  it('calls onCheckout when CTA button is clicked', () => {
    render(<FinalCTA onCheckout={onCheckout} />);
    const ctaBtn = screen.getByRole('button', { name: /begin/i });
    fireEvent.click(ctaBtn);
    expect(onCheckout).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
describe('Footer', () => {
  it('renders "SlowCarb" brand name', () => {
    render(<Footer />);
    expect(screen.getByText('SlowCarb')).toBeInTheDocument();
  });

  it('renders legal links', () => {
    render(<Footer />);
    expect(screen.getByText('Algemene Voorwaarden')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// StickyCTA
// ---------------------------------------------------------------------------
describe('StickyCTA', () => {
  const onCheckout = vi.fn();

  beforeEach(() => {
    onCheckout.mockClear();
  });

  it('renders price "Nu \u20AC47"', () => {
    render(<StickyCTA onCheckout={onCheckout} />);
    expect(screen.getByText(/Nu\s*€47/)).toBeInTheDocument();
  });

  it('calls onCheckout when CTA button is clicked', () => {
    render(<StickyCTA onCheckout={onCheckout} />);
    const ctaBtn = screen.getByRole('button', { name: /begin/i });
    fireEvent.click(ctaBtn);
    expect(onCheckout).toHaveBeenCalledTimes(1);
  });
});

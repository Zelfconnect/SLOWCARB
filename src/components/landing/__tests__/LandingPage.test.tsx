import React from 'react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useUserStore } from '@/store/useUserStore';

// Mock IntersectionObserver globally (jsdom doesn't provide it)
let observerInstances: MockIntersectionObserver[] = [];

class MockIntersectionObserver {
  observed: Element[] = [];
  callback: IntersectionObserverCallback;
  observe = vi.fn((element: Element) => {
    this.observed.push(element);
  });
  disconnect = vi.fn();
  unobserve = vi.fn();
  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    void options;
    observerInstances.push(this);
  }
}

beforeEach(() => {
  observerInstances = [];
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

  // Reset Zustand store
  useUserStore.setState({ profile: null, isLoaded: true });
});

function withRouter(ui: React.ReactElement) {
  return <MemoryRouter>{ui}</MemoryRouter>;
}

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

const landingCss = readFileSync(resolve(process.cwd(), 'src/styles/landing.css'), 'utf8');

// ---------------------------------------------------------------------------
// LandingPage (parent)
// ---------------------------------------------------------------------------
describe('LandingPage', () => {
  it('renders without crash', () => {
    render(withRouter(<LandingPage />));
    // The hero heading should be present in the composed page
    expect(screen.getByText(/8 tot 10/)).toBeInTheDocument();
  });

  it('calls window.open with the Stripe URL when a CTA is clicked', () => {
    const mockOpen = vi.fn(() => ({ focus: vi.fn() }));
    vi.stubGlobal('open', mockOpen);

    render(withRouter(<LandingPage />));
    // Click the first "Begin met de 5 regels" button (hero bottom CTA)
    const ctaButtons = screen.getAllByRole('button', { name: /begin/i });
    fireEvent.click(ctaButtons[0]);

    expect(mockOpen).toHaveBeenCalledWith(
      'https://buy.stripe.com/5kQ4gBeAG19IfBNcWn5Rm01',
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

    render(withRouter(<LandingPage />));
    const ctaButtons = screen.getAllByRole('button', { name: /begin/i });
    fireEvent.click(ctaButtons[0]);

    expect(hrefSetter).toHaveBeenCalledWith(
      'https://buy.stripe.com/5kQ4gBeAG19IfBNcWn5Rm01',
    );
  });

  it('shows "Ga naar de app" button when user has profile', () => {
    useUserStore.setState({ profile: { name: 'test' } as any, isLoaded: true });
    render(withRouter(<LandingPage />));
    const links = screen.getAllByText('Ga naar de app');
    expect(links.length).toBeGreaterThanOrEqual(1);
  });

  it('hides "Ga naar de app" button when no profile in localStorage', () => {
    render(withRouter(<LandingPage />));
    expect(screen.queryByText('Ga naar de app')).not.toBeInTheDocument();
  });

  it('does not crash when localStorage.getItem throws', () => {
    const originalGetItem = Storage.prototype.getItem;
    Storage.prototype.getItem = vi.fn(() => {
      throw new Error('Storage unavailable');
    });

    useUserStore.getState().loadProfile();
    expect(() => render(withRouter(<LandingPage />))).not.toThrow();

    Storage.prototype.getItem = originalGetItem;
  });

  it('wires reveal targets through IntersectionObserver and marks them visible', () => {
    const { container } = render(withRouter(<LandingPage />));
    const revealObserver = observerInstances.reduce<MockIntersectionObserver | null>((currentBest, observer) => {
      if (!currentBest) return observer;
      return observer.observed.length > currentBest.observed.length ? observer : currentBest;
    }, null);

    expect(revealObserver).toBeTruthy();
    expect(revealObserver!.observed.length).toBeGreaterThanOrEqual(7);
    revealObserver!.observed.forEach((target) => {
      expect((target as HTMLElement).closest('#method')).toBeTruthy();
    });

    const target = container.querySelector('#method [data-reveal="up"]') as HTMLElement;
    expect(target).toBeTruthy();

    act(() => {
      revealObserver!.callback(
        [{ target, isIntersecting: true } as IntersectionObserverEntry],
        revealObserver! as unknown as IntersectionObserver,
      );
    });

    expect(target).toHaveAttribute('data-reveal-visible', 'true');
  });

  it('keeps left/right reveal directions exclusive to the 5 rules section', () => {
    const { container } = render(withRouter(<LandingPage />));
    const directionalTargets = Array.from(
      container.querySelectorAll<HTMLElement>('[data-reveal="left"], [data-reveal="right"]'),
    );

    expect(directionalTargets.length).toBeGreaterThan(0);
    directionalTargets.forEach((target) => {
      expect(target.closest('#method')).toBeTruthy();
    });
  });

  it('keeps scroll-reveal markers scoped to the 5 rules section', () => {
    const { container } = render(withRouter(<LandingPage />));
    const revealTargets = Array.from(
      container.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-group], [data-reveal-part], [data-stagger]'),
    );

    expect(revealTargets.length).toBeGreaterThan(0);
    revealTargets.forEach((target) => {
      expect(target.closest('#method')).toBeTruthy();
    });
  });

  it('applies landing-wide wrap helpers to major headings and long-form copy', () => {
    render(withRouter(<LandingPage />));

    expect(screen.getByRole('heading', { name: 'Zo werkt de app' })).toHaveClass('landing-balance');
    expect(screen.getByRole('heading', { name: 'Alles wat je nodig hebt om te starten en vol te houden.' })).toHaveClass('landing-balance');
    expect(screen.getByText(/Van "ik weet niet wat ik mag eten"/)).toHaveClass('landing-pretty');
    expect(screen.getByText(/Geen kleine lettertjes of verborgen abonnementen/)).toHaveClass('landing-pretty');
    expect(landingCss).toMatch(/\.landing-page \.landing-balance[\s\S]*text-wrap:\s*balance/);
    expect(landingCss).toMatch(/\.landing-page \.landing-pretty[\s\S]*text-wrap:\s*pretty/);
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
    render(withRouter(<LandingHero onCheckout={onCheckout} />));
    expect(screen.getByText(/8 tot 10/)).toBeInTheDocument();
  });

  it('renders the existing hero animation hooks for the intro transitions', () => {
    const { container } = render(withRouter(<LandingHero onCheckout={onCheckout} />));

    expect(container.querySelector('.landing-hero-shell')).toBeTruthy();
    expect(container.querySelector('.landing-hero-media-shell')).toBeTruthy();
    expect(container.querySelector('.landing-hero-brand')).toBeTruthy();
    expect(container.querySelector('.landing-hero-nav')).toBeTruthy();
    expect(container.querySelectorAll('.landing-hero-heading-line')).toHaveLength(3);
    expect(container.querySelector('.landing-hero-copy')).toBeTruthy();
    expect(container.querySelector('.landing-hero-cta')).toBeTruthy();
    expect(container.querySelector('.landing-hero-footnote')).toBeTruthy();
  });

  it('uses layered cinematic motion on the hero background media', () => {
    const heroShellRule = landingCss.match(/\.landing-page \.landing-hero-shell\[data-hero-ready='true'\] \.landing-hero-media-shell\s*\{([\s\S]*?)\}/);
    const heroMediaRule = landingCss.match(/\.landing-page \.landing-hero-shell\[data-hero-ready='true'\] \.landing-hero-media\s*\{([\s\S]*?)\}/);

    expect(heroShellRule?.[1]).toBeTruthy();
    expect(heroShellRule![1]).toMatch(/landing-hero-pullback/);
    expect(heroShellRule![1]).toMatch(/landing-hero-drift/);
    expect(heroMediaRule?.[1]).toBeTruthy();
    expect(heroMediaRule![1]).toMatch(/landing-hero-camera/);
  });

  it('renders 7 nav links (page + section)', () => {
    render(withRouter(<LandingHero onCheckout={onCheckout} />));
    const links = screen.getAllByText(
      /Gids|Recepten|De methode|Hoe werkt de app|Bewijs|Prijs|FAQ/,
    );
    // Desktop + mobile duplicates = 14+, but at minimum 7 unique labels
    expect(links.length).toBeGreaterThanOrEqual(7);
  });

  it('opens the mobile menu on hamburger click', () => {
    render(withRouter(<LandingHero onCheckout={onCheckout} />));
    const hamburger = screen.getByLabelText('Menu openen');
    fireEvent.click(hamburger);
    // After opening, the close button should be visible
    expect(screen.getByLabelText('Menu sluiten')).toBeInTheDocument();
  });

  it('closes the mobile menu on X button click', () => {
    render(withRouter(<LandingHero onCheckout={onCheckout} />));
    fireEvent.click(screen.getByLabelText('Menu openen'));
    const closeBtn = screen.getByLabelText('Menu sluiten');
    fireEvent.click(closeBtn);

    // After closing, the mobile menu container should be aria-hidden="true"
    const mobileMenu = document.querySelector('[aria-hidden="true"]');
    expect(mobileMenu).toBeTruthy();
  });

  it('closes the mobile menu on Escape key', () => {
    render(withRouter(<LandingHero onCheckout={onCheckout} />));
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
  it('renders the current solution heading', () => {
    render(<SolutionSection />);
    expect(
      screen.getByText('Eén systeem. Nul denkwerk.'),
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
    expect(screen.getAllByText('Snap wat er in je lijf gebeurt').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('AmmoCheck: altijd voorbereid').length).toBeGreaterThanOrEqual(1);
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

  it('keeps raster mockups free of blur-prone image effects', () => {
    const imageRule = landingCss.match(/\.landing-page \.app-showcase-screen-image\s*\{([\s\S]*?)\}/);
    expect(imageRule?.[1]).toBeTruthy();
    expect(imageRule![1]).not.toMatch(/\bfilter\s*:/);
    expect(imageRule![1]).not.toMatch(/\btransform\s*:/);
    expect(imageRule![1]).not.toMatch(/\bbackface-visibility\s*:/);
  });

  it('does not scale showcase wrappers that contain raster mockups', () => {
    const selectors = [
      /\.landing-page \.app-showcase-slide\s*\{([\s\S]*?)\}/,
      /\.landing-page \.app-showcase-slide\[data-active="true"\]\s*\{([\s\S]*?)\}/,
      /\.landing-page \.app-showcase-mobile-slide\s*\{([\s\S]*?)\}/,
      /\.landing-page \.app-showcase-mobile-slide\[data-active="true"\] \.app-showcase-mobile-stage\s*\{([\s\S]*?)\}/,
    ];

    selectors.forEach((selector) => {
      const rule = landingCss.match(selector);
      expect(rule?.[1]).toBeTruthy();
      expect(rule![1]).not.toMatch(/scale\(/);
    });
  });

  it('does not apply scroll reveal attributes to the showcase media wrapper', () => {
    const { container } = render(<AppShowcase />);
    const revealWrapper = container.querySelector('.app-showcase-stage')?.closest('[data-reveal]');
    expect(revealWrapper).toBeNull();
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

  it('uses the intended mobile rule and image order per stage', () => {
    const { container } = render(<RulesSection />);
    const stages = Array.from(container.querySelectorAll('.rules-stage'));

    expect(stages).toHaveLength(5);

    stages.forEach((stage, index) => {
      const mediaLayer = stage.querySelector('.rules-media-layer');
      const copyLayer = stage.querySelector('.rules-copy-stack')?.parentElement;

      expect(mediaLayer).toBeTruthy();
      expect(copyLayer).toBeTruthy();

      if (index === stages.length - 1) {
        expect(mediaLayer?.className).toContain('order-1 md:order-1');
        expect(copyLayer?.className).toContain('order-2 md:order-2');
        return;
      }

      expect(mediaLayer?.className).toContain('order-2 md:order-1');
      expect(copyLayer?.className).toContain('order-1 md:order-2');
    });
  });

  it('uses one shared reveal trigger per rule so image and copy animate together', () => {
    const { container } = render(<RulesSection />);
    const stages = Array.from(container.querySelectorAll('.rules-stage'));

    stages.forEach((stage) => {
      const mediaLayer = stage.querySelector('.rules-media-layer');
      const copyLayer = stage.querySelector('.rules-copy-stack')?.parentElement;

      expect(stage.getAttribute('data-reveal-group')).toBe('rules-pair');
      expect(stage.getAttribute('data-stagger')).toBeTruthy();
      expect(mediaLayer?.getAttribute('data-reveal-part')).toBe('rules-pair');
      expect(copyLayer?.getAttribute('data-reveal-part')).toBe('rules-pair');
      expect(mediaLayer?.hasAttribute('data-stagger')).toBe(false);
      expect(copyLayer?.hasAttribute('data-stagger')).toBe(false);
    });
  });

  it('keeps rule media static instead of scroll-parallaxed', () => {
    const parallaxRule = landingCss.match(/\.landing-page \.rules-media-parallax\s*\{([\s\S]*?)\}/);
    const glowRule = landingCss.match(/\.landing-page \.rules-media-glow\s*\{([\s\S]*?)\}/);

    expect(parallaxRule?.[1]).toBeTruthy();
    expect(parallaxRule![1]).not.toMatch(/rule-media-parallax/);
    expect(parallaxRule![1]).not.toMatch(/\btransition\s*:/);
    expect(glowRule?.[1]).toBeTruthy();
    expect(glowRule![1]).not.toMatch(/rule-media-parallax/);
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
  function mockViewportRect(viewport: Element) {
    vi.spyOn(viewport, 'getBoundingClientRect').mockReturnValue({
      x: 100,
      y: 0,
      left: 100,
      top: 0,
      width: 300,
      height: 420,
      right: 400,
      bottom: 420,
      toJSON: () => ({}),
    } as DOMRect);
  }

  it('renders founder name "Jesper"', () => {
    render(<FounderSection />);
    expect(screen.getByText('Jesper')).toBeInTheDocument();
  });

  it('keeps the founder story, support block, and CTA static on page load', () => {
    const { container } = render(<FounderSection />);
    const storyColumn = screen.getByText('Het verhaal achter SlowCarb').closest('.max-w-xl');
    const proofCard = container.querySelector('.transform-proof-card');
    const supportReveal = screen.getByText('De methode').closest('[data-reveal]');
    const founderCtaReveal = screen.getByRole('link', { name: /word een van de eerste 200 gebruikers/i }).closest('[data-reveal]');

    expect(storyColumn).toBeTruthy();
    expect(storyColumn).not.toHaveAttribute('data-reveal');

    expect(proofCard).toBeTruthy();
    expect(proofCard).not.toHaveAttribute('data-reveal');
    expect(proofCard).not.toHaveAttribute('data-stagger');

    expect(supportReveal).toBeNull();
    expect(founderCtaReveal).toBeNull();
  });

  it('renders the founder thumbnail with the profile photo', () => {
    const { container } = render(<FounderSection />);
    const profilePhoto = container.querySelector('.transform-proof-support-avatar--photo img[src*="jesper-smile-thumb.png"]');
    expect(profilePhoto).toBeTruthy();
  });

  it('applies balanced headings and pretty copy helpers for founder mobile readability', () => {
    render(<FounderSection />);
    expect(screen.getByRole('heading', { name: 'Eerst werkte het bij mij.' })).toHaveClass('founder-story-heading');
    expect(screen.getByRole('heading', { name: 'Mijn eigen voor en na' })).toHaveClass('transform-proof-title');
    expect(landingCss).toMatch(/\.landing-page \.founder-story-heading[\s\S]*text-wrap:\s*balance/);
    expect(landingCss).toMatch(/\.landing-page \.founder-story-copy[\s\S]*text-wrap:\s*pretty/);
  });

  it('does not render the old standalone founder portrait', () => {
    render(<FounderSection />);
    expect(screen.queryByAltText('Jesper, oprichter van SlowCarb')).not.toBeInTheDocument();
  });

  it('renders the center compare handle as an accessible slider', () => {
    render(<FounderSection />);
    const compareHandle = screen.getByRole('slider', {
      name: /voor en na/i,
    });
    expect(compareHandle).toBeInTheDocument();
    expect(compareHandle).toHaveAttribute('aria-valuenow', '78');
    expect(compareHandle).toHaveAttribute('tabindex', '0');
  });

  it('does not render the old range input below the image', () => {
    const { container } = render(<FounderSection />);
    expect(container.querySelector('input[type="range"]')).toBeNull();
  });

  it('updates split value from keyboard input', () => {
    render(<FounderSection />);
    const compareHandle = screen.getByRole('slider', { name: /voor en na/i });

    fireEvent.keyDown(compareHandle, { key: 'ArrowLeft' });
    expect(compareHandle).toHaveAttribute('aria-valuenow', '77');

    fireEvent.keyDown(compareHandle, { key: 'Home' });
    expect(compareHandle).toHaveAttribute('aria-valuenow', '0');

    fireEvent.keyDown(compareHandle, { key: 'End' });
    expect(compareHandle).toHaveAttribute('aria-valuenow', '100');
  });

  it('updates split value when the handle is dragged', () => {
    const { container } = render(<FounderSection />);
    const viewport = container.querySelector('.transform-proof-viewport');
    const compareHandle = screen.getByRole('slider', { name: /voor en na/i });

    expect(viewport).toBeTruthy();
    mockViewportRect(viewport!);

    fireEvent.pointerDown(compareHandle, { pointerId: 1, clientX: 334 });
    fireEvent.pointerMove(compareHandle, { pointerId: 1, clientX: 190 });
    fireEvent.pointerUp(compareHandle, { pointerId: 1, clientX: 190 });

    expect(compareHandle).toHaveAttribute('aria-valuenow', '30');
  });

  it('does not update the split when pointer interaction starts on the photo', () => {
    const { container } = render(<FounderSection />);
    const viewport = container.querySelector('.transform-proof-viewport');
    const compareHandle = screen.getByRole('slider', { name: /voor en na/i });
    const compareImage = container.querySelector('.transform-proof-compare');

    expect(viewport).toBeTruthy();
    expect(compareImage).toBeTruthy();
    mockViewportRect(viewport!);

    fireEvent.pointerDown(compareImage!, { pointerId: 2, clientX: 190 });
    fireEvent.pointerMove(compareImage!, { pointerId: 2, clientX: 145 });
    fireEvent.pointerUp(compareImage!, { pointerId: 2, clientX: 145 });

    expect(compareHandle).toHaveAttribute('aria-valuenow', '78');
  });

  it('shows the discovery cue once and suppresses it after interaction', () => {
    vi.useFakeTimers();

    try {
      const { container } = render(<FounderSection />);
      const compareHandle = screen.getByRole('slider', { name: /voor en na/i });
      const proofCard = container.querySelector('.transform-proof-card');
      const cueObserver = observerInstances.find((observer) => observer.observed.includes(proofCard as Element));

      expect(compareHandle).toHaveAttribute('data-discovery-cue', 'idle');
      expect(cueObserver).toBeTruthy();

      act(() => {
        cueObserver!.callback(
          [{ target: proofCard!, isIntersecting: true } as IntersectionObserverEntry],
          cueObserver! as unknown as IntersectionObserver,
        );
      });

      expect(compareHandle).toHaveAttribute('data-discovery-cue', 'active');

      fireEvent.keyDown(compareHandle, { key: 'ArrowLeft' });
      expect(compareHandle).toHaveAttribute('data-discovery-cue', 'complete');

      act(() => {
        vi.runAllTimers();
      });

      expect(compareHandle).toHaveAttribute('data-discovery-cue', 'complete');
    } finally {
      vi.useRealTimers();
    }
  });

  it('suppresses the discovery cue when reduced motion is enabled', () => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    render(<FounderSection />);
    const compareHandle = screen.getByRole('slider', { name: /voor en na/i });

    expect(compareHandle).toHaveAttribute('data-discovery-cue', 'disabled');
    expect(observerInstances).toHaveLength(0);
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
    const priceElements = screen.getAllByText(/47/);
    expect(priceElements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders all 4 competitor names', () => {
    render(<PricingSection onCheckout={onCheckout} />);
    expect(screen.getByText(/Di.*tist/)).toBeInTheDocument();
    expect(screen.getByText('Noom')).toBeInTheDocument();
    expect(screen.getByText('WeightWatchers')).toBeInTheDocument();
    expect(screen.getByText('Personal trainer')).toBeInTheDocument();
  });

  it('renders the section in compare, get, buy order', () => {
    render(<PricingSection onCheckout={onCheckout} />);

    const comparisonBlock = screen.getByTestId('pricing-compare');
    const includesBlock = screen.getByTestId('pricing-includes-block');
    const buyCard = screen.getByTestId('pricing-buy-card');

    expect(comparisonBlock.compareDocumentPosition(includesBlock) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(includesBlock.compareDocumentPosition(buyCard) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('uses a value-led intro instead of leading with payment framing', () => {
    render(<PricingSection onCheckout={onCheckout} />);

    const intro = screen.getByTestId('pricing-intro');
    expect(within(intro).getByText('Rustige tools. Duidelijke structuur.')).toBeInTheDocument();
    expect(within(intro).queryByText('Eenmalig. Geen abonnement.')).not.toBeInTheDocument();
  });

  it('keeps the purchase framing only in the final buy card', () => {
    render(<PricingSection onCheckout={onCheckout} />);

    const buyCard = screen.getByTestId('pricing-buy-card');

    expect(screen.getAllByText('Eenmalig. Geen abonnement.')).toHaveLength(1);
    expect(within(buyCard).getByText('Eenmalig. Geen abonnement.')).toBeInTheDocument();
    expect(within(buyCard).getByText(/30 dagen proberen/i)).toBeInTheDocument();
    expect(within(buyCard).getByRole('button', { name: /start het protocol/i })).toBeInTheDocument();
  });

  it('calls onCheckout when CTA button is clicked', () => {
    render(<PricingSection onCheckout={onCheckout} />);
    const buyCard = screen.getByTestId('pricing-buy-card');
    fireEvent.click(within(buyCard).getByRole('button', { name: /start het protocol/i }));
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
    const firstQuestion = screen.getByRole('button', { name: 'Is dit een abonnement?' });

    expect(firstQuestion).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(firstQuestion);
    expect(firstQuestion).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/Je betaalt/)).toBeInTheDocument();

    fireEvent.click(firstQuestion);
    expect(firstQuestion).toHaveAttribute('aria-expanded', 'false');
  });

  it('only allows one answer open at a time', () => {
    render(<FAQSection />);

    const firstQ = screen.getByRole('button', { name: 'Is dit een abonnement?' });
    fireEvent.click(firstQ);
    expect(firstQ).toHaveAttribute('aria-expanded', 'true');

    const secondQ = screen.getByRole('button', { name: 'Moet ik naar de sportschool?' });
    fireEvent.click(secondQ);
    expect(secondQ).toHaveAttribute('aria-expanded', 'true');
    expect(firstQ).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText(/SlowCarb is puur voeding/)).toBeInTheDocument();
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

  it('keeps the final CTA background static while the hero remains animated', () => {
    const finalCtaRule = landingCss.match(/\.landing-page \.landing-final-cta-media\s*\{([\s\S]*?)\}/);
    expect(finalCtaRule?.[1]).toBeTruthy();
    expect(finalCtaRule![1]).not.toMatch(/\banimation\s*:/);
    expect(landingCss).not.toMatch(/@keyframes landing-final-cta-drift/);
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
    expect(screen.getByText('Gids')).toBeInTheDocument();
    expect(screen.getByText('Recepten')).toBeInTheDocument();
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

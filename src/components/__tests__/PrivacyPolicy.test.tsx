import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PrivacyPolicy } from '@/components/legal/PrivacyPolicy';

describe('PrivacyPolicy', () => {
  it('renders required Dutch privacy content', () => {
    render(<PrivacyPolicy />);

    expect(screen.getByRole('link', { name: '← Terug naar home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('heading', { level: 1, name: 'Privacybeleid' })).toBeInTheDocument();
    expect(screen.getByText(/Naam/i)).toBeInTheDocument();
    expect(screen.getByText(/E-mailadres/i)).toBeInTheDocument();
    expect(screen.getByText(/Gewicht/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Betalingen via Stripe/i })).toBeInTheDocument();
    expect(screen.getByText(/Geen trackingcookies/i)).toBeInTheDocument();
    expect(screen.getByText(/Geen verkoop van jouw persoonsgegevens/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'hello@slowcarb.nl' })).toHaveAttribute(
      'href',
      'mailto:hello@slowcarb.nl'
    );
  });

  it('keeps legal page visual contract classes', () => {
    const { container } = render(<PrivacyPolicy />);
    const main = container.querySelector('main');

    expect(main).toHaveClass('max-w-3xl', 'bg-cream', 'text-stone-800');
  });
});

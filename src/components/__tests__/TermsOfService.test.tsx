import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TermsOfService } from '@/components/legal/TermsOfService';

describe('TermsOfService', () => {
  it('renders required Dutch terms sections', () => {
    render(<TermsOfService />);

    expect(screen.getByRole('link', { name: '← Terug naar home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('heading', { level: 1, name: 'Algemene voorwaarden' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Wat is SlowCarb\?/i })).toBeInTheDocument();
    expect(screen.getByText(/PWA web-app/i)).toBeInTheDocument();
    expect(screen.getByText(/lifetime access/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Eenmalige betaling/i })).toBeInTheDocument();
    expect(screen.getByText(/geen maandabonnement/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Intellectueel eigendom/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Aansprakelijkheid/i })).toBeInTheDocument();
    expect(screen.getByText(/geen medisch advies/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Beeindiging/i })).toBeInTheDocument();
  });

  it('keeps legal page visual contract classes', () => {
    const { container } = render(<TermsOfService />);
    const main = container.querySelector('main');

    expect(main).toHaveClass('max-w-3xl', 'bg-cream', 'text-stone-800');
  });
});

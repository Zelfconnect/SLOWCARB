import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RefundPolicy } from '@/components/legal/RefundPolicy';

describe('RefundPolicy', () => {
  it('renders required Dutch refund content', () => {
    render(<RefundPolicy />);

    expect(screen.getByRole('link', { name: '← Terug naar home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('heading', { level: 1, name: 'Refundbeleid' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /30 dagen geld-terug garantie/i })).toBeInTheDocument();
    expect(screen.getByText(/volledige terugbetaling aanvragen/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Geen vragen/i })).toBeInTheDocument();
    expect(screen.getByText(/geen reden op te geven/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Hoe vraag je een refund aan\?/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'hello@slowcarb.nl' })).toHaveAttribute(
      'href',
      'mailto:hello@slowcarb.nl'
    );
    expect(screen.getByRole('heading', { level: 2, name: /Verwerkingstijd/i })).toBeInTheDocument();
    expect(screen.getByText(/5-7 werkdagen/i)).toBeInTheDocument();
  });

  it('keeps legal page visual contract classes', () => {
    const { container } = render(<RefundPolicy />);
    const main = container.querySelector('main');

    expect(main).toHaveClass('max-w-3xl', 'bg-cream', 'text-stone-800');
  });
});

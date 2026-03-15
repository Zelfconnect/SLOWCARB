import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LandingPageFinal from '@/components/LandingPageFinal';

describe('LandingPageFinal section parity', () => {
  it('includes all sections and anchor targets from the reviewed HTML source', () => {
    render(<LandingPageFinal />);

    expect(screen.getByRole('heading', { name: /8 tot 10/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Herkenbaar?' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Wat als afvallen simpeler was?' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Zo werkt de app' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'De 5 regels. Dat is alles.' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Waarom een militair een dieet-app bouwde.' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Alles wat je nodig hebt om de 5 regels vol te houden.' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Veelgestelde Vragen' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '5 regels. 6 weken. €47.' })).toBeInTheDocument();

    expect(document.getElementById('premium-app-showcase')).not.toBeNull();
    expect(document.getElementById('method')).not.toBeNull();
    expect(document.getElementById('founder')).not.toBeNull();
    expect(document.getElementById('reviews')).not.toBeNull();
    expect(document.getElementById('pricing')).not.toBeNull();
    expect(document.getElementById('faq')).not.toBeNull();
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LegalLayout } from '@/components/legal/LegalLayout';
import { useDocumentScroll } from '@/hooks/useDocumentScroll';

vi.mock('@/hooks/useDocumentScroll', () => ({
  useDocumentScroll: vi.fn(),
}));

describe('LegalLayout', () => {
  it('enables document scrolling for legal pages', () => {
    render(
      <LegalLayout title="Algemene voorwaarden" intro="Voorwaarden voor gebruik.">
        <section>
          <h2>Testsectie</h2>
          <p>Voorbeeldinhoud.</p>
        </section>
      </LegalLayout>
    );

    expect(useDocumentScroll).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('heading', { level: 1, name: 'Algemene voorwaarden' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /terug/i })).toHaveAttribute('href', '/');
  });
});

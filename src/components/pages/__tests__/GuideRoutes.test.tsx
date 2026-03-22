import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '@/App';

beforeEach(() => {
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
  localStorage.clear();
});

describe('Guide routes', () => {
  it('renders the guide index at /gids', async () => {
    render(
      <MemoryRouter initialEntries={['/gids']}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: 'Slow Carb Gids' }, { timeout: 10_000 })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Slow Carb Dieet: De Complete Gids/ })).toHaveAttribute('href', '/gids/slow-carb-dieet');
    expect(screen.getByRole('link', { name: /Slow Carb vs Keto: Welk Dieet Past bij Jou\?/ })).toHaveAttribute('href', '/gids/slow-carb-vs-keto');
  });

  it('lets the article breadcrumb navigate back to the guide index', async () => {
    render(
      <MemoryRouter initialEntries={['/gids/slow-carb-dieet']}>
        <App />
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole('heading', { name: 'Slow Carb Dieet: De Complete Gids' }, { timeout: 10_000 })
    ).toBeInTheDocument();

    const breadcrumbNav = screen.getByLabelText('Breadcrumb');
    fireEvent.click(within(breadcrumbNav).getByRole('link', { name: 'Gids' }));

    expect(await screen.findByRole('heading', { name: 'Slow Carb Gids' }, { timeout: 10_000 })).toBeInTheDocument();
  });
});

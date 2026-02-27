import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BottomNav } from '@/components/BottomNav';

describe('BottomNav UI/UX', () => {
  it('renders all 4 tabs and emits selected tab id on click', () => {
    const onTabChange = vi.fn();
    render(<BottomNav activeTab="dashboard" onTabChange={onTabChange} />);

    const labels = ['Dashboard', 'Recepten', 'Leren', 'AmmoCheck'];
    for (const label of labels) {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
    }

    fireEvent.click(screen.getByRole('button', { name: 'Recepten' }));
    fireEvent.click(screen.getByRole('button', { name: 'Leren' }));
    expect(onTabChange).toHaveBeenNthCalledWith(1, 'recipes');
    expect(onTabChange).toHaveBeenNthCalledWith(2, 'learn');
  });

  it('applies active-state style contract to selected tab', () => {
    render(<BottomNav activeTab="ammo" onTabChange={vi.fn()} />);
    const shoppingTab = screen.getByRole('button', { name: 'AmmoCheck' });
    expect(shoppingTab.className).toContain('text-sage-600');
    expect(shoppingTab.className).toContain('shrink-0');

    const activeIconContainer = shoppingTab.querySelector('div');
    expect(activeIconContainer?.className).toContain('bg-sage-50');
  });

  it('keeps fixed nav safe-area aware in Safari', () => {
    const { container } = render(<BottomNav activeTab="dashboard" onTabChange={vi.fn()} />);
    const nav = container.querySelector('nav');
    expect(nav).toHaveStyle({
      height: 'calc(5rem + env(safe-area-inset-bottom, 0px))',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    });
  });
});

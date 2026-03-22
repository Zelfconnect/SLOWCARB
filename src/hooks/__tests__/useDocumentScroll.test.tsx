import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { useDocumentScroll } from '@/hooks/useDocumentScroll';

function RecipeStub() {
  useDocumentScroll();
  const navigate = useNavigate();
  return (
    <div>
      <button type="button" onClick={() => navigate('/recepten/other')}>
        Volgende recept
      </button>
    </div>
  );
}

describe('useDocumentScroll', () => {
  it('scrolls to top when the pathname changes while the same route component stays mounted', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

    render(
      <MemoryRouter initialEntries={['/recepten/first']}>
        <Routes>
          <Route path="/recepten/:slug" element={<RecipeStub />} />
        </Routes>
      </MemoryRouter>
    );

    scrollTo.mockClear();

    fireEvent.click(screen.getByRole('button', { name: 'Volgende recept' }));

    expect(scrollTo).toHaveBeenCalledWith(0, 0);

    scrollTo.mockRestore();
  });

  it('enables and restores document scrolling on mount and unmount', () => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);

    const { unmount } = render(
      <MemoryRouter initialEntries={['/recepten/first']}>
        <Routes>
          <Route path="/recepten/:slug" element={<RecipeStub />} />
        </Routes>
      </MemoryRouter>
    );

    expect(document.body.style.overflow).toBe('auto');
    expect(document.body.style.height).toBe('auto');
    expect(root.style.overflow).toBe('visible');
    expect(root.style.height).toBe('auto');

    unmount();

    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.height).toBe('');
    expect(root.style.overflow).toBe('');
    expect(root.style.height).toBe('');

    root.remove();
  });
});

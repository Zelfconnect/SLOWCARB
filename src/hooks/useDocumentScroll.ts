import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Enables native document scrolling for public pages.
 * The app shell sets overflow:hidden on body/#root to manage its own scroll container.
 * Public pages (landing, articles, recipes) need document-level scrolling instead.
 *
 * Scrolls the window to the top whenever the URL pathname changes. Without this,
 * React Router reuses the same page component for e.g. `/recepten/a` → `/recepten/b`
 * and the previous scroll position would persist.
 */
export function useDocumentScroll() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const root = document.getElementById('root');
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    if (root) {
      root.style.overflow = 'visible';
      root.style.height = 'auto';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
      if (root) {
        root.style.overflow = '';
        root.style.height = '';
      }
    };
  }, []);
}

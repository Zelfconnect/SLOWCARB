import { useEffect } from 'react';

/**
 * Enables native document scrolling for public pages.
 * The app shell sets overflow:hidden on body/#root to manage its own scroll container.
 * Public pages (landing, articles, recipes) need document-level scrolling instead.
 */
export function useDocumentScroll() {
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

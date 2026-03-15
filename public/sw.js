const CACHE_NAME = 'slowcarb-v3';
const APP_SHELL = ['/', '/index.html'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Never cache auth, API, or Supabase requests
  if (
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('stripe.com') ||
    url.pathname.startsWith('/api')
  ) {
    return;
  }

  // Only cache GET requests for static assets
  if (event.request.method !== 'GET') return;

  // Cache-first for images — instant after first load
  if (url.pathname.match(/\.(webp|jpg|jpeg|png|svg)$/i)) {
    event.respondWith(
      caches.match(event.request).then((cached) =>
        cached ||
        fetch(event.request).then((response) => {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
      )
    );
    return;
  }

  // Network-first for everything else
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      )
    )
  );
});

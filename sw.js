// iGraSpore Service Worker v2 — full offline cache
const CACHE_NAME = 'igraspore-v2-' + '20260812090000';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/privacy.html',
  '/favicon-32.png',
  '/icons/icon-192.png',
  '/icons/icon-256.png',
  '/icons/icon-384.png',
  '/icons/icon-512.png',
  '/icons/maskable-512.png',
];

// Runtime cache: cache everything as it's fetched
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(STATIC_ASSETS).catch(() => {})
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  
  // Only handle GET
  if (req.method !== 'GET') return;
  
  const url = new URL(req.url);
  
  // Skip cross-origin (analytics, fonts, etc.)
  if (url.origin !== self.location.origin) return;
  
  // Strategy: cache-first, then network, then fallback
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        // Update cache in background (stale-while-revalidate)
        fetch(req).then((resp) => {
          if (resp && resp.status === 200) {
            const clone = resp.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
        }).catch(() => {});
        return cached;
      }
      
      // Not in cache — fetch from network
      return fetch(req).then((resp) => {
        // Cache successful responses
        if (resp && resp.status === 200 && resp.type === 'basic') {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return resp;
      }).catch(() => {
        // Offline and not cached — try index.html fallback
        if (req.destination === 'document') {
          return caches.match('/index.html');
        }
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      });
    })
  );
});

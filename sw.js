// GyaanSetu Service Worker — Network First Strategy
// This ensures users ALWAYS get the latest version of the site.
// We only return cached files if the network request fails (offline fallback).

const CACHE_NAME = 'gyaansetu-v3';
const OFFLINE_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/firebase-config.js'
];

// On install: cache the offline shell
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Activate immediately, don't wait for old SW to die
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_ASSETS))
  );
});

// On activate: delete ALL old caches so stale files never persist
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // Take control of all open pages immediately
});

// On fetch: NETWORK FIRST — always try the live server first
// Only fall back to cache if the user is offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET and cross-origin requests (Firebase, YouTube, Jitsi etc.)
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Save a fresh copy in cache for offline use
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => {
        // Network failed — serve from cache as offline fallback
        return caches.match(event.request).then((cached) => cached || caches.match('./index.html'));
      })
  );
});

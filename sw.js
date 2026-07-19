/**
 * FitOS Service Worker - Offline caching
 */

const CACHE_NAME = 'fitos-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/design-system.css',
  './css/components.css',
  './css/pages.css',
  './js/app.js',
  './js/modules/db.js',
  './js/modules/router.js',
  './js/modules/ui.js',
  './js/modules/home.js',
  './js/modules/meals.js',
  './js/modules/workout.js',
  './js/data/meals.js',
  './js/data/workouts.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    }).catch(() => {
      if (event.request.mode === 'navigate') return caches.match('./index.html');
    })
  );
});

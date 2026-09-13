const CACHE_NAME = 'giani-hardayal-singh-v1';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/assets/styles.css',
  '/assets/giani-hardayal-singh.jpg',
  '/assets/app-icon-180.png',
  '/assets/app-icon-192.png',
  '/assets/app-icon-512.png',
  '/manifest.webmanifest'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then(r => r || caches.match('/index.html')))
  );
});

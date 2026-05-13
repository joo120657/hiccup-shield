const CACHE_NAME = 'hiccup-shield-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/icon.png',
  '/globals.css',
  'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

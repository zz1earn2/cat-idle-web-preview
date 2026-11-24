const CACHE = 'meowyard-v1';
const BASE = '/cat-idle-web-preview/';
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll([BASE, BASE + 'index.html', BASE + 'manifest.webmanifest'])));
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;
  event.respondWith(
    caches.match(event.request).then((hit) => {
      const fetched = fetch(event.request)
        .then((res) => {
          if (res && res.ok && (url.pathname.startsWith('/cat-idle-web-preview'))) {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          }
          return res;
        })
        .catch(() => hit || caches.match(BASE + 'index.html'));
      return hit || fetched;
    }),
  );
});

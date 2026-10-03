// Service worker: the whole app (code, data, pictures, sound) is saved on install, so it runs offline.
// The build (vite.config.ts) puts two lines above this file: VERSION, unique per build, and FILES,
// every file in dist/. A new deploy therefore changes this file, which is how the browser notices it.
/* global VERSION, FILES */

// The origin is shared with other apps on buildapp.se: only caches with this prefix are ours to delete.
const PREFIX = 'dinodeck-';
const CACHE = PREFIX + VERSION;

self.addEventListener('install', (event) => {
  // 'reload' skips the browser's own HTTP cache, which may hold ten-minute-old copies from the previous deploy.
  // addAll is all or nothing: if one file fails, this version is never installed and the old one keeps running.
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(FILES.map((file) => new Request(file, { cache: 'reload' }))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    // The page itself: network first, so a new deploy shows on the very next load. Saved copy when offline or slow.
    event.respondWith(
      fetch(request.url, { cache: 'no-cache', signal: AbortSignal.timeout(4000) }).catch(() =>
        caches.match('index.html', { cacheName: CACHE }),
      ),
    );
    return;
  }
  // Everything else: saved copy first. Script and style names change with their content, so they never go stale.
  // ignoreVary: a server that answers "Vary: Origin" made the saved script miss for <script crossorigin>,
  // which sends an Origin header the install request did not. These are our own static files: the URL is the whole key.
  event.respondWith(
    caches.match(request, { cacheName: CACHE, ignoreSearch: true, ignoreVary: true }).then((hit) => hit ?? fetch(request)),
  );
});

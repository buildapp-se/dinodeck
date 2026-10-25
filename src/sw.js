// Service worker: the whole app (code, data, pictures, sound) is saved on install, so it runs offline.
// The build (vite.config.ts) puts two lines above this file: VERSION, unique per build, and FILES,
// every file in dist/ as [name, content hash]. A new deploy therefore changes this file, which is how the browser notices it.
/* global VERSION, FILES */

// The origin is shared with other apps on buildapp.se: only caches with this prefix are ours to delete.
const PREFIX = 'dinodeck-';
const CACHE = PREFIX + VERSION;

self.addEventListener('install', (event) => {
  // Each file is saved under its content hash. A file whose content did not change is copied from the previous
  // version's cache, so a deploy downloads only what changed (all 11 MB once per deploy was the old way).
  // A changed file gets a new address, which skips both the CDN's copy (the previous deploy's for about ten minutes)
  // and, with 'reload', the browser's own HTTP cache (Cloudflare says four hours). Lookups below ignore the query.
  // All or nothing: if one file fails, this version is not installed and the old one keeps running. Files already
  // saved stay in this version's cache, so the next attempt fetches only the rest.
  const save = async (cache, [file, hash]) => {
    const url = `${file}?v=${hash}`;
    const kept = await caches.match(url);
    if (kept) return cache.put(url, kept);
    const response = await fetch(url, { cache: 'reload' });
    if (!response.ok) throw new Error(`${url}: ${response.status}`);
    return cache.put(url, response);
  };
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => Promise.all(FILES.map((entry) => save(cache, entry))))
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
    // The page itself: network first, so a new deploy shows on the very next load. Saved copy when offline, slow
    // or the server errs. A plain AbortController, not AbortSignal.timeout: that one needs Safari 16.
    const slow = new AbortController();
    setTimeout(() => slow.abort(), 4000);
    event.respondWith(
      fetch(request.url, { cache: 'no-cache', signal: slow.signal })
        .then((r) => (r.ok ? r : Promise.reject(new Error(String(r.status)))))
        .catch(() => caches.match('index.html', { cacheName: CACHE, ignoreSearch: true })),
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

/* MakeSense service worker: offline shell via runtime caching. */
const CACHE = "makesense-v2";
const APP_SHELL = ["/", "/dashboard", "/manifest.webmanifest", "/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Static assets: cache first.
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname === "/icon.svg" ||
    url.pathname === "/manifest.webmanifest"
  ) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((response) => {
            const copy = response.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
            return response;
          })
      )
    );
    return;
  }

  // Pages: network first, fall back to cache when offline.
  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((c) => c.put(request, copy));
        return response;
      })
      .catch(() =>
        caches.match(request).then((hit) => hit || caches.match("/dashboard"))
      )
  );
});

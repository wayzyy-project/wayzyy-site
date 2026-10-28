// Bumped so every browser drops the old cache, which could hold stale /api
// responses from the previous cache-everything rule.
const CACHE_NAME = "wayzyy-cache-v5";
const ASSETS = [
  "/",
  "/index.html",
  "/favicon.png",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

self.addEventListener("install", (event) => {
  self.skipWaiting(); // Force active immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim()) // Claim clients immediately
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Only our own files. Third-party requests (Google Maps tiles, Supabase,
  // image CDNs, analytics) go straight to the network - routing them through
  // this cache stalled the map's tiles and could serve stale API data.
  if (url.origin !== self.location.origin) return;

  // Network First for index.html / pages so new deployments load immediately
  if (event.request.mode === "navigate" || url.pathname === "/" || url.pathname.endsWith(".html")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((res) => {
            return res || caches.match("/index.html");
          });
        })
    );
    return;
  }

  // Cache First only for files whose name changes with their contents: the
  // hashed build output and the fixed icons precached above. Everything else
  // (/api/* data, /calendar/*.ics, sitemaps, images in /public) goes to the
  // network as normal - serving those cache-first kept a browser on the first
  // copy it ever saw, e.g. a host preview that never updated.
  const precached = ASSETS.includes(url.pathname) && url.pathname !== "/" && url.pathname !== "/index.html";
  if (!url.pathname.startsWith("/assets/") && !precached) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        return new Response("Asset not found", { status: 404, headers: { "Content-Type": "text/plain" } });
      });
    })
  );
});


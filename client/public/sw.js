// ==========================================
// AVORA SERVICE WORKER (`client/public/sw.js`)
// ==========================================
const CACHE_NAME = "avora-cache-v4";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/manifest.json?v=3",
  "/avoraLogoDark.png",
  "/avoraLogoLight.png",
  "/pwa-icon-192.png?v=3",
  "/pwa-icon-512.png?v=3"
];

// --- Install Service Worker & Cache Core Shell ---
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// --- Activate Service Worker & Clean Old Caches ---
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// --- Fetch Event (Network-first with Safe Cache Fallback) ---
self.addEventListener("fetch", (event) => {
  // Only intercept GET requests
  if (event.request.method !== "GET") return;

  // Skip browser extension requests or non-http
  if (!event.request.url.startsWith("http")) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache valid HTTP 200 GET responses
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        // Offline fallback to cache safely returning valid Response object
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        if (event.request.headers.get("accept")?.includes("text/html")) {
          const indexPage = await caches.match("/index.html");
          if (indexPage) {
            return indexPage;
          }
        }

        // Return a valid JSON fallback Response object so Chrome never throws TypeError
        return new Response(
          JSON.stringify({ message: "Network unavailable" }),
          {
            status: 503,
            headers: { "Content-Type": "application/json" },
          }
        );
      })
  );
});

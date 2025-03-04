const CACHE_NAME = "mlrs-cache-v1";
const OFFLINE_PAGE = "/offline.html";

// Files to cache
const ASSETS = [
    "/",
    "/index.html",
    "/manifest.json",
    "/icon.png",
    OFFLINE_PAGE
];

// Install event (Cache assets)
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// Fetch event (Serve from cache, fallback to offline)
self.addEventListener("fetch", (event) => {
    if (event.request.mode === "navigate") {
        event.respondWith(
            fetch(event.request)
                .catch(() => caches.match(OFFLINE_PAGE))
        );
    } else {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    }
});

// Activate event (Clean old caches)
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});
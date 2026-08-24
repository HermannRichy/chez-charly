const STATIC_CACHE = "cc-static-v1";
const OFFLINE_URL = "/offline";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll([OFFLINE_URL, "/logo-charly.png", "/android-chrome-192x192.png"])),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Uniquement les navigations (chargement de page) : le reste (données live,
// API) ne doit jamais être servi depuis un cache obsolète sur ce site.
self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return;

  event.respondWith(fetch(event.request).catch(() => caches.match(OFFLINE_URL)));
});

self.addEventListener("push", (event) => {
  if (!event.data) return;
  const data = event.data.json();

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/android-chrome-192x192.png",
      badge: "/android-chrome-192x192.png",
      data: { url: data.url || "/" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(clients.openWindow(url));
});

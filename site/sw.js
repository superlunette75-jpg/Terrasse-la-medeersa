/*
 * Service worker: makes the site open instantly and work on a weak connection, like an app.
 * - the app shell is cached on install
 * - pages: network first (always the latest menu), cache if offline
 * - images, fonts, scripts: cache first, refreshed in the background
 * Bump VERSION after every change to the site so phones pick up the new files.
 */
const VERSION = "medersa-v1";
const SHELL = [
  "./", "index.html", "styles.css", "cart.css", "data.js", "cart.js", "app.js", "whatsapp.js",
  "sound.js", "pwa.js", "manifest.webmanifest", "images/ornament.svg", "images/hero.webp",
  "icons/icon-192.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === location.origin;
  const isFont = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!sameOrigin && !isFont) return; // WhatsApp, maps…: straight to the network

  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); return res; })
        .catch(() => caches.match(req).then((r) => r || caches.match("index.html")))
    );
    return;
  }

  // stale-while-revalidate
  e.respondWith(
    caches.open(VERSION).then((cache) =>
      cache.match(req).then((cached) => {
        const network = fetch(req)
          .then((res) => { if (res.ok || res.type === "opaque") cache.put(req, res.clone()); return res; })
          .catch(() => cached);
        return cached || network;
      })
    )
  );
});

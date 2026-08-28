const CACHE_NAME = "elibrary-v1";
const FILES_TO_CACHE = [
  "index.html",
  "style.css",
  "images/emily.jpg",
  "images/stars.jpg",
  "images/hour.jpg",
  "images/magi.jpg",
  "images/emily-cover.jpg",
  "images/stars-cover.jpg",
  "images/hour-cover.jpg",
  "images/magi-cover.jpg"
];

// I-install at i-cache lahat
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
});

// Pag offline, kunin sa cache
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});

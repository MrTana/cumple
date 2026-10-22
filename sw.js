// Service worker: deja la app disponible sin conexión.
// Solo guarda archivos de esta misma página; Google y la People API siempre van directo a la red.
var CACHE = 'cumple-v1';
var SHELL = [
  './',
  'index.html',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png',
  'icons/favicon-32.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // Google, People API, etc.: sin tocar

  // Páginas: primero red (para recibir versiones nuevas), si no hay conexión, la copia guardada.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function (r) {
        var copia = r.clone();
        caches.open(CACHE).then(function (c) { c.put('index.html', copia); });
        return r;
      }).catch(function () {
        return caches.match('index.html').then(function (r) { return r || caches.match('./'); });
      })
    );
    return;
  }

  // Resto (iconos, manifest): copia guardada y se refresca en segundo plano.
  e.respondWith(
    caches.match(req).then(function (hit) {
      var red = fetch(req).then(function (r) {
        if (r && r.ok) { var copia = r.clone(); caches.open(CACHE).then(function (c) { c.put(req, copia); }); }
        return r;
      }).catch(function () { return hit; });
      return hit || red;
    })
  );
});

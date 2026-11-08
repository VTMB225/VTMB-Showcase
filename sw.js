const C = 'showcase-v33';
const ASSETS = ['./', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(ASSETS)).catch(() => { })); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  const key = e.request.mode === 'navigate' ? './' : e.request;
  // „no-cache“: immer beim Server nachfragen, damit neue Versionen sofort ankommen (GitHub Pages hält Seiten sonst 10 Minuten im Browser-Zwischenspeicher)
  e.respondWith(fetch(e.request.mode === 'navigate' ? new Request(e.request.url, { cache: 'no-cache', credentials: 'same-origin' }) : new Request(e.request, { cache: 'no-cache' })).then(r => { if (r.ok && !u.search.includes('code=')) { const cp = r.clone(); caches.open(C).then(c => c.put(key, cp)); } return r; }).catch(() => caches.match(key).then(r => r || caches.match('./'))));
});

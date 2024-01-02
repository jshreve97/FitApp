self.addEventListener('install', event => {
    event.waitUntil(
      caches.open('static-v1').then(cache => {
        return cache.addAll(['/', '/styles/main.css', '/scripts/main.js', '/index.html']);
      })
    );
  });
  
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  });
  
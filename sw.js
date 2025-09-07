const CACHE_NAME = 'spice-analyzer-v1.0.0';
const basePath = self.location.pathname.includes('/chi1i-bot/') ? '/chi1i-bot' : '';
const urlsToCache = [
  `${basePath}/`,
  `${basePath}/index.html`,
  `${basePath}/styles.css`,
  `${basePath}/js/performance-optimizer.js`,
  `${basePath}/js/state.js`,
  `${basePath}/js/compatibility.js`,
  `${basePath}/js/detailed-analysis.js`,
  `${basePath}/js/spice-mixture-analysis.js`,
  `${basePath}/js/comprehensive-analyzer.js`,
  `${basePath}/js/ui.js`,
  `${basePath}/js/app.js`,
  `${basePath}/data/products.json`,
  `${basePath}/data/methods.json`,
  `${basePath}/data/spices.json`,
  `${basePath}/manifest.json`
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Failed to cache resources:', error);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            if (event.request.destination === 'document') {
              return caches.match(`${basePath}/index.html`);
            }
          });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  return new Promise(resolve => {
    console.log('Background sync triggered');
    resolve();
  });
}

self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(`${basePath}/`)
  );
});

self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Новое обновление доступно',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect width="192" height="192" fill="%230f172a"/><text x="96" y="120" font-size="120" text-anchor="middle" fill="%234ade80">🌿</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="%230f172a"/><text x="48" y="60" font-size="60" text-anchor="middle" fill="%234ade80">🌿</text></svg>',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Открыть приложение',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23ffffff" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>'
      },
      {
        action: 'close',
        title: 'Закрыть',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23ffffff" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Анализатор специй', options)
  );
});
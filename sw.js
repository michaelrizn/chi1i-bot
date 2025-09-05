const CACHE_NAME = 'spice-analyzer-v1.0.0';
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    '/js/data/spices.js',
    '/js/data/products.js',
    '/js/data/cooking-methods.js',
    '/js/utils/compatibility.js',
    '/js/utils/explanation.js',
    '/js/utils/compatibility-system.js',
    '/js/utils/telegram-webapp.js',
    '/js/components/cloud.js',
    '/js/components/analysis.js',
    '/js/components/selection-interface.js'
];

const DYNAMIC_CACHE_URLS = [
    'https://telegram.org/js/telegram-web-app.js'
];

self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching static assets...');
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => {
                console.log('Static assets cached successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Failed to cache static assets:', error);
            })
    );
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker activated');
                return self.clients.claim();
            })
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    if (request.method !== 'GET') {
        return;
    }
    
    if (url.origin === location.origin) {
        event.respondWith(handleStaticAsset(request));
    } else if (DYNAMIC_CACHE_URLS.some(dynamicUrl => request.url.includes(dynamicUrl))) {
        event.respondWith(handleDynamicAsset(request));
    } else {
        event.respondWith(handleExternalRequest(request));
    }
});

async function handleStaticAsset(request) {
    try {
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            console.log('Serving from cache:', request.url);
            return cachedResponse;
        }
        
        console.log('Fetching and caching:', request.url);
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Failed to handle static asset:', request.url, error);
        
        if (request.url.endsWith('.html') || request.url === location.origin + '/') {
            const cachedIndex = await caches.match('/index.html');
            if (cachedIndex) {
                return cachedIndex;
            }
        }
        
        return new Response('Offline - Resource not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

async function handleDynamicAsset(request) {
    try {
        console.log('Fetching dynamic asset:', request.url);
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('Network failed, trying cache for:', request.url);
        
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        console.error('Failed to handle dynamic asset:', request.url, error);
        return new Response('Offline - Dynamic resource not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

async function handleExternalRequest(request) {
    try {
        const networkResponse = await fetch(request);
        return networkResponse;
    } catch (error) {
        console.log('External request failed:', request.url, error);
        
        return new Response('Offline - External resource not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.delete(CACHE_NAME)
            .then(() => {
                event.ports[0].postMessage({ success: true });
            })
            .catch((error) => {
                event.ports[0].postMessage({ success: false, error: error.message });
            });
    }
});

self.addEventListener('sync', (event) => {
    console.log('Background sync triggered:', event.tag);
    
    if (event.tag === 'background-analysis') {
        event.waitUntil(performBackgroundAnalysis());
    }
});

async function performBackgroundAnalysis() {
    try {
        console.log('Performing background analysis...');
        
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'BACKGROUND_ANALYSIS_COMPLETE',
                data: { timestamp: Date.now() }
            });
        });
    } catch (error) {
        console.error('Background analysis failed:', error);
    }
}

self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event.notification.tag);
    
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({ type: 'window' })
            .then((clientList) => {
                if (clientList.length > 0) {
                    return clientList[0].focus();
                }
                return clients.openWindow('/');
            })
    );
});

self.addEventListener('push', (event) => {
    console.log('Push message received:', event);
    
    const options = {
        body: 'Новые рекомендации по специям доступны!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        tag: 'spice-recommendation',
        requireInteraction: true,
        actions: [
            {
                action: 'open',
                title: 'Открыть приложение'
            },
            {
                action: 'dismiss',
                title: 'Отклонить'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Анализатор специй', options)
    );
});

console.log('Service Worker loaded successfully');
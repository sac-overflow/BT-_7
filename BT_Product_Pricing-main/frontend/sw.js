// Credexa Product Pricing Management System - Service Worker

const CACHE_NAME = 'credexa-pricing-v1.0.0';
const STATIC_CACHE = 'credexa-static-v1';
const DYNAMIC_CACHE = 'credexa-dynamic-v1';

// Files to cache for offline functionality
const STATIC_FILES = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.min.js',
    'https://cdn.jsdelivr.net/npm/axios@1.5.0/dist/axios.min.js',
    'https://unpkg.com/aos@2.3.1/dist/aos.js'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
    /\/api\/products/,
    /\/api\/roles/,
    /\/api\/charges/,
    /\/api\/business-rules/,
    /\/api\/transaction-types/,
    /\/api\/dashboard\/stats/
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('🔧 Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('📦 Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('✅ Service Worker: Static files cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Service Worker: Failed to cache static files', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('🚀 Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('🗑️ Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker: Activated successfully');
                return self.clients.claim();
            })
            .catch(error => {
                console.error('❌ Service Worker: Activation failed', error);
            })
    );
});

// Fetch event - serve cached content and implement strategies
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Handle different types of requests
    if (isStaticFile(request)) {
        event.respondWith(cacheFirstStrategy(request));
    } else if (isAPIRequest(request)) {
        event.respondWith(networkFirstStrategy(request));
    } else if (isExternalResource(request)) {
        event.respondWith(staleWhileRevalidateStrategy(request));
    } else {
        event.respondWith(networkFirstStrategy(request));
    }
});

// Cache First Strategy - for static files
async function cacheFirstStrategy(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Cache first strategy failed:', error);
        return new Response('Offline content not available', { status: 503 });
    }
}

// Network First Strategy - for API requests
async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('Network failed, trying cache for:', request.url);
        
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline fallback for API requests
        if (isAPIRequest(request)) {
            return new Response(JSON.stringify({
                error: 'Network unavailable',
                offline: true,
                message: 'Please check your internet connection'
            }), {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        return new Response('Offline content not available', { status: 503 });
    }
}

// Stale While Revalidate Strategy - for external resources
async function staleWhileRevalidateStrategy(request) {
    const cachedResponse = await caches.match(request);
    
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
            const cache = caches.open(DYNAMIC_CACHE);
            cache.then(c => c.put(request, networkResponse.clone()));
        }
        return networkResponse;
    }).catch(() => cachedResponse);
    
    return cachedResponse || fetchPromise;
}

// Helper functions
function isStaticFile(request) {
    const url = new URL(request.url);
    return url.pathname.endsWith('.html') ||
           url.pathname.endsWith('.css') ||
           url.pathname.endsWith('.js') ||
           url.pathname.endsWith('.json') ||
           url.pathname === '/';
}

function isAPIRequest(request) {
    const url = new URL(request.url);
    return url.pathname.startsWith('/api/') ||
           API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname));
}

function isExternalResource(request) {
    const url = new URL(request.url);
    return url.hostname.includes('cdnjs.cloudflare.com') ||
           url.hostname.includes('fonts.googleapis.com') ||
           url.hostname.includes('cdn.jsdelivr.net') ||
           url.hostname.includes('unpkg.com');
}

// Background Sync for offline actions
self.addEventListener('sync', event => {
    console.log('🔄 Service Worker: Background sync triggered', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Get pending offline actions from IndexedDB
        const pendingActions = await getPendingActions();
        
        for (const action of pendingActions) {
            try {
                await processOfflineAction(action);
                await removePendingAction(action.id);
            } catch (error) {
                console.error('Failed to process offline action:', action, error);
            }
        }
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Push notifications
self.addEventListener('push', event => {
    console.log('📱 Service Worker: Push notification received');
    
    const options = {
        body: 'You have new updates in Credexa Pricing System',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'View Dashboard',
                icon: '/icons/checkmark.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/icons/xmark.png'
            }
        ],
        tag: 'credexa-notification',
        requireInteraction: true
    };
    
    if (event.data) {
        const data = event.data.json();
        options.body = data.body || options.body;
        options.data = { ...options.data, ...data };
    }
    
    event.waitUntil(
        self.registration.showNotification('Credexa Pricing System', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
    console.log('🔔 Service Worker: Notification clicked');
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/?page=dashboard')
        );
    } else if (event.action === 'close') {
        // Just close the notification
        return;
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handling from main thread
self.addEventListener('message', event => {
    console.log('💬 Service Worker: Message received', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
    
    if (event.data && event.data.type === 'CACHE_API_RESPONSE') {
        const { request, response } = event.data;
        cacheAPIResponse(request, response);
    }
});

// Cache API response for offline use
async function cacheAPIResponse(request, response) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        await cache.put(request, response);
        console.log('📦 Service Worker: API response cached', request.url);
    } catch (error) {
        console.error('❌ Service Worker: Failed to cache API response', error);
    }
}

// IndexedDB operations for offline actions
async function getPendingActions() {
    // This would typically use IndexedDB to store pending actions
    // For now, return empty array
    return [];
}

async function processOfflineAction(action) {
    // Process offline action when network is available
    console.log('🔄 Processing offline action:', action);
}

async function removePendingAction(actionId) {
    // Remove processed action from IndexedDB
    console.log('✅ Removed pending action:', actionId);
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', event => {
    if (event.tag === 'content-sync') {
        event.waitUntil(doPeriodicSync());
    }
});

async function doPeriodicSync() {
    console.log('⏰ Service Worker: Periodic sync triggered');
    
    try {
        // Sync dashboard data, recent activity, etc.
        await syncDashboardData();
        await syncRecentActivity();
    } catch (error) {
        console.error('Periodic sync failed:', error);
    }
}

async function syncDashboardData() {
    // Sync dashboard statistics
    console.log('📊 Syncing dashboard data...');
}

async function syncRecentActivity() {
    // Sync recent activity feed
    console.log('📝 Syncing recent activity...');
}

// Error handling
self.addEventListener('error', event => {
    console.error('❌ Service Worker: Error occurred', event.error);
});

self.addEventListener('unhandledrejection', event => {
    console.error('❌ Service Worker: Unhandled promise rejection', event.reason);
});

console.log('🚀 Service Worker: Script loaded successfully');


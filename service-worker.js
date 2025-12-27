const CACHE_NAME = 'habit-tracker-v2';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json'
];

let scheduledNotifications = [];
let notificationCheckInterval = null;

// Install service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Handle messages from the app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATIONS') {
    scheduledNotifications = event.data.habits || [];
    startNotificationScheduler();
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return clients.openWindow('./');
      })
  );
});

function startNotificationScheduler() {
  // Clear existing interval
  if (notificationCheckInterval) {
    clearInterval(notificationCheckInterval);
  }

  // Check for notifications every minute (60000ms)
  notificationCheckInterval = setInterval(() => {
    checkAndShowNotifications();
  }, 60000);

  // Check immediately when starting
  checkAndShowNotifications();
}

function checkAndShowNotifications() {
  if (scheduledNotifications.length === 0) return;

  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Current time in minutes since midnight
  const today = now.toISOString().split('T')[0];

  scheduledNotifications.forEach(habit => {
    if (!habit.notificationTime) return;

    const [hours, minutes] = habit.notificationTime.split(':').map(Number);
    const notificationTime = hours * 60 + minutes;

    // Check if it's time to show notification (within 1 minute window)
    const timeDiff = Math.abs(currentTime - notificationTime);
    
    if (timeDiff <= 1) {
      // Use tag to prevent duplicate notifications for the same habit on the same day
      const notificationKey = `habit-${habit.id}-${today}`;
      
      // Show notification
      self.registration.showNotification(`Time for: ${habit.name}`, {
        body: `Don't forget to complete your habit: ${habit.name}`,
        icon: './icon-192.png',
        badge: './icon-192.png',
        tag: notificationKey, // This prevents duplicate notifications
        requireInteraction: false,
        vibrate: [200, 100, 200],
        data: {
          habitId: habit.id,
          url: './'
        }
      }).catch(err => {
        console.error('Error showing notification:', err);
      });
    }
  });
}

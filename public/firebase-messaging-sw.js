// Using compat scripts to match index.html
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyDK0yKKGvh_I2xk-w4qmWrWBQrJmbCQkuA",
    authDomain: "second-hand-app-2a0d3.firebaseapp.com",
    projectId: "second-hand-app-2a0d3",
    storageBucket: "second-hand-app-2a0d3.appspot.com",
    messagingSenderId: "747252196826",
    appId: "1:747252196826:web:41b5ea1eadbbe0049f0ce3",
    measurementId: "G-RQH5E5H8JD"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle incoming messages when the app is in the background or closed
messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload,
  );
  
  // The payload from a data-only message is in payload.data
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: payload.data.icon || '/images/icons/icon-192x192.png',
    badge: payload.data.badge || '/images/icons/icon-192x192.png',
    data: { 
        url: payload.data.url || '/'
    }
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.notification);
  
  event.notification.close();

  const urlToOpen = new URL(event.notification.data.url, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

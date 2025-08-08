// importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// firebase.initializeApp({
//   apiKey: "AIzaSyDiXX3RK_b7pZhbM2nDnOnrs7m4itehEG8",
//   authDomain: "nomicsai-ff38d.firebaseapp.com",
//   projectId: "nomicsai-ff38d",
//   storageBucket: "nomicsai-ff38d.firebasestorage.app",
//   messagingSenderId: "380740394783",
//   appId: "1:380740394783:web:ecc4414e885aefa7859a2a",
//   measurementId: "G-891SKHHT6K"
// });

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log('Received background message ', payload);
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: '/firebase-logo.png'
//   };
//   self.registration.showNotification(notificationTitle, notificationOptions);
// });


importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

console.log('🔄 Service Worker loaded');

firebase.initializeApp({
  apiKey: "AIzaSyDiXX3RK_b7pZhbM2nDnOnrs7m4itehEG8",
  authDomain: "nomicsai-ff38d.firebaseapp.com",
  projectId: "nomicsai-ff38d",
  storageBucket: "nomicsai-ff38d.firebasestorage.app",
  messagingSenderId: "380740394783",
  appId: "1:380740394783:web:ecc4414e885aefa7859a2a",
  measurementId: "G-891SKHHT6K"
});

const messaging = firebase.messaging();

console.log('✅ Firebase messaging initialized in service worker');

messaging.onBackgroundMessage((payload) => {
  console.log('📨 Received background message:', payload);
  
  const notificationTitle = payload.notification?.title || 'New Message';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/firebase-logo.png',
    badge: '/badge-icon.png',
    tag: 'notification-tag',
    requireInteraction: false,
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };
  
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('🖱️ Notification clicked:', event);
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('✅ Service Worker setup complete');
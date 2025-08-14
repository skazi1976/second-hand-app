// Import and configure the Firebase SDK
// NOTE: This file must be in the root of your project
importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-messaging-compat.js');

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

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload,
  );
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/images/icons/icon-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

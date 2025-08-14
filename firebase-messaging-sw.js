// Import the Firebase SDK for the service worker
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getMessaging, onBackgroundMessage } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-messaging.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDK0yKKGvh_I2xk-w4qmWrWBQrJmbCQkuA",
    authDomain: "second-hand-app-2a0d3.firebaseapp.com",
    projectId: "second-hand-app-2a0d3",
    storageBucket: "second-hand-app-2a0d3.appspot.com",
    messagingSenderId: "747252196826",
    appId: "1:747252196826:web:41b5ea1eadbbe0049f0ce3",
    measurementId: "G-RQH5E5H8JD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Handler for background messages
onBackgroundMessage(messaging, (payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload,
  );
  
  // Customize the notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/images/icons/icon-192x192.png' // Make sure you have this icon in your project
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

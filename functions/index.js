const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const {getMessaging} = require("firebase-admin/messaging");

initializeApp();

exports.sendPushNotification = onDocumentCreated("users/{userId}/notifications/{notificationId}", async (event) => {
    const snap = event.data;
    if (!snap) {
        console.log("No data associated with the event");
        return;
    }
    const notificationData = snap.data();
    const userId = event.params.userId;

    // Get the recipient's FCM token from their user document
    const userDoc = await getFirestore().collection("users").doc(userId).get();
    if (!userDoc.exists) {
        console.log(`User document not found for userId: ${userId}`);
        return;
    }
    const fcmToken = userDoc.data().fcmToken;

    if (!fcmToken) {
      console.log("User does not have an FCM token. Cannot send notification.");
      return;
    }

    // "data-only" payload to ensure the service worker always handles it.
    const payload = {
      data: {
        title: "התראה חדשה בסטייל מתגלגל!",
        body: notificationData.text,
        icon: "/images/icons/icon-192x192.png",
        badge: "/images/icons/icon-192x192.png", // Added for better mobile UX
        url: notificationData.url || '/' // URL to open on click
      }
    };

    try {
      const message = {
        token: fcmToken,
        data: payload.data
      };
      const response = await getMessaging().send(message);
      console.log("Successfully sent message:", response);
    } catch (error) {
      console.log("Error sending message:", error);
      // Optional: Clean up invalid tokens
      if (error.code === 'messaging/registration-token-not-registered') {
        await userDoc.ref.update({ fcmToken: null });
        console.log(`Removed invalid token for user: ${userId}`);
      }
    }
});

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

    const payload = {
      notification: {
        title: "התראה חדשה בסטייל מתגלגל!",
        body: notificationData.text,
        icon: "https://raw.githubusercontent.com/skazi1976/second-hand-app/main/ChatGPT%20Image%20Jul%2023%2C%202025%2C%2010_44_20%20AM%20copy.png",
      },
      data: {
        // Pass notification data to the client
        ...notificationData
      }
    };

    try {
      const response = await getMessaging().sendToDevice(fcmToken, payload);
      console.log("Successfully sent message:", response);
    } catch (error) {
      console.log("Error sending message:", error);
    }
});

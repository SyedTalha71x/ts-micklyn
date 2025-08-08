import { initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
let messagingInstance = null;

export const initializeMessaging = async () => {
  try {
    console.log("Initializing messaging...");

    const isMessagingSupported = await isSupported();
    if (!isMessagingSupported) {
      console.warn("Messaging not supported in this browser");
      return { success: false, error: "Messaging not supported" };
    }

    let registration;
    try {
      registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
        { scope: "/firebase-cloud-messaging-push-scope" }
      );

      await navigator.serviceWorker.ready;
      messagingInstance = getMessaging(app);

      return { success: true, messaging: messagingInstance, registration };
    } catch (swError) {
      console.error("Service worker registration failed:", swError);
    }
  } catch (error) {
    console.error("Error initializing messaging:", error);
    return { success: false, error: error.message };
  }
};

export const requestNotificationPermission = async () => {
  try {
    console.log("Requesting notification permission...");
    console.log("Current permission:", Notification.permission);

    if (Notification.permission === "granted") {
      console.log("Permission already granted");
      return true;
    }

    if (Notification.permission === "denied") {
      console.log("Permission denied by user");
      return false;
    }

    const permission = await Notification.requestPermission();
    console.log("Permission result:", permission);

    if (permission === "granted") {
      console.log("Permission granted");
      return true;
    } else {
      console.log("Permission not granted:", permission);
      return false;
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
};

export const requestFcmToken = async () => {
  try {
    console.log("Requesting FCM token...");

    if (!messagingInstance) {
      console.warn(
        "Messaging not initialized. Call initializeMessaging() first."
      );
      return null;
    }

    console.log("Messaging instance exists:", !!messagingInstance);

    // Ensure we have permission
    if (Notification.permission !== "granted") {
      console.warn(
        "No notification permission. Cannot get token. Current permission:",
        Notification.permission
      );
      return null;
    }

    console.log("Permission is granted, attempting to get token...");

    const vapidKey = import.meta.env.VITE_VAPID_KEY;
    console.log("Using VAPID key:", vapidKey.substring(0, 20) + "...");

    const token = await getToken(messagingInstance, {
      vapidKey: vapidKey,
    });

    console.log("Raw token result:", token);

    if (token) {
      console.log("FCM Token received:", token);
      return token;
    } else {
      console.log(" No registration token available - this could mean:");
      console.log("   1. Service worker not properly registered");
      console.log("   2. VAPID key doesn't match server configuration");
      console.log("   3. Browser blocking the request");
      console.log("   4. Network connectivity issues");
      return null;
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    return null;
  }
};

export const getTokenWithInit = async () => {
  try {

    const initResult = await initializeMessaging();
    if (!initResult.success) {
      console.error("Failed to initialize messaging:", initResult.error);
      return null;
    }

    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      console.log("No permission granted");
      return null;
    }

    const token = await requestFcmToken();
    return token;
  } catch (error) {
    console.error("Error in getTokenWithInit:", error);
    return null;
  }
};

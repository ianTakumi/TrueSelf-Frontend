importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyAKdmJjxWCEncFCHXd0akU-oREK97R_Cq4",
  authDomain: "trueself-6b7e7.firebaseapp.com",
  projectId: "trueself-6b7e7",
  storageBucket: "trueself-6b7e7.firebaseapp.com",
  messagingSenderId: "362916422094",
  appId: "1:362916422094:web:df38ff59865baa67d74b9f",
  measurementId: "G-TVQDD6BVX2",
});

// Get Firebase Messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image || "/firebase-logo.png", // Default icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

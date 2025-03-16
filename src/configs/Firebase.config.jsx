import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAKdmJjxWCEncFCHXd0akU-oREK97R_Cq4",
  authDomain: "trueself-6b7e7.firebaseapp.com",
  projectId: "trueself-6b7e7",
  storageBucket: "trueself-6b7e7.firebasestorage.app",
  messagingSenderId: "362916422094",
  appId: "1:362916422094:web:df38ff59865baa67d74b9f",
  measurementId: "G-TVQDD6BVX2",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const messaging = getMessaging(app);

export { auth, app, messaging };

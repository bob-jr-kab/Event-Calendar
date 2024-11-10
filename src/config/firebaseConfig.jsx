// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyCSOCHRU3uxVI_Q4mHsV8XxoqV0HYBx3FA",
  authDomain: "authenti5app.web.app",
  projectId: "authenti5app",
  storageBucket: "authenti5app.appspot.com", // Ensure these values are correct
  // messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  // appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore and export them
export const auth = getAuth(app);
export const db = getFirestore(app); // Firestore database instance

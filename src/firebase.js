import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"; // ✅ Import Firebase Storage

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA3WK1kv18nHbPQqMdQM078TppQdYcst28",
  authDomain: "mental-health-app-ffeb5.firebaseapp.com",
  projectId: "mental-health-app-ffeb5",
  storageBucket: "mental-health-app-ffeb5.appspot.com",
  messagingSenderId: "319056181590",
  appId: "1:319056181590:web:33ddee0b75b5f62a6abef7",
  measurementId: "G-ZVXW9N2T7Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); 
const analytics = getAnalytics(app);

export { app, auth, db, storage, analytics, signInWithEmailAndPassword, createUserWithEmailAndPassword };

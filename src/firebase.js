import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc, query, where,doc,getDoc, setDoc } from "firebase/firestore"; // ✅ Import these
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// ✅ Secure Firebase Config (Move sensitive keys to .env)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// ✅ Initialize Firebase Services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// ✅ Export Firebase utilities
export {
  app,
  auth,
  db,
  storage,
  analytics,
  where,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  collection, // ✅ Export collection
  query,
  getDocs,
  addDoc,
  doc, getDoc, setDoc,
};

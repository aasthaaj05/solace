import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA3WK1kv18nHbPQqMdQM078TppQdYcst28",
    authDomain: "mental-health-app-ffeb5.firebaseapp.com",
    projectId: "mental-health-app-ffeb5",
    storageBucket: "mental-health-app-ffeb5.firebasestorage.app",
    messagingSenderId: "319056181590",
    appId: "1:319056181590:web:33ddee0b75b5f62a6abef7",
    measurementId: "G-ZVXW9N2T7Y"
  };
  

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);



import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCfDPY0j4Zgdpb51jK9fyoHEXFa7qXFaRk",
  authDomain: "subtrack-5d7d1.firebaseapp.com",
  projectId: "subtrack-5d7d1",
  storageBucket: "subtrack-5d7d1.firebasestorage.app",
  messagingSenderId: "586277645670",
  appId: "1:586277645670:web:cd9c0b2a09e5bb402beca7",
  measurementId: "G-2MCL89NB70"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
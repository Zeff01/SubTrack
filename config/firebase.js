import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { initializeAuth  } from 'firebase/auth';
import { initializeAuth, getReactNativePersistence  } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyCfDPY0j4Zgdpb51jK9fyoHEXFa7qXFaRk",
  authDomain: "subtrack-5d7d1.firebaseapp.com",
  projectId: "subtrack-5d7d1",
  storageBucket: "subtrack-5d7d1.firebasestorage.app",
  messagingSenderId: "586277645670",
  appId: "1:586277645670:web:cd9c0b2a09e5bb402beca7",
  measurementId: "G-2MCL89NB70"
};

const app = initializeApp(firebaseConfig);
// const auth = initializeAuth(app);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(app);

export { app, auth, db };

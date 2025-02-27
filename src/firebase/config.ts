import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDSN2O4ct74StYellLehKXYPB_vHcmN2wY",
  authDomain: "parametre-c0a72.firebaseapp.com",
  projectId: "parametre-c0a72",
  storageBucket: "parametre-c0a72.firebasestorage.app",
  messagingSenderId: "948192269408",
  appId: "1:948192269408:web:9cd96dc8ed75718c175f05",
  measurementId: "G-2XGLYXWEKX"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Auth ve Firestore servislerini al
export const auth = getAuth(app);
export const db = getFirestore(app); 
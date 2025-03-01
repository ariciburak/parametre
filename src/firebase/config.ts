import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported, setAnalyticsCollectionEnabled } from 'firebase/analytics';
import { Platform } from 'react-native';

// Global tipini genişlet
declare global {
  interface NativeModuleProxy {
    setAnalyticsCollectionEnabled: (enabled: boolean) => void;
  }
  
  var nativeModuleProxy: NativeModuleProxy | undefined;
}

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

// Analytics'i başlat (eğer destekleniyorsa)
export const analytics = isSupported().then(async yes => {
  if (yes) {
    const analyticsInstance = getAnalytics(app);
    
    // Debug modunu etkinleştir
    if (__DEV__) {
      await setAnalyticsCollectionEnabled(analyticsInstance, true);
      console.log('Firebase Analytics debug mode is enabled');
      
      // Debug modunu zorla
      if (Platform.OS === 'ios') {
        await fetch('firebase-analytics-debug://');
      } else {
        // Android için debug modunu etkinleştir
        if (global.nativeModuleProxy) {
          global.nativeModuleProxy.setAnalyticsCollectionEnabled(true);
        }
      }
    }
    
    return analyticsInstance;
  }
  return null;
}); 
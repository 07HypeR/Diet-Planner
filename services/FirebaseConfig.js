import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "diet-planner-b06a5.firebaseapp.com",
  projectId: "diet-planner-b06a5",
  storageBucket: "diet-planner-b06a5.firebasestorage.app",
  messagingSenderId: "908524552983",
  appId: "1:908524552983:web:84549cffe2b479f0112d52",
  measurementId: "G-JLQJVHDJF7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Use getReactNativePersistence only for non-web (i.e., React Native)
export const auth =
  Platform.OS === "web"
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage),
      });

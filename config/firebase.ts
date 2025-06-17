// config/firebase.ts
import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANNw7NrJ0FR7agcNrLzNGqanLdpES_684",
  authDomain: "kitchensentinel-2b488.firebaseapp.com",
  databaseURL: "https://kitchensentinel-2b488-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kitchensentinel-2b488",
  storageBucket: "kitchensentinel-2b488.appspot.com",
  messagingSenderId: "849797552148",
  appId: "1:849797552148:web:6d891ae6d4f21eb9536f01"
};

// Prevent Firebase from initializing more than once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize and export database
export const database = getDatabase(app);
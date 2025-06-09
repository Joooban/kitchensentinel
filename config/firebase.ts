// config/firebase.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANNw7NrJ0FR7agcNrLzNGqanLdpES_684",
  authDomain: "kitchensentinel-2b488.firebaseapp.com",
  databaseURL: "https://kitchensentinel-2b488-default-rtdb.asia-southeast1.firebasedatabase.app", // ADDED: Correct database URL
  projectId: "kitchensentinel-2b488",
  storageBucket: "kitchensentinel-2b488.firebasestorage.app",
  messagingSenderId: "849797552148",
  appId: "1:849797552148:web:6d891ae6d4f21eb9536f01"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export database
export const database = getDatabase(app);
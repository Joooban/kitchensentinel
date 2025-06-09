// Replace with your own Firebase config
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyANNw7NrJ0FR7agcNrLzNGqanLdpES_684",
  authDomain: "kitchensentinel-2b488.firebaseapp.com",
  projectId: "kitchensentinel-2b488",
  storageBucket: "kitchensentinel-2b488.firebasestorage.app",
  messagingSenderId: "849797552148",
  appId: "1:849797552148:web:6d891ae6d4f21eb9536f01"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

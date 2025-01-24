import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyC3umr3B_-6olFtlvCGsks0S8NVuijAMbc",
  authDomain: "cycle-checkpoint.firebaseapp.com",
  projectId: "cycle-checkpoint",
  storageBucket: "cycle-checkpoint.firebasestorage.app",
  messagingSenderId: "542253674434",
  appId: "1:542253674434:web:a2f5741acde5c02860b05b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
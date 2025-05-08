import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzhubdj4yd1TCoFjifY7rNu8lMM-kHOK4",
  authDomain: "taskflowbysabaree.firebaseapp.com",
  projectId: "taskflowbysabaree",
  storageBucket: "taskflowbysabaree.appspot.com",
  messagingSenderId: "540617773620",
  appId: "1:540617773620:web:fca14febdb4dbcbb9eb061",
  measurementId: "G-LVG4RSVV6Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Auth functions
export const loginUser = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const registerUser = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const logoutUser = () => {
  return signOut(auth);
};

export { auth, db };
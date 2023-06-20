// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyArq6oR38kwZNLHQE9CciV3fP4JTLFAyGs",
  authDomain: "taskpro-2ac88.firebaseapp.com",
  projectId: "taskpro-2ac88",
  storageBucket: "taskpro-2ac88.appspot.com",
  messagingSenderId: "942795955654",
  appId: "1:942795955654:web:5ed1cffb62a11f4a3426c7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

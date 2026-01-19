// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // For user authentication

// TODO: Replace these with your actual Firebase project configuration!
const firebaseConfig = {
    apiKey: "AIzaSyBiYpgD-XoEabHDqM7ySlt58BpJPyf63Js",
    authDomain: "stoic-quest.firebaseapp.com",
    projectId: "stoic-quest",
    storageBucket: "stoic-quest.firebasestorage.app",
    messagingSenderId: "799539318422",
    appId: "1:799539318422:web:2049b609324f9f673ffcb7",
    measurementId: "G-MHRR5KVLDJ"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Export the instances you'll need in other parts of your app
export { db, auth, app }; // Export 'app' if you need it for other Firebase services
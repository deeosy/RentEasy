// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getAuth, signInWithCustomToken } from 'firebase/auth'  // add firebase auth

// Firebase configuration using environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
export const storage = getStorage(app);

//Initialize Firebase Authentication
export const auth = getAuth(app)

// function to sign in with custom token
export const signInWithFirebaseToken = async (firebaseToken) => {
    try {
        await signInWithCustomToken(auth, firebaseToken);
        console.log('Signed in to Firebase successfully');        
    } catch (err) {
        console.error('Firebase sign-in error: ', err);
        throw err
    }
}
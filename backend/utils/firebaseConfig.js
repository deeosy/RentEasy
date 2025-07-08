// const admin = require('firebase-admin');
// require('dotenv').config();

// const serviceAccount = require('../firebase/serviceAccountKey.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
// });

// module.exports = admin;

// Import Firebase Admin SDK and environment variables
const admin = require('firebase-admin');
require('dotenv').config();

// Load the Firebase service account key (contains credentials for Firebase)
const serviceAccount = require('../firebase/serviceAccountKey.json');

// Validate required environment variables
if (!process.env.FIREBASE_STORAGE_BUCKET) {
  throw new Error('FIREBASE_STORAGE_BUCKET is not defined in .env file');
}

// Initialize Firebase Admin SDK
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
} catch (err) {
  console.error('Firebase initialization error:', err.message);
  throw new Error('Failed to initialize Firebase: ' + err.message);
}

// Export the Firebase admin instance
module.exports = admin;
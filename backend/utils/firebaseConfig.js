const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

module.exports = admin;



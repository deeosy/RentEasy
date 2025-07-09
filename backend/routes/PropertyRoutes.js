// const express = require('express')
// const { createProperty, confirmPropertyPayment, getAllProperties, upload } = require('../controllers/PropertyControllers')
// const authMiddleware = require('../middleware/authMiddleware')

// const router = express.Router();

// router.post('/properties', authMiddleware, upload.array('images', 5), createProperty);
// router.post('/properties/confirm-payment', authMiddleware, confirmPropertyPayment);
// router.get('/properties', getAllProperties);


// module.exports = router

// Import required modules
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createProperty, confirmPayment, getProperties } = require('../controllers/PropertyControllers');
const authMiddleware = require('../middleware/authMiddleware');

// Configure multer for file uploads (store in memory for Firebase)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 }, // 5MB per file, max 5 files
});

// Routes for properties
router.get('/', getProperties); // Get all properties
router.post('/', authMiddleware, upload.array('images', 5), (req, res, next) => {
  console.log('POST /api/properties received:', {
    body: req.body,
    files: req.files ? req.files.map(f => f.originalname) : [],
  });
  createProperty(req, res, next);
}); // Create a new property
router.post('/confirm-payment', authMiddleware, confirmPayment); // Confirm payment and save property

module.exports = router;
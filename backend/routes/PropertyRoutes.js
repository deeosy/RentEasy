// const express = require('express')
// const { createProperty, confirmPropertyPayment, getAllProperties, upload } = require('../controllers/PropertyControllers')
// const authMiddleware = require('../middleware/authMiddleware')

// const router = express.Router();

// router.post('/properties', authMiddleware, upload.array('images', 5), createProperty);
// router.post('/properties/confirm-payment', authMiddleware, confirmPropertyPayment);
// router.get('/properties', getAllProperties);


// module.exports = router

const express = require('express');
const { createProperty, confirmPayment, getProperties, getPropertyById } = require('../controllers/PropertyControllers');
const { authenticate } = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');

// Debugging imports
console.log('authenticate:', typeof authenticate);
console.log('upload.array:', typeof upload.array);
console.log('createProperty:', typeof createProperty);
console.log('confirmPayment:', typeof confirmPayment);
console.log('getProperties:', typeof getProperties);
console.log('getPropertyById:', typeof getPropertyById);

const router = express.Router();

// Routes for property management
router.post('/', authenticate, upload.array('images', 5), createProperty);
router.post('/confirm-payment', authenticate, confirmPayment);
router.get('/', getProperties);
router.get('/:id', getPropertyById);

module.exports = router;
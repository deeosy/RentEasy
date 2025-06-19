const express = require('express')
const { createProperty, confirmPropertyPayment, getAllProperties, upload } = require('../controllers/PropertyControllers')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router();

router.post('/properties', authMiddleware, upload.array('images', 5), createProperty);
router.post('/properties/confirm-payment', authMiddleware, confirmPropertyPayment);
router.get('/properties', getAllProperties);


module.exports = router
const PropertyModel = require('../models/PropertyModel')
const UserModel = require('../models/UserModel')
const axios = require('axios')
const { uploadImagesToFirebase } = require('../utils/firebaseStorage')
const multer = require('multer');
require('dotenv').config()

const storage = multer.memoryStorage();
const upload = multer({ storage })

const InitializePaystackPayment = async (params) => {
    try {
        
    } catch (error) {
        
    }
}



const verifyPaystackPayment = async (params) => {
    try {
        
    } catch (error) {
        
    }
}



const createProperty = async (req, res) => {
    try {
        const { title, description, price, location, type } = req.body;
        const userId = req.user.id;
        const files = req.files;

        if (!title || !description || !price || !location || !type){
            return res.status(400).json({message: 'All required fields must be provided'})
        }

        // Validate Ghana Post Address format if provided
        if(location.ghanaPostAddress && !/^[A-Z]{2}-[0-9]{3}-[0-9]{4}$/.test(location.ghanaPostAddress)){
            return res.status(400).json({message: 'Invalid Ghana Post Digital Address format'})
        }

        //Upload images to Firebase Storage
        const imageUrls = files && files.length > 0 ? await uploadImagesToFirebase(files, userId) : [];

        // count user's existing listings
        const user = await UserModel.findById(userId);
        const listingCount = await PropertyModel.countDocuments({ userId });
        let paymentRequired = false;
        let amount = 0;

        // pricing logic
        if(listingCount >= 2 && listingCount < 5){
            paymentRequired = true;
            amount=50.00; // 50.00 GHS
        } else if(listingCount >= 5 && listingCount < 25){
            paymentRequired = true;
            amount = 70.00; // 70.00 GHS
        }

        // Initialize Paystack payment



        // Create property if no payment is required
        const property = new PropertyModel({
            userId,
            title,
            description,
            price,
            location: JSON.parse(location), // parse JSON string from form data
            images: imageUrls,
            type,
        });

        await property.save();

        res.status(201).json({message: 'Property created successfully', property});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});        
    }
}



const confirmPropertyPayment = async (req, res) => {
    try {
        
    } catch (err) {
        
    }
}



const getAllProperties = async (req, res) => {
    try {
        const properties = await PropertyModel.find().populate('userId', 'username email');
        res.status(200).json({ properties });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error '});        
    }    
}


module.exports = {createProperty, confirmPropertyPayment, getAllProperties, upload}
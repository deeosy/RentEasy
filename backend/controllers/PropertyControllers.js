const PropertyModel = require('../models/PropertyModel')
const UserModel = require('../models/UserModel')
const axios = require('axios')
const { uploadImagesToFirebase } = require('../utils/firebaseStorage')
const multer = require('multer');
require('dotenv').config();

const storage = multer.memoryStorage();
const upload = multer({ storage })

const initializePaystackPayment = async (email, amount, listingCount) => {
    try {
        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                email,
                amount: amount * 100, // paystack uses kobo (100 GHS = 10000 kobo)
                metadata: {listingCount},
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.data;
    } catch (err) {
        throw new Error("Paystack initialization failed");        
    }
};



const verifyPaystackPayment = async (reference) => {
    try {
        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        );
        return response.data.data.status === 'success';
    } catch (err) {
        throw new Error("Paystack verification failed");        
    }
};



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
        if(paymentRequired) {
            const paymentData = await initializePaystackPayment(user.email, amount, listingCount + 1)
            return res.status(200).json({
                message: 'Payment required for this listing', 
                paymentUrl: paymentData.authorization_url,
                reference: paymentData.reference,
                propertyData: { title, description, price, location, images: imageUrls, type}
            })
        }



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
        const { reference, propertyData } = req.body;
        const userId = req.user.id;

        //verify payment
        const isPaid = await verifyPaystackPayment(reference);
        if (!isPaid) return res.status(400).json({ message: 'Payment verification failed' });

        //create property after payment
        const property = new PropertyModel({
            userId,
            title: propertyData.title,
            description: propertyData.description,
            price: propertyData.price,
            location: propertyData.location,
            images: propertyData.images,
            type: propertyData.type,
        });

        await property.save();

        res.status(201).json({ message: 'Property created successfully after payment', property })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal server error' })
    }
};



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
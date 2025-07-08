// const PropertyModel = require('../models/PropertyModel')
// const UserModel = require('../models/UserModel')
// const axios = require('axios')
// const { uploadImagesToFirebase } = require('../utils/firebaseStorage')
// const multer = require('multer');
// require('dotenv').config();

// const storage = multer.memoryStorage();
// const upload = multer({ storage })

// const initializePaystackPayment = async (email, amount, listingCount) => {
//     try {
//         const response = await axios.post(
//             "https://api.paystack.co/transaction/initialize",
//             {
//                 email,
//                 amount: amount * 100, // paystack uses kobo (100 GHS = 10000 kobo)
//                 metadata: {listingCount},
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//                     'Content-Type': 'application/json',
//                 },
//             }
//         );
//         return response.data.data;
//     } catch (err) {
//         throw new Error("Paystack initialization failed");        
//     }
// };



// const verifyPaystackPayment = async (reference) => {
//     try {
//         const response = await axios.get(
//             `https://api.paystack.co/transaction/verify/${reference}`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//                 },
//             }
//         );
//         return response.data.data.status === 'success';
//     } catch (err) {
//         throw new Error("Paystack verification failed");        
//     }
// };



// const createProperty = async (req, res) => {
//     try {
//         const { title, description, price, location, type, beds, baths } = req.body;
//         const userId = req.user.id;
//         const files = req.files;

//         if (!title || !description || !price || !location || !type){
//             return res.status(400).json({message: 'All required fields must be provided'})
//         }

//         // Validate Ghana Post Address format if provided
//         if(location.ghanaPostAddress && !/^[A-Z]{2}-[0-9]{3}-[0-9]{4}$/.test(location.ghanaPostAddress)){
//             return res.status(400).json({message: 'Invalid Ghana Post Digital Address format'})
//         }

//         //Upload images to Firebase Storage
//         const imageUrls = files && files.length > 0 ? await uploadImagesToFirebase(files, userId) : [];

//         // count user's existing listings
//         const user = await UserModel.findById(userId);
//         const listingCount = await PropertyModel.countDocuments({ userId });
//         let paymentRequired = false;
//         let amount = 0;

//         // pricing logic
//         if(listingCount >= 2 && listingCount < 5){
//             paymentRequired = true;
//             amount=50.00; // 50.00 GHS
//         } else if(listingCount >= 5 && listingCount < 25){
//             paymentRequired = true;
//             amount = 70.00; // 70.00 GHS
//         }

//         // Initialize Paystack payment
//         if(paymentRequired) {
//             const paymentData = await initializePaystackPayment(user.email, amount, listingCount + 1)
//             return res.status(200).json({
//                 message: 'Payment required for this listing', 
//                 paymentUrl: paymentData.authorization_url,
//                 reference: paymentData.reference,
//                 propertyData: { title, description, price, location, images: imageUrls, type, beds, baths}
//             })
//         }



//         // Create property if no payment is required
//         const property = new PropertyModel({
//             userId,
//             title,
//             description,
//             price,
//             location: JSON.parse(location), // parse JSON string from form data
//             images: imageUrls,
//             beds,
//             baths,
//             type,
//         });

//         await property.save();

//         res.status(201).json({message: 'Property created successfully', property});
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({message: 'Internal server error'});        
//     }
// }



// const confirmPropertyPayment = async (req, res) => {
//     try {
//         const { reference, propertyData } = req.body;
//         const userId = req.user.id;

//         //verify payment
//         const isPaid = await verifyPaystackPayment(reference);
//         if (!isPaid) return res.status(400).json({ message: 'Payment verification failed' });

//         //create property after payment
//         const property = new PropertyModel({
//             userId,
//             title: propertyData.title,
//             description: propertyData.description,
//             price: propertyData.price,
//             location: propertyData.location,
//             images: propertyData.images,
//             type: propertyData.type,
//             beds: propertyData.beds,
//             baths: propertyData.baths,
//         });

//         await property.save();

//         res.status(201).json({ message: 'Property created successfully after payment', property })
//     } catch (err) {
//         console.error(err)
//         res.status(500).json({ message: 'Internal server error' })
//     }
// };



// const getAllProperties = async (req, res) => {
//     try {
//         const properties = await PropertyModel.find().populate('userId', 'username email phone');
//         // res.status(200).json({ properties });
//         res.status(200).json({ 
//             properties: properties.map((property) => ({
//               ...property.toObject(),
//               contactName: property.userId.username,
//               contactEmail: property.userId.email,
//               contactPhone: property.userId.phone,
//             })),
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Internal server error '});        
//     }    
// }


// module.exports = {createProperty, confirmPropertyPayment, getAllProperties, upload}


const PropertyModel = require('../models/PropertyModel');
const { initializePayment, verifyPayment } = require('../utils/paystack');
const { uploadImagesToFirebase } = require('../utils/firebaseStorage');

const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      'location[gps][latitude]': latitude,
      'location[gps][longitude]': longitude,
      'location[ghanaPostAddress]': ghanaPostAddressRaw,
    } = req.body;

    // Normalize ghanaPostAddress: trim spaces and convert to uppercase
    const ghanaPostAddress = ghanaPostAddressRaw ? ghanaPostAddressRaw.trim().toUpperCase() : null;
    console.log('POST /api/properties received:', {
      body: req.body,
      files: req.files,
      normalizedGhanaPostAddress: ghanaPostAddress,
    });

    if (!ghanaPostAddress && (!latitude || !longitude)) {
      return res.status(400).json({ message: 'Either GPS coordinates or Ghana Post Digital Address is required' });
    }

    if (ghanaPostAddress && !/^[A-Z]{2}-[0-9]{3}-[0-9]{4}$/.test(ghanaPostAddress)) {
      return res.status(400).json({ message: `Invalid Ghana Post Address format: ${ghanaPostAddress} (expected format: GA-123-4567)` });
    }

    const images = req.files ? await uploadImagesToFirebase(req.files, req.user.id) : [];

    const propertyData = {
      title,
      description,
      price: parseFloat(price),
      location: {
        gps: latitude && longitude ? { latitude: parseFloat(latitude), longitude: parseFloat(longitude) } : undefined,
        ghanaPostAddress: ghanaPostAddress || undefined,
      },
      type: req.body.type,
      beds: parseInt(req.body.beds) || 0,
      baths: parseInt(req.body.baths) || 0,
      images,
      owner: req.user.id,
    };

    const property = new PropertyModel(propertyData);
    const savedProperty = await property.save();

    const payment = await initializePayment(req.user.email, 1000, savedProperty._id);
    if (!payment) {
      await PropertyModel.deleteOne({ _id: savedProperty._id });
      return res.status(500).json({ message: 'Failed to initialize payment' });
    }

    res.status(201).json({
      message: 'Property created, proceed to payment',
      paymentUrl: payment.data.authorization_url,
      reference: payment.data.reference,
      propertyData,
      property: savedProperty,
    });
  } catch (err) {
    console.error('Create property error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { reference, propertyData } = req.body;
    const payment = await verifyPayment(reference);
    if (!payment || payment.data.status !== 'success') {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const property = new PropertyModel({
      ...propertyData,
      paymentStatus: 'completed',
    });
    await property.save();

    res.status(200).json({ message: 'Property posted successfully', property });
  } catch (err) {
    console.error('Confirm payment error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getProperties = async (req, res) => {
  try {
    const properties = await PropertyModel.find().populate('owner', 'username email');
    res.status(200).json({ properties });
  } catch (err) {
    console.error('Get properties error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const property = await PropertyModel.findById(req.params.id).populate('owner', 'username email');
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json({ property });
  } catch (err) {
    console.error('Get property by ID error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createProperty, confirmPayment, getProperties, getPropertyById };
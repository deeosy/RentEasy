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







// Import required modules
const Property = require('../models/PropertyModel');
const { uploadImagesToFirebase } = require('../utils/firebaseStorage');
const axios = require('axios');
require('dotenv').config();

// Create a new property
exports.createProperty = async (req, res) => {
  try {
    console.log('Received req.body:', req.body);
    console.log('Received files:', req.files);

    const { title, description, price, type, beds, baths } = req.body;
    const location = {
      gps: {
        latitude: req.body['location[gps][latitude]'] ? parseFloat(req.body['location[gps][latitude]']) : undefined,
        longitude: req.body['location[gps][longitude]'] ? parseFloat(req.body['location[gps][longitude]']) : undefined,
      },
      ghanaPostAddress: req.body['location[ghanaPostAddress]'] || undefined,
    };

    if (!title || !description || !price || !type || !beds || !baths) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Count user's existing properties
    const userPropertyCount = await Property.countDocuments({ userId: req.user.id });
    console.log('User property count:', userPropertyCount);

    const propertyData = {
      userId: req.user.id,
      title,
      description,
      price: parseFloat(price),
      location,
      type,
      beds: parseInt(beds) || 0,
      baths: parseInt(baths) || 0,
    };

    // Handle image uploads
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = await uploadImagesToFirebase(req.files);
      propertyData.images = imageUrls;
    }

    // Check if payment is required (3rd or subsequent listing)
    if (userPropertyCount >= 2) {
      const paymentResponse = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
          email: req.user.email,
          amount: 5000, // 50 GHS in kobo
          reference: `prop_${Date.now()}_${req.user.id}`,
          callback_url: 'https://renteasy-m3ux.onrender.com/api/properties/confirm-payment',
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (paymentResponse.data.status) {
        return res.status(200).json({
          paymentUrl: paymentResponse.data.data.authorization_url,
          reference: paymentResponse.data.data.reference,
          propertyData,
          message: 'Payment required for this listing',
        });
      } else {
        console.error('Paystack initialization error:', paymentResponse.data);
        return res.status(500).json({ message: 'Payment initialization failed' });
      }
    }

    // Save property if no payment is required
    const property = new Property(propertyData);
    await property.save();
    console.log('Property saved:', property);
    res.status(201).json({ message: 'Property created successfully', property });
  } catch (err) {
    console.error('Create property error:', err);
    res.status(500).json({ message: err.message || 'Internal server error' });
  }
};

// Confirm payment and save property
exports.confirmPayment = async (req, res) => {
  try {
    const { reference, propertyData } = req.body;

    // Verify payment with Paystack
    const paymentResponse = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    if (paymentResponse.data.data.status !== 'success') {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Save property after successful payment
    const property = new Property({
      ...propertyData,
      userId: req.user.id,
    });
    await property.save();
    console.log('Property saved after payment:', property);
    res.status(201).json({ message: 'Property created successfully after payment', property });
  } catch (err) {
    console.error('Confirm payment error:', err);
    res.status(500).json({ message: err.message || 'Internal server error' });
  }
};

// Get all properties
exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json({ properties });
  } catch (err) {
    console.error('Get properties error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
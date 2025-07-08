const axios = require('axios');
require('dotenv').config();

// Validate Paystack secret key
if (!process.env.PAYSTACK_SECRET_KEY) {
  throw new Error('PAYSTACK_SECRET_KEY is not defined in .env file');
}

const paystackApi = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
});

// Initialize a payment
const initializePayment = async (email, amount, propertyId) => {
  try {
    const response = await paystackApi.post('/transaction/initialize', {
      email,
      amount: amount * 100, // Convert to kobo
      reference: `prop_${propertyId}_${Date.now()}`,
      callback_url: 'http://localhost:5173/properties', // Redirect after payment
    });
    return response.data;
  } catch (err) {
    console.error('Paystack initialize payment error:', err.response?.data || err.message);
    return null;
  }
};

// Verify a payment
const verifyPayment = async (reference) => {
  try {
    const response = await paystackApi.get(`/transaction/verify/${reference}`);
    return response.data;
  } catch (err) {
    console.error('Paystack verify payment error:', err.response?.data || err.message);
    return null;
  }
};

module.exports = { initializePayment, verifyPayment };
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ListPropertyPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: { gps: { latitude: '', longitude: '' }, ghanaPostAddress: '' },
    type: 'apartment',
    beds: '',
    baths: '',
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'latitude' || name === 'longitude') {
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          gps: {
            ...prev.location.gps,
            [name]: value,
          },
        },
      }));
    } else if (name === 'ghanaPostAddress') {
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          ghanaPostAddress: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('location', JSON.stringify(formData.location));
    formDataToSend.append('type', formData.type);
    formDataToSend.append('beds', formData.beds);
    formDataToSend.append('baths', formData.baths);
    images.forEach((image, index) => {
      formDataToSend.append(`images`, image);
    });

    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
      const response = await fetch('http://localhost:4001/api/properties', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl; // Redirect to Paystack if payment is required
        } else {
          navigate('/'); // Redirect to home on success without payment
        }
      } else {
        setError(data.message || 'Failed to create property');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 min-h-screen text-white p-6">
      <h3 className="text-4xl font-bold text-center mb-10">List Your Property</h3>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-[440px] mx-auto text-indigo-900">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Property Title"
          className="rounded-xl bg-gray-300 px-6 py-3 placeholder-indigo-900 focus:outline-none"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="rounded-xl bg-gray-300 px-6 py-3 placeholder-indigo-900 focus:outline-none h-24 resize-none"
          required
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price (GHS)"
          className="rounded-xl bg-gray-300 px-6 py-3 placeholder-indigo-900 focus:outline-none"
          required
        />
        <div className="flex flex-col gap-2">
          <label>GPS Coordinates</label>
          <input
            type="number"
            name="latitude"
            value={formData.location.gps.latitude}
            onChange={handleChange}
            placeholder="Latitude"
            className="rounded-xl bg-gray-300 px-6 py-3 placeholder-indigo-900 focus:outline-none"
          />
          <input
            type="number"
            name="longitude"
            value={formData.location.gps.longitude}
            onChange={handleChange}
            placeholder="Longitude"
            className="rounded-xl bg-gray-300 px-6 py-3 placeholder-indigo-900 focus:outline-none"
          />
        </div>
        <input
          type="text"
          name="ghanaPostAddress"
          value={formData.location.ghanaPostAddress}
          onChange={handleChange}
          placeholder="Ghana Post Digital Address (e.g., GA-123-4567)"
          className="rounded-xl bg-gray-300 px-6 py-3 placeholder-indigo-900 focus:outline-none"
        />
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="rounded-xl bg-gray-300 px-6 py-3 placeholder-indigo-900 focus:outline-none"
          required
        >
          <option value="apartment">Apartment</option>
          <option value="townhouse">Townhouse</option>
          <option value="room">Room</option>
          <option value="building">Building</option>
        </select>
        <input
          type="number"
          name="beds"
          value={formData.beds}
          onChange={handleChange}
          placeholder="Number of Bedrooms"
          className="rounded-xl bg-gray-300 px-6 py-3 placeholder-indigo-900 focus:outline-none"
          required
        />
        <input
          type="number"
          name="baths"
          value={formData.baths}
          onChange={handleChange}
          placeholder="Number of Bathrooms"
          className="rounded-xl bg-gray-300 px-6 py-3 placeholder-indigo-900 focus:outline-none"
          required
        />
        <input
          type="file"
          name="images"
          onChange={handleImageChange}
          multiple
          accept="image/*"
          className="rounded-xl bg-gray-300 px-6 py-3 placeholder-indigo-900 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium text-sm hover:bg-indigo-700 transition-colors"
        >
          Submit Listing
        </button>
      </form>
    </div>
  );
}
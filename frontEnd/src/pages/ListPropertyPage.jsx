// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// // Component for listing a new property
// export default function ListPropertyPage() {
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     price: '',
//     location: { gps: { latitude: '', longitude: '' }, ghanaPostAddress: '' },
//     type: 'apartment',
//     beds: '',
//     baths: '',
//   });
//   const [images, setImages] = useState([]);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   // Handle changes to text inputs, select, and textarea
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'latitude' || name === 'longitude') {
//       setFormData((prev) => ({
//         ...prev,
//         location: {
//           ...prev.location,
//           gps: {
//             ...prev.location.gps,
//             [name]: value,
//           },
//         },
//       }));
//     } else if (name === 'ghanaPostAddress') {
//       setFormData((prev) => ({
//         ...prev,
//         location: {
//           ...prev.location,
//           ghanaPostAddress: value,
//         },
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   // Handle image file selection
//   const handleImageChange = (e) => {
//     setImages(Array.from(e.target.files));
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     // Validate token
//     const tokenRow = document.cookie.split('; ').find((row) => row.startsWith('token='));
//     if (!tokenRow) {
//       setError('You must be logged in to list a property.');
//       return;
//     }
//     const token = tokenRow.split('=')[1];

//     // Validate location
//     if (!formData.location.ghanaPostAddress && (!formData.location.gps.latitude || !formData.location.gps.longitude)) {
//       setError('Either GPS coordinates or Ghana Post Address is required.');
//       return;
//     }

//     // Prepare FormData
//     const formDataToSend = new FormData();
//     formDataToSend.append('title', formData.title);
//     formDataToSend.append('description', formData.description);
//     formDataToSend.append('price', formData.price);
//     formDataToSend.append('location[gps][latitude]', formData.location.gps.latitude || '');
//     formDataToSend.append('location[gps][longitude]', formData.location.gps.longitude || '');
//     formDataToSend.append('location[ghanaPostAddress]', formData.location.ghanaPostAddress || '');
//     formDataToSend.append('type', formData.type);
//     formDataToSend.append('beds', formData.beds || 0);
//     formDataToSend.append('baths', formData.baths || 0);
//     images.forEach((image) => {
//       formDataToSend.append('images', image);
//     });

//     // Log FormData for debugging
//     console.log('FormData sent:', {
//       title: formData.title,
//       description: formData.description,
//       price: formData.price,
//       'location[gps][latitude]': formData.location.gps.latitude,
//       'location[gps][longitude]': formData.location.gps.longitude,
//       'location[ghanaPostAddress]': formData.location.ghanaPostAddress,
//       type: formData.type,
//       beds: formData.beds,
//       baths: formData.baths,
//       images: images.length,
//     });

//     try {
//       const response = await fetch('http://localhost:4001/api/properties', {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formDataToSend,
//       });

//       const data = await response.json();
//       if (response.ok) {
//         alert(data.message || 'Property listed successfully!');
//         if (data.paymentUrl) {
//           window.location.href = data.paymentUrl; // Redirect to Paystack
//         } else {
//           navigate('/'); // Redirect to home
//         }
//       } else {
//         setError(data.message || 'Failed to create property');
//         console.error('Backend error:', data);
//       }
//     } catch (err) {
//       console.error('Submission error:', err);
//       setError(`Error posting property: ${err.message}`);
//     }
//   };

//   return (
//     <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 min-h-screen text-white p-6">
//       <h3 className="text-4xl font-bold text-center mb-10">List Your Property</h3>
//       {error && <p className="text-red-500 text-center mb-4">{error}</p>}
//       <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-[440px] mx-auto text-indigo-900">
//         <input
//           type="text"
//           name="title"
//           value={formData.title}
//           onChange={handleChange}
//           placeholder="Property Title"
//           className="rounded-xl bg-gray-300 px-6 py-3 placeholder-indigo-900 focus:outline-none"
//           required
//         />
//         <textarea
//           name="description"
//           value={formData.description}
//           onChange={handleChange}
//           placeholder="Description"
//           className="rounded-xl bg-gray-300 px-6 py-3 placeholder-indigo-900 focus:outline-none h-24 resize-none"
//           required
//         />
//         <input
//           type="number"
//           name="price"
//           value={formData.price}
//           onChange={handleChange}
//           placeholder="Price (GHS)"
//           className="rounded-xl bg-gray-300 px-6 py-3 placeholder-indigo-900 focus:outline-none"
//           required
//         />
//         <div className="flex flex-col gap-2">
//           <label className="text-white">GPS Coordinates</label>
//           <input
//             type="number"
//             name="latitude"
//             value={formData.location.gps.latitude}
//             onChange={handleChange}
//             placeholder="Latitude"
//             className="rounded-xl bg-gray-300 px-6 py-3 placeholder-indigo-900 focus:outline-none"
//           />
//           <input
//             type="number"
//             name="longitude"
//             value={formData.location.gps.longitude}
//             onChange={handleChange}
//             placeholder="Longitude"
//             className="rounded-xl bg-gray-300 px-6 py-3 placeholder-indigo-900 focus:outline-none"
//           />
//         </div>
//         <input
//           type="text"
//           name="ghanaPostAddress"
//           value={formData.location.ghanaPostAddress}
//           onChange={handleChange}
//           placeholder="Ghana Post Digital Address (e.g., GA-123-4567)"
//           className="rounded-xl bg-gray-300 px-6 py-3 placeholder-indigo-900 focus:outline-none"
//         />
//         <select
//           name="type"
//           value={formData.type}
//           onChange={handleChange}
//           className="rounded-xl bg-gray-300 px-6 py-3 placeholder-indigo-900 focus:outline-none"
//           required
//         >
//           <option value="apartment">Apartment</option>
//           <option value="townhouse">Townhouse</option>
//           <option value="room">Room</option>
//           <option value="building">Building</option>
//         </select>
//         <input
//           type="number"
//           name="beds"
//           value={formData.beds}
//           onChange={handleChange}
//           placeholder="Number of Bedrooms"
//           className="rounded-xl bg-gray-300 px-6 py-3 placeholder-indigo-900 focus:outline-none"
//           required
//         />
//         <input
//           type="number"
//           name="baths"
//           value={formData.baths}
//           onChange={handleChange}
//           placeholder="Number of Bathrooms"
//           className="rounded-xl bg-gray-300 px-6 py-3 placeholder-indigo-900 focus:outline-none"
//           required
//         />
//         <input
//           type="file"
//           name="images"
//           onChange={handleImageChange}
//           multiple
//           accept="image/*"
//           className="rounded-xl bg-gray-300 px-6 py-3 placeholder-indigo-900 focus:outline-none"
//         />
//         <button
//           type="submit"
//           className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium text-sm hover:bg-indigo-700 transition-colors"
//         >
//           Submit Listing
//         </button>
//       </form>
//     </div>
//   );
// }
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import usePropertyStore from '../store/usePropertyStore';

export default function ListPropertyPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: '',
    beds: '',
    baths: '',
    ghanaPostAddress: '',
    latitude: '',
    longitude: '',
  });
  const [images, setImages] = useState([]);
  const navigate = useNavigate();
  const { addProperty } = usePropertyStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('type', formData.type);
    formDataToSend.append('beds', formData.beds);
    formDataToSend.append('baths', formData.baths);
    formDataToSend.append('location[ghanaPostAddress]', formData.ghanaPostAddress);
    formDataToSend.append('location[gps][latitude]', formData.latitude);
    formDataToSend.append('location[gps][longitude]', formData.longitude);
    images.forEach((image) => formDataToSend.append('images', image));

    // Log FormData for debugging
    const formDataLog = {};
    formDataToSend.forEach((value, key) => {
      formDataLog[key] = value;
    });
    console.log('FormData sent:', formDataLog);

    try {
      const response = await addProperty(formDataToSend);
      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else {
        toast.success('Property posted successfully!');
        navigate('/properties');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to post property');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">List a Property</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label>Price (GHS)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label>Property Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          >
            <option value="">Select Type</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
          </select>
        </div>
        <div>
          <label>Beds</label>
          <input
            type="number"
            name="beds"
            value={formData.beds}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label>Baths</label>
          <input
            type="number"
            name="baths"
            value={formData.baths}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label>Ghana Post Address</label>
          <input
            type="text"
            name="ghanaPostAddress"
            value={formData.ghanaPostAddress}
            onChange={handleChange}
            className="border p-2 w-full"
            placeholder="e.g., GA-123-4567"
          />
        </div>
        <div>
          <label>Latitude (optional)</label>
          <input
            type="number"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            className="border p-2 w-full"
            step="any"
          />
        </div>
        <div>
          <label>Longitude (optional)</label>
          <input
            type="number"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            className="border p-2 w-full"
            step="any"
          />
        </div>
        <div>
          <label>Images (up to 5)</label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="border p-2 w-full"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Submit Property
        </button>
      </form>
    </div>
  );
}
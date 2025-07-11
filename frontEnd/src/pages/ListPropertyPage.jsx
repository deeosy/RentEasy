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


import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import usePropertyStore from '../store/usePropertyStore';

export default function ListPropertyPage() {
  const { register, handleSubmit, setValue, formState: { errors, isValid } } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      price: '',
      type: '',
      beds: '',
      baths: '',
      ghanaPostAddress: '',
      latitude: '',
      longitude: '',
    },
  });
  const [images, setImages] = useState([]);
  const [useAutoLocation, setUseAutoLocation] = useState(false);
  const [autoLocation, setAutoLocation] = useState({ latitude: '', longitude: '' });
  const navigate = useNavigate();
  const { addProperty } = usePropertyStore();

  // Fetch user location when switching to auto
  useEffect(() => {
    if (useAutoLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setAutoLocation({ latitude, longitude });
          setValue('latitude', latitude.toString());
          setValue('longitude', longitude.toString());
          toast.info('Location fetched successfully');
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Failed to fetch location. Please enable location services or enter manually.');
          setUseAutoLocation(false); // Revert to manual if geolocation fails
        }
      );
    }
  }, [useAutoLocation, setValue]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5); // Limit to 5 images
    setImages(files);
    setValue('images', files); // Update form value for images
  };

  const toggleLocationMode = () => {
    setUseAutoLocation((prev) => !prev);
    if (!useAutoLocation) {
      // Clear manual inputs when switching to auto
      setValue('latitude', '');
      setValue('longitude', '');
    } else {
      // Clear auto location when switching to manual
      setAutoLocation({ latitude: '', longitude: '' });
    }
  };

  const onSubmit = async (data) => {
    // Validate location
    if (!data.ghanaPostAddress && (!data.latitude || !data.longitude)) {
      toast.error('Either Ghana Post Address or GPS coordinates are required.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', data.title);
    formDataToSend.append('description', data.description);
    formDataToSend.append('price', data.price);
    formDataToSend.append('type', data.type);
    formDataToSend.append('beds', data.beds);
    formDataToSend.append('baths', data.baths);
    formDataToSend.append('location[ghanaPostAddress]', data.ghanaPostAddress);
    formDataToSend.append('location[gps][latitude]', useAutoLocation ? autoLocation.latitude : data.latitude);
    formDataToSend.append('location[gps][longitude]', useAutoLocation ? autoLocation.longitude : data.longitude);
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
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold text-center text-indigo-900 mb-8">List a Property</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 text-indigo-900">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Title *</label>
          <input
            type="text"
            {...register('title', { required: 'Title is required' })}
            className="rounded-xl bg-gray-300 px-4 py-3 placeholder-indigo-900 focus:outline-none"
            placeholder="e.g., Cozy 2-Bedroom Apartment"
          />
          {errors.title && (
            <span className="text-red-500 text-sm mt-1">{errors.title.message}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Description *</label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            className="rounded-xl bg-gray-300 px-4 py-3 placeholder-indigo-900 focus:outline-none h-32 resize-none"
            placeholder="Describe your property..."
          />
          {errors.description && (
            <span className="text-red-500 text-sm mt-1">{errors.description.message}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Price (GHS) *</label>
          <input
            type="number"
            {...register('price', {
              required: 'Price is required',
              min: { value: 0, message: 'Price must be a positive number' },
            })}
            className="rounded-xl bg-gray-300 px-4 py-3 placeholder-indigo-900 focus:outline-none"
            placeholder="e.g., 1500"
          />
          {errors.price && (
            <span className="text-red-500 text-sm mt-1">{errors.price.message}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Property Type *</label>
          <select
            {...register('type', { required: 'Property type is required' })}
            className="rounded-xl bg-gray-300 px-4 py-3 placeholder-indigo-900 focus:outline-none"
          >
            <option value="">Select Type</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
          </select>
          {errors.type && (
            <span className="text-red-500 text-sm mt-1">{errors.type.message}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Beds *</label>
          <input
            type="number"
            {...register('beds', {
              required: 'Number of beds is required',
              min: { value: 1, message: 'Beds must be at least 1' },
            })}
            className="rounded-xl bg-gray-300 px-4 py-3 placeholder-indigo-900 focus:outline-none"
            placeholder="e.g., 2"
          />
          {errors.beds && (
            <span className="text-red-500 text-sm mt-1">{errors.beds.message}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Baths *</label>
          <input
            type="number"
            {...register('baths', {
              required: 'Number of baths is required',
              min: { value: 1, message: 'Baths must be at least 1' },
            })}
            className="rounded-xl bg-gray-300 px-4 py-3 placeholder-indigo-900 focus:outline-none"
            placeholder="e.g., 1"
          />
          {errors.baths && (
            <span className="text-red-500 text-sm mt-1">{errors.baths.message}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Ghana Post Address</label>
          <input
            type="text"
            {...register('ghanaPostAddress', {
              pattern: {
                value: /^[A-Z]{2}-\d{3}-\d{4}$/,
                message: 'Invalid Ghana Post Address (e.g., GA-123-4567)',
              },
            })}
            className="rounded-xl bg-gray-300 px-4 py-3 placeholder-indigo-900 focus:outline-none"
            placeholder="e.g., GA-123-4567"
          />
          {errors.ghanaPostAddress && (
            <span className="text-red-500 text-sm mt-1">{errors.ghanaPostAddress.message}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Location Input Method</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={toggleLocationMode}
              className={`flex-1 py-2 rounded-xl font-medium transition-colors duration-150 ${
                useAutoLocation
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-300 text-indigo-900 hover:bg-gray-400'
              }`}
            >
              Auto
            </button>
            <button
              type="button"
              onClick={toggleLocationMode}
              className={`flex-1 py-2 rounded-xl font-medium transition-colors duration-150 ${
                !useAutoLocation
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-300 text-indigo-900 hover:bg-gray-400'
              }`}
            >
              Manual
            </button>
          </div>
          {useAutoLocation && (
            <p className="text-sm text-gray-600 mt-1">
              {autoLocation.latitude && autoLocation.longitude
                ? `Detected: Lat ${autoLocation.latitude}, Lon ${autoLocation.longitude}`
                : 'Fetching location...'}
            </p>
          )}
        </div>

        {!useAutoLocation && (
          <>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Latitude (optional)</label>
              <input
                type="number"
                {...register('latitude', {
                  validate: (value) =>
                    !value || (value >= -90 && value <= 90) || 'Latitude must be between -90 and 90',
                })}
                className="rounded-xl bg-gray-300 px-4 py-3 placeholder-indigo-900 focus:outline-none"
                step="any"
                placeholder="e.g., 5.6037"
              />
              {errors.latitude && (
                <span className="text-red-500 text-sm mt-1">{errors.latitude.message}</span>
              )}
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Longitude (optional)</label>
              <input
                type="number"
                {...register('longitude', {
                  validate: (value) =>
                    !value || (value >= -180 && value <= 180) || 'Longitude must be between -180 and 180',
                })}
                className="rounded-xl bg-gray-300 px-4 py-3 placeholder-indigo-900 focus:outline-none"
                step="any"
                placeholder="e.g., -0.1870"
              />
              {errors.longitude && (
                <span className="text-red-500 text-sm mt-1">{errors.longitude.message}</span>
              )}
            </div>
          </>
        )}

        <div className="flex flex-col">
          <label className="text-sm font-medium Remedialmb-1">Images (up to 5)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="border p-2 w-full text-gray-700"
          />
          {images.length > 5 && (
            <span className="text-red-500 text-sm mt-1">Maximum 5 images allowed</span>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid || images.length > 5}
          className={`bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium w-fit mx-auto cursor-pointer transition-colors duration-150 ${
            !isValid || images.length > 5 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
          }`}
        >
          Submit Property
        </button>
      </form>
    </div>
  );
}
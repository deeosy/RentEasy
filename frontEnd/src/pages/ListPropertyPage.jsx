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


import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Plus, X, Camera, MapPin, Upload } from 'lucide-react';
import usePropertyStore from '../store/usePropertyStore';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Map component using plain Leaflet
function MapComponent({ center, hasValidCoords }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map', {
        center: center,
        zoom: 13,
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }

    if (hasValidCoords) {
      if (markerRef.current) {
        markerRef.current.setLatLng(center);
      } else {
        markerRef.current = L.marker(center)
          .addTo(mapRef.current)
          .bindPopup(`Location: Lat ${center[0].toFixed(4)}, Lon ${center[1].toFixed(4)}`);
      }
      mapRef.current.setView(center, 13);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [center, hasValidCoords]);

  return <div id="map" className="rounded-xl z-0" style={{ height: '500px', width: '100%' }} />;
}

// Image Preview Component
function ImagePreview({ file, onRemove, index }) {
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('FileReader result: ', e.target.result);
        setPreview(e.target.result);
        setIsLoading(false);
      }
      reader.readAsDataURL(file);
    }
    return () => {
      setPreview(null);
      setIsLoading(false)
    }
  }, [file]);

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!preview) return null;

  return (
    <div className="relative group h-28 min-w-28 rounded-2xl overflow-hidden bg-gray-200">
      <img 
        src={preview} 
        alt={`Preview ${index + 1}`}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
        <button
          type="button"
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default function ListPropertyPage() {
  const { register, handleSubmit, setValue, watch, formState: { errors, isValid } } = useForm({
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
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();
  const { addProperty } = usePropertyStore();
  const fileInputRef = useRef(null);

  // Watch form values for latitude and longitude
  const latitude = watch('latitude');
  const longitude = watch('longitude');

  // Default map center (Accra, Ghana)
  const defaultCenter = [5.6037, -0.1870];

  // Determine current coordinates
  const currentLat = useAutoLocation ? parseFloat(autoLocation.latitude || '') : parseFloat(latitude || '');
  const currentLon = useAutoLocation ? parseFloat(autoLocation.longitude || '') : parseFloat(longitude || '');
  const mapCenter = [
    isNaN(currentLat) || !currentLat ? defaultCenter[0] : currentLat,
    isNaN(currentLon) || !currentLon ? defaultCenter[1] : currentLon,
  ];
  const hasValidCoords = !isNaN(currentLat) && !isNaN(currentLon) && currentLat && currentLon;

  // Enhanced geolocation effect with better options and loading state
  useEffect(() => {
    if (useAutoLocation && navigator.geolocation) {
      setIsLoadingLocation(true);
      
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setAutoLocation({ latitude, longitude });
          setValue('latitude', latitude.toString());
          setValue('longitude', longitude.toString());
          setIsLoadingLocation(false);
          toast.info('Location fetched successfully');
        },
        (error) => {
          setIsLoadingLocation(false);
          console.error('Geolocation error:', error);
          
          let errorMessage = 'Failed to fetch location. ';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Location access denied. Please enable location services.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Location information unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage += 'Location request timed out.';
              break;
            default:
              errorMessage += 'Unknown error occurred.';
          }
          
          toast.error(errorMessage + ' Please enter coordinates manually.');
          setUseAutoLocation(false);
        },
        options
      );
    } else if (useAutoLocation && !navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser. Please enter coordinates manually.');
      setUseAutoLocation(false);
    }
  }, [useAutoLocation, setValue]);

  // Image handling functions
  const handleImageUpload = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      
      if (!isValidType) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    const totalImages = images.length + validFiles.length;
    if (totalImages > 5) {
      toast.warning('Maximum 5 images allowed. Some files were not added.');
      const remainingSlots = 5 - images.length;
      const filesToAdd = validFiles.slice(0, remainingSlots);
      setImages(prev => [...prev, ...filesToAdd]);
    } else {
      setImages(prev => [...prev, ...validFiles]);
    }
  };

  const handlePlusButtonClick = () => {
    if (images.length >= 5) {
      toast.warning('Maximum 5 images allowed');
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e) => {
    if (e.target.files?.length > 0) {
      handleImageUpload(e.target.files);
    }
    // Reset the input value to allow selecting the same file again
    e.target.value = '';
  };

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files?.length > 0) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  // Enhanced location status display
  const renderLocationStatus = () => {
    if (useAutoLocation) {
      if (isLoadingLocation) {
        return (
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
            <span>Fetching location...</span>
          </div>
        );
      } else if (autoLocation.latitude && autoLocation.longitude) {
        return (
          <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
            <MapPin size={10} />
            Location detected: Lat {parseFloat(autoLocation.latitude).toFixed(4)}, 
            Lon {parseFloat(autoLocation.longitude).toFixed(4)}
          </p>
        );
      } else {
        return (
          <p className="text-sm text-yellow-600 mt-1">
            ⚠ Location not yet available
          </p>
        );
      }
    }
    return null;
  };

  const toggleLocationMode = () => {
    if (isLoadingLocation) return;
    
    setUseAutoLocation((prev) => !prev);
    if (!useAutoLocation) {
      setValue('latitude', '');
      setValue('longitude', '');
    } else {
      setAutoLocation({ latitude: '', longitude: '' });
    }
  };

  const onSubmit = async (data) => {
    if (!data.ghanaPostAddress && (!data.latitude || !data.longitude)) {
      toast.error('Either Ghana Post Address or GPS coordinates are required.');
      return;
    }

    if (images.length <= 3) {
      toast.error('Minimum of three (3) images are required.');
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
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold text-center text-indigo-900 mb-8">List a Property</h1>
      <div className="flex flex-col-reverse md:flex-row gap-4">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 text-indigo-900 md:w-[50%]">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              {...register('title', { required: 'Title is required' })}
              className="rounded-xl bg-gray-300 px-4 py-3 placeholder-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="e.g., Cozy 2-Bedroom Apartment"
            />
            {errors.title && (
              <span className="text-red-500 text-sm mt-1">{errors.title.message}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Description *</label>
            <textarea
              {...register('description', { required: 'Description is required', minLength: { value: 20, message: 'Description must be at least 20 characters' } })}
              className="rounded-xl bg-gray-300 px-4 py-3 placeholder-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all h-32 resize-none"
              placeholder="Describe your property in detail..."
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
                min: { value: 1, message: 'Price must be greater than 0' },
                max: { value: 10000000, message: 'Price seems too high' }
              })}
              className="rounded-xl bg-gray-300 px-4 py-3 placeholder-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="e.g., 1500"
            />
            {errors.price && (
              <span className="text-red-500 text-sm mt-1">{errors.price.message}</span>
            )}
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col md:max-w-72 ">
              <label className="text-sm font-medium mb-1">Property Type *</label>
              <select
                {...register('type', { required: 'Property type is required' })}
                className="rounded-xl bg-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                <option value="">Select Type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="studio">Studio</option>
                <option value="townhouse">Townhouse</option>
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
                  max: { value: 20, message: 'Maximum 20 beds allowed' }
                })}
                className="w-full rounded-xl bg-gray-300 px-4 py-3 placeholder-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
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
                  max: { value: 20, message: 'Maximum 20 baths allowed' }
                })}
                className="w-full rounded-xl bg-gray-300 px-4 py-3 placeholder-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="e.g., 1"
              />
              {errors.baths && (
                <span className="text-red-500 text-sm mt-1">{errors.baths.message}</span>
              )}
            </div>
          </div>

          <div className="flex space-x-5">
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
                className="w-40 rounded-xl bg-gray-300 px-4 py-3 placeholder-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="e.g., GA-123-4567"
              />
              {errors.ghanaPostAddress && (
                <span className="text-red-500 text-sm mt-1">{errors.ghanaPostAddress.message}</span>
              )}
            </div>
            
            <div className="flex flex-col">
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Location Input Method:</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={toggleLocationMode}
                    disabled={isLoadingLocation}
                    className={`flex-1 py-1 px-2 rounded-xl font-medium transition-all duration-150 ${
                      useAutoLocation
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-gray-300 text-indigo-900 hover:bg-gray-400'
                    } ${isLoadingLocation ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isLoadingLocation && useAutoLocation ? 'Loading...' : 'Auto'}
                  </button>
                  <button
                    type="button"
                    onClick={toggleLocationMode}
                    disabled={isLoadingLocation}
                    className={`flex-1 py-1 px-2 rounded-xl font-medium transition-all duration-150 ${
                      !useAutoLocation
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-gray-300 text-indigo-900 hover:bg-gray-400'
                    } ${isLoadingLocation ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Manual
                  </button>
                </div>
              </div>
              
              {renderLocationStatus()}

              {!useAutoLocation && (
                <div className="flex gap-1.5 mt-2">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Latitude (optional)</label>
                    <input
                      type="number"
                      {...register('latitude', {
                        validate: (value) =>
                          !value || (value >= -90 && value <= 90) || 'Latitude must be between -90 and 90',
                      })}
                      className="w-36 rounded-xl bg-gray-300 px-4 py-1 placeholder-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
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
                      className="w-36 rounded-xl bg-gray-300 px-4 py-1 placeholder-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      step="any"
                      placeholder="e.g., -0.1870"
                    />
                    {errors.longitude && (
                      <span className="text-red-500 text-sm mt-1">{errors.longitude.message}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={!isValid || images.length <= 2}
            className={`bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium w-fit mx-auto transition-all duration-150 ${
              !isValid || images.length <= 2 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-indigo-700 hover:shadow-lg transform hover:scale-105'
            }`}
          >
            {images.length <= 2 ? 'Add images to continue' : 'Submit Property'}
          </button>
        </form>
        
        <div className="flex flex-col px-2 md:w-1/2">
          {/* Enhanced Images container with drag and drop */}
          <div className="flex flex-col mb-4">
            <label className="text-sm font-medium mb-2 text-indigo-900 flex items-center gap-2">
              <Camera size={16} />
              Property Images * (min 3, max 5)
            </label>
            <div 
              className={`flex gap-2 p-3 rounded-xl border-2 border-dashed transition-all ${
                dragActive 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {/* Plus button for adding images */}
              <button
                type="button"
                onClick={handlePlusButtonClick}
                className={`h-28 min-w-28 bg-gray-300 rounded-2xl flex flex-col items-center justify-center text-indigo-900 transition-all duration-200 ${
                  images.length >= 5 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-gray-400 hover:shadow-md transform hover:scale-105'
                }`}
                disabled={images.length >= 5}
              >
                <Plus size={24} />
                <span className="text-xs mt-1">Add Image</span>
              </button>

              {/* Image previews */}
              <div className=" flex gap-2 overflow-x-scroll no-scroll ">
              {images.map((image, index) => (
                <ImagePreview 
                  key={index} 
                  file={image} 
                  index={index}
                  onRemove={() => removeImage(index)} 
                />
              ))}

              </div>

              {/* Empty placeholders */}
              {Array.from({ length: Math.max(0, 1 - images.length) }).map((_, index) => (
                <div 
                  key={`placeholder-${index}`} 
                  className="h-28 min-w-28 bg-gray-200 rounded-2xl border-2 border-dashed border-gray-300"
                />
              ))}
            </div>
            
            {/* Image upload info */}
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <p className="flex items-center gap-1">
                <Upload size={14} />
                {images.length}/5 images uploaded
              </p>
              <p className="text-xs mt-1">
                Drag & drop images here or click the + button. Max 5MB per image.
              </p>
            </div>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {/* Map container */}
          <div className="h-[400px] rounded-xl overflow-hidden shadow-lg">
            <MapComponent center={mapCenter} hasValidCoords={hasValidCoords} />
          </div>
        </div>
      </div>
    </div>
  );
}
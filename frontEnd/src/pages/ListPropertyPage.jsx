import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import debounce from 'lodash/debounce';
import usePropertyStore from '../store/usePropertyStore';
import { fetchLocationFromAddress } from '../utils/ghanaPostApi'
import MapComponent from '../component/MapComponent';
import AddImages from '../component/AddImages';
import FormField from '../component/FormField';
import PropertyDetails from '../component/PropertyDetails';
import LocationInput from '../component/LocationInput';

// Fix for default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function ListPropertyPage() {
  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      price: '',
      type: '',
      beds: '',
      baths: '',
      ghanaPostAddress: '',
    },
  });
  const ghanaPostAddress = watch('ghanaPostAddress')  // watch for address changes
  const [images, setImages] = useState([]);
  const [useGeoLocation, setUseGeoLocation] = useState(false);
  const [autoLocation, setAutoLocation] = useState({ latitude: '', longitude: '' });
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isFetchingFromAddress, setIsFetchingFromAddress] = useState(false); 
  const [locationSource, setLocationSource] = useState('')  // state to track source of coordinate either (map, auto location, address)
  const navigate = useNavigate();
  const { addProperty } = usePropertyStore();

  // Default map center (Accra, Ghana)
  const defaultCenter = [5.6037, -0.1870];
  const currentLat = autoLocation.latitude ? parseFloat(autoLocation.latitude) : defaultCenter[0];
  const currentLon = autoLocation.longitude ? parseFloat(autoLocation.longitude) : defaultCenter[1];
  const mapCenter = [!isNaN(currentLat) ? currentLat : defaultCenter[0], !isNaN(currentLon) ? currentLon : defaultCenter[1]];
  const hasValidCoords = !isNaN(currentLat) && !isNaN(currentLon) && autoLocation.latitude && autoLocation.longitude;

  // Geolocation effect
  useEffect(() => {
    let watchId;
    if (useGeoLocation && navigator.geolocation) {
      setIsLoadingLocation(true);
      navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
        if (permissionStatus.state === 'denied') {
          toast.error('Location access denied. Please enable location services.');
          setUseGeoLocation(false);
          setIsLoadingLocation(false);
          setLocationSource('');
          return;
        }
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setAutoLocation({ latitude, longitude });
            setLocationSource('geolocation');
            setIsLoadingLocation(false);
            toast.info(`Location fetched: Lat ${latitude.toFixed(4)}, Lon ${longitude.toFixed(4)}`);
          },
          (error) => {
            setIsLoadingLocation(false);
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
            toast.error(errorMessage);
            setUseGeoLocation(false);
          },
          { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
        );
      });
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [useGeoLocation]);

  // create debounced fetch function
  const debouncFetchLocation = useMemo(() => 
    debounce( async (address) => {
      setIsFetchingFromAddress(true);
      try {
        const { latitude, longitude } = await fetchLocationFromAddress(address);
        setAutoLocation({ latitude, longitude });
        toast.info(`Coordinates fetched for ${address}: Lat ${latitude}, Lon ${longitude}`);        
      } catch (error) {
        toast.error(error.message);
        setAutoLocation({ latitude: '', longitude: '' }) // clear invalid location
        setLocationSource('');
      } finally {
        setIsFetchingFromAddress(false);
      }
    }, 1000), // debounce delay of 1 min
    []
  ) 

  // clear up debounce on unmount
  useEffect(() => {
    return () => {
      debouncFetchLocation.cancel();
    };
  }, [debouncFetchLocation])

  // fetch coordinates from Ghana Post Address when valid
  useEffect(() => {
    const addressPattern = /^[A-Z]{2}-\d{3}-\d{4}$/;

    if (ghanaPostAddress && addressPattern.test(ghanaPostAddress) && !useGeoLocation && locationSource !== 'map') { // dont fetch ghana post address if geolocation auto fetch is active
      debouncFetchLocation(ghanaPostAddress);
    } else if (ghanaPostAddress && !addressPattern.test(ghanaPostAddress)) {
      //clear location if invalid format
      setAutoLocation( { latitude: '', longitude: '' })
      setLocationSource('');
    }
  }, [ghanaPostAddress, useGeoLocation, debouncFetchLocation, locationSource])

  // handler for map click
  const handleMapClick = (latlng) => {
    const { lat, lng } = latlng;
    setAutoLocation({ latitude:lat, longitude:lng });
    setLocationSource('map')
    toast.info(`location selected from map: Lat ${lat.toFixed(4)}, Lon ${lng.toFixed(4)}`)
    if(useGeoLocation){ // uncheck geoloaction if active
      setUseGeoLocation(false);
    }
  };

  const onSubmit = async (data) => {
    if (!data.ghanaPostAddress && (!autoLocation.latitude || !autoLocation.longitude)) {
      toast.error('Either Ghana Post Address or GPS coordinates are required.');
      return;
    }
    if (images.length < 3) {
      toast.error('Minimum of three (3) images are required.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', data.title);
    formDataToSend.append('description', data.description);
    formDataToSend.append('price', data.price);
    formDataToSend.append('type', data.type);
    formDataToSend.append('beds', data.baths);
    formDataToSend.append('baths', data.baths);
    formDataToSend.append('location[ghanaPostAddress]', data.ghanaPostAddress);
    formDataToSend.append('location[gps][latitude]', useGeoLocation ? autoLocation.latitude : '');
    formDataToSend.append('location[gps][longitude]', useGeoLocation ? autoLocation.longitude : '');
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
    <div className="container mx-auto p-2 sm:p-4 max-w-full sm:max-w-4xl lg:max-w-7xl">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-indigo-900 mb-6 sm:mb-8">List a Property</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:gap-6 text-indigo-900 w-full md:w-1/2">
          <FormField
            label="Title *"
            type="text"
            name="title"
            register={register}
            rules={{ required: 'Title is required' }}
            errors={errors}
            placeholder="e.g., Cozy 2-Bedroom Apartment"
          />
          <FormField
            label="Description *"
            type="textarea"
            name="description"
            register={register}
            rules={{ required: 'Description is required', minLength: { value: 20, message: 'Description must be at least 20 characters' } }}
            errors={errors}
            placeholder="Describe your property in detail..."
            className="h-24 sm:h-32 resize-none"
          />
          <FormField
            label="Price (GHS) *"
            type="number"
            name="price"
            register={register}
            rules={{
              required: 'Price is required',
              min: { value: 1, message: 'Price must be greater than 0' },
              max: { value: 10000000, message: 'Price seems too high' },
            }}
            errors={errors}
            placeholder="e.g., 1500"
          />
          <PropertyDetails register={register} errors={errors} />
          <LocationInput
            register={register}
            errors={errors}
            useGeoLocation={useGeoLocation}
            setUseGeoLocation={setUseGeoLocation}
            isLoadingLocation={isLoadingLocation}
            autoLocation={autoLocation}
            isFetchingFromAddress={isFetchingFromAddress} 
            locationSource={locationSource}
          />
          <button
            type="submit"
            disabled={!isValid || images.length < 3}
            className={`bg-indigo-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-medium w-fit mx-auto transition-all duration-150 ${
              !isValid || images.length < 3
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-indigo-700 hover:shadow-lg transform hover:scale-105'
            }`}
          >
            {images.length < 3 ? 'Add images to continue' : 'Submit Property'}
          </button>
        </form>
        <div className="flex flex-col px-2 w-full md:w-1/2">
          <AddImages images={images} setImages={setImages} />
          <div className="h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden shadow-lg">
            <MapComponent center={mapCenter} hasValidCoords={hasValidCoords} onMapClick={handleMapClick} />
          </div>
        </div>
      </div>
    </div>
  );
}
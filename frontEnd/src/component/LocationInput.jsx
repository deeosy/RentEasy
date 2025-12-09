import React from 'react';
import { MapPin } from 'lucide-react';
import FormField from './FormField';

export default function LocationInput({
  register,
  errors,
  useGeoLocation,
  setUseGeoLocation,
  isLoadingLocation,
  autoLocation,
  isFetchingFromAddress,
  locationSource,
  selectedAddress,
}) {
  const handleGeoLocationChange = () => {
    if (isLoadingLocation) return;
    setUseGeoLocation((prev) => !prev);
  };

  const renderLocationStatus = () => {
    // Map click location
    if (locationSource === 'map' && selectedAddress) {
      return (
        <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
          <MapPin size={10} />
          Location selected: {selectedAddress}
        </p>
      );
    }

    //Geolocation status
    if (useGeoLocation) {
      if (isLoadingLocation) {
        return (
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
            <span>Fetching location...</span>
          </div>
        );
      }
      if(selectedAddress) {
        return (
          <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
            <MapPin size={10} />
            Location detected: {selectedAddress}
          </p>
        )
      }
      
      return (
        <p className="text-sm text-yellow-600 mt-1">
          ⚠ Location not yet available
        </p>
      );
    }
    // address fetch (show input address)
    if (locationSource === 'address' && selectedAddress) {
      return (
        <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
          <MapPin size={10} />
          Location detected: {selectedAddress}
        </p>
      )
    }
    return null
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-5">
      <div className="flex flex-col w-full sm:w-1/2">
        <FormField
          label="Ghana Post Address"
          type="text"
          name="ghanaPostAddress"
          register={register}
          rules={{
            pattern: {
              value: /^[A-Z]{2}-\d{3}-\d{4}$/,
              message: 'Invalid Ghana Post Address (e.g., GA-123-4567)',
            },
          }}
          errors={errors}
          placeholder="e.g., GA-123-4567"
        />
        {isFetchingFromAddress && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1 ">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 "></div>
            <span>Fetching coordinates from address...</span>
          </div>
        )}
      </div>
      <div className="flex flex-col w-full sm:w-1/2">
        <label className="text-sm font-medium mb-1 flex items-center gap-2">
          <input
            type="checkbox"
            checked={useGeoLocation}
            onChange={handleGeoLocationChange}
            disabled={isLoadingLocation}
            className="h-5 w-5 rounded-full border-2 border-indigo-600 checked:bg-indigo-600 focus:ring-indigo-500"
          />
          Use Current Location
        </label>
        {renderLocationStatus()}
      </div>
    </div>
  );
}
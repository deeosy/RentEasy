import React from 'react';
import SelectField from './SelectField';
import FormField from './FormField';

export default function PropertyDetails({ register, errors }) {
  const typeOptions = [
    { value: '', label: 'Select Type' },
    { value: 'room', label: 'Room' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'condo', label: 'Condo' },
    { value: 'studio', label: 'Studio' },
    { value: 'townhouse', label: 'Townhouse' },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
      <div className="flex flex-col w-full sm:w-1/3">
        <SelectField
          label="Property Type *"
          name="type"
          register={register}
          rules={{ required: 'Property type is required' }}
          errors={errors}
          options={typeOptions}
        />
      </div>
      <div className="flex flex-col w-full sm:w-1/3">
        <FormField
          label="Beds *"
          type="number"
          name="beds"
          register={register}
          rules={{
            required: 'Number of beds is required',
            min: { value: 1, message: 'Beds must be at least 1' },
            max: { value: 20, message: 'Maximum 20 beds allowed' },
          }}
          errors={errors}
          placeholder="e.g., 2"
        />
      </div>
      <div className="flex flex-col w-full sm:w-1/3">
        <FormField
          label="Baths *"
          type="number"
          name="baths"
          register={register}
          rules={{
            required: 'Number of baths is required',
            min: { value: 1, message: 'Baths must be at least 1' },
            max: { value: 20, message: 'Maximum 20 baths allowed' },
          }}
          errors={errors}
          placeholder="e.g., 1"
        />
      </div>
    </div>
  );
}
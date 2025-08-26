import React, { useRef, useState } from 'react';
import { Plus, Camera, Upload } from 'lucide-react';
import { toast } from 'react-toastify';
import ImagePreview from './ImagePreview';

export default function AddImages({ images, setImages }) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => {
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
      setImages([...images, ...validFiles.slice(0, remainingSlots)]);
    } else {
      setImages([...images, ...validFiles]);
    }
  };

  const handleDrag = (e, isActive) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(isActive);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length > 0) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  return (
    <div className="flex flex-col mb-4">
      <label className="text-sm font-medium mb-2 text-indigo-900 flex items-center gap-2">
        <Camera size={16} />
        Property Images * (min 3, max 5)
      </label>
      <div
        className={`flex flex-col sm:flex-row gap-2 p-3 rounded-xl border-2 border-dashed transition-all ${
          dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={(e) => handleDrag(e, true)}
        onDragLeave={(e) => handleDrag(e, false)}
        onDragOver={(e) => handleDrag(e, true)}
        onDrop={handleDrop}
      >
        <button
          type="button"
          onClick={() => {
            if (images.length >= 5) {
              toast.warning('Maximum 5 images allowed');
              return;
            }
            fileInputRef.current?.click();
          }}
          className={`h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 bg-gray-300 rounded-2xl flex flex-col items-center justify-center text-indigo-900 transition-all duration-200 flex-shrink-0 ${
            images.length >= 5
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-gray-400 hover:shadow-md transform hover:scale-105'
          }`}
          disabled={images.length >= 5}
        >
          <Plus size={20} />
          <span className="text-xs mt-1">Add Image</span>
        </button>
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <ImagePreview
              key={index}
              file={image}
              index={index}
              onRemove={() => setImages(images.filter((_, i) => i !== index))}
            />
          ))}
        </div>
        {images.length < 1 && (
          <div className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 bg-gray-200 rounded-2xl border-2 border-dashed border-gray-300 flex-shrink-0" />
        )}
      </div>
      <div className="flex flex-col sm:flex-row justify-between mt-2 text-sm text-gray-600">
        <p className="flex items-center gap-1">
          <Upload size={14} />
          {images.length}/5 images uploaded
        </p>
        <p className="text-xs mt-1 sm:mt-0">
          Drag & drop images here or click the + button. Max 5MB per image.
        </p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.length > 0) {
            handleImageUpload(e.target.files);
          }
          e.target.value = '';
        }}
        className="hidden"
      />
    </div>
  );
}
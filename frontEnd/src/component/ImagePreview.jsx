import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function ImagePreview({ file, onRemove, index }) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  }, [file]);

  if (!preview) return null;

  return (
    <div className="relative group h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-2xl overflow-hidden bg-gray-200 flex-shrink-0">
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


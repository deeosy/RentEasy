import React from 'react'

export default function SkeletonPropertyCard() {
  return (
    <div>
      <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md animate-pulse">
        {/* Image Skeleton */}
        <div className="h-48 w-full bg-gray-300"></div>
        <div className="p-4 space-y-3">
          {/* Title */}
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>

          {/* Location row */}
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>

          {/* Rooms / Baths / Type */}
          <div className="flex gap-3">
            <div className="h-3 bg-gray-300 rounded w-10"></div>
            <div className="h-3 bg-gray-300 rounded w-10"></div>
            <div className="h-3 bg-gray-300 rounded w-16"></div>
          </div>

          {/* Button */}
          <div className="h-8 bg-gray-300 rounded-md w-full"></div>

        </div>
      </div>
    </div>
  )
}

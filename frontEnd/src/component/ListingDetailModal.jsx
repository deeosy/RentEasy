import React, { useState } from 'react'

export default function ListingDetailModal({ show, listing, onClose, onPremiumClick }) {
    const [selectedImage, setSelectedImage] = useState(0);
    
    if (!show || !listing) return null;

    const allImages = [listing.imageUrl, ...(listing.additionalImages || [])];

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-2 bg-black/60 backdrop-blur-sm'>
            {/* Modal Container - Perfectly Centered & Compact */}
            <div className="relative w-full max-w-4xl h-[95vh] sm:h-[90vh] md:h-[85vh] bg-white rounded-lg shadow-2xl overflow-hidden">
                
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-2 right-2 z-20 bg-white/95 rounded-full p-1 text-gray-500 hover:text-gray-700 hover:bg-white transition-all"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Main Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
                    
                    {/* Image Section - Takes 3/5 of space on large screens, full width on mobile */}
                    <div className="lg:col-span-3 relative bg-gray-900 h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-full">
                        <img 
                            src={allImages[selectedImage]} 
                            alt={listing.title} 
                            className="w-full h-full object-cover"
                        />
                        
                        {/* Price Badge */}
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                            GHS {listing.price}/mo
                        </div>

                        {/* Property Type */}
                        <div className="absolute top-2 right-8 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                            {listing.propertyType}
                        </div>

                        {/* Navigation Arrows */}
                        {allImages.length > 1 && (
                            <>
                                <button 
                                    onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : allImages.length - 1)}
                                    className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-white"
                                >
                                    <svg className="w-3 h-3 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button 
                                    onClick={() => setSelectedImage(selectedImage < allImages.length - 1 ? selectedImage + 1 : 0)}
                                    className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-white"
                                >
                                    <svg className="w-3 h-3 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}

                        {/* Thumbnail Strip */}
                        <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black/80 to-transparent">
                            <div className="flex space-x-1 overflow-x-auto">
                                {allImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`flex-shrink-0 w-8 h-8 rounded overflow-hidden transition-all ${
                                            selectedImage === index ? 'ring-1 ring-white' : 'opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Image Counter */}
                        <div className="absolute bottom-1 right-1 bg-black/70 text-white px-1 py-0.5 rounded text-xs">
                            {selectedImage + 1}/{allImages.length}
                        </div>
                    </div>

                    {/* Content Section - Takes 2/5 of space on large screens, full width on mobile */}
                    <div className="lg:col-span-2 bg-white flex flex-col h-[55vh] sm:h-[45vh] md:h-[40vh] lg:h-full">
                        
                        {/* Header */}
                        <div className="p-3 border-b border-gray-100 flex-shrink-0">
                            <h1 className="text-base font-bold text-gray-900 mb-1">{listing.title}</h1>
                            <div className="flex items-center text-gray-600 mb-2">
                                <svg className="w-3 h-3 text-indigo-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs">{listing.location}</span>
                            </div>
                            
                            {/* Property Stats */}
                            <div className="grid grid-cols-3 gap-1">
                                <div className="text-center p-1 bg-gray-50 rounded text-xs">
                                    <div className="font-bold text-gray-900">{listing.beds}</div>
                                    <div className="text-gray-600">Beds</div>
                                </div>
                                <div className="text-center p-1 bg-gray-50 rounded text-xs">
                                    <div className="font-bold text-gray-900">{listing.baths}</div>
                                    <div className="text-gray-600">Baths</div>
                                </div>
                                <div className="text-center p-1 bg-indigo-50 rounded text-xs">
                                    <div className="font-bold text-indigo-600">★</div>
                                    <div className="text-indigo-600">Premium</div>
                                </div>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
                            
                            {/* Description */}
                            <div>
                                <h3 className="text-xs font-semibold text-gray-900 mb-1">Description</h3>
                                <p className="text-gray-700 text-xs leading-relaxed line-clamp-2">{listing.description}</p>
                            </div>

                            {/* Amenities */}
                            <div>
                                <h3 className="text-xs font-semibold text-gray-900 mb-1">Amenities</h3>
                                <div className="space-y-1">
                                    {listing.amenities?.slice(0, 2).map((amenity, index) => (
                                        <div key={index} className="flex items-center p-1 bg-gray-50 rounded text-xs">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                            <span className="text-gray-800">{amenity}</span>
                                        </div>
                                    ))}
                                    {listing.amenities?.length > 2 && (
                                        <button 
                                            onClick={onPremiumClick}
                                            className="text-indigo-600 text-xs font-medium hover:text-indigo-700"
                                        >
                                            +{listing.amenities.length - 2} more
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <h3 className="text-xs font-semibold text-gray-900 mb-1">Contact</h3>
                                <div className="relative bg-gray-50 p-2 rounded overflow-hidden">
                                    <div className="blur-sm space-y-1 text-xs">
                                        <div>Name: {listing.contactName}</div>
                                        <div>Phone: {listing.contactPhone}</div>
                                        <div>Email: {listing.contactEmail}</div>
                                    </div>
                                    <button 
                                        onClick={onPremiumClick}
                                        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex items-center justify-center rounded"
                                    >
                                        <div className="text-center">
                                            <svg className="w-4 h-4 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                            </svg>
                                            <p className="text-xs font-medium">Unlock Contact</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-3 bg-gray-50 border-t border-gray-200 space-y-2 flex-shrink-0">
                            <button 
                                onClick={onPremiumClick}
                                className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-medium py-2 px-3 rounded text-xs flex items-center justify-center space-x-1"
                            >
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <span>Get Directions</span>
                            </button>
                            <div className="grid grid-cols-2 gap-2">
                                <button 
                                    onClick={onClose}
                                    className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-1.5 px-3 rounded border border-gray-200 text-xs"
                                >
                                    Close
                                </button>
                                <button 
                                    onClick={onPremiumClick}
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-1.5 px-3 rounded text-xs"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
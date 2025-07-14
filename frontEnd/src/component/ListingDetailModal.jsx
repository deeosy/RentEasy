// import React from 'react'

// export default function ListingDetailModal({ show, listing, onClose, onPremiumClick }) {
//     if (!show || !listing) return null;

//     return (
//         <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm'>
//             {/* Modal Container - Perfectly Centered */}
//             <div className="relative w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 animate-in fade-in-0 zoom-in-95">
                
//                 {/* Close Button */}
//                 <button 
//                     onClick={onClose}
//                     className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 shadow-md"
//                 >
//                     <span className="sr-only">Close</span>
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                 </button>

//                 {/* Main Content */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-hidden">
                    
//                     {/* Image Section */}
//                     <div className="relative h-64 md:h-96 bg-gray-100">
//                         <img 
//                             src={listing.imageUrl} 
//                             alt={listing.title} 
//                             className="w-full h-full object-cover"
//                         />
                        
//                         {/* Price Badge */}
//                         <div className="absolute top-4 left-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg">
//                             <span className="text-lg font-bold">GHS {listing.price}</span>
//                             <span className="text-sm opacity-90">/month</span>
//                         </div>

//                         {/* Additional Images */}
//                         {listing.additionalImages && listing.additionalImages.length > 0 && (
//                             <div className="absolute bottom-4 left-4 right-4">
//                                 <div className="flex space-x-2 overflow-x-auto">
//                                     {listing.additionalImages.map((img, index) => (
//                                         <div 
//                                             key={index} 
//                                             className="relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200"
//                                             onClick={onPremiumClick}
//                                         >
//                                             <img 
//                                                 src={img} 
//                                                 alt={`View ${index + 1}`} 
//                                                 className="w-full h-full object-cover"
//                                             />
//                                             <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
//                                                 <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
//                                                     <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
//                                                 </svg>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     {/* Content Section */}
//                     <div className="p-6 overflow-y-auto max-h-[90vh]">
                        
//                         {/* Header */}
//                         <div className="mb-6">
//                             <h2 className="text-2xl font-bold text-gray-900 mb-2">{listing.title}</h2>
//                             <div className="flex items-center text-gray-600 mb-2">
//                                 <svg className="w-4 h-4 text-indigo-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                                     <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
//                                 </svg>
//                                 {listing.location}
//                             </div>
                            
//                             {/* Property Details */}
//                             <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
//                                 <span className="flex items-center">
//                                     <svg className="w-4 h-4 text-gray-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                                         <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
//                                     </svg>
//                                     {listing.beds} {listing.beds === 1 ? 'Bed' : 'Beds'}
//                                 </span>
//                                 <span className="flex items-center">
//                                     <svg className="w-4 h-4 text-gray-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                                         <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
//                                     </svg>
//                                     {listing.baths} {listing.baths === 1 ? 'Bath' : 'Baths'}
//                                 </span>
//                                 <span className="flex items-center">
//                                     <svg className="w-4 h-4 text-gray-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                                         <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
//                                     </svg>
//                                     {listing.propertyType}
//                                 </span>
//                             </div>
//                         </div>

//                         {/* Description */}
//                         <div className="mb-6">
//                             <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
//                             <p className="text-gray-600 leading-relaxed">{listing.description}</p>
//                         </div>

//                         {/* Amenities */}
//                         <div className="mb-6">
//                             <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
//                             <div className="grid grid-cols-1 gap-2">
//                                 {listing.amenities?.map((amenity, index) => (
//                                     <div key={index} className="flex items-center text-gray-600">
//                                         <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                                             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                                         </svg>
//                                         {amenity}
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Contact Information */}
//                         <div className="mb-6">
//                             <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
//                             <div className="relative bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-hidden">
//                                 <div className="blur-sm">
//                                     <p className="text-gray-600 mb-2"><strong>Name:</strong> {listing.contactName}</p>
//                                     <p className="text-gray-600 mb-2"><strong>Phone:</strong> {listing.contactPhone}</p>
//                                     <p className="text-gray-600"><strong>Email:</strong> {listing.contactEmail}</p>
//                                 </div>
//                                 <div 
//                                     className="absolute inset-0 bg-white/80 flex items-center justify-center cursor-pointer hover:bg-white/70 transition-colors"
//                                     onClick={onPremiumClick}
//                                 >
//                                     <div className="text-center">
//                                         <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
//                                             <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
//                                                 <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
//                                             </svg>
//                                         </div>
//                                         <p className="text-indigo-600 font-medium text-sm">Sign up to view contact details</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Directions Button */}
//                         <button 
//                             onClick={onPremiumClick}
//                             className="w-full bg-gray-100 text-gray-500 border border-gray-300 py-3 rounded-lg text-sm font-medium flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors mb-6"
//                         >
//                             <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                                 <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
//                             </svg>
//                             Get Directions
//                             <svg className="w-4 h-4 ml-2 opacity-60" fill="currentColor" viewBox="0 0 20 20">
//                                 <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
//                             </svg>
//                         </button>

//                         {/* Action Buttons */}
//                         <div className="space-y-3">
//                             <button 
//                                 onClick={onPremiumClick}
//                                 className="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
//                             >
//                                 Sign Up to View More
//                             </button>
//                             <button 
//                                 onClick={onClose}
//                                 className="w-full bg-white text-gray-700 font-semibold py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
//                             >
//                                 Close
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

import React, { useState } from 'react'

export default function ListingDetailModal({ show, listing, onClose, onPremiumClick }) {
    const [selectedImage, setSelectedImage] = useState(0);
    
    if (!show || !listing) return null;

    const allImages = [listing.imageUrl, ...(listing.additionalImages || [])];

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/60 backdrop-blur-sm'>
            {/* Modal Container - Perfectly Centered & Compact */}
            <div className="relative w-full max-w-4xl h-[85vh] bg-white rounded-lg shadow-2xl overflow-hidden">
                
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
                    
                    {/* Image Section - Takes 3/5 of space */}
                    <div className="lg:col-span-3 relative bg-gray-900">
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

                    {/* Content Section - Takes 2/5 of space */}
                    <div className="lg:col-span-2 bg-white flex flex-col">
                        
                        {/* Header */}
                        <div className="p-3 border-b border-gray-100">
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
                        <div className="flex-1 overflow-y-auto p-3 space-y-3">
                            
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
                        <div className="p-3 bg-gray-50 border-t border-gray-200 space-y-2">
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
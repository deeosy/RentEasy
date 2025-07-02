import React from 'react'

export default function ListingDetailModal({ show, listing, onClose, onPremiumClick }) {
  if (!show || !listing) return null;
  
    return (
    <div className='fixed inset-0 z-50 overflow-y-auto' aria-labelledby='modal-title' role='dialog' aria-modal='true' >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 ">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity " aria-hidden='true' onClick={onClose}></div>
            <span className='hidden sm:inline-block sm:align-middle sm:h-screen' aria-hidden='true' ></span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full ">
                <div className="absolute top-0 right-0 pt-4 pr-4">
                    <button type='button' className='bg-white rounded-full px-1  text-gray-400 hover:text-gray-500 focus:outline-none ' onClick={onClose} >
                        <span className='sr-only' >Close</span>
                        <i className='fas fa-times text-xl' ></i>
                    </button>
                </div>
                <div className="bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative h-64 md:h-full ">
                            <img src={listing.imageUrl} alt={listing.title} className='w-full h-full object-cover object-top ' />
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent ">
                                <div className="flex space-x-2 overflow-x-auto">
                                    {listing.additionalImages.map((img, index) => (
                                        <div key={index} className="relative flex-shrink-0 w-16 h-16 rounded overflow-hidden cursor-pointer" onClick={onPremiumClick} >
                                            <img src={img} alt={`Additional view ${index + 1}`} className='w-full h-full object-cover object-top' />
                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center ">
                                                <i className='fas fa-lock text-white' ></i>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="mb-4">
                                <h2 className='text-2xl font-bold text-gray-900 ' >{listing.title}</h2>
                                <p className='text-gray-600 flex items-center mt-1 ' >
                                    <i className='fas fa-map-marker-alt text-indigo-500 mr-1 ' ></i>
                                    {listing.location}
                                </p>
                                <p className='text-2xl font-bold text-indigo-600 mt-2 ' >GHS{listing.price}/month</p>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mb-4 ">
                                <span className='flex items-center mr-4' >
                                    <i className='fas fa-bed text-gray-400 mr-1' ></i>
                                    {listing.beds}{listing.beds === 1 ? 'Bed' : 'Beds' }
                                </span>
                                <span className='flex items-center mr-4 ' >
                                    {listing.baths}{listing.baths === 1 ? 'Bath' : 'Baths'}
                                </span>
                                <span className='flex items-center' >
                                    <i className='fas fa-home text-gray-400 mr-1' ></i>
                                    {listing.propertyType}
                                </span>
                            </div>
                            <div className="mb-4">
                                <h3 className='text-lg font-semibold text-gray-900 mb-2 ' >Description</h3>
                                <p className='text-gray-600' >{listing.description}</p>
                            </div>
                            <div className="mb-4">
                                <h3 className='text-lg fond-semibold text-gray-900 mb-2 ' >Amenities</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {listing.amenities.map((amenity, index) => {
                                      <div key={index} className="flex items-center text-gray-600 ">
                                        <i className='fas fa-check text-green-500 mr-2' ></i>
                                        {amenity}
                                      </div>
                                    })}
                                </div>
                            </div>
                            <div className="mb-4 relative">
                                <h3 className='text-lg font-semibold text-gray-900 mb-2' >Contact Information</h3>
                                <div className="bg-gray-100 p-4 rounded-md relative overflow-hidden">
                                    <div className="blur-sm">
                                        <p className='text-gray-600' ><strong>Name:</strong>{listing.contactName}</p>
                                        <p className='text-gray-600' ><strong>Phone:</strong>{listing.contactPhone}</p>
                                        <p className='text-gray-600' ><strong>Email:</strong>{listing.contactEmail}</p>
                                    </div>
                                    <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center " onClick={onPremiumClick} >
                                        <div className="text-center cursor-pointer">
                                            <i className='fas fa-lock text-indigo-600 text-2xl mb-2' ></i>
                                            <p className='text-indigo-600 font-medium' >Sign up to view contact details</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                                <button className='w-full bg-gray-100 text-gray-400 border border-gray-300 py-3 rounded-md text-sm font-medium flex items-center justify-center cursor-pointer !rounded-button whitespace-nowrap ' 
                                    onClick={onPremiumClick}
                                >
                                    <i className='fas fa-map-marker-alt mr-2' ></i>
                                    Get Directions
                                    <i className='fas fa-lock ml-2' ></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray50 px-4 py-3 sm:flex sm:flex-row-reverse ">
                    <button type='button' onClick={onPremiumClick}
                        className=' w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm !rounded-button whitespace-nowrap cursor-pointer '
                        
                    >
                        Sign Up to View More
                    </button>
                    <button onClick={onClose} type='button'
                        className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm !rounded-button whitespace-nowrap cursor-pointer '
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

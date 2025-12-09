import React from 'react'

export default function FeaturedListings({ listings, handleViewDetails }) {
  return (
    <section className='py-16' >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
                <h2 className='text-3xl font-bold text-gray-900 mb-4' >Featured Listings</h2>
                <p className='text-gray-600 w-full'>Discover our handpicked selection of properties
                    available for rent. Connect directly with landlords and property owners and find your perfect home.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {listings.map((listing) => (
                    <div key={listing.id}
                        className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                        onClick={() => handleViewDetails(listing)}
                    >
                        <div className="relative h-48 overflow-hidden">
                            <img src={listing.imageUrl} alt={listing.title} className='w-full h-full object-cover object-top' />
                            <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 text-sm font-medium">
                                GHS {listing.price}/mo
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className='text-lg font-semibold text-gray-900 mb-1 truncate' >{listing.title}</h3>
                            <p className='text-gray-600 text-sm mb-2 flex items-center' >
                                <i className='fas fa-map-marker-alt text-indigo-500 mr-1' ></i>
                                {listing.location}
                            </p>
                            <div className="flex items-center  text-sm text-gray-500 mb-3">
                                <span className='flex items-center mr-3 ' >
                                    <i className='fas fa-bed text-gray-400 mr-1' ></i>
                                    {listing.beds}{listing.beds === 1 ? 'Bed' : 'Beds'}
                                </span>                                
                                <span className='flex items-center mr-3 '>
                                    <i className='fas fa-bath text-gray-400 mr-1' ></i>
                                    {listing.baths}{listing.baths === 1 ? 'Bath' : 'Baths'}
                                </span>
                                <span className='flex items-center truncate'>
                                    <i className='fas fa-home text-gray-400 mr-1 ' ></i>
                                    {listing.propertyType} 
                                </span>
                            </div>
                            <button className='w-full bg-indigo-600 text-white py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors !rounded-button whitespace-nowrap cursor-pointer' >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
  )
}

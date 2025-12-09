// import React, { useEffect } from 'react'
// import { Button } from '@mui/material';
// import usePropertyStore from '../store/usePropertyStore'
// import axios from 'axios';
// import {PostAdModal} from '../component/PostAdModal';
// import MapComponent from '../component/MapComponent';

// export default function PropertiesPage() {
//     const { properties, setProperties} = usePropertyStore();

//     useEffect(() => {
//       const fetchProperties = async () => {
//         try {
//             const response = await axios.get('https://renteasy-m3ux.onrender.com/api/properties');
//             setProperties(response.data.properties);
//         } catch (err) {
//             console.error('Error fetching properties: ', err);
//         }
//       };
//       fetchProperties();
//     }, [setProperties])
//   return (
//     <>
//         <div className="flex justify-between px-2 py-3 bg-blue-400/80">
//             <h3 className='text-2xl font-bold flex items-center '><span className='text-xl font-normal'>rent</span>EASY</h3>
//             <PostAdModal />
//         </div>
//         <div className='p-5'>
//             <h4 className='text-xl mb-5'>Available Properties</h4>
//             <MapComponent properties={properties} center= {[5.6037, -0.1870]} zoom={12} />
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//             {properties.length === 0 ? (
//                 <p>No properties available</p>
//             ) : (
//                 properties.map((property) => (
//                 <div key={property._id} className="border rounded-md p-2 shadow-md" >
//                     <h3 className='text-xl font-bold' >{property.title}</h3>
//                     <p>{property.description}</p>
//                     <p className='text-green-600'>GHS {property.price} per month</p>
//                     <p>
//                         Location: {' '}
//                         {property.location.ghanaPostAddress || `${property.location.gps.latitude}, ${property.location.gps.longitude}`}
//                     </p>
//                     {property.images.length > 0 && (
//                         <img src={property.images[0]} alt={property.title} className='w-full h-48 object-cover rounded-md mt-2' />
//                     )}
//                 </div>
//                 ))
//             )}
//         </div>
//         </div>
//     </>
//   )
// }


import React, { useEffect, useState } from 'react';
import usePropertyStore from '../store/usePropertyStore';
import axios from 'axios';
import MapComponent from '../component/MapComponent';

// Main page to display all properties in a grid and on a map
export default function PropertiesPage() {
    const { properties, setProperties, isAuth } = usePropertyStore();
    const [loading, setLoading] = useState(true); // Track loading state

    // Fetch properties from backend when component mounts
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://renteasy-m3ux.onrender.com/api/properties');
                setProperties(response.data.properties);
            } catch (err) {
                console.error('Error fetching properties:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, [setProperties]);

    return (
        <>
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h4 className="text-xl mb-5">Available Properties</h4>
                    </div>
                    {/* Map showing property locations */}
                    {/* i am commenting out the map component for now i am still thinking about how this page is going to finally look like */}
                    {/* <MapComponent properties={properties} center={[5.6037, -0.1870]} zoom={12} /> */}
                    {/* Grid of property cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {loading ? (
                            <p>Loading properties...</p>
                        ) : properties.length === 0 ? (
                            <p>No properties available</p>
                        ) : (
                                properties.map((property) => (
                                    <div key={property._id}
                                        className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                                        onClick={() => handleViewDetails(property)}
                                    >
                                        <div className="relative h-48 overflow-hidden">
                                            <img src={property.images[0]} alt={property.title} className='w-full h-full object-cover object-top' />
                                            <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 text-sm font-medium">
                                                GHS {property.price}/mo
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className='text-lg font-semibold text-gray-900 mb-1 truncate' >{property.title}</h3>
                                            <p className='text-gray-600 text-sm mb-2 flex items-center' >
                                                <i className='fas fa-map-marker-alt text-indigo-500 mr-1' ></i>
                                                {property.location.ghanaPostAddress || `${property.location.gps?.latitude}, ${property.location.gps?.longitude}`}
                                            </p>
                                            <div className="flex items-center  text-sm text-gray-500 mb-3">
                                                <span className='flex items-center mr-3 ' >
                                                    <i className='fas fa-bed text-gray-400 mr-1' ></i>
                                                    {property.beds}{property.beds === 1 ? 'Bed' : 'Beds'}
                                                </span>                                
                                                <span className='flex items-center mr-3 '>
                                                    <i className='fas fa-bath text-gray-400 mr-1' ></i>
                                                    {property.baths}{property.baths === 1 ? 'Bath' : 'Baths'}
                                                </span>
                                                <span className='flex items-center truncate'>
                                                    <i className='fas fa-home text-gray-400 mr-1 ' ></i>
                                                    {property.propertyType} 
                                                </span>
                                            </div>
                                            <button className='w-full bg-indigo-600 text-white py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors !rounded-button whitespace-nowrap cursor-pointer' >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )
                        }
                    </div>
                </div>
            
            </div>
        </>
    );
}
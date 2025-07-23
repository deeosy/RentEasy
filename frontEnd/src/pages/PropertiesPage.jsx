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
import { Button } from '@mui/material';
import usePropertyStore from '../store/usePropertyStore';
import axios from 'axios';
import { PostAdModal } from '../component/PostAdModal';
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
            {/* Header with branding and Post Ad button */}
            <div className="flex justify-between px-2 py-3 bg-blue-400/80">
                <h3 className="text-2xl font-bold flex items-center">
                    <span className="text-xl font-normal">rent</span>EASY
                </h3>
                {/* Show Post Ad button only if user is authenticated */}
                {isAuth ? <PostAdModal /> : <Button variant="outlined" disabled>Log in to Post Ad</Button>}
            </div>
            <div className="p-5">
                <h4 className="text-xl mb-5">Available Properties</h4>
                {/* Map showing property locations */}
                <MapComponent properties={properties} center={[5.6037, -0.1870]} zoom={12} />
                {/* Grid of property cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {loading ? (
                        <p>Loading properties...</p>
                    ) : properties.length === 0 ? (
                        <p>No properties available</p>
                    ) : (
                        properties.map((property) => (
                            <div key={property._id} className="border rounded-md p-2 shadow-md">
                                <h3 className="text-xl font-bold">{property.title}</h3>
                                <p>{property.description}</p>
                                <p className="text-green-600">GHS {property.price} per month</p>
                                <p>
                                    Location:{' '}
                                    {property.location.ghanaPostAddress || `${property.location.gps?.latitude}, ${property.location.gps?.longitude}`}
                                </p>
                                {property.images.length > 0 && (
                                    <img
                                        src={property.images[0]}
                                        alt={property.title}
                                        className="w-full h-48 object-cover rounded-md mt-2"
                                    />
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
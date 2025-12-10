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
import SkeletonPropertyCard from '../component/SkeletonPropertyCard';

// Main page to display all properties in a grid and on a map
export default function PropertiesPage() {
    const { properties, setProperties, isAuth } = usePropertyStore();
    const [loading, setLoading] = useState(true); // Track loading state
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [searchInput, setSearchInput] = useState('')

    const [typeFilter, setTypeFilter] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [bedFilter, setBedFilter] = useState('');

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    

    // Fetch properties from backend when component mounts
    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/api/properties` ,
                    {
                        params: {
                            search: searchQuery || undefined,
                            type: typeFilter || undefined,
                            minPrice: minPrice || undefined,
                            maxPrice: maxPrice || undefined,
                            beds: bedFilter || undefined,
                            page,
                            limit: 20,
                        },
                    }
                );

                const data = response?.data || {};

                setProperties(data.properties || []);
                setTotalPages(data.pagination?.pages || 1);

            } catch (err) {
                console.error('Error fetching properties:', err);

                // Prevent crash by falling back to safe defaults
                setProperties([]);
                setTotalPages(1);
            }

            setLoading(false);
        };

        fetchProperties();
    }, [searchQuery, typeFilter, minPrice, maxPrice, bedFilter, page]);


    // debounce to prevent overwelming API calls to the server
    useEffect(() => {
      const delay = setTimeout(() => {
        setSearchQuery(searchInput);  // trigger API call only after delay
      }, 600);

      return () => clearTimeout(delay)
    }, [searchInput])

    useEffect(() => {
      setPage(1)
    }, [searchQuery, typeFilter, minPrice, maxPrice, bedFilter])

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page]);

    const handleViewDetails = (property) => {
      window.location.href = `/property/${property._id}`
    };

    return (
        <>
            <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  ">
            {/* Search Bar + Filters */}
            <div className="rounded-lg mb-4 flex flex-col lg:flex-row justify-between ">
                {/* Search Bar */}
                <div className="flex gap-3 justify-between lg:items-center ">
                    <input 
                        type="text"
                        placeholder='Search for your next home ...'
                        className='border p-2 rounded-md w-full lg:w-[400px] md:flex-1 focus:ring-2 focus:ring-indigo-500'
                        value={searchInput}
                        onChange={(e)=> setSearchInput(e.target.value)}                    
                    />
                    <button
                        onClick={()=> setShowFilters(!showFilters)}
                        className='lg:hidden bg-indigo-600 text-white px-4 py-2 rounded-md'
                    >
                        Filters
                    </button>
                </div>
                {/* Filters (hidden for mobile view and visible on desktop) */}
                <div className={`${showFilters ? 'block' : 'hidden'} lg:block mt-4 lg:mt-0`}>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {/* Property type */}
                        <select value={typeFilter} onChange={(e)=>setTypeFilter(e.target.value)} 
                            className='sm:w-[120px] border p-2 rounded-md'
                        >
                            <option value="">All Types</option>
                            <option value="room">Room</option>
                            <option value="apartment">Apartment</option>
                            <option value="house">House</option>
                            <option value="studio">Studio</option>
                            <option value="townhouse">Town House</option>
                            <option value="condo">Condo</option>
                        </select>

                        {/* Min Price */}
                        <input 
                            
                            type="number"
                            placeholder='Min Price'
                            className='border p-2 rounded-md sm:w-[120px]'
                            value={minPrice}
                            onChange={(e)=> setMinPrice(e.target.value)}
                        />

                        {/* Max Price */}
                        <input 
                            type="number"
                            placeholder='Max Price'
                            className='border p-2 rounded-md sm:w-[120px]'
                            value={maxPrice}
                            onChange={(e)=> setMaxPrice(e.target.value)}
                        />

                        {/* Beds */}
                        <select className='border p-2 rounded-md sm:w-[120px] ' value={bedFilter} onChange={(e)=> setBedFilter(e.target.value)}>
                            <option value="">Beds</option>
                            <option value="1">1+</option>
                            <option value="2">2+</option>
                            <option value="3">3+</option>
                            <option value="4">4+</option>
                        </select>

                    </div>
                </div>
            </div>
                <div className="">
                    <div className="mb-8">
                        <h4 className="text-xl mb-5">Available Properties</h4>
                    </div>
                    {/* Map showing property locations */}
                    {/* i am commenting out the map component for now i am still thinking about how this page is going to finally look like */}
                    {/* <MapComponent properties={properties} center={[5.6037, -0.1870]} zoom={12} /> */}
                    {/* Grid of property cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {loading ? (
                            // showing 8 skeleton cards on loading
                            Array.from({ length: 8 }).map((_, index) => (
                                <SkeletonPropertyCard key={index} />
                            ))  
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
                {/* Pagination */}
                <div className="flex justify-center items-center mt-10 gap-4">
                    <button
                        onClick={()=> setPage((prev)=> Math.max(prev - 1, 1) )}
                        disabled={page === 1}
                        className={`px-4 py-2 rounded-md ${page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 text-white'}`}
                    >
                        Previous
                    </button>

                    <span className='text-gray-700'>
                        Page {page} of {totalPages}
                    </span>
                    
                    <button
                        onClick={()=> setPage((prev)=> Math.min(prev + 1, totalPages) )}
                        disabled={page === totalPages}
                        className={`px-4 py-2 rounded-md ${page === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 text-white'}`}
                    >
                        Next
                    </button>

                </div>
            
            </div>
        </>
    );
}
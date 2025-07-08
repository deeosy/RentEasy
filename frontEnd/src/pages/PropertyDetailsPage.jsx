import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function PropertyDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:4001/api/properties/${id}`);
                setProperty(response.data.property);
            } catch (err) {
                toast.error(`Failed to load property: ${err.response?.data?.message || err.message}`, {
                    position: 'top-right',
                    autoClose: 5000,
                });
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    if (loading) return <p>Loading property...</p>;
    if (!property) return <p>Property not found</p>;

    return (
        <div className="p-6 bg-gradient-to-r from-indigo-700 to-indigo-900 min-h-screen text-white">
            <h3 className="text-3xl font-bold mb-4">{property.title}</h3>
            <div className="max-w-2xl mx-auto">
                <p className="mb-2">{property.description}</p>
                <p className="text-green-600 mb-2">GHS {property.price} per month</p>
                <p className="mb-2">
                    Location:{' '}
                    {property.location.ghanaPostAddress || `${property.location.gps?.latitude}, ${property.location.gps?.longitude}`}
                </p>
                <p className="mb-2">Type: {property.type}</p>
                <p className="mb-2">Bedrooms: {property.beds}</p>
                <p className="mb-2">Bathrooms: {property.baths}</p>
                {property.images.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {property.images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`${property.title} ${index + 1}`}
                                className="w-full h-48 object-cover rounded-md"
                            />
                        ))}
                    </div>
                )}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/directions/${property._id}`)}
                >
                    Get Directions
                </Button>
            </div>
        </div>
    );
}
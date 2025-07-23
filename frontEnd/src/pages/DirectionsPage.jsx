import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function DirectionsPage() {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`https://renteasy-m3ux.onrender.com/api/properties/${id}`);
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

    if (loading) return <p>Loading...</p>;
    if (!property) return <p>Property not found</p>;

    const handleContactOwner = () => {
        // Placeholder: In production, use email or messaging system
        toast.info(`Contact owner at: ${property.owner?.email || 'owner@example.com'}`, {
            position: 'top-right',
            autoClose: 5000,
        });
    };

    const handleOpenMap = () => {
        const lat = property.location.gps?.latitude || 5.6037;
        const lng = property.location.gps?.longitude || -0.1870;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        window.open(url, '_blank');
    };

    return (
        <div className="p-6 bg-gradient-to-r from-indigo-700 to-indigo-900 min-h-screen text-white">
            <h3 className="text-3xl font-bold mb-4">Directions to {property.title}</h3>
            <div className="max-w-2xl mx-auto">
                <p className="mb-2">
                    Location:{' '}
                    {property.location.ghanaPostAddress || `${property.location.gps?.latitude}, ${property.location.gps?.longitude}`}
                </p>
                <Button variant="contained" color="primary" onClick={handleOpenMap} className="mr-2">
                    Open in Google Maps
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleContactOwner}>
                    Contact Owner
                </Button>
            </div>
        </div>
    );
}
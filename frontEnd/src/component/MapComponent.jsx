// import React, { useEffect, useRef } from 'react'
// import L from 'leaflet'
// import 'leaflet/dist/leaflet.css'

// export default function MapComponent({ onLocationSelect, properties, center, zoom = 13 }) {
//   const mapRef = useRef(null);

//   useEffect(() => {
//     // Initialize map if not already initialized
//     if (!mapRef.current) {
//       mapRef.current = L.map('map').setView(center || [5.6037, -0.1870], zoom) // Default to Accra, Ghana
//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//       }).addTo(mapRef.current);

//       // add click event for coordinate selection
//       if (onLocationSelect) {
//         mapRef.current.on('click', (e) => {
//           const { lat, lng } = e.latlng;
//           onLocationSelect({ latitude: lat, longitude: lng });
//           L.marker([lat, lng]).addTo(mapRef.current).bindPopup(`Selected: ${lat}, ${lng}`).openPopup();
//         });
//       }

//       // Add markers for properties
//       if (properties && properties.length > 0) {
//         properties.forEach((property) => {
//           if (property.location.gps && property.location.gps.latitude && property.location.gps.longitude) {
//             const marker = L.marker([property.location.gps.latitude, property.location.gps.longitude]).addTo(mapRef.current);
//             marker.bindPopup(`<b>${property.title}</b><b>${property.location.gps.latitude}</b>, ${property.location.gps.longitude}`)
//           }
//         });
//       }
//     }

//     //update map center if center prop changes
//     if (center && mapRef.current) {
//       mapRef.current.setView(center, zoom);
//     }

//     // clean up
//     if (mapRef.current) {
//       mapRef.current.remove();
//       mapRef.current = null;
//     }
//   }, [onLocationSelect, properties, center, zoom])

//   return <div id='map' style={{ height: '400px', width: '100%' }} />
// }

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Placeholder geocoding function for Ghana Post Address
const geocodeGhanaPostAddress = async (address) => {
  // Simulate API call (replace with real geocoding service like Nominatim in production)
  const mockCoordinates = {
    'GA-123-4567': { latitude: 5.6037, longitude: -0.1870 }, // Example
  };
  return mockCoordinates[address] || { latitude: 5.6037, longitude: -0.1870 };
};

// Component to display a map with property markers
export default function MapComponent({ onLocationSelect, properties, center, zoom = 13 }) {
  const mapRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView(center || [5.6037, -0.1870], zoom);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      // Add click event for selecting coordinates
      if (onLocationSelect) {
        mapRef.current.on('click', (e) => {
          const { lat, lng } = e.latlng;
          onLocationSelect({ latitude: lat, longitude: lng });
          L.marker([lat, lng])
            .addTo(mapRef.current)
            .bindPopup(`Selected: ${lat}, ${lng}`)
            .openPopup();
        });
      }
    }

    // Add or update markers for properties
    if (properties && properties.length > 0) {
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapRef.current.removeLayer(layer);
        }
      });

      properties.forEach(async (property) => {
        let lat, lng, popupContent;
        if (property.location.gps && property.location.gps.latitude && property.location.gps.longitude) {
          lat = property.location.gps.latitude;
          lng = property.location.gps.longitude;
          popupContent = `<b>${property.title}</b><br>Location: ${lat}, ${lng}`;
        } else if (property.location.ghanaPostAddress) {
          const coords = await geocodeGhanaPostAddress(property.location.ghanaPostAddress);
          lat = coords.latitude;
          lng = coords.longitude;
          popupContent = `<b>${property.title}</b><br>Location: ${property.location.ghanaPostAddress}`;
        } else {
          return; // Skip properties with no valid location
        }

        const marker = L.marker([lat, lng]).addTo(mapRef.current);
        marker.bindPopup(`
          ${popupContent}
          <br>
          <button onclick="window.location.href='/property/${property._id}'" class="leaflet-popup-btn">View Details</button>
          <br>
          <button onclick="window.location.href='/directions/${property._id}'" class="leaflet-popup-btn">Get Directions</button>
        `);
      });
    }

    // Update map center
    if (center && mapRef.current) {
      mapRef.current.setView(center, zoom);
    }

    // Clean up
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onLocationSelect, properties, center, zoom]);

  return (
    <div id="map" style={{ height: '400px', width: '100%' }}>
      <style>{`
        .leaflet-popup-btn {
          display: block;
          margin: 5px 0;
          padding: 5px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 3px;
          cursor: pointer;
        }
        .leaflet-popup-btn:hover {
          background: #2563eb;
        }
      `}</style>
    </div>
  );
}
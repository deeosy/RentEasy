import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default function MapComponent({ onLocationSelect, properties, center, zoom = 13 }) {
    const mapRef = useRef(null);

    useEffect(() => {
      // Initialize map if not already initialized
      if(!mapRef.current) {
        mapRef.current = L.map('map').setView(center || [5.6037, -0.1870], zoom) // Default to Accra, Ghana
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(mapRef.current);

        // add click event for coordinate selection
        if(onLocationSelect) {
            mapRef.current.on('click', (e) => {
                const { lat, lng } = e.latlng;
                onLocationSelect({ latitude: lat, longitude: lng });
                L.marker([lat, lng]).addTo(mapRef.current).bindPopup(`Selected: ${lat}, ${lng}`).openPopup();
            });
        }

        // Add markers for properties
        if (properties && properties.length > 0) {
            properties.forEach((property) => {
              if (property.location.gps && property.location.gps.latitude && property.location.gps.longitude) {
                const marker = L.marker([property.location.gps.latitude, property.location.gps.longitude]).addTo(mapRef.current);
                marker.bindPopup(`<b>${property.title}</b><b>${property.location.gps.latitude}</b>, ${property.location.gps.longitude}`)
              }
            });
        }
      }

      //update map center if center prop changes
      if (center && mapRef.current) {
        mapRef.current.setView(center, zoom);
      }

      // clean up
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    }, [onLocationSelect, properties, center, zoom])

  return <div id='map' style={{height:'400px', width: '100%'}} />
}

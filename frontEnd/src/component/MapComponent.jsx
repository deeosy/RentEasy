import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapComponent({ center, hasValidCoords, onMapClick }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map', {
        center: center,
        zoom: 13,
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      // added on map click event listener
      if(onMapClick) {
        mapRef.current.on('click', (e)=> onMapClick(e.latlng))
      }
    }

    if (hasValidCoords) {
      if (markerRef.current) {
        markerRef.current.setLatLng(center);
      } else {
        markerRef.current = L.marker(center)
          .addTo(mapRef.current)
          .bindPopup(`Location: Lat ${center[0].toFixed(4)}, Lon ${center[1].toFixed(4)}`);
      }
      mapRef.current.setView(center, 13);
    } else {
      mapRef.current.setView(center, 13);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [center, hasValidCoords, onMapClick]);

  return <div id="map" className="rounded-xl z-0 w-full h-full" />;
}
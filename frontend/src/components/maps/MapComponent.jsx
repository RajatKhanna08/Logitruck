import { useEffect, useRef, useState } from "react";

export default MapComponent = ({ onLocationSelect, selectedLocation, locations = [] }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  
  useEffect(() => {
    // Load Leaflet library
    loadLeaflet().then((L) => {
      window.L = L;
      setLeafletLoaded(true);
    });
  }, []);
  
  useEffect(() => {
    // Initialize Leaflet map
    if (leafletLoaded && !mapInstanceRef.current && mapRef.current && window.L) {
      // Default center on Delhi, India
      mapInstanceRef.current = window.L.map(mapRef.current).setView([28.6139, 77.2090], 10);
      
      // Add OpenStreetMap tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);
      
      // Add click event listener
      mapInstanceRef.current.on('click', handleMapClick);
    }
    
    // Clean up markers
    return () => {
      if (mapInstanceRef.current) {
        markersRef.current.forEach(marker => {
          mapInstanceRef.current.removeLayer(marker);
        });
        markersRef.current = [];
      }
    };
  }, [leafletLoaded]);
  
  useEffect(() => {
    // Update markers when locations change
    if (mapInstanceRef.current && window.L) {
      // Clear existing markers
      markersRef.current.forEach(marker => {
        mapInstanceRef.current.removeLayer(marker);
      });
      markersRef.current = [];
      
      // Add new markers
      locations.forEach((location, index) => {
        if (location.latitude && location.longitude) {
          const marker = window.L.marker([location.latitude, location.longitude]);
          
          // Custom popup content
          const popupContent = `
            <div style="font-family: Arial, sans-serif;">
              <strong style="color: #1565c0; font-size: 14px;">${location.name || `Location ${index + 1}`}</strong>
              <br/>
              <span style="color: #666; font-size: 12px;">${location.address || 'Selected location'}</span>
              <br/>
              <small style="color: #999; font-size: 10px;">
                Lat: ${location.latitude.toFixed(4)}, Lng: ${location.longitude.toFixed(4)}
              </small>
            </div>
          `;
          
          marker.bindPopup(popupContent);
          marker.addTo(mapInstanceRef.current);
          markersRef.current.push(marker);
          
          // Different icons for pickup vs drop
          if (location.name === 'Pickup') {
            marker.setIcon(window.L.divIcon({
              html: '<div style="background: #10b981; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">P</div>',
              iconSize: [30, 30],
              iconAnchor: [15, 15],
              className: 'custom-marker'
            }));
          } else {
            marker.setIcon(window.L.divIcon({
              html: `<div style="background: #f59e0b; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${index}</div>`,
              iconSize: [30, 30],
              iconAnchor: [15, 15],
              className: 'custom-marker'
            }));
          }
        }
      });
      
      // Auto-fit map to show all markers
      if (markersRef.current.length > 0) {
        const group = new window.L.featureGroup(markersRef.current);
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
      }
    }
  }, [locations, leafletLoaded]);
  
  const handleMapClick = async (e) => {
    const { lat, lng } = e.latlng;
    
    try {
      // Reverse geocoding using OpenStreetMap Nominatim
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      const address = data.display_name || `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      
      onLocationSelect({
        latitude: lat,
        longitude: lng,
        address: address
      });
    } catch (error) {
      console.error('Error getting address:', error);
      onLocationSelect({
        latitude: lat,
        longitude: lng,
        address: `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`
      });
    }
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  if (!leafletLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg" style={{ minHeight: '300px' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapRef}
        className="w-full h-full cursor-crosshair rounded-lg"
        style={{ minHeight: '300px' }}
      />
      {selectedLocation && (
        <div className="absolute top-2 left-2 bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow-md z-[1000]">
          <p className="text-sm font-medium text-blue-600">
            📍 Click on map to select {selectedLocation === 'pickup' ? 'pickup' : 'drop'} location
          </p>
        </div>
      )}
      
      {/* Legend */}
      <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow-md z-[1000]">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span>Pickup</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span>Drop</span>
          </div>
        </div>
      </div>
    </div>
  );
};
import { useState, useEffect, useRef } from 'react';
import { 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaTruck, 
  FaDollarSign, 
  FaBoxOpen, 
  FaClock, 
  FaRoute,
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaPlus,
  FaTrash
} from 'react-icons/fa';

// Leaflet CSS and JS imports
const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

// Load Leaflet dynamically
const loadLeaflet = () => {
  return new Promise((resolve) => {
    if (window.L) {
      resolve(window.L);
      return;
    }
    
    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = LEAFLET_CSS;
    document.head.appendChild(link);
    
    // Load JS
    const script = document.createElement('script');
    script.src = LEAFLET_JS;
    script.onload = () => resolve(window.L);
    document.head.appendChild(script);
  });
};

// Real Leaflet Map Component with OpenStreetMap
const MapComponent = ({ onLocationSelect, selectedLocation, locations = [] }) => {
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
  }, [leafletLoaded]);
  
  useEffect(() => {
    if (mapInstanceRef.current && window.L && leafletLoaded) {
      // Clear existing markers
      markersRef.current.forEach(marker => {
        mapInstanceRef.current.removeLayer(marker);
      });
      markersRef.current = [];
      
      // Add new markers for existing locations
      locations.forEach((location, index) => {
        if (location.latitude && location.longitude) {
          const marker = window.L.marker(
            [parseFloat(location.latitude), parseFloat(location.longitude)],
            {
              icon: window.L.divIcon({
                html: `<div style="background: ${location.name === 'Pickup' ? '#10b981' : '#f59e0b'}; 
                              color: white; 
                              border-radius: 50%; 
                              width: 30px; 
                              height: 30px; 
                              display: flex; 
                              align-items: center; 
                              justify-content: center; 
                              font-weight: bold; 
                              border: 2px solid white; 
                              box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                        ${location.name === 'Pickup' ? 'P' : index}
                      </div>`,
                className: 'custom-marker',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
              })
            }
          );

          marker.bindPopup(`<b>${location.name}</b><br>${location.address}`);
          marker.addTo(mapInstanceRef.current);
          markersRef.current.push(marker);
        }
      });

      // Fit bounds if there are markers
      if (markersRef.current.length > 0) {
        const group = new window.L.featureGroup(markersRef.current);
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
      }
    }
  }, [locations, leafletLoaded]);
  
  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    
    // Immediately pass location to parent to show marker
    onLocationSelect({
      latitude: lat,
      longitude: lng,
      address: `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`
    });

    // Then try to get formatted address
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    )
      .then(response => response.json())
      .then(data => {
        onLocationSelect({
          latitude: lat,
          longitude: lng,
          address: data.display_name
        });
      })
      .catch(error => {
        console.error('Error getting address:', error);
      });
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

export default function BookOrderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    pickupLocation: { address: '', latitude: '', longitude: '' },
    dropLocations: [{ address: '', latitude: '', longitude: '' }],
    scheduledAt: '',
    isBiddingEnabled: false,
    biddingExpiresAt: '',
    loadDetails: '',
    completedStops: [],
    paymentMode: '',
    urgency: 'normal',
    bodyTypeMultiplier: 1,
    sizeCategoryMultiplier: 1,
    isMultiStop: false
  });
  
  const [activeLocationInput, setActiveLocationInput] = useState(null);
  const [mapKey, setMapKey] = useState(0);

  const steps = [
    { id: 1, title: 'Pickup & Drop', icon: FaMapMarkerAlt },
    { id: 2, title: 'Schedule & Bidding', icon: FaCalendarAlt },
    { id: 3, title: 'Load Details', icon: FaBoxOpen },
    { id: 4, title: 'Payment & Urgency', icon: FaDollarSign },
    { id: 5, title: 'Review & Submit', icon: FaCheck }
  ];

  const handleLocationSelect = (location) => {
    if (activeLocationInput === 'pickup') {
      setFormData(prev => ({
        ...prev,
        pickupLocation: {
          address: location.address,
          latitude: location.latitude.toString(),
          longitude: location.longitude.toString()
        }
      }));
    } else if (activeLocationInput?.startsWith('drop-')) {
      const index = parseInt(activeLocationInput.split('-')[1]);
      setFormData(prev => ({
        ...prev,
        dropLocations: prev.dropLocations.map((drop, idx) => 
          idx === index ? {
            address: location.address,
            latitude: location.latitude.toString(),
            longitude: location.longitude.toString()
          } : drop
        )
      }));
    }
    
    // Keep the active input selected until user chooses another input
    // setActiveLocationInput(null); // Remove this line
    setMapKey(prev => prev + 1);
  };

  const addDropLocation = () => {
    setFormData(prev => ({
      ...prev,
      dropLocations: [...prev.dropLocations, { address: '', latitude: '', longitude: '' }]
    }));
  };

  const removeDropLocation = (index) => {
    if (formData.dropLocations.length > 1) {
      setFormData(prev => ({
        ...prev,
        dropLocations: prev.dropLocations.filter((_, idx) => idx !== index)
      }));
    }
  };

  const handleInputChange = (field, value, index = null) => {
    if (field === 'dropLocation' && index !== null) {
      setFormData(prev => ({
        ...prev,
        dropLocations: prev.dropLocations.map((drop, idx) => 
          idx === index ? { ...drop, address: value } : drop
        )
      }));
    } else if (field === 'pickupLocation') {
      setFormData(prev => ({
        ...prev,
        pickupLocation: { ...prev.pickupLocation, address: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Order submitted:', formData);
    alert('Order submitted successfully!');
  };

  const getAllLocations = () => {
    const locations = [];
    
    // Add pickup location
    if (formData.pickupLocation.address && formData.pickupLocation.latitude && formData.pickupLocation.longitude) {
      locations.push({ 
        ...formData.pickupLocation, 
        name: 'Pickup' 
      });
    }
    
    // Add drop locations
    formData.dropLocations.forEach((drop, idx) => {
      if (drop.address && drop.latitude && drop.longitude) {
        locations.push({ 
          ...drop, 
          name: `Drop ${idx + 1}` 
        });
      }
    });
    
    return locations;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-green-500" />
                    Pickup Location
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Enter pickup address"
                      value={formData.pickupLocation.address}
                      onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => setActiveLocationInput('pickup')}
                      className={`w-full px-4 py-2 border rounded-lg transition-colors flex items-center justify-center gap-2 ${
                        activeLocationInput === 'pickup' 
                          ? 'bg-blue-500 text-white border-blue-500' 
                          : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
                      }`}
                    >
                      <FaMapMarkerAlt />
                      {activeLocationInput === 'pickup' ? 'Click on map now' : 'Select on Map'}
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                    <FaRoute className="text-yellow-500" />
                    Drop Locations
                  </h3>
                  <div className="space-y-3">
                    {formData.dropLocations.map((drop, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder={`Drop location ${index + 1}`}
                            value={drop.address}
                            onChange={(e) => handleInputChange('dropLocation', e.target.value, index)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => setActiveLocationInput(`drop-${index}`)}
                            className={`w-full mt-2 px-4 py-2 border rounded-lg transition-colors flex items-center justify-center gap-2 ${
                              activeLocationInput === `drop-${index}` 
                                ? 'bg-blue-500 text-white border-blue-500' 
                                : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
                            }`}
                          >
                            <FaMapMarkerAlt />
                            {activeLocationInput === `drop-${index}` ? 'Click on map now' : 'Select on Map'}
                          </button>
                        </div>
                        {formData.dropLocations.length > 1 && (
                          <button
                            onClick={() => removeDropLocation(index)}
                            className="px-3 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addDropLocation}
                      className="w-full px-4 py-3 bg-yellow-400 text-blue-900 rounded-lg hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <FaPlus />
                      Add Drop Location
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Interactive Map</h3>
                <div className="h-96 border border-gray-300 rounded-lg overflow-hidden">
                  <MapComponent
                    key={mapKey}
                    onLocationSelect={handleLocationSelect}
                    selectedLocation={activeLocationInput}
                    locations={getAllLocations()}
                  />
                </div>
                {activeLocationInput && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">
                      Click on the map to select {activeLocationInput === 'pickup' ? 'pickup' : 'drop'} location
                    </p>
                  </div>
                )}
                
                {/* Show selected locations summary */}
                {getAllLocations().length > 0 && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800 mb-2">Selected Locations:</p>
                    {getAllLocations().map((loc, idx) => (
                      <p key={idx} className="text-xs text-green-700 mb-1">
                        {loc.name}: {loc.address.substring(0, 50)}...
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                <FaCalendarAlt className="text-yellow-500" />
                Schedule Pickup
              </h3>
              <input
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => handleInputChange('scheduledAt', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                <FaDollarSign className="text-yellow-500" />
                Bidding Options
              </h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBiddingEnabled}
                    onChange={(e) => handleInputChange('isBiddingEnabled', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Enable competitive bidding</span>
                </label>
                
                {formData.isBiddingEnabled && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bidding Expires At
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.biddingExpiresAt}
                      onChange={(e) => handleInputChange('biddingExpiresAt', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                <FaBoxOpen className="text-yellow-500" />
                Load Information
              </h3>
              <textarea
                placeholder="Describe your load (type of goods, weight, dimensions, special requirements)"
                value={formData.loadDetails}
                onChange={(e) => handleInputChange('loadDetails', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h4 className="text-md font-semibold text-blue-800 mb-3">Body Type Multiplier</h4>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={formData.bodyTypeMultiplier}
                  onChange={(e) => handleInputChange('bodyTypeMultiplier', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h4 className="text-md font-semibold text-blue-800 mb-3">Size Category Multiplier</h4>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={formData.sizeCategoryMultiplier}
                  onChange={(e) => handleInputChange('sizeCategoryMultiplier', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isMultiStop}
                  onChange={(e) => handleInputChange('isMultiStop', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">Enable Multi-Stop Delivery</span>
              </label>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  <FaDollarSign className="text-yellow-500" />
                  Payment Mode
                </h3>
                <select
                  value={formData.paymentMode}
                  onChange={(e) => handleInputChange('paymentMode', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Payment Mode</option>
                  <option value="prepaid">Prepaid</option>
                  <option value="postpaid">Postpaid</option>
                </select>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  <FaClock className="text-yellow-500" />
                  Urgency Level
                </h3>
                <select
                  value={formData.urgency}
                  onChange={(e) => handleInputChange('urgency', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low Priority</option>
                  <option value="normal">Normal</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                <FaCheck className="text-yellow-500" />
                Review Your Order
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="border-b pb-3">
                    <h4 className="font-medium text-gray-700 mb-2">Pickup Location</h4>
                    <p className="text-gray-600">{formData.pickupLocation.address || 'Not selected'}</p>
                  </div>
                  
                  <div className="border-b pb-3">
                    <h4 className="font-medium text-gray-700 mb-2">Drop Locations</h4>
                    {formData.dropLocations.map((drop, index) => (
                      <p key={index} className="text-gray-600 mb-1">
                        {index + 1}. {drop.address || 'Not selected'}
                      </p>
                    ))}
                  </div>
                  
                  <div className="border-b pb-3">
                    <h4 className="font-medium text-gray-700 mb-2">Scheduled At</h4>
                    <p className="text-gray-600">{formData.scheduledAt || 'Not scheduled'}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="border-b pb-3">
                    <h4 className="font-medium text-gray-700 mb-2">Load Details</h4>
                    <p className="text-gray-600">{formData.loadDetails || 'Not provided'}</p>
                  </div>
                  
                  <div className="border-b pb-3">
                    <h4 className="font-medium text-gray-700 mb-2">Payment & Urgency</h4>
                    <p className="text-gray-600">
                      Payment: {formData.paymentMode || 'Not selected'} | 
                      Urgency: {formData.urgency}
                    </p>
                  </div>
                  
                  <div className="border-b pb-3">
                    <h4 className="font-medium text-gray-700 mb-2">Options</h4>
                    <p className="text-gray-600">
                      Bidding: {formData.isBiddingEnabled ? 'Enabled' : 'Disabled'} | 
                      Multi-Stop: {formData.isMultiStop ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">Book Your Order</h1>
          <p className="text-gray-600">Complete the form below to book your logistics order</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-20 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step.id ? (
                    <FaCheck className="w-10 h-5" />
                  ) : (
                    <step.icon className="w-10 h-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-full h-1 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            {steps.map((step) => (
              <div key={step.id} className="text-center">
                <p className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {step.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            <FaArrowLeft />
            Previous
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Step {currentStep} of {steps.length}
            </p>
          </div>

          {currentStep < steps.length ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Next
              <FaArrowRight />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-8 py-3 bg-yellow-400 text-blue-900 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
            >
              <FaCheck />
              Submit Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
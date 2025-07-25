import { useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
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
import { useUserProfile } from '../../hooks/useUserProfile';
import { bookOrder } from '../../api/orderApi';

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
                                ${location.name === 'Pickup' ? 'P' : index + 1}
                              </div>`, // Changed index to index + 1 for drop locations
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
  const { data:userProfile } = useUserProfile();
  const customerId = userProfile?.role === "company" ? userProfile._id : "";

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    pickupLocation: { address: '', latitude: '', longitude: '' },
    dropLocations: [{ address: '', latitude: '', longitude: '' }],
    scheduledAt: '',
    isBiddingEnabled: false,
    biddingExpiresAt: '',
    loadDetails: { // Updated structure for loadDetails
      weightInKg: '',
      volumeInCubicMeters: '',
      type: 'general', // Default value from schema
      quantity: '',
      description: ''
    },
    // Adding required fields from schema with default values
    completedStops: 0,
    paymentMode: '', // Will be updated to match schema enum
    urgency: 'low', // Default value from schema
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
            ...drop, // Preserve existing contactName, contactPhone, instructions if they were there
            address: location.address,
            latitude: location.latitude.toString(),
            longitude: location.longitude.toString()
          } : drop
        )
      }));
    }
    
    // Keep the active input selected until user chooses another input
    // setActiveLocationInput(null); // Removed as per original comment
    setMapKey(prev => prev + 1);
  };
  
  const addDropLocation = () => {
    setFormData(prev => ({
      ...prev,
      dropLocations: [...prev.dropLocations, { address: '', latitude: '', longitude: '', contactName: '', contactPhone: '', instructions: '' }] // Initialize new drop location with all fields
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

  // Modified handleInputChange to handle nested loadDetails and dropLocations
  const handleInputChange = (field, value, index = null) => {
    if (field === 'pickupLocation') {
      setFormData(prev => ({
        ...prev,
        pickupLocation: { ...prev.pickupLocation, address: value }
      }));
    } else if (field.startsWith('dropLocation-')) {
        const [_, dropField, idxStr] = field.split('-');
        const index = parseInt(idxStr);
        setFormData(prev => ({
            ...prev,
            dropLocations: prev.dropLocations.map((drop, idx) => 
                idx === index ? { ...drop, [dropField]: value } : drop
            )
        }));
    } else if (field.startsWith('loadDetails.')) {
      const loadDetailField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        loadDetails: {
          ...prev.loadDetails,
          [loadDetailField]: value
        }
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

  const bookOrderMutation = useMutation({
    mutationFn: bookOrder,
    onSuccess: (data) => {
      console.log("Order booked successfully:", data);
      alert('Order booked successfully!');
      setFormData({
        pickupLocation: { address: '', latitude: '', longitude: '' },
        dropLocations: [{ address: '', latitude: '', longitude: '' }],
        scheduledAt: '',
        isBiddingEnabled: false,
        biddingExpiresAt: '',
        loadDetails: {
          weightInKg: '',
          volumeInCubicMeters: '',
          type: 'general',
          quantity: '',
          description: ''
        },
        completedStops: 0, 
        distance: 0, 
        duration: 0, 
        fare: 0,
        paymentMode: '',
        urgency: 'low',
        bodyTypeMultiplier: 1,
        sizeCategoryMultiplier: 1,
        isMultiStop: false
      });
      setCurrentStep(1);
      setActiveLocationInput(null);
      setMapKey(0);
    },
    onError: (error) => {
      console.error("Booking failed:", error);
      alert("Order booking failed: " + error.message); // Using alert for simplicity, replace with custom UI
    }
  });

  const handleSubmit = async () => {
    try {
      const orderData = {
        customerId: customerId,
        isMultiStop: formData.isMultiStop,
        pickupLocation: {
          address: formData.pickupLocation.address,
          coordinates: {
            type: "Point",
            coordinates: [
              parseFloat(formData.pickupLocation.longitude),
              parseFloat(formData.pickupLocation.latitude)
            ]
          }
        },
        dropLocations: formData.dropLocations.map((drop, index) => ({
          stopIndex: index + 1,
          address: drop.address,
          coordinates: {
            type: "Point",
            coordinates: [
              parseFloat(drop.longitude),
              parseFloat(drop.latitude)
            ]
          },
          // Ensure these fields are collected from the form or have sensible defaults
          contactName: drop.contactName || "N/A", // Use value from form, or default
          contactPhone: drop.contactPhone ? parseInt(drop.contactPhone) : 0, // Use value from form, or default
          instructions: drop.instructions || "No specific instructions" // Use value from form, or default
        })),
        scheduleAt: formData.scheduledAt ? new Date(formData.scheduledAt) : null,
        urgency: formData.urgency,
        bidding: {
          isEnabled: formData.isBiddingEnabled,
          expiresAt: formData.biddingExpiresAt ? new Date(formData.biddingExpiresAt) : null
        },
        loadDetails: { // Correctly map the new loadDetails structure
          weightInKg: parseFloat(formData.loadDetails.weightInKg) || 0,
          volumeInCubicMeters: parseFloat(formData.loadDetails.volumeInCubicMeters) || 0,
          type: formData.loadDetails.type,
          quantity: parseInt(formData.loadDetails.quantity) || 0,
          description: formData.loadDetails.description
        },
        // Add other required fields from schema with default values if not user input
        completedStops: formData.completedStops,
        paymentMode: formData.paymentMode,
        // These fields are not user inputs in this form but are required by schema
        // You might want to add inputs for these or handle them on the backend
        routeInfo: {
            estimatedDistance: "N/A",
            estimatedDuration: "N/A",
            polyline: []
        },
        startTime: null,
        endTime: null,
        biddingStatus: "open",
        status: "pending",
        currentStatus: "pending",
        paymentStatus: "unpaid",
        advancePaid: 0,
        advanceDiscount: 0,
        isRefundRequested: false,
        refundStatus: "not_applicable",
        refundAmount: 0,
        isRefunded: false,
        currentLocation: {
            type: "Point",
            coordinates: []
        },
        trackingHistory: [],
        deliveryRemarks: [],
        deliveryTimeline: {
            lastknownProgress: "pending"
        },
        tripStatus: "Heading to Pickup",
        currentStopIndex: 0,
        isStalledAt: false,
        isDelayed: false,
        documents: {} // Assuming documents are handled separately or not required at booking
      };

      // Basic validation before mutation
      if (!orderData.pickupLocation.address || !orderData.pickupLocation.coordinates.coordinates[0] || !orderData.pickupLocation.coordinates.coordinates[1]) {
        throw new Error("Please select a pickup location on the map.");
      }
      if (orderData.dropLocations.some(d => !d.address || !d.coordinates.coordinates[0] || !d.coordinates.coordinates[1])) {
        throw new Error("Please select all drop locations on the map.");
      }
      if (!orderData.scheduledAt) {
        throw new Error("Please select a schedule time.");
      }
      if (!orderData.loadDetails.weightInKg || !orderData.loadDetails.volumeInCubicMeters || !orderData.loadDetails.quantity || !orderData.loadDetails.description) {
        throw new Error("Please fill in all load details.");
      }
      if (!orderData.paymentMode) {
        throw new Error("Please select a payment mode.");
      }

      bookOrderMutation.mutate(orderData);
    } catch (err) {
      console.error("Error submitting order:", err);
      alert("Failed to submit order: " + err.message); // Using alert for simplicity, replace with custom UI
    }
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
                      <div key={index} className="flex flex-col gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <h4 className="font-medium text-gray-700">Drop Stop {index + 1}</h4>
                        <input
                          type="text"
                          placeholder={`Address for Drop ${index + 1}`}
                          value={drop.address}
                          onChange={(e) => handleInputChange(`dropLocation-address-${index}`, e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder={`Contact Name for Drop ${index + 1}`}
                          value={drop.contactName}
                          onChange={(e) => handleInputChange(`dropLocation-contactName-${index}`, e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          placeholder={`Contact Phone for Drop ${index + 1}`}
                          value={drop.contactPhone}
                          onChange={(e) => handleInputChange(`dropLocation-contactPhone-${index}`, e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <textarea
                          placeholder={`Instructions for Drop ${index + 1}`}
                          value={drop.instructions}
                          onChange={(e) => handleInputChange(`dropLocation-instructions-${index}`, e.target.value)}
                          rows={2}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                        <div className="flex items-center gap-2 mt-2">
                            <button
                                onClick={() => setActiveLocationInput(`drop-${index}`)}
                                className={`flex-1 px-4 py-2 border rounded-lg transition-colors flex items-center justify-center gap-2 ${
                                    activeLocationInput === `drop-${index}` 
                                    ? 'bg-blue-500 text-white border-blue-500' 
                                    : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
                                }`}
                            >
                                <FaMapMarkerAlt />
                                {activeLocationInput === `drop-${index}` ? 'Click on map now' : 'Select on Map'}
                            </button>
                            {formData.dropLocations.length > 1 && (
                                <button
                                    onClick={() => removeDropLocation(index)}
                                    className="px-3 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <FaTrash />
                                </button>
                            )}
                        </div>
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
              <div className="space-y-4">
                <div>
                  <label htmlFor="weightInKg" className="block text-sm font-medium text-gray-700 mb-2">Weight in Kg</label>
                  <input
                    id="weightInKg"
                    type="number"
                    placeholder="e.g., 1000"
                    value={formData.loadDetails.weightInKg}
                    onChange={(e) => handleInputChange('loadDetails.weightInKg', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="volumeInCubicMeters" className="block text-sm font-medium text-gray-700 mb-2">Volume in Cubic Meters</label>
                  <input
                    id="volumeInCubicMeters"
                    type="number"
                    placeholder="e.g., 10.5"
                    step="0.1"
                    value={formData.loadDetails.volumeInCubicMeters}
                    onChange={(e) => handleInputChange('loadDetails.volumeInCubicMeters', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="loadType" className="block text-sm font-medium text-gray-700 mb-2">Type of Load</label>
                  <select
                    id="loadType"
                    value={formData.loadDetails.type}
                    onChange={(e) => handleInputChange('loadDetails.type', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="general">General</option>
                    <option value="fragile">Fragile</option>
                    <option value="perishable">Perishable</option>
                    <option value="bulk">Bulk</option>
                    <option value="electronics">Electronics</option>
                    <option value="furniture">Furniture</option>
                    <option value="others">Others</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    id="quantity"
                    type="number"
                    placeholder="e.g., 50"
                    value={formData.loadDetails.quantity}
                    onChange={(e) => handleInputChange('loadDetails.quantity', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    id="description"
                    placeholder="Detailed description of your load"
                    value={formData.loadDetails.description}
                    onChange={(e) => handleInputChange('loadDetails.description', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
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
                  <option value="UPI">UPI</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Net-Banking">Net-Banking</option>
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
                  <option value="medium">Normal</option>
                  <option value="high">High Priority</option>
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
                      <div key={index} className="mb-2 p-2 border border-gray-100 rounded-md bg-gray-50">
                        <p className="text-gray-600 font-semibold">Stop {index + 1}: {drop.address || 'Not selected'}</p>
                        <p className="text-gray-500 text-sm">Contact: {drop.contactName || 'N/A'} ({drop.contactPhone || 'N/A'})</p>
                        <p className="text-gray-500 text-sm">Instructions: {drop.instructions || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-b pb-3">
                    <h4 className="font-medium text-gray-700 mb-2">Scheduled At</h4>
                    <p className="text-gray-600">{formData.scheduledAt ? new Date(formData.scheduledAt).toLocaleString() : 'Not scheduled'}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="border-b pb-3">
                    <h4 className="font-medium text-gray-700 mb-2">Load Details</h4>
                    <p className="text-gray-600">Weight: {formData.loadDetails.weightInKg || 'N/A'} Kg</p>
                    <p className="text-gray-600">Volume: {formData.loadDetails.volumeInCubicMeters || 'N/A'} m³</p>
                    <p className="text-gray-600">Type: {formData.loadDetails.type}</p>
                    <p className="text-gray-600">Quantity: {formData.loadDetails.quantity || 'N/A'}</p>
                    <p className="text-gray-600">Description: {formData.loadDetails.description || 'Not provided'}</p>
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
    <div className="min-h-screen bg-gray-50 font-inter"> {/* Added font-inter class */}
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
              disabled={bookOrderMutation.isPending} // Disable button while submitting
            >
              {bookOrderMutation.isPending ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-900"></div>
              ) : (
                <FaCheck />
              )}
              {bookOrderMutation.isPending ? 'Submitting...' : 'Submit Order'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

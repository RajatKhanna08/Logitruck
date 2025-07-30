import React, { useState, useEffect } from 'react';
import { axiosInstance } from "../../lib/axios";
import MapComponent from "../../components/maps/MapComponent";
import { useUserProfile } from '../../hooks/useUserProfile';

const TrackOrderPage = () => {
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();
  const userRole = userProfile?.role;
  
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  // Check if user has permission to track orders
  const hasTrackingPermission = () => {
    return ['company', 'transporter', 'admin'].includes(userRole);
  };

  // Show loading while checking user profile
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show access denied for unauthorized users
  if (!hasTrackingPermission()) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h2>
              <p className="text-gray-600 mb-6">
                Only Companies, Transporters, and Admins can access order tracking.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-yellow-800">
                  <strong>Your Role:</strong> {userRole || 'Unknown'}
                </p>
                <p className="text-sm text-yellow-700 mt-2">
                  <strong>Required Roles:</strong> Company, Transporter, or Admin
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fetch order details from API
  const fetchOrderData = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);
      
      const response = await axiosInstance.get(`/order/${orderId}`);
      setOrderData(response.data);
      setLastUpdated(new Date());
      
      if (showLoading) setLoading(false);
    } catch (err) {
      console.error('Error fetching order data:', err);
      setError(err.response?.data?.message || 'Failed to fetch order details');
      if (showLoading) setLoading(false);
      setIsTracking(false);
    }
  };

  // Handle track order button click
  const handleTrackOrder = () => {
    if (!orderId.trim()) {
      setError('Please enter a valid order ID');
      return;
    }
    setIsTracking(true);
    setError(null);
    setOrderData(null);
    fetchOrderData(true);
  };

  // Handle stop tracking
  const handleStopTracking = () => {
    setIsTracking(false);
    setOrderData(null);
    setError(null);
    setLastUpdated(null);
  };

  // Set up polling every 10 seconds for live updates when tracking
  useEffect(() => {
    if (!isTracking || !orderId || !orderData) return;

    const interval = setInterval(() => {
      fetchOrderData(false); // Don't show loading spinner for polling updates
    }, 10000);

    return () => clearInterval(interval);
  }, [isTracking, orderId, orderData]);

  // Prepare locations array for MapComponent
  const getMapLocations = () => {
    if (!orderData) return [];

    const locations = [];

    // Add pickup location
    if (orderData.pickup?.lat && orderData.pickup?.lng) {
      locations.push({
        lat: orderData.pickup.lat,
        lng: orderData.pickup.lng,
        label: 'Pickup'
      });
    }

    // Add drop location
    if (orderData.drop?.lat && orderData.drop?.lng) {
      locations.push({
        lat: orderData.drop.lat,
        lng: orderData.drop.lng,
        label: 'Drop'
      });
    }

    // Add driver location
    if (orderData.driver?.currentLocation?.lat && orderData.driver?.currentLocation?.lng) {
      locations.push({
        lat: orderData.driver.currentLocation.lat,
        lng: orderData.driver.currentLocation.lng,
        label: 'Driver'
      });
    }

    return locations;
  };

  // Format coordinates for display
  const formatCoordinates = (lat, lng) => {
    if (!lat || !lng) return 'Not available';
    return `${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)}`;
  };

  // Format last updated time
  const formatLastUpdated = () => {
    if (!lastUpdated) return '';
    return lastUpdated.toLocaleTimeString();
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'picked_up':
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Search Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-30">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-3">
              <div className="bg-blue-100 rounded-full p-3 mr-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold text-gray-900">Track Your Order</h1>
                <p className="text-sm text-blue-600 font-medium">Welcome, {userRole?.toUpperCase()}</p>
              </div>
            </div>
            <p className="text-gray-600">Enter order ID to get real-time tracking updates</p>
          </div>
          
          <div className="max-w-lg mx-auto">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter Order ID (e.g., ORD123456)"
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 text-lg font-medium placeholder-gray-400 shadow-sm hover:shadow-md"
                  onKeyDown={(e) => e.key === 'Enter' && handleTrackOrder()}
                  disabled={loading}
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              {!isTracking ? (
                <button
                  onClick={handleTrackOrder}
                  disabled={loading || !orderId.trim()}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Tracking...
                    </div>
                  ) : (
                    'Track'
                  )}
                </button>
              ) : (
                <button
                  onClick={handleStopTracking}
                  className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  Stop
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <p className="text-gray-700 text-lg font-medium">Fetching order details...</p>
                <div className="flex justify-center mt-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-l-4 border-red-500 p-8">
            <div className="text-center py-8">
              <div className="text-red-500 mb-6">
                <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto flex items-center justify-center">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Unable to Track Order</h2>
              <p className="text-gray-600 mb-6 text-lg">{error}</p>
              <button
                onClick={handleTrackOrder}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Order Tracking Results */}
        {orderData && !loading && (
          <>
            {/* Status Header */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-3 mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                      Order #{orderId}
                    </h2>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${getStatusBadgeColor(orderData.status)}`}>
                        <div className="w-2 h-2 bg-current rounded-full mr-2"></div>
                        {orderData.status || 'Unknown'}
                      </span>
                      {lastUpdated && (
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          Last updated: {formatLastUpdated()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-6 sm:mt-0 flex items-center space-x-4">
                  <div className="flex items-center text-sm text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                    Live tracking active
                  </div>
                  <button
                    onClick={() => fetchOrderData(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-xl transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md transform hover:scale-105"
                  >
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            {/* Order Details and Map */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Information */}
              <div className="lg:col-span-1 space-y-6">
                {/* Driver Information */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-2 mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Driver Information</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Name</label>
                      <p className="text-gray-900 font-medium mt-1">{orderData.driver?.name || 'Not assigned'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Phone</label>
                      <p className="text-gray-900 font-medium mt-1">{orderData.driver?.phone || 'Not available'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Vehicle</label>
                      <p className="text-gray-900 font-medium mt-1">{orderData.driver?.vehicle || 'Not available'}</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
                      <label className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">Current Location</label>
                      <p className="text-emerald-900 font-mono text-sm mt-1">
                        {formatCoordinates(
                          orderData.driver?.currentLocation?.lat,
                          orderData.driver?.currentLocation?.lng
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pickup Details */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-2 mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Pickup Details</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Address</label>
                      <p className="text-gray-900 font-medium mt-1">{orderData.pickup?.address || 'Not available'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Coordinates</label>
                      <p className="text-gray-900 font-mono text-sm mt-1">
                        {formatCoordinates(orderData.pickup?.lat, orderData.pickup?.lng)}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Contact</label>
                      <p className="text-gray-900 font-medium mt-1">{orderData.pickup?.contact || 'Not available'}</p>
                    </div>
                  </div>
                </div>

                {/* Drop Details */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-2 mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Drop Details</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Address</label>
                      <p className="text-gray-900 font-medium mt-1">{orderData.drop?.address || 'Not available'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Coordinates</label>
                      <p className="text-gray-900 font-mono text-sm mt-1">
                        {formatCoordinates(orderData.drop?.lat, orderData.drop?.lng)}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Contact</label>
                      <p className="text-gray-900 font-medium mt-1">{orderData.drop?.contact || 'Not available'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Live Map Tracking</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      Updates every 10 seconds
                    </div>
                  </div>
                  <MapComponent locations={getMapLocations()} />
                </div>
              </div>
            </div>

            {/* Additional Order Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Created At</label>
                  <p className="text-gray-900">
                    {orderData.createdAt ? new Date(orderData.createdAt).toLocaleString() : 'Not available'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Estimated Delivery</label>
                  <p className="text-gray-900">
                    {orderData.estimatedDelivery ? new Date(orderData.estimatedDelivery).toLocaleString() : 'Not available'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Weight</label>
                  <p className="text-gray-900">{orderData.weight || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Distance</label>
                  <p className="text-gray-900">{orderData.distance || 'Calculating...'}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Initial State - Show some example */}
        {!orderData && !loading && !error && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Track</h3>
              <p className="text-gray-600 mb-6">Enter your order ID above to start real-time tracking</p>
              <div className="text-sm text-gray-500">
                <p>Example Order IDs for testing:</p>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  <button 
                    onClick={() => setOrderId('ORD123456')}
                    className="px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    ORD123456
                  </button>
                  <button 
                    onClick={() => setOrderId('TRK789012')}
                    className="px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    TRK789012
                  </button>
                  <button 
                    onClick={() => setOrderId('LOG345678')}
                    className="px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    LOG345678
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;
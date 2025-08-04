import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  MapPin, Clock, User, Check, X, Eye, Navigation,
  AlertCircle, Loader2, MoreVertical,
  Car
} from 'lucide-react';
import { orderHistory } from '../../api/driverApi';

const ViewBookingsPage = () => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  // You need to define these mutations if you are using them in the action menu
  // For now, I'll add placeholders. You'll need to implement the actual API calls.
  const acceptBookingMutation = useMutation({
    mutationFn: async (bookingId) => {
      // Replace with your actual accept booking API call
      console.log('Accepting booking:', bookingId);
      return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
    },
    onSuccess: () => {
      // Invalidate queries or refetch bookings after successful acceptance
      fetchBookingsMutation.mutate();
      setActionMenuOpen(null); // Close menu after action
    },
    onError: (error) => {
      console.error('Error accepting booking:', error);
      // Handle error, e.g., show a toast notification
    }
  });

  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId) => {
      // Replace with your actual cancel booking API call
      console.log('Cancelling booking:', bookingId);
      return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
    },
    onSuccess: () => {
      // Invalidate queries or refetch bookings after successful cancellation
      fetchBookingsMutation.mutate();
      setActionMenuOpen(null); // Close menu after action
    },
    onError: (error) => {
      console.error('Error cancelling booking:', error);
      // Handle error
    }
  });


  const fetchBookingsMutation = useMutation({
    mutationFn: async () => {
      const response = await orderHistory();
      return response;
    },
    onSuccess: (data) => {
      setBookings(data);
      // console.log(data); // Log the data directly received, not the state which might be async
    },
    onError: (error) => {
      console.error('Failed to fetch bookings:', error);
    }
  });

  useEffect(() => {
    fetchBookingsMutation.mutate();
  }, []); // Run once on component mount

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      accepted: 'bg-blue-100 text-blue-800 border-blue-200',
      'in-progress': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
      case 'accepted':
        return <Check className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <Check className="w-4 h-4" />;
      case 'cancelled':
        return <X className="w-4 h-4" />;
      case 'in-progress':
        return <Navigation className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleAcceptBooking = (bookingId) => {
    acceptBookingMutation.mutate(bookingId);
  };

  const handleCancelBooking = (bookingId) => {
    cancelBookingMutation.mutate(bookingId);
  };

  const renderContent = () => {
    if (fetchBookingsMutation.isPending) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="ml-3 text-gray-600 font-medium">Loading bookings...</span>
        </div>
      );
    }

    if (fetchBookingsMutation.isError) {
      return (
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Bookings</h2>
          <p className="text-gray-600 mb-6">{fetchBookingsMutation.error?.message || 'Failed to load bookings'}</p>
          <button
            onClick={() => fetchBookingsMutation.mutate()}
            className="bg-gradient-to-r from-yellow-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-yellow-600 hover:to-blue-600 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (!bookings || bookings.length === 0) { // Check for empty array
      return (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Found</h3>
          <p className="text-gray-600 mb-6">You don't have any bookings yet.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <div
            key={booking._id} // Use _id as key as per your data
            className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-500 to-blue-500 p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">#{booking._id.slice(-6)}</h3> {/* Use _id and slice for short ID */}
                  {/* Format booking.createdAt or scheduleAt if needed for bookingDate */}
                  <p className="text-yellow-100 text-sm">{new Date(booking.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActionMenuOpen(actionMenuOpen === booking._id ? null : booking._id);
                    }}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  {/* Action Menu */}
                  {actionMenuOpen === booking._id && (
                    <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-10 w-48">
                      {/* You'll need to define accepted and cancelled states more clearly
                          and add mutations for them or link to existing ones from orderApi */}
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleAcceptBooking(booking._id)} // Pass booking._id
                          disabled={acceptBookingMutation.isPending}
                          className="w-full px-4 py-2 text-left hover:bg-green-50 text-green-700 flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Accept Booking
                        </button>
                      )}
                      {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)} // Pass booking._id
                          disabled={cancelBookingMutation.isPending}
                          className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-700 flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Cancel Booking
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="w-full px-4 py-2 text-left hover:bg-blue-50 text-blue-700 flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-2 ${getStatusColor(booking.status)}`}>
                  {getStatusIcon(booking.status)}
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
                <span className="text-2xl font-bold text-green-600">₹{booking.fare}</span>
              </div>

              {/* Customer Info */}
              {/* Assuming acceptedDriverId and acceptedTransporterId are populated in your backend query */}
              {booking.acceptedDriverId && (
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-semibold text-gray-900">{booking.acceptedDriverId.email}</p> {/* Use actual driver name if available */}
                    <p className="text-sm text-gray-500">{booking.acceptedDriverId.phone}</p>
                  </div>
                </div>
              )}
              {booking.acceptedTransporterId && (
                <div className="flex items-center gap-3">
                  <Car className="w-5 h-5 text-gray-400" /> {/* Using Car icon for transporter */}
                  <div>
                    <p className="font-semibold text-gray-900">{booking.acceptedTransporterId.transporterName}</p>
                    <p className="text-sm text-gray-500">{booking.acceptedTransporterId.contactNo}</p>
                  </div>
                </div>
              )}


              {/* Time */}
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                {/* Use scheduleAt and format it */}
                <span className="text-gray-700">{new Date(booking.scheduleAt).toLocaleString()}</span>
              </div>

              {/* Locations */}
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Pickup</p>
                    {/* CORRECTED: Access the 'address' property */}
                    <p className="text-sm text-gray-600">{booking.pickupLocation?.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Drop-off</p>
                    {/* CORRECTED: Access the 'address' property of the first dropLocation */}
                    <p className="text-sm text-gray-600">
                      {booking.dropLocations && booking.dropLocations.length > 0
                        ? booking.dropLocations[0].address
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Trip Info */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Car className="w-4 h-4" />
                  {/* Ensure distance is directly renderable */}
                  {booking.distance ? `${booking.distance} km` : 'N/A'}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  {/* Ensure duration is directly renderable */}
                  {booking.duration ? `${booking.duration} min` : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mt-30 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-blue-600 bg-clip-text text-transparent">
                My Bookings
              </h1>
              <p className="text-gray-600 mt-2">View your ride bookings</p>
            </div>
            <button
              onClick={() => fetchBookingsMutation.mutate()}
              disabled={fetchBookingsMutation.isPending}
              className="bg-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200"
            >
              {fetchBookingsMutation.isPending ? (
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              ) : (
                <Navigation className="w-5 h-5 text-blue-600" />
              )}
            </button>
          </div>
        </div>

        {renderContent()}

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-yellow-500 to-blue-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Booking Details</h2>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                {/* Detailed booking information would go here */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Booking ID</label>
                    <p className="font-semibold">{selectedBooking._id}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Status</label>
                    <p className={`font-semibold ${selectedBooking.status === 'completed' ? 'text-green-600' : 'text-blue-600'}`}>
                      {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                    </p>
                  </div>
                  {/* Add more detailed information as needed from selectedBooking object */}
                  <div>
                    <label className="text-sm text-gray-500">Fare</label>
                    <p className="font-semibold">₹{selectedBooking.fare}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Payment Status</label>
                    <p className={`font-semibold ${selectedBooking.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedBooking.paymentStatus.charAt(0).toUpperCase() + selectedBooking.paymentStatus.slice(1)}
                    </p>
                  </div>
                   <div>
                    <label className="text-sm text-gray-500">Pickup Location</label>
                    <p className="font-semibold">{selectedBooking.pickupLocation?.address}</p>
                  </div>
                   <div>
                    <label className="text-sm text-gray-500">Scheduled At</label>
                    <p className="font-semibold">{new Date(selectedBooking.scheduleAt).toLocaleString()}</p>
                  </div>
                  {/* Iterate through drop locations for details */}
                  {selectedBooking.dropLocations && selectedBooking.dropLocations.map((drop, index) => (
                    <div key={index} className="col-span-2 border-t pt-4 mt-4">
                      <label className="text-sm text-gray-500">Drop-off Location {index + 1}</label>
                      <p className="font-semibold">{drop.address}</p>
                      {drop.contactName && <p className="text-sm text-gray-600">Contact: {drop.contactName} ({drop.contactPhone})</p>}
                      {drop.instructions && <p className="text-sm text-gray-600">Instructions: {drop.instructions}</p>}
                    </div>
                  ))}

                  {/* Load Details */}
                  {selectedBooking.loadDetails && (
                    <div className="col-span-2 border-t pt-4 mt-4">
                      <label className="text-sm text-gray-500">Load Details</label>
                      <p className="text-gray-700">Type: {selectedBooking.loadDetails.type}</p>
                      <p className="text-gray-700">Weight: {selectedBooking.loadDetails.weightInTon} tons</p>
                      <p className="text-gray-700">Volume: {selectedBooking.loadDetails.volumeInCubicMeters} m³</p>
                      <p className="text-gray-700">Quantity: {selectedBooking.loadDetails.quantity}</p>
                      <p className="text-gray-700">Description: {selectedBooking.loadDetails.description}</p>
                    </div>
                  )}

                  {/* Transporter and Truck Details if available */}
                  {selectedBooking.acceptedTransporterId && (
                    <div className="col-span-2 border-t pt-4 mt-4">
                      <label className="text-sm text-gray-500">Accepted Transporter</label>
                      <p className="font-semibold">{selectedBooking.acceptedTransporterId.transporterName}</p>
                      <p className="text-sm text-gray-600">Email: {selectedBooking.acceptedTransporterId.email}</p>
                      <p className="text-sm text-gray-600">Contact: {selectedBooking.acceptedTransporterId.contactNo}</p>
                    </div>
                  )}
                  {selectedBooking.acceptedTruckId && (
                    <div className="col-span-2">
                      <label className="text-sm text-gray-500">Accepted Truck</label>
                      <p className="font-semibold">{selectedBooking.acceptedTruckId.brand} {selectedBooking.acceptedTruckId.model}</p>
                      <p className="text-sm text-gray-600">Reg. No: {selectedBooking.acceptedTruckId.registrationNumber}</p>
                      <p className="text-sm text-gray-600">Type: {selectedBooking.acceptedTruckId.vehicleType}</p>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewBookingsPage;
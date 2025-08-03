import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaTruck, FaUserTie, FaMapMarkerAlt, FaClock, FaWeightHanging, FaMoneyBill, 
         FaCalendarAlt, FaArrowLeft, FaBox, FaPhoneAlt, FaEnvelope, FaFileAlt } from 'react-icons/fa';
import { getOrderById, getBidsForOrder, acceptBid, rejectBid } from '../../api/orderApi';

const OrderDetailsPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: order, isLoading, error } = useQuery({
        queryKey: ['order', orderId],
        queryFn: () => getOrderById(orderId),
        enabled: !!orderId,
        refetchOnWindowFocus: false,
        onSuccess: (data) => {
            console.log('Order data:', data);
        },
        onError: (err) => {
            console.error('Error fetching order:', err);
        }
    });

    // Add new query for bids
    const { data: bidsData, isLoading: bidsLoading } = useQuery({
        queryKey: ['bids', orderId],
        queryFn: () => getBidsForOrder(orderId),
        enabled: !!orderId && !order?.acceptedTransporterId,
    });

    // Add mutations for accepting/rejecting bids
    const acceptBidMutation = useMutation({
        mutationFn: acceptBid,
        onSuccess: () => {
            queryClient.invalidateQueries(['order', orderId]);
            queryClient.invalidateQueries(['bids', orderId]);
        },
    });

    const rejectBidMutation = useMutation({
        mutationFn: rejectBid,
        onSuccess: () => {
            queryClient.invalidateQueries(['bids', orderId]);
        },
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfdfd]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen p-8 bg-[#fdfdfd]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-semibold text-red-600 mb-4">Error Loading Order</h2>
                    <p className="text-gray-600 mb-4">{error.message}</p>
                    <button 
                        onClick={() => navigate('/orders')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    if (!order) return <div>No orders</div>;

    return (
        <div className="min-h-screen p-8 bg-[#fdfdfd]">
            <div className="max-w-6xl mx-auto">
                <button 
                    onClick={() => navigate('/orders/all')}
                    className="mb-6 mt-20 flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                    <FaArrowLeft /> Back to Orders
                </button>

                <h2 className="text-3xl font-semibold text-blue-900 border-b-2 border-yellow-400 pb-2 mb-6 flex items-center justify-between">
                    <span>Order #{order._id.slice(-6)}</span>
                    <span className={`text-sm px-3 py-1 rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                    }`}>
                        {order.status.toUpperCase()}
                    </span>
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Locations */}
                        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                            <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                                <FaMapMarkerAlt /> Locations
                            </h3>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-sm">P</span>
                                    </div>
                                    <div>
                                        <p className="font-medium">Pickup Location</p>
                                        <p className="text-gray-600">{order.pickupLocation.address}</p>
                                    </div>
                                </div>
                                {order.dropLocations.map((drop, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                                            <span className="text-white text-sm">{index + 1}</span>
                                        </div>
                                        <div>
                                            <div className="font-medium flex items-center gap-4">
                                                <span>{drop.contactName}</span>
                                                <span className="text-gray-500 text-sm flex items-center gap-1">
                                                    <FaPhoneAlt className="w-3 h-3" /> {drop.contactPhone}
                                                </span>
                                            </div>
                                            <p className="text-gray-600">{drop.address}</p>
                                            <p className="text-sm text-gray-500 mt-1">{drop.instructions}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Load Details */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2 mb-4">
                                <FaBox /> Load Details
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-gray-500">Type</p>
                                    <p className="font-medium">{order.loadDetails.type}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Weight</p>
                                    <p className="font-medium">{order.loadDetails.weightInTon} Tons</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Volume</p>
                                    <p className="font-medium">{order.loadDetails.volumeInCubicMeters} m³</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Quantity</p>
                                    <p className="font-medium">{order.loadDetails.quantity} units</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-gray-500">Description</p>
                                    <p className="font-medium">{order.loadDetails.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* Documents Section if available */}
                        {order.documents && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2 mb-4">
                                    <FaFileAlt /> Documents
                                </h3>
                                {/* Add document links/preview here */}
                            </div>
                        )}
                    </div>

                    {/* Add Bids Section */}
                    {!order.acceptedTransporterId && (
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2 mb-4">
                                <FaMoneyBill /> Bids
                            </h3>
                            {bidsLoading ? (
                                <div className="text-center py-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                </div>
                            ) : bidsData?.bids?.length > 0 ? (
                                <div className="space-y-4">
                                    {bidsData.bids.map((bid) => (
                                        <div key={bid.transporterId} 
                                             className="border rounded-lg p-4 hover:bg-gray-50">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="font-medium">Bid Amount: ₹{bid.bidAmount}</p>
                                                    <p className="text-sm text-gray-500">
                                                        Status: {bid.status.toUpperCase()}
                                                    </p>
                                                </div>
                                                {bid.status === 'pending' && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => acceptBidMutation.mutate({
                                                                transporterId: bid.transporterId
                                                            })}
                                                            disabled={acceptBidMutation.isPending}
                                                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => rejectBidMutation.mutate({
                                                                transporterId: bid.transporterId
                                                            })}
                                                            disabled={rejectBidMutation.isPending}
                                                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            {bid.message && (
                                                <p className="text-sm text-gray-600 mt-2">{bid.message}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 py-4">No bids received yet</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Side Panel */}
                <div className="space-y-6">
                    {/* Order Status & Timeline */}
                    <div className="bg-white mt-5 rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-blue-800 mb-4">Order Information</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-gray-500">Schedule</p>
                                <p className="font-medium">{new Date(order.scheduleAt).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Trip Status</p>
                                <p className="font-medium">{order.tripStatus}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Payment Status</p>
                                <p className={`font-medium ${
                                    order.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {order.paymentStatus.toUpperCase()}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500">Amount</p>
                                <p className="text-xl font-semibold text-green-600">₹{order.fare}</p>
                            </div>
                        </div>
                    </div>

                    {/* Transporter Info if assigned */}
                    {order.acceptedTransporterId && (
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-blue-800 mb-4">Transport Details</h3>
                            <div className="space-y-3">
                                <p className="font-medium">
                                    Selected Bid: ₹{order.finalBidAmount}
                                </p>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <FaUserTie />
                                    <span>{order.acceptedTransporterId.transporterName}</span>
                                </div>
                                {/* Add more transporter details as needed */}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;
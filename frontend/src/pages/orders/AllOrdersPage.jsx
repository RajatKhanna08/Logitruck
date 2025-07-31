import { FaTruck, FaMoneyBillWave, FaClock, FaBoxOpen, FaMapMarkedAlt, FaTimes, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrder';
import { useState } from 'react';

const AllOrdersPage = () => {
    const navigate = useNavigate();
    const [cancelModalOrder, setCancelModalOrder] = useState(null);
    const { data: companyOrdersData = [], isLoading } = useOrders();

    const handleCancelOrder = async (orderId) => {
        try {
            const response = await fetch(`/api/orders/${orderId}/cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                // Refresh orders data
                window.location.reload();
            }
        } catch (error) {
            console.error('Failed to cancel order:', error);
        }
        setCancelModalOrder(null);
    };

    const getStatusBadge = (status, tripStatus) => {
        const colors = {
            delivered: 'bg-green-100 text-green-800 border-green-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200',
            in_transit: 'bg-blue-100 text-blue-800 border-blue-200',
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            delayed: 'bg-orange-100 text-orange-800 border-orange-200',
            paused: 'bg-gray-100 text-gray-800 border-gray-200'
        };
        return (
            <div className="flex items-center justify-between w-full">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[status]}`}>
                    {status.toUpperCase()}
                </span>
                <span className="text-xs text-gray-500">{tripStatus}</span>
            </div>
        );
    };

    const handleCardClick = (orderId, e) => {
        // Prevent navigation if clicking cancel button
        if (e.target.closest('button')) return;
        navigate(`/orders/${orderId}`);
    };

    return (
        <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
            <h2 className="text-3xl mt-20 font-bold text-blue-900 mb-6 border-b-2 border-yellow-300 pb-2 flex justify-between items-center">
                All Orders
                <span className="text-sm text-gray-500 font-normal">
                    {companyOrdersData.length} orders
                </span>
            </h2>

            {/* Orders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {companyOrdersData.map((order) => (
                    <div
                        key={order._id}
                        onClick={(e) => handleCardClick(order._id, e)}
                        className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
                    >
                        {/* Status Header */}
                        <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
                            {getStatusBadge(order.status, order.tripStatus)}
                        </div>

                        <div className="p-4">
                            {/* Order ID and Time */}
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900">#{order._id.slice(-6)}</h3>
                                    <p className="text-xs text-gray-500">
                                        Scheduled: {new Date(order.scheduleAt).toLocaleString()}
                                    </p>
                                </div>
                                {order.isBiddingEnabled && (
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                        order.biddingStatus === 'open' 
                                            ? 'bg-blue-100 text-blue-800' 
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {order.biddingStatus.toUpperCase()}
                                    </span>
                                )}
                            </div>

                            {/* Locations Section */}
                            <div className="space-y-3 mb-4">
                                <div className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                        <FaMapMarkedAlt className="text-white w-3 h-3" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">Pickup</p>
                                        <p className="text-xs text-gray-600 truncate">{order.pickupLocation.address}</p>
                                    </div>
                                </div>
                                {order.dropLocations.map((drop, index) => (
                                    <div key={index} className="flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                                            <span className="text-white text-xs">{index + 1}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">
                                                {drop.contactName} • {drop.contactPhone}
                                            </p>
                                            <p className="text-xs text-gray-600 truncate">{drop.address}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Load Details */}
                            <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-lg mb-4">
                                <div>
                                    <p className="text-xs text-gray-500">Weight</p>
                                    <p className="text-sm font-medium">{order.loadDetails.weightInTon}T</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Volume</p>
                                    <p className="text-sm font-medium">{order.loadDetails.volumeInCubicMeters}m³</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Type</p>
                                    <p className="text-sm font-medium">{order.loadDetails.type}</p>
                                </div>
                            </div>

                            {/* Price and Actions */}
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                <div>
                                    <p className="text-xs text-gray-500">Total Amount</p>
                                    <p className="text-lg font-semibold text-green-600">₹{order.fare}</p>
                                </div>
                                {order.status !== 'cancelled' && order.status !== 'delivered' && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCancelModalOrder(order);
                                        }}
                                        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        Cancel Order
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cancel Modal */}
            {cancelModalOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <FaExclamationTriangle className="text-red-500 w-6 h-6" />
                            <h3 className="text-xl font-semibold">Cancel Order</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to cancel this order? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setCancelModalOrder(null)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Keep Order
                            </button>
                            <button
                                onClick={() => handleCancelOrder(cancelModalOrder._id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Yes, Cancel Order
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {companyOrdersData.length === 0 && !isLoading && (
                <div className="text-center mt-20">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <FaBoxOpen className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                    <p className="text-gray-500 mb-6">Start by creating your first order</p>
                    <button
                        onClick={() => navigate('/orders/book')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        Book New Order
                    </button>
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            )}
        </div>
    );
};

export default AllOrdersPage;

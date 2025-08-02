import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Truck, MapPin, Ruler, Weight, Box, TruckIcon, Package, Clock, X, Loader2, CheckCircle, XCircle, Info, DollarSign, Lightbulb, ChevronDown, ChevronUp, CreditCard, FileText, AlertCircle
} from 'lucide-react';

axios.defaults.baseURL = 'http://localhost:5000/api';
axios.defaults.withCredentials = true;

const BiddingPage = () => {
    const [orders, setOrders] = useState([]);
    // ✅ Naya State: Logged-in transporter ki ID store karne ke liye
    const [myId, setMyId] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showBidModal, setShowBidModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [bidAmount, setBidAmount] = useState('');
    const [bidMessage, setBidMessage] = useState('');
    const [isPlacingBid, setIsPlacingBid] = useState(false);
    
    const [suggestedPrice, setSuggestedPrice] = useState(null);
    const [marketMin, setMarketMin] = useState(null);
    const [marketMax, setMarketMax] = useState(null);
    const [isPriceLoading, setIsPriceLoading] = useState(false);
    const [priceError, setPriceError] = useState(null);

    // Add missing state for accepting orders
    const [acceptingOrderId, setAcceptingOrderId] = useState(null);

    // Add this inside BiddingPage component (state)
    const [expandedOrderIds, setExpandedOrderIds] = useState([]);

    // Toggle function
    const toggleExpanded = (orderId) => {
        setExpandedOrderIds(prev =>
            prev.includes(orderId)
                ? prev.filter(id => id !== orderId)
                : [...prev, orderId]
        );
    };

    useEffect(() => {
        const fetchBiddingData = async () => {
            try {
                setLoading(true);
                setError(null);
                const ordersResponse = await axios.get('/order/transporter/bidding-orders');
                setOrders(ordersResponse.data.orders);
                // ✅ Backend se aa rahi transporter ID ko state mein save karein
                setMyId(ordersResponse.data.transporterId);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching bidding data:", err);
                if (err.response && err.response.status === 401) {
                    setError("Not authenticated. Please log in as a Transporter.");
                } else {
                    setError("Failed to fetch bidding data. Please try again later.");
                }
                setLoading(false);
            }
        };

        fetchBiddingData();
    }, []);

    const fetchPriceSuggestion = async (order) => {
        setIsPriceLoading(true);
        setPriceError(null);
        setSuggestedPrice(null);
        setMarketMin(null);
        setMarketMax(null);

        try {
            const priceData = {
                weightInTon: order.loadDetails?.weightInTon || 0,
                distanceKm: order.distance || 0,
                isMultiStop: order.isMultiStop || false,
                loadCategory: order.loadDetails?.type || "general",
                bodyTypeMultiplier: order.bodyTypeMultiplier || 1,
                sizeCategoryMultiplier: order.sizeCategoryMultiplier || 1,
                urgencyLevel: order.urgency || "low",
                deliveryTimeline: 1,
            };

            const response = await axios.post(`/bidding/price-suggestion/${order._id}`, priceData);
            setSuggestedPrice(response.data.fairPrice);
            setMarketMin(response.data.marketRange.min);
            setMarketMax(response.data.marketRange.max);
        } catch (err) {
            console.error("Error fetching AI price suggestion:", err);
            setPriceError("Failed to get AI price suggestion.");
        } finally {
            setIsPriceLoading(false);
        }
    };

    const handleBidClick = (order) => {
        setSelectedOrder(order);
        setBidAmount('');
        setBidMessage('');
        setShowBidModal(true);
        fetchPriceSuggestion(order);
    };

    const handlePlaceBid = async () => {
        if (!selectedOrder || !bidAmount) {
            setBidMessage('Please enter a bid amount.');
            return;
        }
        if (isNaN(bidAmount) || parseFloat(bidAmount) <= 0) {
            setBidMessage('Please enter a valid bid amount.');
            return;
        }
        
        setIsPlacingBid(true);
        setBidMessage('');

        try {
            const bidData = {
                orderId: selectedOrder._id,
                bidAmount: parseFloat(bidAmount),
                weightInTon: selectedOrder.loadDetails?.weightInTon || 0,
                distanceKm: selectedOrder.distance || 0,
                isMultiStop: selectedOrder.isMultiStop || false,
                loadCategory: selectedOrder.loadDetails?.type || "general",
                bodyType: selectedOrder.bodyTypeMultiplier || 1,
                sizeCategory: selectedOrder.sizeCategoryMultiplier || 1,
                urgencyLevel: selectedOrder.urgency || "low",
                deliveryTimeline: 1, 
            };

            const response = await axios.post(
                `/bidding/place/${selectedOrder._id}`,
                bidData
            );
            setBidMessage(response.data.message);
            setTimeout(() => {
                setShowBidModal(false);
                setBidAmount('');
                // Refresh orders list instead of full page reload
                const fetchOrders = async () => {
                    try {
                        const ordersResponse = await axios.get('/order/transporter/bidding-orders');
                        setOrders(ordersResponse.data.orders);
                    } catch (err) {
                        console.error("Error refreshing orders:", err);
                    }
                };
                fetchOrders();
            }, 2000);

        } catch (err) {
            console.error("Error placing bid:", err);
            if (err.response && err.response.data && err.response.data.message) {
                setBidMessage(`Error: ${err.response.data.message}`);
            } else {
                setBidMessage("Failed to place bid. Please try again.");
            }
        } finally {
            setIsPlacingBid(false);
        }
    };

    // Updated Function: Ab order accept karne par UI update hoga
    const handleAcceptOrder = async (orderToAccept) => {
        setAcceptingOrderId(orderToAccept._id);
        setBidMessage('');

        try {
            const response = await axios.post(`/order/transporter/accept-order/${orderToAccept._id}`);
            const updatedOrder = response.data.order;

            // Order ko list se hatane ke bajaye, use update karein
            setOrders(prevOrders => 
                prevOrders.map(o => o._id === updatedOrder._id ? updatedOrder : o)
            );
            
            setBidMessage(`Success: Order ${orderToAccept._id.slice(-6)} accepted!`);
            
        } catch (err) {
            console.error("Error accepting fixed price order:", err);
            const errorMessage = err.response?.data?.message || "Failed to accept the order. Please try again.";
            setBidMessage(`Error: ${errorMessage}`);
        } finally {
            setAcceptingOrderId(null); // Loading state band karein
        }
    };

    const getUrgencyText = (level) => {
        switch (level) {
            case 'low': return 'Normal';
            case 'medium': return 'Medium';
            case 'high': return 'High';
            default: return 'Normal';
        }
    };

    const getPaymentMethodIcon = (method) => {
        switch (method) {
            case 'UPI': return '📱';
            case 'Credit Card': return '💳';
            case 'Net-Banking': return '🏦';
            default: return '💰';
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-yellow-50 to-blue-200">
                <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
                <p className="ml-3 text-lg text-gray-700">Loading orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-yellow-50 to-blue-200">
                <XCircle className="text-red-500 w-10 h-10" />
                <p className="ml-3 text-lg text-red-700">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-28 font-inter pt-16 bg-gradient-to-br from-blue-100 via-yellow-50 to-blue-200">
            {/* CHANGED: Heading text updated */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 sm:mb-10 animate-fade-in
                       text-blue-800 tracking-wide drop-shadow-lg">
                All Available Orders
            </h1>

            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center bg-white p-6 rounded-xl shadow-md max-w-lg mx-auto animate-fade-in">
                    <Info className="text-blue-500 w-12 h-12 mb-4" />
                    <p className="text-lg text-gray-600">No orders currently available.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                    {orders.map((order) => {
                        const isExpanded = expandedOrderIds.includes(order._id);
                        // ✅ Button state ke liye behtar logic
                        const isAccepted = !!order.acceptedTransporterId;
                        const isAcceptedByMe = isAccepted && order.acceptedTransporterId === myId;
                        // ✅ DEBUGGING KE LIYE CONSOLE LOG
                        // Yeh console mein dikhega. F12 daba kar console tab kholen.
                        if (!order.isBiddingEnabled) {
                            console.log(
                                `Order ID: ${order._id}`,
                                `| DB se ID: ${order.acceptedTransporterId} (type: ${typeof order.acceptedTransporterId})`,
                                `| Meri ID: ${myId} (type: ${typeof myId})`,
                                `| Kya Maine Accept Kiya? -> ${isAcceptedByMe}`
                            );
                        }
                        
                        return (
                            <div key={order._id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300 h-fit">
                                <div>
                                    <h2 className="text-xl font-semibold text-blue-700 mb-3 flex items-center whitespace-nowrap">
                                        <Package className="mr-2 text-blue-500 flex-shrink-0" size={20} /> 
                                        Order ID: <span className="font-mono text-gray-600 ml-2 overflow-hidden text-ellipsis max-w-32">{order._id}</span>
                                    </h2>
                                    <p className="text-gray-700 mb-2 flex items-center">
                                        <MapPin className="mr-2 text-red-500" size={18} />
                                        <span className="font-medium">From:</span> {order.pickupLocation?.address || 'N/A'}
                                    </p>
                                    <p className="text-gray-700 mb-2 flex items-center">
                                        <MapPin className="mr-2 text-green-500" size={18} />
                                        <span className="font-medium">To:</span> {order.dropLocations?.[0]?.address || 'N/A'}
                                    </p>
                                    <p className="text-gray-700 mb-2 flex items-center">
                                        <Ruler className="mr-2 text-purple-500" size={18} />
                                        <span className="font-medium">Distance:</span> {order.distance || 'N/A'} Km
                                    </p>
                                    <p className="text-gray-700 mb-2 flex items-center">
                                        <Weight className="mr-2 text-yellow-600" size={18} />
                                        <span className="font-medium">Weight:</span> {order.loadDetails?.weightInTon || 'N/A'} Tons
                                    </p>
                                    <p className="text-gray-700 mb-2 flex items-center">
                                        <Box className="mr-2 text-teal-500" size={18} />
                                        <span className="font-medium">Load Category:</span> {order.loadDetails?.type || 'N/A'}
                                    </p>
                                    <p className="text-gray-700 mb-2 flex items-center">
                                        <Info className="mr-2 text-gray-500" size={18} />
                                        <span className="font-medium">Multi-Stop:</span> {order.isMultiStop ? 'Yes' : 'No'}
                                    </p>
                                    <p className="text-gray-700 mb-2 flex items-center">
                                        <Clock className="mr-2 text-pink-500" size={18} />
                                        <span className="font-medium">Urgency:</span> {getUrgencyText(order.urgency)}
                                    </p>
                                    <p className="text-gray-700 mb-2 flex items-center">
                                        <Clock className="mr-2 text-cyan-500" size={18} />
                                        <span className="font-medium">Scheduled At:</span> {order.scheduleAt ? new Date(order.scheduleAt).toLocaleDateString() : 'N/A'}
                                    </p>

                                    {/* NEW: Additional details that show/hide */}
                                    {isExpanded && (
                                        <div>
                                            {/* Volume */}
                                            <p className="text-gray-700 mb-2 flex items-center">
                                                <Box className="mr-2 text-indigo-500" size={18} />
                                                <span className="font-medium">Volume:</span> {order.loadDetails?.volumeInCubicMeters || 'N/A'} m³
                                            </p>

                                            {/* Quantity */}
                                            <p className="text-gray-700 mb-2 flex items-center">
                                                <Package className="mr-2 text-orange-500" size={18} />
                                                <span className="font-medium">Quantity:</span> {order.loadDetails?.quantity || 'N/A'} units
                                            </p>

                                            {/* Description */}
                                            <p className="text-gray-700 mb-2 flex items-start">
                                                <FileText className="mr-2 text-gray-500 mt-1" size={18} />
                                                <span>
                                                    <span className="font-medium">Description:</span> {order.loadDetails?.description || 'No description provided'}
                                                </span>
                                            </p>

                                            {/* Instructions */}
                                            {order.dropLocations?.[0]?.instructions && (
                                                <p className="text-gray-700 mb-2 flex items-start">
                                                    <AlertCircle className="mr-2 text-amber-500 mt-1" size={18} />
                                                    <span>
                                                        <span className="font-medium">Instructions:</span> {order.dropLocations[0].instructions}
                                                    </span>
                                                </p>
                                            )}

                                            {/* Fare */}
                                            <p className="text-gray-700 mb-2 flex items-center">
                                                <DollarSign className="mr-2 text-green-500" size={18} />
                                                <span className="font-medium">Fare:</span> 
                                                <span className="font-bold text-green-600 ml-1">
                                                    {order.fare ? formatCurrency(order.fare) : 'N/A'}
                                                </span>
                                            </p>

                                            {/* Payment Method */}
                                            <p className="text-gray-700 mb-2 flex items-center">
                                                <CreditCard className="mr-2 text-blue-500" size={18} />
                                                <span className="font-medium">Payment Method:</span> 
                                                <span className="ml-1">
                                                    {getPaymentMethodIcon(order.paymentMode)} {order.paymentMode || 'UPI'}
                                                </span>
                                            </p>
                                        </div>
                                    )}

                                    {/* NEW: Show More/Show Less Button */}
                                    <button
                                        onClick={() => toggleExpanded(order._id)}
                                        className="w-full mt-3 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg flex items-center justify-center transition-all duration-300 transform hover:-translate-y-px shadow-sm hover:shadow-md"
                                    >
                                        {isExpanded ? (
                                            <>
                                                <ChevronUp className="mr-2" size={18} />
                                                Show Less
                                            </>
                                        ) : (
                                            <>
                                                <ChevronDown className="mr-2" size={18} />
                                                Show More Details
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* CHANGED: Button is now conditional */}
                                {order.isBiddingEnabled ? (
                                    <button
                                        onClick={() => handleBidClick(order)}
                                        className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
                                    >
                                        <DollarSign className="mr-2" size={20} />
                                        Bid on this Order
                                    </button>
                                ) : isAcceptedByMe ? (
                                    <button
                                    className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center cursor-not-allowed flex items-center justify-center "
                                    disabled={true}>
                                    <CheckCircle className="mr-2" size={20} />
                                    Accepted by You
                                </button>
                                )   : isAccepted ? (
                                    <button
                                        className="mt-4 w-full bg-green-800 text-white font-semibold py-3 px-4 rounded-lg cursor-not-allowed flex items-center justify-center shadow-mdr"
                                        disabled={true}
                                    >
                                        Order Already Accepted
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleAcceptOrder(order)}
                                        className={`mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center justify-center ${acceptingOrderId === order._id ? 'opacity-70 cursor-not-allowed' : 'transform hover:scale-105'}`}
                                        disabled={acceptingOrderId === order._id}
                                    >
                                        {acceptingOrderId === order._id ? (
                                            <>
                                                <Loader2 className="animate-spin mr-2" size={20} /> Accepting...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="mr-2" size={20} />
                                                Accept for {formatCurrency(order.fare)}
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {showBidModal && selectedOrder && (
                <div className="fixed inset-0 bg-gradient-to-br from-blue-100 via-yellow-50 to-blue-200 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative animate-zoom-in">
                        <button
                            onClick={() => setShowBidModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition transform hover:rotate-90"
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Place Bid for Order</h2>
                        <p className="text-gray-700 mb-2">
                            <span className="font-semibold">Order ID:</span> {selectedOrder._id}
                        </p>
                        <p className="text-gray-700 mb-4">
                            <span className="font-semibold">Route:</span> {selectedOrder.pickupLocation?.address} to {selectedOrder.dropLocations?.[0]?.address || 'N/A'}
                        </p>

                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start space-x-3 shadow-inner">
                            <Lightbulb className="text-blue-500 mt-1" size={24} />
                            <div>
                                <h3 className="text-lg font-semibold text-blue-700 mb-2">AI Price Suggestion:</h3>
                                {isPriceLoading ? (
                                    <div className="flex items-center text-blue-600">
                                        <Loader2 className="animate-spin mr-2" size={18} /> Loading suggestion...
                                    </div>
                                ) : priceError ? (
                                    <p className="text-red-600 text-sm">{priceError}</p>
                                ) : suggestedPrice !== null ? (
                                    <>
                                        <p className="text-gray-800 text-xl font-bold mb-1">
                                            ₹{suggestedPrice?.toLocaleString('en-IN')}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            Market Range: ₹{marketMin?.toLocaleString('en-IN')} - ₹{marketMax?.toLocaleString('en-IN')}
                                        </p>
                                        <p className="text-gray-500 text-xs mt-1">
                                            (This is an AI-estimated fair price.)
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-gray-500 text-sm">No AI suggestion available for this order.</p>
                                )}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="bidAmount" className="block text-gray-700 text-sm font-bold mb-2">
                                Your Bid Amount (INR):
                            </label>
                            <input
                                type="number"
                                id="bidAmount"
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                min="1"
                                required
                                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                placeholder="Enter your bid amount"
                            />
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowBidModal(false)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-95 shadow-md hover:shadow-lg"
                                disabled={isPlacingBid}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePlaceBid}
                                className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center shadow-md ${isPlacingBid ? 'opacity-70 cursor-not-allowed' : 'transform hover:scale-105 hover:shadow-lg'}`}
                                disabled={isPlacingBid}
                            >
                                {isPlacingBid ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" size={20} /> Submitting...
                                    </>
                                ) : (
                                    <>
                                        <DollarSign className="mr-2" size={20} /> Submit Bid
                                    </>
                                )}
                            </button>
                        </div>
                        {bidMessage && (
                            <p className={`mt-4 text-center font-semibold ${bidMessage.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
                                {bidMessage}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BiddingPage;
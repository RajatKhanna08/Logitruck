import { FaTruck, FaMoneyBillWave, FaClock, FaBoxOpen, FaMapMarkedAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrder';

const AllOrdersPage = () => {
    const navigate = useNavigate();

    const { data:companyOrdersData = [], isLoading } = useOrders();
    console.log(companyOrdersData);

    return (
        <div className="p-6 min-h-screen bg-[#fdfdfd]">
            <h2 className="text-3xl mt-20 font-semibold text-blue-900 mb-6 border-b-2 border-yellow-300 pb-2">
                All Orders
            </h2>

            {companyOrdersData.length === 0 ? (
                <div className="text-center mt-20 text-gray-500">
                    <p className="text-lg">No orders found.</p>
                    <p className="text-sm">Once orders are placed, they will appear here.</p>
                </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {companyOrdersData.map((order) => (
                    <div
                        key={order._id}
                        onClick={() => navigate(`/orders/${order._id}`)}
                        className="bg-white cursor-pointer rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300"
                    >
                        <div className="p-5 flex flex-col gap-2">
                            {/* Pickup & Drop */}
                            <div className="flex items-center gap-2 text-yellow-600 font-medium">
                                <FaMapMarkedAlt className="text-blue-700" />
                                <span>{order.pickupLocation.address}</span>
                            </div>

                            <div className="ml-6 text-gray-700 text-sm">
                                {order.dropLocations.map((drop, index) => (
                                    <div key={index} className="mb-1">
                                        ➤ {drop.address}
                                    </div>
                                ))}
                            </div>
                            
                            {/* Schedule and Status */}
                            <div className="flex justify-between text-sm mt-3">
                                <span className="flex items-center gap-1 text-blue-600">
                                    <FaClock />
                                    {new Date(order.scheduleAt).toLocaleDateString()}
                                </span>
                                <span
                                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                        order.status === 'delivered'
                                            ? 'bg-green-100 text-green-700'
                                            : order.status === 'in_transit'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : 'bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    {order.status.toUpperCase()}
                                </span>
                            </div>
                              
                            {/* Load Details */}
                            <div className="flex items-center gap-2 mt-3 text-sm text-gray-700">
                                <FaBoxOpen className="text-yellow-500" />
                                <span>{order.loadDetails.type} | {order.loadDetails.weightInKg}kg | Qty: {order.loadDetails.quantity}</span>
                            </div>
                              
                            {/* Truck & Driver */}
                            <div className="flex flex-col text-sm mt-2 text-gray-600">
                                <span><FaTruck className="inline-block text-blue-600 mr-1" /> {order.acceptedTruck.registrationNumber}</span>
                                <span className="ml-5">Driver: {order.acceptedDriver.name}</span>
                                <span className="ml-5">Transporter: {order.acceptedTransporter.name}</span>
                            </div>
                              
                            {/* Fare & Payment */}
                            <div className="flex justify-between items-center mt-4">
                                <div className="flex items-center text-green-700 font-semibold text-lg">
                                    <FaMoneyBillWave className="mr-1" />
                                    ₹{order.finalBidAmount}
                                </div>
                                <span
                                    className={`text-sm px-3 py-0.5 rounded-full ${
                                        order.paymentStatus === 'paid'
                                            ? 'bg-green-200 text-green-800'
                                            : 'bg-red-200 text-red-800'
                                    }`}
                                >
                                    {order.paymentStatus.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            )}
        </div>
    );
};

export default AllOrdersPage;

import { FaTruck, FaMoneyBillWave, FaClock, FaBoxOpen, FaMapMarkedAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AllOrdersPage = () => {
    const navigate = useNavigate();

    const companyOrdersData = [
        {
            _id: "order001",
            pickupLocation: {
              address: "Plot 42, Sector 18, Gurgaon, Haryana",
            },
            dropLocations: [
              {
                stopIndex: 1,
                address: "Warehouse A, Sector 20, Noida",
                contactName: "Rohit Mehra",
                contactPhone: 9876543210,
                instructions: "Handle with care, fragile items.",
              },
              {
                stopIndex: 2,
                address: "Retail Store B, Connaught Place, Delhi",
                contactName: "Neha Sharma",
                contactPhone: 9823478123,
                instructions: "Deliver before 5 PM.",
              },
            ],
            scheduleAt: "2025-07-15T10:00:00Z",
            startTime: "2025-07-15T10:30:00Z",
            endTime: "2025-07-15T13:15:00Z",
            biddingStatus: "accepted",
            finalBidAmount: 4500,
            acceptedTransporter: {
              name: "QuickTrans Logistics",
            },
            acceptedDriver: {
              name: "Vikas Singh",
            },
            acceptedTruck: {
              registrationNumber: "HR55AB1234",
            },
            status: "delivered",
            paymentMode: "UPI",
            paymentStatus: "paid",
            loadDetails: {
              weightInKg: 1200,
              volumeInCubicMeters: 6.5,
              type: "electronics",
              quantity: 100,
              description: "Television Sets - 32 inch",
            },
            fare: 4500,
            createdAt: "2025-07-14T08:00:00Z",
          },
          {
            _id: "order002",
            pickupLocation: {
              address: "Industrial Area, Ludhiana, Punjab",
            },
            dropLocations: [
              {
                stopIndex: 1,
                address: "Warehouse C, Chandigarh",
                contactName: "Amit Kumar",
                contactPhone: 9854763210,
                instructions: "Forklift available on site.",
              },
            ],
            scheduleAt: "2025-07-10T11:00:00Z",
            startTime: "2025-07-10T11:45:00Z",
            endTime: "2025-07-10T14:00:00Z",
            biddingStatus: "closed",
            finalBidAmount: 2700,
            acceptedTransporter: {
              name: "SafeHaul Transport",
            },
            acceptedDriver: {
              name: "Manoj Yadav",
            },
            acceptedTruck: {
              registrationNumber: "PB10XY4567",
            },
            status: "in_transit",
            paymentMode: "Net-Banking",
            paymentStatus: "unpaid",
            loadDetails: {
              weightInKg: 800,
              volumeInCubicMeters: 3.2,
              type: "furniture",
              quantity: 40,
              description: "Office chairs and desks",
            },
            fare: 2700,
            createdAt: "2025-07-09T15:20:00Z",
        },
    ];

  return (
    <div className="p-6 min-h-screen bg-[#fdfdfd]">
      <h2 className="text-3xl mt-20 font-semibold text-blue-900 mb-6 border-b-2 border-yellow-300 pb-2">
        All Orders
      </h2>

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
    </div>
  );
};

export default AllOrdersPage;

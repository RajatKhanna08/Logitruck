import React from 'react';
import { FaTruck, FaUserTie, FaMapMarkerAlt, FaClock, FaWeightHanging, FaMoneyBill, FaCalendarAlt } from 'react-icons/fa';

const mockOrder = {
  _id: "ORD123456",
  pickupLocation: {
    address: "Plot 27, MIDC, Andheri East, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400059",
    country: "India",
    landmark: "Near Metro Station",
  },
  dropLocations: [
    { address: "Sector 62, Noida" },
    { address: "Connaught Place, Delhi" },
  ],
  loadDetails: {
    type: "Industrial Equipment",
    weightInKg: 3200,
    quantity: 8,
    dimensions: "3x3x3 ft",
    packaging: "Wooden Crate",
  },
  scheduleAt: "2025-07-25T09:30:00.000Z",
  status: "in_transit",
  paymentStatus: "paid",
  finalBidAmount: 17500,
  acceptedTruck: {
    registrationNumber: "MH12AB1234",
    type: "Flatbed Truck",
    capacity: "5 Tons",
  },
  acceptedDriver: {
    name: "Rajeev Kumar",
    phone: "+91 9876543210",
    licenseNumber: "DL042021000789",
  },
  acceptedTransporter: {
    name: "Sharma Logistics",
    contactNo: "+91 9812345678",
    email: "contact@sharmalogistics.com",
  },
};

const OrderDetailsPage = () => {
  const order = mockOrder;

  return (
    <div className="min-h-screen p-8 bg-[#fdfdfd]">
      <h2 className="text-3xl font-semibold text-blue-900 border-b-2 border-yellow-400 pb-2 mb-6">
        Order Details
      </h2>

      <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-6 space-y-6">

        {/* Order ID and Status */}
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">
            Order ID: <span className="text-blue-700">{order._id}</span>
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              order.status === "delivered"
                ? "bg-green-100 text-green-700"
                : order.status === "in_transit"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {order.status.toUpperCase()}
          </span>
        </div>

        {/* Pickup & Drop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <FaMapMarkerAlt /> Pickup Location
            </h4>
            <div className="text-gray-700">
              <p>{order.pickupLocation.address}</p>
              <p>{order.pickupLocation.city}, {order.pickupLocation.state}, {order.pickupLocation.pincode}</p>
              <p>{order.pickupLocation.country}</p>
              <p className="text-sm text-gray-500 italic">Landmark: {order.pickupLocation.landmark}</p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-yellow-700 mb-2 flex items-center gap-2">
              <FaMapMarkerAlt /> Drop Locations
            </h4>
            <ul className="text-gray-700 list-disc ml-5">
              {order.dropLocations.map((drop, index) => (
                <li key={index}>{drop.address}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Load Details */}
        <div>
          <h4 className="text-lg font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <FaWeightHanging /> Load Details
          </h4>
          <div className="text-gray-700 grid grid-cols-2 md:grid-cols-3 gap-4">
            <p>Type: <span className="font-medium">{order.loadDetails.type}</span></p>
            <p>Weight: <span className="font-medium">{order.loadDetails.weightInKg} kg</span></p>
            <p>Quantity: <span className="font-medium">{order.loadDetails.quantity}</span></p>
            <p>Dimensions: <span className="font-medium">{order.loadDetails.dimensions}</span></p>
            <p>Packaging: <span className="font-medium">{order.loadDetails.packaging}</span></p>
          </div>
        </div>

        {/* Schedule & Payment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3 text-blue-800 text-lg">
            <FaCalendarAlt />
            <span>
              Scheduled At:{" "}
              <span className="text-gray-800 font-medium">
                {new Date(order.scheduleAt).toLocaleString()}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-green-700 text-lg">
            <FaMoneyBill />
            <span>
              ₹{order.finalBidAmount} -{" "}
              <span
                className={`font-semibold ${
                  order.paymentStatus === "paid"
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {order.paymentStatus.toUpperCase()}
              </span>
            </span>
          </div>
        </div>

        {/* Truck & Driver */}
        <div>
          <h4 className="text-lg font-semibold text-yellow-700 mb-2 flex items-center gap-2">
            <FaTruck /> Assigned Truck & Driver
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div>
              <p><span className="font-medium">Truck:</span> {order.acceptedTruck.registrationNumber}</p>
              <p><span className="font-medium">Type:</span> {order.acceptedTruck.type}</p>
              <p><span className="font-medium">Capacity:</span> {order.acceptedTruck.capacity}</p>
            </div>
            <div>
              <p><span className="font-medium">Driver:</span> {order.acceptedDriver.name}</p>
              <p><span className="font-medium">Phone:</span> {order.acceptedDriver.phone}</p>
              <p><span className="font-medium">License No.:</span> {order.acceptedDriver.licenseNumber}</p>
            </div>
          </div>
        </div>

        {/* Transporter Details */}
        <div>
          <h4 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <FaUserTie /> Transporter Details
          </h4>
          <div className="text-gray-700">
            <p><span className="font-medium">Name:</span> {order.acceptedTransporter.name}</p>
            <p><span className="font-medium">Contact:</span> {order.acceptedTransporter.contactNo}</p>
            <p><span className="font-medium">Email:</span> {order.acceptedTransporter.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
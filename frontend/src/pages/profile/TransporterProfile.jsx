import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaTruck, FaUserTie, FaEnvelope, FaPhone, FaIdBadge } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { useUserProfile } from "../../hooks/useUserProfile";

const mockTrucks = [
  {
    truckNumber: "GJ01X1234",
    driver: {
      name: "Ajay Sharma",
      phone: "+91 9001234567",
      email: "ajay.driver@example.com",
    },
  },
  {
    truckNumber: "GJ02Y5678",
    driver: {
      name: "Suresh Kumar",
      phone: "+91 9812345678",
      email: "suresh.driver@example.com",
    },
  },
];

const mockBids = [
  { orderId: "ORD-1001", amount: "₹ 12,500", status: "Won" },
  { orderId: "ORD-1012", amount: "₹ 9,800", status: "Won" },
];

const TransporterProfile = () => {
    const { data: userProfile, isLoading } = useUserProfile();
    const transporter = userProfile.transporter;
    
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [formData, setFormData] = useState({ ...mockTransporter });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Profile Header */}
      <div className="grid grid-cols-3 gap-6 mt-20 bg-white p-6 rounded-xl shadow-lg mb-6">
        {/* Left: Basic Info */}
        <div className="col-span-2 flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-blue-800">Transporter Profile</h2>
          <div className="flex items-center gap-3">
            <FaUserTie className="text-gray-500" />
            <span className="font-semibold">{transporter.transporterName}</span>
          </div>
          <div className="flex items-center gap-3">
            <FaIdBadge className="text-gray-500" />
            <span>{transporter.ownerName}</span>
          </div>
          <div className="flex items-center gap-3">
            <FaPhone className="text-gray-500" />
            <span>{transporter.contactNo}</span>
          </div>
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-gray-500" />
            <span>{transporter.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <MdLocationOn className="text-gray-500" />
            <span>
              {transporter.address.street}, {transporter.address.city}, {transporter.address.state} -{" "}
              {transporter.address.pincode}
            </span>
          </div>
        </div>

        {/* Right: Profile Meta */}
        <div className="flex flex-col justify-between">
          <div className="self-end">
            <button
              onClick={() => setShowUpdateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          </div>
          <div className="mt-10 text-sm text-gray-700">
            <p><strong>Registration No:</strong> {transporter.registrationNumber}</p>
            <p><strong>Country:</strong> {transporter.address.country}</p>
            <p><strong>Landmark:</strong> {transporter.address.landmark}</p>
          </div>
        </div>
      </div>

      {/* Trucks + Drivers */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <h3 className="text-xl font-semibold mb-4 text-blue-800">Assigned Trucks & Drivers</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {mockTrucks.map((truck, index) => (
            <div
              key={index}
              className="border p-4 rounded-lg bg-gray-50 shadow-sm flex flex-col gap-2"
            >
              <div className="flex items-center gap-2 text-blue-700 font-semibold">
                <FaTruck />
                <span>Truck No: {truck.truckNumber}</span>
              </div>
              <div className="text-sm pl-6 text-gray-700">
                <p><strong>Driver:</strong> {truck.driver.name}</p>
                <p><strong>Phone:</strong> {truck.driver.phone}</p>
                <p><strong>Email:</strong> {truck.driver.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bids Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-blue-800">Bids Won</h3>
        <table className="w-full text-left border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Bid Amount</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockBids.map((bid, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{bid.orderId}</td>
                <td className="px-4 py-2">{bid.amount}</td>
                <td className="px-4 py-2 text-green-600 font-medium">{bid.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-3xl relative">
            <button
              onClick={() => setShowUpdateModal(false)}
              className="absolute cursor-pointer top-3 right-3 text-red-500 text-xl"
            >
              <IoClose />
            </button>
            <h3 className="text-xl font-bold mb-4 text-blue-800">Edit Transporter Profile</h3>
            <form className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="transporterName"
                value={transporter.transporterName}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="Transporter Name"
              />
              <input
                type="text"
                name="ownerName"
                value={transporter.ownerName}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="Owner Name"
              />
              <input
                type="email"
                name="email"
                value={transporter.email}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="Email"
              />
              <input
                type="text"
                name="contactNo"
                value={transporter.contactNo}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="Phone"
              />
              <input
                type="text"
                name="registrationNumber"
                value={transporter.registrationNumber}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="Registration No."
              />
              <input
                type="text"
                name="address.street"
                value={transporter.address.street}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="Street"
              />
              <input
                type="text"
                name="address.city"
                value={transporter.address.city}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="City"
              />
              <input
                type="text"
                name="address.state"
                value={transporter.address.state}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="State"
              />
              <input
                type="text"
                name="address.pincode"
                value={transporter.address.pincode}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="Pincode"
              />
              <input
                type="text"
                name="address.country"
                value={transporter.address.country}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="Country"
              />
              <input
                type="text"
                name="address.landmark"
                value={transporter.address.landmark}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="Landmark"
              />
              <div className="col-span-2 text-right">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="bg-blue-600 cursor-pointer text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransporterProfile;

import React, { useState } from 'react';
import {
    FaTruck, FaUserTie, FaPhoneAlt, FaRegEdit, FaClipboardList,
    FaStar, FaIdCard, FaFileInvoice, FaMapMarkerAlt
} from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { IoIosCloseCircle } from 'react-icons/io';

// 🔸 Mock Transporter Data
const mockTransporter = {
    transporterName: "Sanjeev Logistics Pvt. Ltd.",
    ownerName: "Sanjeev Yadav",
    profileImg: "https://i.pravatar.cc/150?img=12",
    contactNo: 9876543210,
    email: "sanjeevlogistics@example.com",
    registrationNumber: "REG-T12345678",
    rating: 4.3,
    fleetSize: 6,
    address: {
        street: "Plot 18, Transport Nagar",
        city: "Gurugram",
        state: "Haryana",
        pincode: 122001,
        country: "India",
        landmark: "Near Highway Toll"
    },
    documents: {
        idProof: "AadharCard123.pdf",
        businessLicense: "License456.pdf",
        gstCertificate: "GST789.pdf"
    },
    assignedBookings: [
        { orderId: "ORD001", pickup: "Bhiwadi", drop: "Indore", date: "2025-07-10", status: "Assigned" },
        { orderId: "ORD002", pickup: "Noida", drop: "Mumbai", date: "2025-07-12", status: "Delivered" }
    ],
    assignedDrivers: [
        { name: "Rakesh Sharma", truck: "Mahindra Blazo 28", phone: "9876543201" },
        { name: "Sunil Kumar", truck: "Tata Prima LX", phone: "9876543202" }
    ],
    bids: [
        { orderId: "ORD101", amount: 23000, status: "Won" },
        { orderId: "ORD102", amount: 21500, status: "Lost" },
        { orderId: "ORD103", amount: 24900, status: "Won" }
    ]
};

const TransporterProfile = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const transporter = mockTransporter;

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-yellow-50 px-6 py-10">
            {/* Profile Header */}
            <div className="bg-white mt-25 shadow-lg rounded-2xl p-8 mb-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="flex flex-col items-center">
                    <img
                        src={transporter.profileImg}
                        alt="Profile"
                        className="w-36 h-36 rounded-full border-4 border-yellow-500 object-cover"
                    />
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
                    >
                        <FaRegEdit /> Update Profile
                    </button>
                </div>
                <div className="md:col-span-2 grid grid-cols-2 gap-4 text-gray-800">
                    <div><strong>Name:</strong> {transporter.transporterName}</div>
                    <div><strong>Owner:</strong> {transporter.ownerName}</div>
                    <div className="flex items-center gap-2"><MdEmail /> {transporter.email}</div>
                    <div className="flex items-center gap-2"><FaPhoneAlt /> {transporter.contactNo}</div>
                    <div className="flex items-center gap-2"><FaMapMarkerAlt /> {`${transporter.address.city}, ${transporter.address.state}, ${transporter.address.country}`}</div>
                    <div><strong>Fleet Size:</strong> {transporter.fleetSize}</div>
                    <div className="flex items-center gap-2"><FaStar className="text-yellow-500" /> {transporter.rating}</div>
                    <div><strong>Reg. Number:</strong> {transporter.registrationNumber}</div>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <StatCard title="Fleet Size" value={transporter.fleetSize} color="yellow" />
                <StatCard title="Bids Placed" value={transporter.bids.length} color="blue" />
                <StatCard title="Bids Won" value={transporter.bids.filter(b => b.status === "Won").length} color="green" />
            </div>

            {/* Assigned Drivers */}
            <SectionCard title="Assigned Drivers & Trucks" icon={<FaTruck />}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {transporter.assignedDrivers.map((driver, i) => (
                        <div key={i} className="bg-gray-100 p-4 rounded-xl shadow-sm">
                            <div className="font-semibold text-lg">{driver.name}</div>
                            <div className="text-sm text-gray-700">Truck: {driver.truck}</div>
                            <div className="text-sm text-gray-700">Phone: {driver.phone}</div>
                        </div>
                    ))}
                </div>
            </SectionCard>

            {/* Orders */}
            <SectionCard title="Assigned Orders" icon={<FaClipboardList />}>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-blue-100 text-gray-800">
                            <tr>
                                <th className="px-4 py-2">Order ID</th>
                                <th className="px-4 py-2">Pickup</th>
                                <th className="px-4 py-2">Drop</th>
                                <th className="px-4 py-2">Date</th>
                                <th className="px-4 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transporter.assignedBookings.map((order, i) => (
                                <tr key={i} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2">{order.orderId}</td>
                                    <td className="px-4 py-2">{order.pickup}</td>
                                    <td className="px-4 py-2">{order.drop}</td>
                                    <td className="px-4 py-2">{order.date}</td>
                                    <td className="px-4 py-2 text-green-600">{order.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </SectionCard>

            {/* Bidding Activity */}
            <SectionCard title="Bidding Activity" icon={<FaClipboardList />}>
                <ul className="space-y-3">
                    {transporter.bids.map((bid, i) => (
                        <li key={i} className="bg-gray-50 p-4 rounded-md shadow-sm flex justify-between items-center">
                            <div><strong>{bid.orderId}</strong> — ₹{bid.amount}</div>
                            <span className={`px-3 py-1 text-sm rounded-full ${bid.status === "Won" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                {bid.status}
                            </span>
                        </li>
                    ))}
                </ul>
            </SectionCard>

            {/* Update Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white w-full max-w-xl p-6 rounded-xl relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-red-500 text-2xl">
                            <IoIosCloseCircle />
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-blue-800">Update Transporter Profile</h2>
                        <form className="space-y-4">
                            <input type="text" placeholder="Transporter Name" className="w-full p-2 border rounded" />
                            <input type="text" placeholder="Owner Name" className="w-full p-2 border rounded" />
                            <input type="email" placeholder="Email" className="w-full p-2 border rounded" />
                            <input type="text" placeholder="Contact Number" className="w-full p-2 border rounded" />
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// 🔹 Reusable Stat Card
const StatCard = ({ title, value, color }) => {
    const colorMap = {
        yellow: 'bg-yellow-100 border-yellow-500 text-yellow-700',
        blue: 'bg-blue-100 border-blue-500 text-blue-700',
        green: 'bg-green-100 border-green-500 text-green-700',
    };

    return (
        <div className={`p-6 rounded-xl border-l-4 shadow-sm ${colorMap[color]}`}>
            <div className="text-xl font-semibold">{title}</div>
            <div className="text-3xl font-bold mt-2">{value}</div>
        </div>
    );
};

// 🔹 Section Wrapper
const SectionCard = ({ title, icon, children }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
        <h3 className="text-xl font-bold mb-4 text-blue-800 flex items-center gap-2">{icon} {title}</h3>
        {children}
    </div>
);

export default TransporterProfile;

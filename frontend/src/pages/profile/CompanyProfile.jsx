import React, { useState } from "react";
import { FaPhoneAlt, FaLocationArrow, FaEnvelope, FaIndustry, FaUserTie, FaEdit, FaBuilding, FaRegCalendarAlt } from "react-icons/fa";
import { MdOutlineDomainVerification } from "react-icons/md";
import { IoClose } from "react-icons/io5";

const dummyOrders = [
  {
    id: "ORD12345",
    destination: "Bangalore, Karnataka",
    date: "2025-07-14",
    status: "Delivered",
  },
  {
    id: "ORD12346",
    destination: "Mumbai, Maharashtra",
    date: "2025-07-13",
    status: "In Transit",
  },
  {
    id: "ORD12347",
    destination: "Hyderabad, Telangana",
    date: "2025-07-12",
    status: "Pending",
  },
];

const CompanyProfile = () => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);

  const company = {
    name: "ABC Logistics Pvt. Ltd.",
    industry: "Freight & Transport",
    email: "contact@abclogistics.com",
    phone: "+91 9876543210",
    address: "Plot 42, Bhiwadi Industrial Area, Rajasthan",
    gst: "29ABCDE1234F1Z5",
    idProof: "aadhaar_abc.pdf",
    businessLicense: "license_abc.pdf",
    contactPerson: {
      name: "Rohan Mehta",
      position: "Logistics Head",
      phone: "+91 9988776655",
      email: "rohan.mehta@abclogistics.com",
    },
    profileImg: "data:image/jpeg;base64,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"
  };

  return (
    <div className="min-h-screen px-10 py-8 bg-gradient-to-tr from-yellow-50 via-white to-blue-50">
      {/* Profile Header */}
      <div className="bg-white mt-20 p-8 rounded-3xl shadow-xl border border-gray-200 mb-10">
        <div className="flex justify-between items-center mb-6">
            <div className="flex justify-center items-center gap-6">
                <img src={company.profileImg} alt="" className="w-20 rounded-full h-20"/>
                <h2 className="text-3xl font-bold text-blue-900">Company Profile</h2>
            </div>
          <button
            onClick={() => setShowUpdateModal(true)}
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-lg shadow-md transition"
          >
            <FaEdit /> Update Profile
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-blue-900">
          <ProfileField icon={<FaBuilding />} label="Company Name" value={company.name} />
          <ProfileField icon={<FaIndustry />} label="Industry" value={company.industry} />
          <ProfileField icon={<FaEnvelope />} label="Email" value={company.email} />
          <ProfileField icon={<FaPhoneAlt />} label="Phone" value={company.phone} />
          <ProfileField icon={<FaLocationArrow />} label="Address" value={company.address} />
          <ProfileField icon={<MdOutlineDomainVerification />} label="GST Number" value={company.gst} />

          <div
            className="relative group cursor-pointer"
            onMouseEnter={() => setShowContactInfo(true)}
            onMouseLeave={() => setShowContactInfo(false)}
          >
            <div className="flex items-center gap-3 font-semibold">
              <FaUserTie className="text-yellow-600" />
              <span>Contact Person</span>
            </div>
            <div className="text-sm mt-1 text-gray-700">{company.contactPerson.name}</div>

            {/* Hover card */}
            {showContactInfo && (
              <div className="absolute z-50 top-full left-0 w-64 mt-2 bg-white shadow-lg rounded-lg border p-4 text-sm text-gray-800 transition-all duration-200">
                <div><strong>Name:</strong> {company.contactPerson.name}</div>
                <div><strong>Position:</strong> {company.contactPerson.position}</div>
                <div><strong>Email:</strong> {company.contactPerson.email}</div>
                <div><strong>Phone:</strong> {company.contactPerson.phone}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
        <h3 className="text-2xl font-bold text-blue-900 mb-6">📦 Your Orders</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyOrders.map((order) => (
            <div
              key={order.id}
              className="border rounded-xl p-4 shadow-md bg-blue-50 hover:shadow-lg transition cursor-pointer"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-yellow-600">#{order.id}</span>
                <span
                  className={`text-sm px-3 py-1 rounded-full font-semibold ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "In Transit"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="text-gray-700"><strong>Destination:</strong> {order.destination}</div>
              <div className="text-gray-700 flex items-center gap-2">
                <FaRegCalendarAlt /> {order.date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Update Profile Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl p-6 relative">
            <button
              onClick={() => setShowUpdateModal(false)}
              className="absolute top-3 right-3 text-red-500 text-2xl"
            >
              <IoClose />
            </button>
            <h3 className="text-xl font-bold mb-4 text-blue-900">Edit Profile Details</h3>
            <form className="grid grid-cols-2 gap-6">
              <Input label="Company Name" name="companyName" defaultValue={company.name} />
              <Input label="Industry" name="industry" defaultValue={company.industry} />
              <Input label="Email" name="email" defaultValue={company.email} />
              <Input label="Phone" name="phone" defaultValue={company.phone} />
              <Input label="GST Number" name="gst" defaultValue={company.gst} />
              <Input label="Address" name="address" defaultValue={company.address} />
              <Input label="Contact Person Name" name="contactName" defaultValue={company.contactPerson.name} />
              <Input label="Contact Person Phone" name="contactPhone" defaultValue={company.contactPerson.phone} />
              <Input label="Contact Person Email" name="contactEmail" defaultValue={company.contactPerson.email} />
              <Input label="Contact Person Position" name="contactPosition" defaultValue={company.contactPerson.position} />
              <div className="col-span-2 text-right">
                <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold">
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

const ProfileField = ({ icon, label, value }) => (
  <div>
    <div className="flex items-center gap-3 font-semibold">
      {icon}
      <span>{label}</span>
    </div>
    <div className="text-sm mt-1 text-gray-700">{value}</div>
  </div>
);

const Input = ({ label, name, defaultValue }) => (
  <div>
    <label className="block mb-1 font-semibold text-sm text-gray-700">{label}</label>
    <input
      type="text"
      name={name}
      defaultValue={defaultValue}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
    />
  </div>
);

export default CompanyProfile;

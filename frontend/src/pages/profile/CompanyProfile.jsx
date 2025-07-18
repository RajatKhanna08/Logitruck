import React, { useState } from "react";
import {
  FaPhoneAlt,
  FaLocationArrow,
  FaEnvelope,
  FaIndustry,
  FaUserTie,
  FaEdit,
  FaBuilding,
  FaRegCalendarAlt
} from "react-icons/fa";
import { MdOutlineDomainVerification } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { useUserProfile } from "../../hooks/useUserProfile";
import { useNavigate } from "react-router-dom";
import { useOrders } from "../../hooks/useOrder";

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
  const { data: userProfile, isLoading:isProfileLoading } = useUserProfile();
  const { data: allOrders, isLoading:isOrderLoading } = useOrders();

  const navigate = useNavigate();

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);

  if (isProfileLoading || isOrderLoading) return <div>Loading...</div>;
  if (!userProfile || !userProfile.company) return <div>No profile data found</div>;

  const company = userProfile.company;

  const fullAddress = `${company.address?.street || ""}, ${company.address?.landmark || ""}, ${company.address?.city || ""}, ${company.address?.state || ""}, ${company.address?.country || ""} - ${company.address?.pincode || ""}`;

  return (
    <div className="min-h-screen px-10 py-8 bg-gradient-to-tr from-yellow-50 via-white to-blue-50">
      {/* Profile Header */}
      <div className="bg-white mt-20 p-8 rounded-3xl shadow-xl border border-gray-200 mb-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex justify-center items-center gap-6">
            <img
              src={company.profileImg}
              alt="Company Logo"
              className="w-20 h-20 border-2 rounded-full object-cover"
            />
            <h2 className="text-3xl font-bold text-blue-900">{company.companyName}</h2>
          </div>
          <button
            onClick={() => setShowUpdateModal(true)}
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-lg shadow-md transition"
          >
            <FaEdit /> Update Profile
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-blue-900">
          <ProfileField icon={<FaBuilding />} label="Company Name" value={company.companyName} />
          <ProfileField icon={<FaIndustry />} label="Industry" value={company.industry} />
          <ProfileField icon={<FaEnvelope />} label="Email" value={company.companyEmail} />
          <ProfileField icon={<FaPhoneAlt />} label="Phone" value={company.companyPhone} />
          <ProfileField icon={<FaLocationArrow />} label="Full Address" value={fullAddress} />
          <ProfileField icon={<MdOutlineDomainVerification />} label="Registration Number" value={company.registrationNumber} />

          {/* Contact Person Hover Card */}
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

            {showContactInfo && (
              <div className="absolute z-50 top-12 left-0 w-64 mt-2 bg-white shadow-lg rounded-lg border border-gray-300 p-4 text-sm text-gray-800 transition-all duration-200">
                <div><strong>Name:</strong> {company.contactPerson.name}</div>
                <div><strong>Email:</strong> {company.contactPerson.email}</div>
                <div><strong>Phone:</strong> {company.contactPerson.phone}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
        <h3 onClick={() => navigate('/orders/all')} className="text-2xl cursor-pointer font-bold text-blue-900 mb-6">📦 Your Orders</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allOrders.map((order) => (
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
          <div className="bg-white mt-16 w-full max-w-2xl rounded-xl shadow-2xl p-6 relative">
            <button
              onClick={() => setShowUpdateModal(false)}
              className="absolute top-3 right-3 text-red-500 text-2xl"
            >
              <IoClose />
            </button>
            <h3 className="text-xl font-bold mb-4 text-blue-900">Edit Profile Details</h3>
            <form className="grid grid-cols-2 gap-3">
              <Input label="Company Name" name="companyName" defaultValue={company.companyName} />
              <Input label="Industry" name="industry" defaultValue={company.industry} />
              <Input label="Email" name="email" defaultValue={company.companyEmail} />
              <Input label="Phone" name="phone" defaultValue={company.companyPhone} />
              <Input label="GST Number" name="gst" defaultValue={company.registrationNumber} />
              <Input label="Street" name="street" defaultValue={company.address.street} />
              <Input label="Landmark" name="landmark" defaultValue={company.address.landmark} />
              <Input label="City" name="city" defaultValue={company.address.city} />
              <Input label="State" name="state" defaultValue={company.address.state} />
              <Input label="Pincode" name="pincode" defaultValue={company.address.pincode} />
              <Input label="Contact Person Name" name="contactName" defaultValue={company.contactPerson.name} />
              <Input label="Contact Person Phone" name="contactPhone" defaultValue={company.contactPerson.phone} />
              <Input label="Contact Person Email" name="contactEmail" defaultValue={company.contactPerson.email} />
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
    <div className="text-md mt-1 text-gray-700">{value}</div>
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

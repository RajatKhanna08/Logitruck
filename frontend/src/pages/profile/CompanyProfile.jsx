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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCompanyProfile } from "../../api/companyApi";

const CompanyProfile = () => {
  const { data: userProfile, isLoading: isProfileLoading } = useUserProfile();
  const { data: allOrders, isLoading: isOrderLoading } = useOrders();
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);

  // TanStack Query mutation for updating profile
  const updateProfileMutation = useMutation({
    mutationFn: updateCompanyProfile,
    onSuccess: (data) => {
      // Invalidate and refetch user profile data
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      
      // Close the modal
      setShowUpdateModal(false);
      
      // Show success message (you can replace this with your preferred notification system)
      alert('Profile updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    },
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Convert FormData to object matching your company schema
    const updatedData = {
      companyName: formData.get('companyName'),
      industry: formData.get('industry'),
      companyEmail: formData.get('email'),
      companyPhone: parseInt(formData.get('phone')),
      registrationNumber: formData.get('gst'),
      address: {
        street: formData.get('street'),
        landmark: formData.get('landmark'),
        city: formData.get('city'),
        state: formData.get('state'),
        pincode: parseInt(formData.get('pincode')),
        country: userProfile.company.address.country, // Keep existing country
      },
      contactPerson: {
        name: formData.get('contactName'),
        phone: parseInt(formData.get('contactPhone')),
        email: formData.get('contactEmail'),
      },
    };

    // Trigger the mutation
    updateProfileMutation.mutate(updatedData);
  };

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
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={updateProfileMutation.isPending}
          >
            <FaEdit /> {updateProfileMutation.isPending ? 'Updating...' : 'Update Profile'}
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
        <h3 onClick={() => navigate('/orders/all')} className="text-2xl cursor-pointer font-bold text-blue-900 mb-6">
          📦 Your Orders ({allOrders?.length || 0})
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allOrders?.map((order) => (
            <div
              key={order._id}
              onClick={() => navigate(`/orders/${order._id}`)}
              className="border border-gray-200 rounded-xl p-4 shadow-md bg-blue-50 hover:shadow-lg transition cursor-pointer"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-yellow-600">#{order._id.slice(-6)}</span>
                <span
                  className={`text-sm px-3 py-1 rounded-full font-semibold ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "in_transit"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {order.status.toUpperCase()}
                </span>
              </div>
              <div className="space-y-2">
                <div className="text-gray-700">
                  <p className="font-medium">From: {order.pickupLocation.address.split(',')[0]}</p>
                  <p className="font-medium">To: {order.dropLocations[0].address.split(',')[0]}</p>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="text-gray-700 flex items-center gap-2">
                    <FaRegCalendarAlt /> 
                    {new Date(order.scheduleAt).toLocaleDateString()}
                  </div>
                  <div className="font-semibold text-green-600">
                    ₹{order.fare}
                  </div>
                </div>
                {order.tripStatus && (
                  <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block">
                    {order.tripStatus}
                  </div>
                )}
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
              className="absolute top-3 right-3 text-red-500 text-2xl hover:text-red-700 transition"
              disabled={updateProfileMutation.isPending}
            >
              <IoClose />
            </button>
            <h3 className="text-xl font-bold mb-4 text-blue-900">Edit Profile Details</h3>
            
            {/* Show loading state */}
            {updateProfileMutation.isPending && (
              <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-lg">
                Updating profile...
              </div>
            )}
            
            {/* Show error state */}
            {updateProfileMutation.isError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                Error: {updateProfileMutation.error?.message || 'Failed to update profile'}
              </div>
            )}

            <form className="grid grid-cols-2 gap-3" onSubmit={handleSubmit}>
              <Input label="Company Name" name="companyName" defaultValue={company.companyName} required />
              <Input label="Industry" name="industry" defaultValue={company.industry} required />
              <Input label="Email" name="email" type="email" defaultValue={company.companyEmail} required />
              <Input label="Phone" name="phone" type="tel" defaultValue={company.companyPhone} required />
              <Input label="GST Number" name="gst" defaultValue={company.registrationNumber} required />
              <Input label="Street" name="street" defaultValue={company.address.street} required />
              <Input label="Landmark" name="landmark" defaultValue={company.address.landmark} required />
              <Input label="City" name="city" defaultValue={company.address.city} required />
              <Input label="State" name="state" defaultValue={company.address.state} required />
              <Input label="Pincode" name="pincode" type="number" defaultValue={company.address.pincode} required />
              <Input label="Contact Person Name" name="contactName" defaultValue={company.contactPerson.name} required />
              <Input label="Contact Person Phone" name="contactPhone" type="tel" defaultValue={company.contactPerson.phone} required />
              <Input label="Contact Person Email" name="contactEmail" type="email" defaultValue={company.contactPerson.email} required />
              
              <div className="col-span-2 flex justify-end gap-3 mt-4">
                <button 
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition"
                  disabled={updateProfileMutation.isPending}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
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

const Input = ({ label, name, defaultValue, type = "text", required = false }) => (
  <div>
    <label className="block mb-1 font-semibold text-sm text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      defaultValue={defaultValue}
      required={required}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
    />
  </div>
);

export default CompanyProfile;
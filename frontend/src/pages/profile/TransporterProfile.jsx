import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaTruck, FaUserTie, FaEnvelope, FaPhone, FaIdBadge, FaEdit } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { useUserProfile } from "../../hooks/useUserProfile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTransporterProfile, getTransporterTrucks, getTransporterBids } from "../../api/transporterApi"; // You'll need to create this API function

const TransporterProfile = () => {
  const { data: userProfile, isLoading } = useUserProfile();
  const queryClient = useQueryClient();
  
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [trucks, setTrucks] = useState([]);
  const [bids, setBids] = useState([]);
  const [trucksLoading, setTrucksLoading] = useState(true);
  const [bidsLoading, setBidsLoading] = useState(true);
  const [error, setError] = useState(null);

  // TanStack Query mutation for updating transporter profile
  const updateProfileMutation = useMutation({
    mutationFn: updateTransporterProfile,
    onSuccess: (data) => {
      // Invalidate and refetch user profile data
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      
      // Close the modal
      setShowUpdateModal(false);
      
      // Show success message
      alert('Transporter profile updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating transporter profile:', error);
      alert('Failed to update profile. Please try again.');
    },
  });

  // Fetch trucks and bids
  useEffect(() => {
    const fetchData = async () => {
      if (userProfile?.transporter?._id) {
        try {
          setTrucksLoading(true);
          setBidsLoading(true);

          const [trucksData, bidsData] = await Promise.all([
            getTransporterTrucks(userProfile.transporter._id),
            getTransporterBids(userProfile.transporter._id)
          ]);

          setTrucks(trucksData.trucks || []);
          setBids(bidsData.bids || []);
        } catch (err) {
          setError(err.message);
        } finally {
          setTrucksLoading(false);
          setBidsLoading(false);
        }
      }
    };

    fetchData();
  }, [userProfile]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Convert FormData to object matching your transporter schema
    const updatedData = {
      transporterName: formData.get('transporterName'),
      ownerName: formData.get('ownerName'),
      email: formData.get('email'),
      contactNo: parseInt(formData.get('contactNo')),
      registrationNumber: formData.get('registrationNumber'),
      address: {
        street: formData.get('street'),
        city: formData.get('city'),
        state: formData.get('state'),
        pincode: parseInt(formData.get('pincode')),
        country: formData.get('country'),
        landmark: formData.get('landmark'),
      },
    };

    // Trigger the mutation
    updateProfileMutation.mutate(updatedData);
  };

  if (isLoading) return <div>Loading...</div>;
  if (!userProfile || !userProfile.transporter) return <div>No profile data found</div>;

  const transporter = userProfile.transporter;

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
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={updateProfileMutation.isPending}
            >
              <FaEdit /> {updateProfileMutation.isPending ? 'Updating...' : 'Edit Profile'}
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
        <h3 className="text-xl font-semibold mb-4 text-blue-800">
          Assigned Trucks & Drivers
          {trucksLoading && <span className="ml-2 text-sm text-gray-500">Loading...</span>}
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {trucks.length === 0 && !trucksLoading ? (
            <p className="text-gray-500 col-span-2 text-center py-4">No trucks assigned yet</p>
          ) : (
            trucks.map((truck) => (
              <div
                key={truck._id}
                className="border p-4 rounded-lg bg-gray-50 shadow-sm flex flex-col gap-2"
              >
                <div className="flex items-center gap-2 text-blue-700 font-semibold">
                  <FaTruck />
                  <span>Truck No: {truck.registrationNumber}</span>
                </div>
                {truck.assignedDriver && (
                  <div className="text-sm pl-6 text-gray-700">
                    <p><strong>Driver:</strong> {truck.assignedDriver.name}</p>
                    <p><strong>Phone:</strong> {truck.assignedDriver.phone}</p>
                    <p><strong>License:</strong> {truck.assignedDriver.licenseNumber}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bids Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-blue-800">
          Recent Bids
          {bidsLoading && <span className="ml-2 text-sm text-gray-500">Loading...</span>}
        </h3>
        {bids.length === 0 && !bidsLoading ? (
          <p className="text-gray-500 text-center py-4">No bids placed yet</p>
        ) : (
          <table className="w-full text-left border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-blue-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((bid) => (
                <tr key={bid._id} className="border-t">
                  <td className="px-4 py-2">#{bid.orderId.slice(-6)}</td>
                  <td className="px-4 py-2">₹{bid.amount.toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      bid.status === 'won' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {bid.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-500">
                    {new Date(bid.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-3xl relative">
            <button
              onClick={() => setShowUpdateModal(false)}
              className="absolute cursor-pointer top-3 right-3 text-red-500 text-xl hover:text-red-700 transition"
              disabled={updateProfileMutation.isPending}
            >
              <IoClose />
            </button>
            <h3 className="text-xl font-bold mb-4 text-blue-800">Edit Transporter Profile</h3>
            
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

            <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <Input
                label="Transporter Name"
                name="transporterName"
                defaultValue={transporter.transporterName}
                placeholder="Transporter Name"
                required
              />
              <Input
                label="Owner Name"
                name="ownerName"
                defaultValue={transporter.ownerName}
                placeholder="Owner Name"
                required
              />
              <Input
                label="Email"
                name="email"
                type="email"
                defaultValue={transporter.email}
                placeholder="Email"
                required
              />
              <Input
                label="Contact Number"
                name="contactNo"
                type="tel"
                defaultValue={transporter.contactNo}
                placeholder="Phone"
                required
              />
              <Input
                label="Registration Number"
                name="registrationNumber"
                defaultValue={transporter.registrationNumber}
                placeholder="Registration No."
                required
              />
              <Input
                label="Street"
                name="street"
                defaultValue={transporter.address.street}
                placeholder="Street"
                required
              />
              <Input
                label="City"
                name="city"
                defaultValue={transporter.address.city}
                placeholder="City"
                required
              />
              <Input
                label="State"
                name="state"
                defaultValue={transporter.address.state}
                placeholder="State"
                required
              />
              <Input
                label="Pincode"
                name="pincode"
                type="number"
                defaultValue={transporter.address.pincode}
                placeholder="Pincode"
                required
              />
              <Input
                label="Country"
                name="country"
                defaultValue={transporter.address.country}
                placeholder="Country"
                required
              />
              <Input
                label="Landmark"
                name="landmark"
                defaultValue={transporter.address.landmark}
                placeholder="Landmark"
                required
              />
              
              <div className="col-span-2 flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded transition"
                  disabled={updateProfileMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
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

const Input = ({ label, name, defaultValue, type = "text", placeholder, required = false }) => (
  <div>
    <label className="block mb-1 font-semibold text-sm text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      defaultValue={defaultValue}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
    />
  </div>
);

export default TransporterProfile;
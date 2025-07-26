import React, { useState } from 'react';
import {
    FaPhone, FaEnvelope, FaMapMarkerAlt, FaTruckMoving, FaRoad, FaClock,
    FaCalendarAlt, FaFileAlt, FaUserTie, FaEdit
} from 'react-icons/fa';
import {
    GiSteeringWheel
} from 'react-icons/gi';
import {
    MdModeOfTravel, MdWorkHistory, MdOutlineLocationOn
} from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDriverProfile } from "../../api/driverApi"; // You'll need to create this API function

const DriverProfile = () => {
    const { data: userProfile, isLoading } = useUserProfile();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // TanStack Query mutation for updating driver profile
    const updateProfileMutation = useMutation({
        mutationFn: updateDriverProfile,
        onSuccess: (data) => {
            // Invalidate and refetch user profile data
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            
            // Close the modal
            setIsModalOpen(false);
            
            // Show success message
            alert('Driver profile updated successfully!');
        },
        onError: (error) => {
            console.error('Error updating driver profile:', error);
            alert('Failed to update profile. Please try again.');
        },
    });

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        // Convert FormData to object matching your driver schema
        const updatedData = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: parseInt(formData.get('phone')),
            vehicleType: formData.get('vehicleType'),
            experience: parseInt(formData.get('experience')),
            availabilityStatus: formData.get('availabilityStatus') === 'true',
        };

        // Trigger the mutation
        updateProfileMutation.mutate(updatedData);
    };

    if (isLoading) return <div className="text-center py-20 text-blue-600 text-xl font-semibold">Loading driver profile...</div>;
    if (!userProfile || !userProfile.driver) return <div className="text-center py-20 text-red-500 text-xl">No profile data found.</div>;

    const driver = userProfile.driver;

    return (
        <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-blue-100 py-10 px-8">
            {/* Top Profile Section */}
            <div className="bg-white mt-20 shadow-xl rounded-xl p-6 mb-10 grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                <div className="flex flex-col items-center md:items-start gap-4">
                    <img src={driver.profileImg || '/placeholder.png'} alt="Driver" className="w-36 h-36 rounded-full object-cover border-4 border-yellow-300" />
                    <h2 className="text-2xl font-bold text-blue-700">{driver.fullName || 'Not Available'}</h2>
                    <div className="text-gray-700 flex items-center gap-2"><FaEnvelope /> {driver.email || 'Not Provided'}</div>
                    <div className="text-gray-700 flex items-center gap-2"><FaPhone /> {driver.phone || 'Not Provided'}</div>
                </div>

                {/* Middle Info Section */}
                <div className="flex flex-col justify-center gap-4 text-sm text-gray-700">
                    <InfoRow icon={<GiSteeringWheel />} label="Vehicle Type" value={driver.vehicleType} />
                    <InfoRow icon={<FaTruckMoving />} label="Assigned Truck" value={driver.assignedTruckId} />
                    <InfoRow icon={<MdOutlineLocationOn />} label="Current Mode" value={driver.currentMode} />
                    <InfoRow icon={<MdModeOfTravel />} label="Availability" value={driver.availabilityStatus ? 'Available' : 'Unavailable'} color={driver.availabilityStatus ? 'text-green-600' : 'text-red-500'} />
                    <InfoRow icon={<MdWorkHistory />} label="Experience" value={`${driver.experience || 0} yrs`} />
                </div>

                {/* Right: Assigned Transporter Info */}
                <div className="flex flex-col justify-between gap-4">
                    <div className="flex items-start justify-between">
                        <h3 className="text-lg font-semibold text-blue-600 flex items-center gap-2">
                            <FaUserTie /> Assigned Transporter
                        </h3>
                    </div>
                    <div className="text-gray-700 text-sm">
                        <p><strong>Name:</strong> {driver.transporterId?.transporterName || 'Not Assigned'}</p>
                        <p><strong>Email:</strong> {driver.transporterId?.email || 'N/A'}</p>
                        <p><strong>Contact:</strong> {driver.transporterId?.contactNo || 'N/A'}</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="self-end mt-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={updateProfileMutation.isPending}
                    >
                        <FaEdit /> {updateProfileMutation.isPending ? 'Updating...' : 'Update Profile'}
                    </button>
                </div>
            </div>

            {/* Statistics Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mb-10">
                <StatCard icon={<FaRoad />} label="Distance Travelled" value={`${driver.totalDistanceTravelledInKm || 0} km`} />
                <StatCard icon={<FaClock />} label="Hours Driven" value={`${driver.totalHoursDriven || 0} hrs`} />
                <StatCard icon={<FaCalendarAlt />} label="Days Worked" value={`${driver.totalDaysWorked || 0} days`} />
            </div>

            {/* Location and Booking */}
            <div className="grid md:grid-cols-2 gap-8 mb-10">
                <Card title="Last Known Location" icon={<FaMapMarkerAlt />}>
                    <p className="text-gray-700"><strong>Latitude:</strong> {driver.location?.coordinates?.[1] || 'Not Available'}</p>
                    <p className="text-gray-700"><strong>Longitude:</strong> {driver.location?.coordinates?.[0] || 'Not Available'}</p>
                </Card>
                <Card title="Active Booking" icon={<FaTruckMoving />}>
                    <p className="text-gray-700">Booking ID: <span className="font-semibold">{driver.activeBookingId || 'No active booking'}</span></p>
                </Card>
            </div>

            {/* Logs */}
            <div className="grid md:grid-cols-2 gap-8 mb-10">
                <Card title="📍 Location History">
                    {driver.locationHistory?.length > 0 ? (
                        <ul className="space-y-2 text-sm text-gray-700 max-h-60 overflow-auto pr-2">
                            {driver.locationHistory.map((loc, index) => (
                                <li key={index} className="flex justify-between border-b pb-1">
                                    <span>{loc.latitude}, {loc.longitude}</span>
                                    <span>{new Date(loc.timestamp).toLocaleString()}</span>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-sm text-gray-500">No location history available.</p>}
                </Card>

                <Card title="🕒 Status Logs">
                    {driver.statusLogs?.length > 0 ? (
                        <ul className="space-y-2 text-sm text-gray-700 max-h-60 overflow-auto pr-2">
                            {driver.statusLogs.map((log, idx) => (
                                <li key={idx} className="flex justify-between border-b pb-1">
                                    <span className="capitalize">{log.status}</span>
                                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-sm text-gray-500">No status logs found.</p>}
                </Card>
            </div>

            {/* Documents */}
            <Card title="📂 Documents">
                <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-700">
                    {driver.documents?.idProof ? (
                        <a href={driver.documents.idProof} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-2">
                            <FaFileAlt /> ID Proof
                        </a>
                    ) : <span className="text-gray-400">ID Proof not uploaded</span>}

                    {driver.documents?.license ? (
                        <a href={driver.documents.license} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-2">
                            <FaFileAlt /> License
                        </a>
                    ) : <span className="text-gray-400">License not uploaded</span>}

                    {driver.documents?.kataParchiAfter ? (
                        <a href={driver.documents.kataParchiAfter} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-2">
                            <FaFileAlt /> Kata Parchi After
                        </a>
                    ) : <span className="text-gray-400">Kata Parchi not uploaded</span>}
                </div>
            </Card>

            {/* Update Modal */}
            {isModalOpen && (
                <UpdateDriverModal 
                    onClose={() => setIsModalOpen(false)} 
                    driver={driver} 
                    onSubmit={handleSubmit}
                    isLoading={updateProfileMutation.isPending}
                    error={updateProfileMutation.error}
                />
            )}
        </div>
    );
};

// Info Row Component
const InfoRow = ({ icon, label, value, color = "text-blue-800" }) => (
    <div className="flex items-center gap-2">
        <span className="text-blue-500">{icon}</span>
        {label}:
        <span className={`font-semibold ${color}`}>{value || "Not Available"}</span>
    </div>
);

// StatCard Component
const StatCard = ({ icon, label, value }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="text-3xl text-yellow-500 mb-2 flex justify-center">{icon}</div>
        <div className="text-sm text-gray-600">{label}</div>
        <div className="text-lg font-semibold text-blue-800">{value}</div>
    </div>
);

// Card Wrapper Component
const Card = ({ title, icon, children }) => (
    <div className="bg-white p-6 shadow-md rounded-lg">
        <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            {icon} {title}
        </h3>
        {children}
    </div>
);

// Enhanced Modal Component with Form
const UpdateDriverModal = ({ onClose, driver, onSubmit, isLoading, error }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-3xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-red-500 text-2xl hover:text-red-700 transition"
                    disabled={isLoading}
                >
                    <IoClose />
                </button>
                
                <h2 className="text-xl font-bold text-blue-700 mb-6">Update Driver Profile</h2>

                {/* Show loading state */}
                {isLoading && (
                    <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-lg">
                        Updating profile...
                    </div>
                )}
                
                {/* Show error state */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                        Error: {error?.message || 'Failed to update profile'}
                    </div>
                )}

                <form className="grid grid-cols-2 gap-4" onSubmit={onSubmit}>
                    <Input
                        label="Full Name"
                        name="fullName"
                        defaultValue={driver.fullName}
                        required
                    />
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        defaultValue={driver.email}
                        required
                    />
                    <Input
                        label="Phone"
                        name="phone"
                        type="tel"
                        defaultValue={driver.phone}
                        required
                    />
                    <Input
                        label="Vehicle Type"
                        name="vehicleType"
                        defaultValue={driver.vehicleType}
                        required
                    />
                    <Input
                        label="Experience (Years)"
                        name="experience"
                        type="number"
                        defaultValue={driver.experience}
                        required
                    />
                    <div>
                        <label className="block mb-1 font-semibold text-sm text-gray-700">
                            Availability Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="availabilityStatus"
                            defaultValue={driver.availabilityStatus}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                        >
                            <option value={true}>Available</option>
                            <option value={false}>Unavailable</option>
                        </select>
                    </div>

                    <div className="col-span-2 flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
        />
    </div>
);

export default DriverProfile;
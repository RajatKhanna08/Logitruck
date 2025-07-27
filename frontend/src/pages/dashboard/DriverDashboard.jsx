import React, { useState } from 'react';
import {
    FaRoad,
    FaClock,
    FaCalendarCheck,
    FaTruck,
    FaToggleOn,
    FaToggleOff,
    FaHistory,
    FaMapMarkedAlt,
    FaFileAlt,
    FaUser,
    FaPhone,
    FaIdCard,
    FaEdit,
    FaEnvelope,
    FaStar,
    FaMapMarkerAlt,
    FaTools,
    FaUpload
} from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { MdLocationOn, MdWork, MdRestaurant } from 'react-icons/md';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateDriverProfile, toggleWorkMode, uploadKataParchi } from '../../api/driverApi';

const DriverDashboard = () => {
    const { data: userProfile, isLoading: isProfileLoading } = useUserProfile();
    const queryClient = useQueryClient();
    
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showLogsModal, setShowLogsModal] = useState(false);
    const [showLocationHistory, setShowLocationHistory] = useState(false);
    const [showKataParchiModal, setShowKataParchiModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    // Mutations
    const updateProfileMutation = useMutation({
        mutationFn: updateDriverProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            setShowUpdateModal(false);
            alert('Profile updated successfully!');
        },
        onError: (error) => {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        },
    });

    const toggleModeMutation = useMutation({
        mutationFn: toggleWorkMode,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            alert('Work mode updated successfully!');
        },
        onError: (error) => {
            console.error('Error toggling work mode:', error);
            alert('Failed to update work mode. Please try again.');
        },
    });

    const uploadKataParchiMutation = useMutation({
        mutationFn: uploadKataParchi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            setShowKataParchiModal(false);
            setSelectedFile(null);
            alert('Kata Parchi uploaded successfully!');
        },
        onError: (error) => {
            console.error('Error uploading file:', error);
            alert('Failed to upload file. Please try again.');
        },
    });

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const updatedData = {
            fullName: formData.get('fullName'),
            phone: parseInt(formData.get('phone')),
            email: formData.get('email'),
            vehicleType: formData.get('vehicleType'),
            experience: parseInt(formData.get('experience')),
        };

        updateProfileMutation.mutate(updatedData);
    };

    const handleToggleMode = () => {
        toggleModeMutation.mutate();
    };

    const handleFileUpload = (e) => {
        e.preventDefault();
        if (!selectedFile) {
            alert('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append('kataParchi', selectedFile);
        uploadKataParchiMutation.mutate(formData);
    };

    if (isProfileLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-blue-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (!userProfile || !userProfile.driver) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-blue-100 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 text-lg">No driver profile found</p>
                </div>
            </div>
        );
    }

    const driver = userProfile.driver;

    return (
        <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-blue-100 py-10 px-6">
            {/* Header */}
            <div className="text-center mt-20 mb-8">
                <div className="flex justify-center items-center gap-4 mb-4">
                    <img
                        src={driver.profileImg || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                        alt="Driver Avatar"
                        className="w-16 h-16 border-2 border-yellow-400 rounded-full object-cover"
                    />
                    <div>
                        <h1 className="text-3xl font-bold text-blue-800">Welcome, {driver.fullName} 👋</h1>
                        <p className="text-gray-600 mt-1 text-sm">Here's your dashboard summary</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowUpdateModal(true)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-lg shadow-md transition"
                >
                    <FaEdit className="inline mr-2" /> Update Profile
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard 
                    icon={<FaRoad />} 
                    label="Total Distance" 
                    value={`${driver.totalDistanceTravelledInKm || 0} km`} 
                />
                <StatCard 
                    icon={<FaClock />} 
                    label="Hours Driven" 
                    value={`${driver.totalHoursDriven || 0} hrs`} 
                />
                <StatCard 
                    icon={<FaCalendarCheck />} 
                    label="Days Worked" 
                    value={`${driver.totalDaysWorked || 0}`} 
                />
                <StatCard 
                    icon={<FaTruck />} 
                    label="Vehicle Type" 
                    value={driver.vehicleType} 
                />
            </div>

            {/* Status & Mode */}
            <div className="grid md:grid-cols-3 gap-8 mb-10">
                {/* Current Status */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-bold text-blue-700 mb-3 flex items-center gap-2">
                        {driver.currentMode === 'work_mode' ? <MdWork /> : <MdRestaurant />} Current Status
                    </h3>
                    <div className="space-y-2">
                        <p className={`font-semibold ${driver.currentMode === 'work_mode' ? 'text-green-600' : 'text-orange-600'}`}>
                            {driver.currentMode === 'work_mode' ? '🟢 Work Mode' : '🟠 Rest Mode'}
                        </p>
                        <p className="text-sm text-gray-600">
                            Available: {driver.availabilityStatus ? '✅ Yes' : '❌ No'}
                        </p>
                        {driver.isStalled && (
                            <p className="text-red-600 text-sm">⚠️ Vehicle Stalled</p>
                        )}
                    </div>
                </div>

                {/* Active Booking */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-bold text-blue-700 mb-3 flex items-center gap-2">
                        <FaTruck /> Active Booking
                    </h3>
                    <p className="text-gray-700">
                        {driver.activeBookingId
                            ? `Booking ID: ${driver.activeBookingId}`
                            : 'No active bookings assigned.'}
                    </p>
                    {driver.assignedTruckId && (
                        <p className="text-sm text-gray-600 mt-2">
                            Truck ID: {driver.assignedTruckId}
                        </p>
                    )}
                </div>

                {/* Toggle Mode */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-bold text-blue-700 mb-3 flex items-center gap-2">
                        {driver.currentMode === 'work_mode' ? <FaToggleOn /> : <FaToggleOff />} Toggle Work Mode
                    </h3>
                    <button
                        onClick={handleToggleMode}
                        disabled={toggleModeMutation.isPending}
                        className={`px-5 py-2 rounded-full text-white font-semibold transition-all duration-300 disabled:opacity-50 ${
                            driver.currentMode === 'work_mode' 
                                ? 'bg-red-500 hover:bg-red-600' 
                                : 'bg-green-500 hover:bg-green-600'
                        }`}
                    >
                        {toggleModeMutation.isPending 
                            ? 'Updating...' 
                            : driver.currentMode === 'work_mode' 
                                ? 'Switch to Rest Mode' 
                                : 'Switch to Work Mode'
                        }
                    </button>
                </div>
            </div>

            {/* Driver Details */}
            <div className="grid md:grid-cols-2 gap-8 mb-10">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-bold text-blue-700 mb-4">👤 Driver Information</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                            <FaUser className="text-yellow-500" />
                            <span className="font-semibold">Name:</span> {driver.fullName}
                        </div>
                        <div className="flex items-center gap-2">
                            <FaPhone className="text-yellow-500" />
                            <span className="font-semibold">Phone:</span> {driver.phone}
                        </div>
                        <div className="flex items-center gap-2">
                            <FaEnvelope className="text-yellow-500" />
                            <span className="font-semibold">Email:</span> {driver.email}
                        </div>
                        <div className="flex items-center gap-2">
                            <FaIdCard className="text-yellow-500" />
                            <span className="font-semibold">License:</span> {driver.documents?.license}
                        </div>
                        <div className="flex items-center gap-2">
                            <FaTools className="text-yellow-500" />
                            <span className="font-semibold">Experience:</span> {driver.experience} years
                        </div>
                        {driver.rating && (
                            <div className="flex items-center gap-2">
                                <FaStar className="text-yellow-500" />
                                <span className="font-semibold">Rating:</span> {driver.rating}
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-bold text-blue-700 mb-4">📍 Location Information</h3>
                    <div className="space-y-3 text-sm">
                        {driver.location?.coordinates && (
                            <div className="flex items-center gap-2">
                                <MdLocationOn className="text-yellow-500" />
                                <span className="font-semibold">Current Location:</span> 
                                <span>{driver.location.coordinates[1]}, {driver.location.coordinates[0]}</span>
                            </div>
                        )}
                        {driver.lastKnownLocation && (
                            <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-yellow-500" />
                                <span className="font-semibold">Last Known:</span> 
                                <span>{driver.lastKnownLocation.latitude}, {driver.lastKnownLocation.longitude}</span>
                            </div>
                        )}
                        <button
                            onClick={() => setShowLocationHistory(true)}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                        >
                            <FaHistory /> View Location History
                        </button>
                    </div>
                </div>
            </div>

            {/* Actions & Logs */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* Status Logs */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-bold text-blue-700 mb-3 flex items-center gap-2">
                        <FaHistory /> Recent Status Logs
                    </h3>
                    <div className="space-y-2 text-sm text-gray-700 max-h-40 overflow-y-auto">
                        {driver.statusLogs && driver.statusLogs.length > 0 ? (
                            driver.statusLogs.slice(-5).map((log, idx) => (
                                <div key={idx} className="flex justify-between border-b pb-1">
                                    <div>
                                        <span className="capitalize font-semibold">{log.status}</span>
                                        {log.note && <p className="text-xs text-gray-500">{log.note}</p>}
                                    </div>
                                    <span className="text-right text-xs">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No status logs available</p>
                        )}
                    </div>
                    <button
                        onClick={() => setShowLogsModal(true)}
                        className="mt-3 text-blue-600 hover:text-blue-800 text-sm"
                    >
                        View All Logs
                    </button>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-bold text-blue-700 mb-3">⚡ Quick Actions</h3>
                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={() => setShowLocationHistory(true)}
                            className="flex items-center gap-2 text-blue-700 hover:text-blue-900 p-2 hover:bg-blue-50 rounded"
                        >
                            <FaMapMarkedAlt /> View Route Map
                        </button>
                        <button 
                            onClick={() => setShowKataParchiModal(true)}
                            className="flex items-center gap-2 text-blue-700 hover:text-blue-900 p-2 hover:bg-blue-50 rounded"
                        >
                            <FaFileAlt /> Upload Kata Parchi
                        </button>
                        <button 
                            onClick={() => setShowLogsModal(true)}
                            className="flex items-center gap-2 text-blue-700 hover:text-blue-900 p-2 hover:bg-blue-50 rounded"
                        >
                            <FaHistory /> View Full Logs
                        </button>
                        {driver.kataParchiAfter?.fileURL && (
                            <a
                                href={driver.kataParchiAfter.fileURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-green-700 hover:text-green-900 p-2 hover:bg-green-50 rounded"
                            >
                                <FaFileAlt /> View Uploaded Kata Parchi
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Update Profile Modal */}
            {showUpdateModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl p-6 relative max-h-[80vh] overflow-y-auto">
                        <button
                            onClick={() => setShowUpdateModal(false)}
                            className="absolute top-3 right-3 text-red-500 text-2xl hover:text-red-700 transition"
                        >
                            <IoClose />
                        </button>
                        <h3 className="text-xl font-bold mb-4 text-blue-900">Update Driver Profile</h3>
                        
                        {updateProfileMutation.isPending && (
                            <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-lg">
                                Updating profile...
                            </div>
                        )}

                        <form className="grid grid-cols-2 gap-3" onSubmit={handleProfileUpdate}>
                            <Input 
                                label="Full Name" 
                                name="fullName" 
                                defaultValue={driver.fullName} 
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
                                label="Email" 
                                name="email" 
                                type="email" 
                                defaultValue={driver.email} 
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
                            
                            <div className="col-span-2 flex justify-end gap-3 mt-4">
                                <button 
                                    type="button"
                                    onClick={() => setShowUpdateModal(false)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 transition"
                                    disabled={updateProfileMutation.isPending}
                                >
                                    {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Kata Parchi Upload Modal */}
            {showKataParchiModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 relative">
                        <button
                            onClick={() => setShowKataParchiModal(false)}
                            className="absolute top-3 right-3 text-red-500 text-2xl hover:text-red-700 transition"
                        >
                            <IoClose />
                        </button>
                        <h3 className="text-xl font-bold mb-4 text-blue-900">Upload Kata Parchi</h3>
                        
                        <form onSubmit={handleFileUpload} className="space-y-4">
                            <div>
                                <label className="block mb-2 font-semibold text-sm text-gray-700">
                                    Select File
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => setSelectedFile(e.target.files[0])}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    required
                                />
                            </div>
                            
                            <div className="flex justify-end gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setShowKataParchiModal(false)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 transition"
                                    disabled={uploadKataParchiMutation.isPending}
                                >
                                    {uploadKataParchiMutation.isPending ? 'Uploading...' : 'Upload'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Status Logs Modal */}
            {showLogsModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl p-6 relative max-h-[80vh] overflow-y-auto">
                        <button
                            onClick={() => setShowLogsModal(false)}
                            className="absolute top-3 right-3 text-red-500 text-2xl hover:text-red-700 transition"
                        >
                            <IoClose />
                        </button>
                        <h3 className="text-xl font-bold mb-4 text-blue-900">All Status Logs</h3>
                        
                        <div className="space-y-3">
                            {driver.statusLogs && driver.statusLogs.length > 0 ? (
                                driver.statusLogs.map((log, idx) => (
                                    <div key={idx} className="border rounded-lg p-3 bg-gray-50">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="capitalize font-semibold text-blue-700">
                                                    {log.status}
                                                </span>
                                                {log.note && (
                                                    <p className="text-sm text-gray-600 mt-1">{log.note}</p>
                                                )}
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-8">No status logs available</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Location History Modal */}
            {showLocationHistory && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl p-6 relative max-h-[80vh] overflow-y-auto">
                        <button
                            onClick={() => setShowLocationHistory(false)}
                            className="absolute top-3 right-3 text-red-500 text-2xl hover:text-red-700 transition"
                        >
                            <IoClose />
                        </button>
                        <h3 className="text-xl font-bold mb-4 text-blue-900">Location History</h3>
                        
                        <div className="space-y-3">
                            {driver.locationHistory && driver.locationHistory.length > 0 ? (
                                driver.locationHistory.map((location, idx) => (
                                    <div key={idx} className="border rounded-lg p-3 bg-gray-50">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <FaMapMarkerAlt className="text-yellow-500" />
                                                <span>
                                                    Lat: {location.latitude}, Long: {location.longitude}
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {new Date(location.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-8">No location history available</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ icon, label, value }) => (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
        <div className="text-3xl text-yellow-500 mb-2 flex justify-center">{icon}</div>
        <div className="text-sm text-gray-600">{label}</div>
        <div className="text-lg font-semibold text-blue-800">{value}</div>
    </div>
);

const Input = ({ label, name, defaultValue, type = "text", required = false, disabled = false }) => (
    <div>
        <label className="block mb-1 font-semibold text-sm text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            name={name}
            defaultValue={defaultValue}
            required={required}
            disabled={disabled}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition ${
                disabled ? 'bg-gray-100 text-gray-500' : ''
            }`}
        />
    </div>
);

export default DriverDashboard;
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
    FaFileAlt
} from 'react-icons/fa';

const DriverDashboard = () => {
    const [driverData, setDriverData] = useState({
        name: 'Rajeev Singh',
        currentMode: 'work_mode',
        availabilityStatus: true,
        totalDistanceTravelledInKm: 58234,
        totalHoursDriven: 2080,
        totalDaysWorked: 320,
        activeBookingId: 'ORD238913',
        statusLogs: [
            { status: 'started', timestamp: '2025-07-10T09:00', note: 'Started from Bhiwadi' },
            { status: 'paused', timestamp: '2025-07-10T12:00', note: 'Lunch Break' },
            { status: 'resumed', timestamp: '2025-07-10T13:00', note: 'Resumed Journey' }
        ]
    });

    const toggleMode = () => {
        const newMode = driverData.currentMode === 'work_mode' ? 'rest_mode' : 'work_mode';
        setDriverData(prev => ({ ...prev, currentMode: newMode }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-blue-100 py-10 px-6">
            {/* Header */}
            <div className="text-center mt-23 mb-8">
                <h1 className="text-3xl font-bold text-blue-800">Welcome, {driverData.name} 👋</h1>
                <p className="text-gray-600 mt-1 text-sm">Here’s your dashboard summary</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard icon={<FaRoad />} label="Total Distance" value={`${driverData.totalDistanceTravelledInKm} km`} />
                <StatCard icon={<FaClock />} label="Hours Driven" value={`${driverData.totalHoursDriven} hrs`} />
                <StatCard icon={<FaCalendarCheck />} label="Days Worked" value={`${driverData.totalDaysWorked}`} />
                <StatCard icon={<FaTruck />} label="Current Mode" value={driverData.currentMode === 'work_mode' ? 'Work' : 'Rest'} />
            </div>

            {/* Booking & Mode */}
            <div className="grid md:grid-cols-2 gap-8 mb-10">
                {/* Active Booking */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-blue-700 mb-3 flex items-center gap-2">
                        <FaTruck /> Active Booking
                    </h3>
                    <p className="text-gray-700">
                        {driverData.activeBookingId
                            ? `Booking ID: ${driverData.activeBookingId}`
                            : 'No active bookings assigned.'}
                    </p>
                </div>

                {/* Toggle Mode */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-blue-700 mb-3 flex items-center gap-2">
                        {driverData.currentMode === 'work_mode' ? <FaToggleOn /> : <FaToggleOff />} Toggle Work Mode
                    </h3>
                    <button
                        onClick={toggleMode}
                        className={`px-5 py-2 rounded-full text-white font-semibold transition-all duration-300 ${
                            driverData.currentMode === 'work_mode' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                        }`}
                    >
                        {driverData.currentMode === 'work_mode' ? 'Switch to Rest Mode' : 'Switch to Work Mode'}
                    </button>
                </div>
            </div>

            {/* Logs & Quick Actions */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* Status Logs */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-blue-700 mb-3 flex items-center gap-2">
                        <FaHistory /> Recent Status Logs
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        {driverData.statusLogs.map((log, idx) => (
                            <li key={idx} className="flex justify-between border-b pb-1">
                                <span className="capitalize">{log.status}</span>
                                <span className="text-right">{new Date(log.timestamp).toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-blue-700 mb-3">⚡ Quick Actions</h3>
                    <div className="flex flex-col gap-3">
                        <button className="flex items-center gap-2 text-blue-700 hover:text-blue-900">
                            <FaMapMarkedAlt /> View Route Map
                        </button>
                        <button className="flex items-center gap-2 text-blue-700 hover:text-blue-900">
                            <FaFileAlt /> Upload Kata Parchi
                        </button>
                        <button className="flex items-center gap-2 text-blue-700 hover:text-blue-900">
                            <FaHistory /> View Full Logs
                        </button>
                    </div>
                </div>
            </div>
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

export default DriverDashboard;
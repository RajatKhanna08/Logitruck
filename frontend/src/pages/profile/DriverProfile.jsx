import React from 'react';
import {
    FaPhone, FaEnvelope, FaMapMarkerAlt, FaTruckMoving, FaRoad, FaClock, FaCalendarAlt, FaFileAlt, FaInfoCircle
} from 'react-icons/fa';
import { GiSteeringWheel } from 'react-icons/gi';
import { MdModeOfTravel, MdWorkHistory, MdOutlineLocationOn } from 'react-icons/md';

const DriverProfile = () => {
    const driver = {
        profileImg: '/driver-profile.jpg',
        fullName: 'Rajeev Singh',
        email: 'rajeev.driver@example.com',
        phone: 9876543210,
        vehicleType: 'Tanker',
        experience: 6,
        availabilityStatus: true,
        currentMode: 'work_mode',
        totalDistanceTravelledInKm: 58234,
        totalHoursDriven: 2080,
        totalDaysWorked: 320,
        lastKnownLocation: {
            latitude: "28.6139",
            longitude: "77.2090"
        },
        documents: {
            idProof: '/docs/idProof.pdf',
            license: '/docs/license.pdf',
            kataParchiAfter: '/docs/kata.pdf'
        },
        assignedTruckId: 'HR38D1234',
        activeBookingId: 'ORD238913',
        locationHistory: [
            { latitude: '28.705', longitude: '77.104', timestamp: '2025-07-10T09:00' },
            { latitude: '28.614', longitude: '77.209', timestamp: '2025-07-12T15:30' }
        ],
        statusLogs: [
            { status: 'started', timestamp: '2025-07-10T09:00', note: 'Started journey from Bhiwadi' },
            { status: 'paused', timestamp: '2025-07-10T12:00', note: 'Break for lunch' }
        ]
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-blue-100 py-10 px-8">
            {/* Top Section */}
            <div className="bg-white mt-25 shadow-xl rounded-xl p-6 mb-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center md:items-start gap-4">
                    <img src={driver.profileImg} alt="Driver" className="w-36 h-36 rounded-full object-cover border-4 border-yellow-300" />
                    <h2 className="text-2xl font-bold text-blue-700">{driver.fullName}</h2>
                    <div className="text-gray-700 flex items-center gap-2"><FaEnvelope /> {driver.email}</div>
                    <div className="text-gray-700 flex items-center gap-2"><FaPhone /> {driver.phone}</div>
                </div>
                <div className="flex flex-col justify-center gap-4 text-sm text-gray-700">
                    <div className="flex items-center gap-2"><GiSteeringWheel className="text-blue-500" /> Vehicle Type: <span className="font-semibold">{driver.vehicleType}</span></div>
                    <div className="flex items-center gap-2"><FaTruckMoving className="text-blue-500" /> Assigned Truck: <span className="font-semibold">{driver.assignedTruckId}</span></div>
                    <div className="flex items-center gap-2"><MdOutlineLocationOn className="text-blue-500" /> Current Mode: <span className="font-semibold">{driver.currentMode}</span></div>
                    <div className="flex items-center gap-2"><MdModeOfTravel className="text-blue-500" /> Availability: <span className={`font-semibold ${driver.availabilityStatus ? 'text-green-600' : 'text-red-500'}`}>{driver.availabilityStatus ? 'Available' : 'Unavailable'}</span></div>
                    <div className="flex items-center gap-2"><MdWorkHistory className="text-blue-500" /> Experience: <span className="font-semibold">{driver.experience} yrs</span></div>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mb-10">
                <StatCard icon={<FaRoad />} label="Distance Travelled" value={`${driver.totalDistanceTravelledInKm} km`} />
                <StatCard icon={<FaClock />} label="Hours Driven" value={`${driver.totalHoursDriven} hrs`} />
                <StatCard icon={<FaCalendarAlt />} label="Days Worked" value={`${driver.totalDaysWorked} days`} />
            </div>

            {/* Live Location + Booking */}
            <div className="grid md:grid-cols-2 gap-8 mb-10">
                <div className="bg-white p-6 shadow-md rounded-lg">
                    <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2"><FaMapMarkerAlt /> Last Known Location</h3>
                    <p className="text-gray-700"><strong>Latitude:</strong> {driver.lastKnownLocation.latitude}</p>
                    <p className="text-gray-700"><strong>Longitude:</strong> {driver.lastKnownLocation.longitude}</p>
                </div>
                <div className="bg-white p-6 shadow-md rounded-lg">
                    <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2"><FaTruckMoving /> Active Booking</h3>
                    <p className="text-gray-700">Booking ID: <span className="font-semibold">{driver.activeBookingId || "No active booking"}</span></p>
                </div>
            </div>

            {/* Location History & Status Logs */}
            <div className="grid md:grid-cols-2 gap-8 mb-10">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-blue-700 mb-3">📍 Location History</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        {driver.locationHistory.map((loc, index) => (
                            <li key={index} className="flex justify-between border-b pb-1">
                                <span>{loc.latitude}, {loc.longitude}</span>
                                <span>{new Date(loc.timestamp).toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-blue-700 mb-3">🕒 Status Logs</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        {driver.statusLogs.map((log, idx) => (
                            <li key={idx} className="flex justify-between border-b pb-1">
                                <span className="capitalize">{log.status}</span>
                                <span className="text-right">{new Date(log.timestamp).toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Documents */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-blue-700 mb-3">📂 Documents</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-700">
                    <a href={driver.documents.idProof} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-2"><FaFileAlt /> ID Proof</a>
                    <a href={driver.documents.license} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-2"><FaFileAlt /> License</a>
                    <a href={driver.documents.kataParchiAfter} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-2"><FaFileAlt /> Kata Parchi After</a>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="text-3xl text-yellow-500 mb-2 flex justify-center">{icon}</div>
        <div className="text-sm text-gray-600">{label}</div>
        <div className="text-lg font-semibold text-blue-800">{value}</div>
    </div>
);

export default DriverProfile;
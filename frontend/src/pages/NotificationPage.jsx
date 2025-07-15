import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";

const NotificationCard = ({ title, message, time, type }) => {
    const typeColor = {
        success: "border-green-400 bg-green-50 text-green-700",
        info: "border-blue-400 bg-blue-50 text-blue-700",
        warning: "border-yellow-400 bg-yellow-50 text-yellow-800",
        error: "border-red-400 bg-red-50 text-red-700",
    };

    return (
        <div className={`border-l-4 shadow-sm p-5 rounded-lg ${typeColor[type]} transition-transform hover:scale-[1.01]`}>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm mt-1">{message}</p>
            <span className="text-xs mt-2 block text-gray-500">{time}</span>
        </div>
    );
};

const NotificationPage = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            const mockData = [
                {
                    id: 1,
                    title: "New Booking Request",
                    message: "You have received a new booking request from ABC Logistics.",
                    time: "2 minutes ago",
                    type: "info",
                },
                {
                    id: 2,
                    title: "Document Approved",
                    message: "Your GST Certificate has been verified successfully.",
                    time: "1 hour ago",
                    type: "success",
                },
                {
                    id: 3,
                    title: "Payment Received",
                    message: "₹12,500 received for Trip ID #TRK2024012.",
                    time: "Yesterday",
                    type: "success",
                },
                {
                    id: 4,
                    title: "Driver Assigned",
                    message: "Driver Rajeev Sharma assigned to your shipment #LOG29312.",
                    time: "2 days ago",
                    type: "info",
                },
                {
                    id: 5,
                    title: "Delayed Shipment Alert",
                    message: "Weather disruption causing delay in shipment #TR12345.",
                    time: "3 days ago",
                    type: "warning",
                },
            ];
            setNotifications(mockData);
        };

        fetchNotifications();
    }, []);

    return (
        <div className="min-h-screen text-black px-5 py-12 sm:px-10">
            <div className="mt-20 max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-4xl font-bold text-black">Notifications</h1>
                        <p className="text-gray-400 mt-1 text-sm">
                            Stay up-to-date with all your logistics activity
                        </p>
                    </div>
                    <FaBell className="text-yellow-300 text-3xl animate-pulse" />
                </div>

                <div className="space-y-5">
                    {notifications.map((notif) => (
                        <NotificationCard key={notif.id} {...notif} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NotificationPage;

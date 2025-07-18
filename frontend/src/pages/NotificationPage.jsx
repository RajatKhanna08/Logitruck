import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useNotification } from "../hooks/useNotification";

const NotificationPage = () => {
    const { data:notifications = [], isLoading:isNotificationsLoading } = useNotification();
    console.log(notifications);

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

    // const [notifications, setNotifications] = useState([]);

    return (
        <div className="min-h-screen relative text-black px-5 py-12 sm:px-10">
            <div className="absolute w-full h-80 top-30 left-0 bg-yellow-300 z-[-10]" />
            <div className="mt-30 max-w-4xl mx-auto">
                <div className="relative flex items-center justify-between mb-1">
                    <div className="z-10">
                        <h1 className="text-4xl font-bold text-[#192a67]">Notifications</h1>
                        <p className="text-black font-semibold mt-1 text-sm">
                            Stay up-to-date with all your logistics activity
                        </p>
                    </div>
                    <FaBell size={50} className="text-yellow-300 z-10 text-3xl p-2 rounded-full bg-black" />
                </div>

                <div className="space-y-5 z-100">
                    {isNotificationsLoading ? (
                        <p>Loading notifications...</p>
                    ) : notifications && notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <NotificationCard key={notif._id} {...notif} />
                        ))
                    ) : (
                        <p>No notifications available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationPage;

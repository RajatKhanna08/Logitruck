import { FaBell } from "react-icons/fa";
import { useNotification } from "../hooks/useNotification";
import moment from "moment";
import { axiosInstance } from "../lib/axios";

const NotificationPage = () => {
    const { data: notifications = [], isLoading: isNotificationsLoading } = useNotification();

    const NotificationCard = ({ title, message, time, type }) => {
        const typeColor = {
            status: "border-blue-400 bg-blue-50 text-blue-700",
            general: "border-gray-400 bg-gray-50 text-gray-700",
            warning: "border-yellow-400 bg-yellow-50 text-yellow-800",
            "rest-mode": "border-purple-400 bg-purple-50 text-purple-700",
            "stall-alert": "border-orange-400 bg-orange-50 text-orange-700",
            task: "border-green-400 bg-green-50 text-green-700",
            alert: "border-red-400 bg-red-50 text-red-700",
            info: "border-cyan-400 bg-cyan-50 text-cyan-700",
            activity: "border-indigo-400 bg-indigo-50 text-indigo-700",
            document: "border-teal-400 bg-teal-50 text-teal-700",
        };
        const typeStyle = typeColor[type] || "border-gray-300 bg-white text-black";

        return (
            <div className={`border-l-4 shadow-sm p-5 rounded-lg ${typeStyle} transition-transform hover:scale-[1.01]`}>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-sm mt-1">{message}</p>
                <span className="text-xs mt-2 block text-gray-500">
                    {moment(time).fromNow()}
                </span>
            </div>
        );
    };

    const handleDeleteAll = async () => {
        try {
            const response = await axiosInstance.delete('/notification/all');
            if (response.data.success) {
                window.location.reload();
            } else {
                alert("Failed to delete notifications.");
            }
        } catch (err) {
            console.error("Error deleting notifications:", err.message);
        }
    };
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
                    <div className="flex gap-3 items-center z-10">
                        <button
                            onClick={handleDeleteAll}
                            className="bg-black border border-black hover:bg-[#f4f4f4] hover:text-black text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                        >
                            Clear All
                        </button>
                        <FaBell size={45} className="text-white text-3xl p-2 rounded-full bg-black" />
                    </div>
                </div>

                <div className="space-y-5 z-50">
                    {isNotificationsLoading ? (
                        <p>Loading notifications...</p>
                    ) : notifications && notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <NotificationCard
                                key={notif._id}
                                title={notif.title}
                                message={notif.message}
                                type={notif.type}
                                time={notif.createdAt}
                            />
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

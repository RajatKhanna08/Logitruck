import { useQuery } from "@tanstack/react-query"
import { getAllNotifications } from "../api/notificationApi"

export const useNotification = async () => {
    return useQuery({
        queryKey: ['notification'],
        queryFn: async () => {
            const data = await getAllNotifications();
            return data;
        }
    })
}
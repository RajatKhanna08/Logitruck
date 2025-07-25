import { useQuery } from "@tanstack/react-query";
import { getAllNotifications } from "../api/notificationApi";

export const useNotification = () => {
  return useQuery({
    queryKey: ['notification'],
    queryFn: getAllNotifications, 
  });
};
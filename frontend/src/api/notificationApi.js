import { axiosInstance } from "../lib/axios";

export const getAllNotifications = async () => {
    try{
        const res = await axiosInstance.get("/notification/all");
        return res.data.notifications;
    }
    catch(err){
        console.log("Error in getAllNotifications: ", err.message);
        throw err;
    }
}
import { axiosInstance } from "../lib/axios";

export const registerDriver = async (driverRegisterData) => {
    try{
        const res = await axiosInstance.post("/driver/register", driverRegisterData);
        return res.data;
    }
    catch(err){
        console.log("Error in registerDriver: ", err.message);
    }
}

export const loginDriver = async (driverLoginData) => {
    try{
        const res = await axiosInstance.post("/driver/login", driverLoginData);
        return res.data;
    }
    catch(err){
        console.log("Error in loginDriver: ", err.message);
    }
}

export const logoutDriver = async () => {
    try{
        const res = await axiosInstance.delete("/driver/logout");
        return res.data;
    }
    catch(err){
        console.log("Error in logoutDriver: ", err.message);
    }
}

export const getDriverProfile = async () => {
    try{
        const res = await axiosInstance.get("/driver/profile");
        return res.data;
    }
    catch(err){
        console.log("Error in getDriverProfile: ", err.message);
    }
}
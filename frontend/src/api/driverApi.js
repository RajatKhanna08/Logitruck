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

export const updateDriverProfile = async (updatedDriverData) => {
    try{
        const res = await axiosInstance.put("/driver/profile", updatedDriverData);
        return res.data;
    }
    catch(err){
        console.log("Error in updateDriverProfile: ", err.message);
        throw err;
    }
};

export const updateDriverLocation = async ({ lat, lng }) => {
    const res = await axiosInstance.post('/driver/location', {
        latitude: lat,
        longitude: lng
    })

    return res.data;
}

export const toggleWorkMode = async () => {
    try{

    }
    catch(err){
        console.log("Error in toggleWorkMode: ", err.message);
        throw err;
    }
}

export const uploadKataParchi = async () => {
    try{

    }
    catch(err){
        console.log("Error in uploadKataParchi: ", err.message);
        throw err;
    }
}

export const orderHistory = async () => {
    try{
        const res = await axiosInstance.get('/driver/order-history');
        return res.data.orderHistory;
    }
    catch(err){
        console.log("Error in orderHistory: ", err.message);
        throw err;
    }
}
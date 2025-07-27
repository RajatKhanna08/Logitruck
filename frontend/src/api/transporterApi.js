import { axiosInstance } from "../lib/axios";

export const registerTransporter = async (transporterRegisterData) => {
    try{
        const res = await axiosInstance.post("/transporter/register", transporterRegisterData);
        return res.data;
    }
    catch(err){
        console.log("Erorr in registerTransporter: ", err);
    }
}

export const loginTransporter = async (transporterLoginData) => {
    try{
        const res = await axiosInstance.post("/transporter/login", transporterLoginData);
    }
    catch(err){
        console.log("Error in loginTransporter: ", err.message);
    }
}

export const logoutTransporter = async () => {
    try{
        const res = await axiosInstance.delete("/transporter/logout");
        return res.data;
    }
    catch(err){
        console.log("Error in logoutTransporter: ", err.message);
    }
}

export const getTransporterProfile = async () => {
    try{
        const res = await axiosInstance.get("/transporter/profile");
        return res.data;
    }
    catch(err){
        console.log("Error in getTransporterProfile: ", err.message);
    }
}

export const updateTransporterProfile = async (updatedTransporterData) => {
    try{
        const res = await axiosInstance.put('/transporter/profile', updatedTransporterData);
        return res.data;
    }
    catch(err){
        console.log("Error in updateTransporterProfile: ", err.message);
        throw err;
    }
}

export const getTransporterDashboard = async () => {
    try{
        const res = await axiosInstance.get('/transporter/dashboard');
        return res.data;
    }
    catch(err){
        console.log("Error in getTransporterDashboard: ", err.message);
        throw err;
    }
}
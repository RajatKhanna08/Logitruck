import { axiosInstance } from "../lib/axios";

export const registerTransporter = async (transporterRegisterData) => {
    try{
        const res = await axiosInstance.post("/transporter/register", transporterRegisterData);
        return res.data;
    }
    catch(err){
        console.log("Erorr in registerTransporter: ", err.message);
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
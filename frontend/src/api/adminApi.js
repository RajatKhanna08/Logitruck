import { axiosInstance } from "../lib/axios";

export const loginAdmin = async (loginAdminData) => {
    try{
        const res = await axiosInstance.post("/admin/login", loginAdminData);
        return res.data;
    }
    catch(err){
        console.log("Error in loginAdmin: ", err.message);
    }
}

export const logoutAdmin = async () => {
    try{
        const res = await axiosInstance.delete("/admin/logout");
        return res.data;
    }
    catch(err){
        console.log("Error in logoutAdmin: ", err.message);
    }

}

export const getAdminProfile = async () => {
    try{
        const res = await axiosInstance.get("/admin/profile");
        return res.data;
    }
    catch(err){
        console.log("Error in getAdminProfile: ", err.message);
    }
}

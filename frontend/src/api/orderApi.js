import { axiosInstance } from "../lib/axios";

export const getAllOrders = async () => {
    try{
        const res = await axiosInstance.get("/order/company/all-orders");
        return res.data.allOrders;
    }
    catch(err){
        console.log("Error in getAllOrders: ", err.message);
        throw err;
    }
}
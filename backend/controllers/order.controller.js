import orderModel from "../models/orderModel.js";

export const createOrderController = async (req, res) => {
    try{
        const { customerId,
                acceptedTransporterId,
                acceptedTruckId,
                pickupLocation,
                dropLocations,
                isBiddingEnabled,
                loadDetails
            } = req.body;

        const newOrder = await orderModel.create({
            customerId,
            acceptedTransporterId,
            acceptedTruckId,
            pickupLocation,
            dropLocations,
            isBiddingEnabled,
            loadDetails
        });

        return res.status(201).json({ createdOrder: newOrder });
    }
    catch(err){
        console.log("Error in createOrderController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const uploadEwayBillController = async (req, res) => {

}

export const trackOrderController = async (req, res) => {

}

export const rateOrderController = async (req, res) => {

}

export const getCurrentOrderController = async (req, res) => {

}

export const getOrdersController = async (req, res) => {

}

export const getCurrentDriverOrderController = async (req, res) => {

}

export const getOrderStatusController = async (req, res) => {

}

export const getActiveOrdersController = async (req, res) => {

}

export const getDriverHistoryController = async (req, res) => {

}

export const updateOrderStatusController = async (req, res) => {

}

export const cancelOrderController = async (req, res) => {
    
}
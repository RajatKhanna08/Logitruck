import mongoose from "mongoose";

const notificationSchema = new  mongoose.Schema({
    role: {
        type: String,
        enum: ["company", "driver", "transporter", "admin"],
        required: true
    },
    
    type: {
        type : String,
        enum: ["general","status","warning","rest-mode","stall-aler"]
    },
    
    title: {
        type: String,
        required: true
    },
    
    message: {
        type: String,
        required: true
    },
    
    relatedBookingId: {
        type: String,
        required: true
    },
    
    relatedUserId: {
        type: String,
        required: true
    },
    
    isRead: {
        type: Boolean,
    },
    
    deliveryMode: {
        type: String,
        enum: ["pending", "accepted", "ongoing", "completed", "cancelled"],
        default: "pending"
    }
})

const notificationModel = mongoose.model("notificationModel",notificationSchema);
export default notificationModel;

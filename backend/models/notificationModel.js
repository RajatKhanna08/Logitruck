import mongoose from "mongoose";

// Define the schema for the notification collection in MongoDB
const notificationSchema = new  mongoose.Schema({
    // Role of the user receiving the notification (required, must be one of the specified roles)
    role: {
        type: String,
        enum: ["company", "driver", "transporter", "admin"],
        required: true
    },
    
    // Type of notification (optional, must be one of the specified types)
    type: {
        type : String,
        enum: ["general","status","warning","rest-mode","stall-aler"]
    },
    
    // Title of the notification (required)
    title: {
        type: String,
        required: true
    },
    
    // Message content of the notification (required)
    message: {
        type: String,
        required: true
    },
    
    // Related booking/order ID (required)
    relatedBookingId: {
        type: String,
        required: true
    },
    
    // Related user ID (required)
    relatedUserId: {
        type: String,
        required: true
    },
    
    // Read status of the notification (optional)
    isRead: {
        type: Boolean,
    },
    
    // Delivery mode/status of the notification (defaults to "pending")
    deliveryMode: {
        type: String,
        enum: ["pending", "accepted", "ongoing", "completed", "cancelled"],
        default: "pending"
    }
})

// Create the notification model using the schema
const notificationModel = mongoose.model("notificationModel",notificationSchema);

// Export the model for use in other parts of the application
export default notificationModel;
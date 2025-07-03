import mongoose from "mongoose";

// Define the schema for the payments collection in MongoDB
const paymentsSchema = new  mongoose.Schema({
    // Reference to the related order (required)
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders',
        required: true,
    },
    
    // Reference to the customer (company) making the payment (required)
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company',
        required: true
    },
    
    // Reference to the transporter receiving the payment (required)
    transporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'transporter',       
        required: true
    },
    
    // Payment amount (required)
    amount: {
        type: Number,
        required:true
    },
    
    // Currency of the payment (required, defaults to INR)
    currency: {
        type: String,
        default: "INR",
        required:true
    },
    
    // Payment mode (required, restricted to specific values, defaults to "Cash")
    paymenmtMode: { // Typo: should be "paymentMode"
        type: String,
        required: true,
        enum: ["UPI", "Cash", "Net Banking", "Credit Card"],
        default: "Cash"
    },
    
    // Payment gateway details (all fields required)
    paymentGateway: {
        name: {
            type: String,
            required: true
        },
        transactionId: {
            type: String,
            required: true
        },
        orderRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'orders',
            required: true
        },
        response: {
            type: String,
            required: true
        },
    },
    
    // Unique payment invoice identifier (required)
    paymentInvoice: {
        type: String,
        required: true,
        unique: true
    },
    
    // Timestamp when payment was made (optional)
    paidAt: Date,

    // Timestamp when payment was refunded (optional)
    refundedAt: Date
});

// Create the payments model using the schema
const paymentsModel = mongoose.model("paymentsModel",paymentsSchema);

// Export the model for use in other parts of the application
export default paymentsModel;
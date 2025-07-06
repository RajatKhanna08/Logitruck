import mongoose from "mongoose";

const paymentsSchema = new  mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders',
        required: true,
    },
    
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company',
        required: true
    },
    
    transporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'transporter',       
        required: true
    },
    
    amount: {
        type: Number,
        required:true
    },
    
    currency: {
        type: String,
        default: "INR",
    },
    
    paymentMode: {
        type: String,
        required: true,
        enum: ["UPI", "Cash", "Net Banking", "Credit Card"],
        default: "Cash"
    },
    
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
    
    paymentInvoice: {
        type: String,
        required: true,
        unique: true
    },
    
    paidAt: {
        type: Date,
        default: null
    },

    refundedAt: {
        type: Date,
        default: null
    },

    refundStatus: {
        type: String,
        enum: ["pending", "processed", "failed"],
        default: "pending"
    }
});

const paymentsModel = mongoose.model("payments",paymentsSchema);

export default paymentsModel;
import mongoose from "mongoose";

const paymentsSchema = new  mongoose.Schema({
    orderId : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'orders',
        required: true,
    },
    customerId : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'company',
        required: true
    },
    transporterId : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'transporter',       
        required: true
    },
    amount : {
        type: Number,
        required:true
    },
    currency : {
        type: String,
        default: "INR",
        required:true
    },
    paymenmtMode : {
        type: String,
        required: true,
        enum: ["UPI", "Cash", "Net Banking", "Credit Card"],
        default: "Cash"
    },
    paymentGateway : {
        name : {
            type: String,
            required: true
        },
        transactionId : {
            type: String,
            required: true
        },
        orderRef : {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'orders',
            required: true
        },
        response : {
            type: String,
            required: true
        },
    },
    paymentInvoice: {
        type: String,
        required: true,
        unique: true
    },
    paidAt : Date,
    refundedAt : Date
    
});

const paymentsModel = mongoose.model("paymentsModel",paymentsSchema);
export default paymentsModel;
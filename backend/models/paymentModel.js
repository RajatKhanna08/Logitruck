import mongoose from "mongoose";

const paymentsSchema = new  mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ordersModel',
        required: true,
    },
    
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company',
        required: true
    },
    
    transporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'transporters',       
        required: true
    },
    
    amount: {
        type: Number,
        required:true
    },
    
    commission: {
        type: Number,
        required: true  
      },
    
    payoutAmount: {
        type: Number,
        required: true
    },
    
    currency: {
        type: String,
        default: "INR",
        required: true
    },
    
    paymentMode: {
        type: String,
        required: true,
        enum: ["UPI","Net Banking", "Credit Card"],
        default: "UPI"
    },
    
    paymentGateway: {
        name: {
            type: String,
            required: true
        }, // Razorpay
        razorpayOrderId: {
            type: String,
            required: true
        },
        razorpayPaymentId: {
            type: String,
            required: true
        },
        razorpaySignature: {
            type: String,
            required: true
        },
        response: {
            type: mongoose.Schema.Types.Mixed,
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
    },

    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "refunded", "failed"],
        default: "pending"
      }    
});

paymentsSchema.virtual("calculatedPayout").get(function () {
    return this.amount - this.commission;
  });
paymentsSchema.set("toJSON", { virtuals: true });
paymentsSchema.set("toObject", { virtuals: true });  

const paymentsModel = mongoose.model("payments",paymentsSchema);        
export default paymentsModel;
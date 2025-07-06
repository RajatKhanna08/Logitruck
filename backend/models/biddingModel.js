import mongoose from "mongoose";

const biddingSchema = new  mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'orders'
    },

    bids: {
        transporterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'transporters',
            required: true
        },
        truckId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'trucks'
        },
        bidAmount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ["pending","accepted","rejected"],
            default: "pending"
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },     
    },

     isClosed: {
        type: Boolean,
        default: false
    },

    acceptedBid: {
        transporterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'transporters'
        },
        truckId: {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'trucks'
        },
        bidAmount: {
            type: Number,
        }
    },
});

const biddingModel = mongoose.model("bidding", biddingSchema);

export default biddingModel;
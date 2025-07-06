import mongoose from "mongoose";

const ordersSchema = new  mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'company',
        required: true
    },
    
    pickupLocation: {
        address: {
            type: String,
            required:true
        },
        latitude: {
            type: String,
            required:true
        },
        longitude: {
            type: String,
            required:true
        }
    },
    
    dropLocations: {
        stopIndex: {
            type: Number,
        },
        address: {
            type: String,
            required: true
        },
        latitude: {
            type: String, 
            required: true
        },
        longitude: {
            type: String,
            required: true
        },
        contactName: {
            type:String,
            required: true
        },
        contactPhone: {
            type: Number,
            required: true
        },
        instructions: {
            type: String,
            required: true
        }
    },
    
    scheduleAt: Date,
    startTime: Date,
    endTime: Date,

    isBiddingEnabled: {
        type: Boolean,
        default: true
    },

    biddingStatus: {
        type: String,
        enum: ["open", "closed", "accepted"],
        default: "open"
    },

    biddingExpiresAt: {
        type: Date
    },

    acceptedTransporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transporters"
    },

    acceptedTruckId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "trucks"
    },

    acceptedDriverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "drivers"
    },

    finalBidAmount: {
        type: Number
    },
    
    status: {
        type: String,
        enum: ["pending","delivered","cancelled","paused","in_transit","delayed"],
        default: "pending"
    },
    
    loadDetails: {
        weightInKg: {
            type: Number,
            required: true
        },
        volumeInCubicMeters: {
            type: Number,
            required: true
        },
        type: {
            type:String ,
            enum:["general","fragile","perishable","bulk","electronics","furniture","others"],
            default: "general"
        },
        quantity: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    },
    
    completedStops: {
        type: Number,
        required: true
    },
    
    distance: {
        type: Number,
        required: true
    },
    
    duration: {
        type: Number,
        required: true
    },
    
    fare: {
        type: Number,
        required: true
    },
    
    paymentMode: {
        type: String,
        enum: ["UPI", "Cash","Credit Card", "Net-Banking"],
        default: "Cash",
    },
    
    paymentStatus: {
        type: String,
        enum:["paid", "unpaid", "failed"],
        default: "unpaid"
    },
    
    currentLocation: {
        latitude: {
            type: String,
        },
        longitude: {
            type: String
        },
        updatedAt: Date
    },
    
    trackingHistory: {
        latitude: {
            type: String,
            required: true
        },
        longitude: {
            type: String,
            required: true
        },
        timeStamp: {
            type: Date
        },
        stars: {
            type: Number
        },
        review: {
            type: String
        }
    },
    
    ratingByCustomer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company',
    },
    
    ratingByDriver: {
        stars: {
            type: Number,
            required: true
        },
        reviews: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ratings',
        }
    },
    
    currentStatus: {
        type: String,
        enum:["pending","delivered","in-progress", "cancelled", "delayed"],
        default: "pending"
    },
     
    deliveryTimeline: {
        startedAt: Date,
        lastknownProgress: {
            type: String,
            enum: ["pending","delivered","in-progress"],
            required: true
        },
        completedAt: Date
    },
    
    isStalledAt: {
        type: Boolean,
        default: false
    },
    
    isDelayed: {
        type: Boolean,
    },
    
    eWayBill: {
        fileURL: {
            type: String,
            required: true
        },
        billNumber: {
            type: Number,
            required: true
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "",
            required: true
        },
        uploadedAt: Date
    },
    
    billty: {
        fileURL: {
            type: String,
            required: true
        },
        billNumber: {
            type : Number,
            required: true
        },
        issuedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "",
            required: true
        },
        issuedAt: Date
    },
});

const orderModel = mongoose.model("orders",ordersSchema);

export default orderModel;
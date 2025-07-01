import mongoose, { mongo } from "mongoose";

const ordersSchema = new  mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        re : 'company',
        required: true
    },
    
    transporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'transporter',
        required: true
    },
    
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'driver',     
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
            type: String,
            required: true
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
    
    status: {
        type: String,
        enum: ["pending","delivered","cancelled","paused","in-transit","delayed"],
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
        enum:["pending","delivered","in-progress", "cancelled"],
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

const ordersModel = mongoose.model("ordersModel",ordersSchema);
export default ordersModel;
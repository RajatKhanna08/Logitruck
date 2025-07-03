import mongoose from "mongoose";

// Define the schema for the orders collection in MongoDB
const ordersSchema = new  mongoose.Schema({
    // Reference to the customer (company) placing the order (required)
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        re : 'company', // Typo: should be 'ref'
        required: true
    },
    
    // Reference to the transporter handling the order (required)
    transporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'transporter',
        required: true
    },
    
    // Reference to the assigned driver (required)
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'driver',     
        required: true
    },
    
    // Pickup location details (address, latitude, longitude)
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
    
    // Drop locations (stop index, address, coordinates, contact, and instructions)
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
    
    // Scheduled, start, and end times for the order
    scheduleAt: Date,
    startTime: Date,
    endTime: Date,

    // Bidding related fields
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

    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "drivers"
    },

    finalBidAmount: {
        type: Number
    },
    
    // Status of the order
    status: {
        type: String,
        enum: ["pending","delivered","cancelled","paused","in-transit","delayed"],
        default: "pending"
    },
    
    // Load details (weight, volume, type, quantity, description)
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
    
    // Number of completed stops for the order
    completedStops: {
        type: Number,
        required: true
    },
    
    // Total distance for the order (in km)
    distance: {
        type: Number,
        required: true
    },
    
    // Total duration for the order (in hours/minutes)
    duration: {
        type: Number,
        required: true
    },
    
    // Fare for the order
    fare: {
        type: Number,
        required: true
    },
    
    // Payment mode and status
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
    
    // Current location of the order (for tracking)
    currentLocation: {
        latitude: {
            type: String,
        },
        longitude: {
            type: String
        },
        updatedAt: Date
    },
    
    // Tracking history for the order (location, timestamp, rating, review)
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
    
    // Rating given by the customer (reference)
    ratingByCustomer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company',
    },
    
    // Rating given by the driver (stars and review reference)
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
    
    // Current status of the order (pending, delivered, in-progress, cancelled)
    currentStatus: {
        type: String,
        enum:["pending","delivered","in-progress", "cancelled"],
        default: "pending"
    },
     
    // Delivery timeline (start, progress, completion)
    deliveryTimeline: {
        startedAt: Date,
        lastknownProgress: {
            type: String,
            enum: ["pending","delivered","in-progress"],
            required: true
        },
        completedAt: Date
    },
    
    // Indicates if the order is stalled
    isStalledAt: {
        type: Boolean,
        default: false
    },
    
    // Indicates if the order is delayed
    isDelayed: {
        type: Boolean,
    },
    
    // E-way bill details (file URL, bill number, uploaded by, uploaded at)
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
    
    // Billty details (file URL, bill number, issued by, issued at)
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

// Create the orders model using the schema
const ordersModel = mongoose.model("ordersModel",ordersSchema);

// Export the model for use in other parts of the application
export default ordersModel;
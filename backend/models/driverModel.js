import mongoose from "mongoose";

// Define the schema for the driver collection in MongoDB
const driverSchema = new  mongoose.Schema({
    // URL or path to the driver's profile image (required)
    profileImg: {
        type: String,
        required: true
    },

    // Reference to the associated transporter (required)
    transporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'transporters',
        required: true
    },

    // Driver's full name (required)
    fullName: {
        type: String,     
        required: true
    },

    // Driver's phone number (required)
    phone: {
        type: Number,
        required:true
    },

    // Driver's email address (required and unique)
    email: {
        type: String,
        required: true,
        unique: true
    },

    // Driver's password (required)
    password: {
        type: Number,
        required: true
    },

    // Documents related to the driver (all required and unique)
    documents: {
        idProof: {
            type: String,
            required: true,
            unique: true
        },
        license: {
            type: String,
            required: true,
            unique: true
        }
    },

    // Type of vehicle the driver operates (required)
    vehicleType: {
        type: String,
        required: true
    },

    // Current location of the driver (latitude and longitude, both required)
    currentLocation: {
        latitude: {
            type: String,
            required: true
        }, 
        longitude: {
            type: String,
            required: true
        }
    },

    // Availability status of the driver (required)
    availabilityStatus: {
        type: Boolean,
        required: true
    },

    // Reference to the driver's rating (required)
    rating: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ratings',
        required: true
    },

    // Reference to the assigned truck (required and unique)
    assignedTruckId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'trucks',
        required: true,
        unique: true
    },

    // Years of driving experience (required)
    experience: {
        type: Number,
        required: true
    },

    // Reference to the active booking/order (required)
    activeBookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders',
        required: true
    },

    // Total distance travelled by the driver in kilometers (required, defaults to 0)
    totalDistanceTravelledInKm: {
        type: Number,
        required: true,
        default: 0
    },

    // Total hours the driver has driven (required, defaults to 0)
    totalHoursDriven: {
        type: Number,
        required: true,
        default: 0
    },

    // Total days the driver has worked (required, defaults to 0)
    totalDaysWorked: {
        type: Number,
        required: true,
        default: 0
    },

    // Current mode of the driver (work or rest, required, defaults to "work mode")
    currentMode: {
        type: String,
        required: true,
        enum: ["work mode","rest mode"],
        default: "work mode"
    }, 

    // Timestamp of the last mode update (optional)
    lastModeUpdateTime: {
        type: Number
    },

    // Indicates if the driver is stalled (defaults to false)
    isStalled: {
        type: Boolean,
        default: false
    },

    // Last known location of the driver (latitude and longitude, both required)
    lastKnownLocation: {
        latitude: {
            type: String,
            required: true
        },
        longitude: {
            type: String,
            required: true
        }
    }
});

// Create the driver model using the schema
const driverModel = mongoose.model("driversModel",driverSchema);

// Export the model for use in other parts of the application
export default driverModel;
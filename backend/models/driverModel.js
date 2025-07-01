import mongoose from "mongoose";

const driverSchema = new  mongoose.Schema({
    profileImg: {
        type: String,
        required: true
    },

    transporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'transporters',
        required: true
    },

    fullName: {
        type: String,     
        required: true
    },

    phone: {
        type: Number,
        required:true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: Number,
        required: true
    },

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

    vehicleType: {
        type: String,
        required: true
    },

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

    availabilityStatus: {
        type: Boolean,
        required: true
    },

    rating: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ratings',
        required: true
    },

    assignedTruckId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'trucks',
        required: true,
        unique: true
    },

    experience: {
        type: Number,
        required: true
    },

    activeBookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders',
        required: true
    },

    totalDistanceTravelledInKm: {
        type: Number,
        required: true,
        default: 0
    },

    totalHoursDriven: {
        type: Number,
        required: true,
        default: 0
    },

    totalDaysWorked: {
        type: Number,
        required: true,
        default: 0
    },

    currentMode: {
        type: String,
        required: true,
        enum: ["work mode","rest mode"],
        default: "work mode"
    }, 

    lastModeUpdateTime: {
        type: Number
    },

    isStalled: {
        type: Boolean,
        default: false
    },

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

const driverModel = mongoose.model("driversModel",driverSchema);

export default driverModel;
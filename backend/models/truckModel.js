import mongoose from "mongoose";

// Define the schema for storing truck details
const trucksSchema = new  mongoose.Schema({
    // Reference to the transporter who owns the truck
    transporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'transporter',
        required: true
    },

    // Truck registration number
    registrationNumber: {
        type: String,
        required: true
    },

    // Brand of the truck
    brand: {
        type: String,     
        required: true
    },

    // Model of the truck
    model: {
        type: String,
        required: true
    },

    // Type of vehicle (e.g., open, container, trailer, etc.)
    vehicleType: {
        type: String,
        enum:[],
        default:""
    },

    // Capacity of the truck in kilograms
    capacityInKg: {
        type: Number,
        required : true
    },

    // Capacity of the truck in cubic meters
    capacityInCubicMeters: {
        type : Number,
        required: true
    },

    // Documents related to the truck
    documents: {
        rcBook: {
            type: String,
            required: true
        },
        insurance: {
            type: String,
        },
        pollutionCertificate: {
            type: String,
            required: true
        }
    },

    // Insurance validity date
    insuranceValidTill: {
        type: Date,
    },

    // Pollution certificate validity date
    pollutionCertificateValidTill: {
        type: Date,
        required: true
    },

    // Reference to the assigned driver
    assignedDriverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'drivers',
        required: true
    },

    // Status of the truck (active/inactive)
    isActive: {
        type: Boolean,
        required: true
    }
});

// Create and export the trucks model
const trucksModel = mongoose.model("trucksModel",trucksSchema);
export default trucksModel;
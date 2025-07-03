import mongoose from "mongoose";

// Define the schema for storing transporter details
const transporterSchema = new  mongoose.Schema({
    // Role of the user (should be 'transporter' for this schema)
    role: {
        type: String,
        enum: ["company","transporter","driver","admin"],
        default:"transporter",
        required:true
    },
    
    // Name of the transporter company
    transporterName: {
        type: String,
        required:true
    },
    
    // Name of the owner of the transporter company
    ownerName: {
        type: String,
        required:true
    },
    
    // Contact number of the transporter
    contactNo: {
        type: Number,
        required : true
    },
    
    // Email address (must be unique)
    email: {
        type: String,
        required: true,
        unique: true
    },
    
    // Password (hashed)
    password: {
        type: String,
        required: true
    },
    
    // Address details
    address: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required:true
        },
        pincode: {
            type: Number,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        landmark: {
            type: String,
            required: true
        }
    },
    
    // Unique registration number for the transporter
    registrationNumber: {
        type: String,
        required: true,
        unique: true
    },
    
    // Verification status of the transporter
    isVerified: {
        type: Boolean,
        default: false
    },
    
    // Documents required for verification
    documents: {
        idProof: {
            type: String,
            required: true
        },
        bussinesLicense: {
            type: String,
            required: true
        },
        gstCertificate: {
            type: String,
            required: true
        }
    },
    
    // Number of trucks in the fleet
    fleetSize: {
        type: Number,
        required: true
    },
    
    // Array of truck references owned by the transporter
    trucks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "truck"
        }
    ],
    
    // Average rating of the transporter
    rating: {
        type: Number
    },
    
    // Array of assigned booking/order references
    assignedBookings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "orders"
        }
    ]
});

// Create and export the transporter model
const transporterModel = mongoose.model('transporterModel',transporterSchema);
export default transporterModel;
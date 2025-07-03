import mongoose from "mongoose";

// Define the schema for the company collection in MongoDB
const companySchema = new  mongoose.Schema({
    // Role of the user, restricted to specific values, defaults to "company"
    role: {
        type: String,
        enum:["company","transporter","driver","admin"],
        default:"company",
        required:true
    },
    
    // Name of the company (required)
    companyName: {
        type: String,
        required: true
    },
    
    // Industry sector of the company (required)
    industry: {
        type: String,
        required: true
    },
    
    // Unique registration number for the company (required)
    registrationNumber: {
        type: String,
        required: true,
        unique: true
    },
    
    // Password for the company account (required)
    password: {
        type: String,
        required: true
    },
    
    // Contact person details (nested object, all fields required)
    contactPerson: {
        name: {
            type: String,
            required: true
        },
        phone : {
            type: Number,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    },
    
    // Company email address (required and unique)
    companyEmail: {
        type: String,
        required: true,
        unique: true
    },
    
    // Company phone number (required)
    companyPhone: {
        type: Number,
        required: true
    },
    
    // Company website (optional)
    website: {
        type: String,
    },
    
    // Address details (nested object, all fields required)
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
    
    // URL or path to the company logo (optional)
    logo: {
        type: String,
    },
    
    // Verification status of the company (defaults to false)
    isVerified: {
        type:Boolean,
        default: false
    },
    
    // Documents required for verification (all fields required)
    documents: {
        idProof: {
            type: String,
            required: true
        },
        bussinesLicense: { // Note: Typo, should be "businessLicense"
            type: String,
            required: true
        },
        gstCertificate: {
            type: String,
            required: true
        }
    }
});

// Create the company model using the schema
const companyModel = mongoose.model('companyModel',companySchema);

// Export the model for use in other parts of the application
export default companyModel;
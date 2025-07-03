import mongoose from "mongoose";

// Define the schema for the admin collection in MongoDB
const adminSchema = new mongoose.Schema({
    // Admin's full name (required)
    fullname: {
        type: String,
        required: true
    },

    // Admin's email address (required)
    email: {
        type: String,
        required: true
    },

    // Admin's phone number (required)
    phone: {
        type: Number,
        required: true
    },

    // Admin's password (required)
    password: {
        type: String,
        required: true
    },

    // Role of the user, restricted to specific values, defaults to "admin"
    role: {
        type: String,
        enum: ["company", "transporter", "driver", "admin"],
        default: "admin",
        required: true
    },

    // Permissions object containing various admin privileges, all default to true
    permissions: {
        manageUsers: {
            type: Boolean,
            default: true
        },
        manageCompanies: {
            type: Boolean,
            default: true
        },
        manageTransporters: {
            type: Boolean,
            default: true
        },
        manageDrivers: {
            type: Boolean,
            default: true
        },
        manageTrucks: {
            type: Boolean,
            default: true
        },
        manageOrders: {
            type: Boolean,
            default: true
        },
        manageReviews: {
            type: Boolean,
            default: true
        },
        viewAnalytics: {
            type: Boolean,
            default: true
        },
        manageSubscriptions: {
            type: Boolean,
            default: true
        },
        manageCommunity: {
            type: Boolean,
            default: true
        }
    },

    // Date of the last login (optional)
    lasLogin: Date
});

// Create the admin model using the schema
const adminModel = mongoose.model('admin', adminSchema);

// Export the model for use in other parts of the application
export default adminModel;
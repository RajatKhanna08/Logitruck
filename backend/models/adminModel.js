import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },

    email: {
        type:String,
        required: true
    },

    phone: {
        type: Number,
        required: true
    },

    password: {
        type:String,
        required: true
    },

    role :{
        type: String,
        enum: ["company","transporter","driver","admin"],
        default: "admin",
        required: true
    },

    permissions: {
        manageUsers: {
            type:Boolean,
            default:true
        },
        manageCompanies: {
            type:Boolean,
            default:true
        },
         manageTransporters: {
            type:Boolean,
            default:true
        },
         manageDrivers: {
            type:Boolean,
            default:true
        },
         manageTrucks: {
            type:Boolean,
            default:true
        },
         manageOrders: {
            type:Boolean,
            default:true
        },
         manageReviews: {
            type:Boolean,
            default:true
        },
        viewAnalytics: {
            type:Boolean,
            default:true
        },
        manageSubscriptions: {
            type:Boolean,
            default:true
        },
        manageCommunity: {
            type:Boolean,
            default:true
        }
    },

    lasLogin: Date
});

const adminModel = mongoose.model('admin', adminSchema);
export default adminModel;
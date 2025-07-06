import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    phone: {
        type: Number,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["company", "transporter", "driver", "admin"],
        default: "admin"
    },

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

    lastLogin: {
        type: Date,
        default: null
    }
});

adminSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({ _id: this._id, role: this.role }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });
    return token;
}

adminSchema.methods.comparePassword = function(enteredPassword){
    return bcrypt.compare(enteredPassword, this.password);
}

adminSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password, 12);
}

const adminModel = mongoose.model('admin', adminSchema);

export default adminModel;
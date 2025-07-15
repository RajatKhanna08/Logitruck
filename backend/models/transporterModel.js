import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";

const transporterSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["company","transporter","driver","admin"],
        default: "transporter",
        required: true
    },
    
    transporterName: {
        type: String,
        required:true
    },
    
    ownerName: {
        type: String,
        required:true
    },

    profileImg: {
        type: String
    },
    
    contactNo: {
        type: Number,
        required : true
    },
    
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, "Please enter a valid email address"]
    },
    
    password: {
        type: String,
        required: true
    },
    
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
    
    registrationNumber: {
        type: String,
        required: true,
        unique: true
    },
    
    isVerified: {
        type: Boolean,
        default: false
    },

    isBlocked: {
        type: Boolean,
        default: false
    },
    
    documents: {
        idProof: {
            type: String,
            required: true
        },
        businessLicense: {
            type: String,
            required: true
        },
        gstCertificate: {
            type: String,
            required: true
        }
    },
    
    fleetSize: {
        type: Number,
        default: 0
    },
    
    trucks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "trucks"
        }
    ],
    
    rating: {
        type: Number,
        default: 0
    },
    
    assignedBookings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "orders"
        }
    ]
}, { timestamps: true });

transporterSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({ _id: this._id, role: this.role }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });
    return token;
}

transporterSchema.methods.comparePassword = function(enteredPassword){
    return bcrypt.compare(enteredPassword, this.password);
}

transporterSchema.statics.hashPassword = async function(password){
    return bcrypt.hash(password, 12);
}

const transporterModel = mongoose.model('transporter',transporterSchema);

export default transporterModel;
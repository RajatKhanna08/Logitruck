import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";

const driverSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["driver", "company", "transporter", "admin"],
        default: "driver",
        required: true
    },
    
    profileImg: {
        type: String,
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
        type: String,
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

    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
            default: [0, 0],
            index: '2dsphere'
        }
    },

    availabilityStatus: {
        type: Boolean,
        required: true,
        default: true
    },

    rating: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ratings',
    },

    assignedTruckId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'trucks',
    },

    experience: {
        type: Number,
        required: true
    },

    activeBookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders',
    },

    totalDistanceTravelledInKm: {
        type: Number,
        default: 0
    },

    totalHoursDriven: {
        type: Number,
        default: 0
    },

    totalDaysWorked: {
        type: Number,
        default: 0
    },

    currentMode: {
        type: String,
        required: true,
        enum: ["work_mode","rest_mode"],
        default: "work_mode"
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
        },
        longitude: {
            type: String,
        }
    },
    kataParchiAfter: {
        fileURL: {
            type: String,
        },
        uploadedAt : {
            type: Date,
        }
    }
}, { timestamps: true });

driverSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({ _id: this._id, role: this.role }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });
    return token;
}

driverSchema.methods.comparePassword = function(enteredPassword){
    return bcrypt.compare(enteredPassword, this.password);
}

driverSchema.statics.hashPassword = async function(password){
    return bcrypt.hash(password, 12);
}

const driverModel = mongoose.model("drivers", driverSchema);

export default driverModel;
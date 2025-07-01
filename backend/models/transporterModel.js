import mongoose from "mongoose";

const transporterSchema = new  mongoose.Schema({
    role : {
        type: String,
        enum:["company","transporter","driver","admin"],
        default:"transporter",
        required:true
    },
    transporterName : {
        type: String,
        required:true
    },
    ownerName : {
        type: String,
        required:true
    },
    contactNo : {
        type: Number,
        required : true
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
    registrationNumber : {
        type: String,
        required: true,
        unique: true
    },
    isVerified : {
        type: Boolean,
        default: false
    },
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
    fleetSize : {
        type: Number,
        required: true
    },
    trucks : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "truck"
        }
    ],
    rating : {
        type: Number
    },
    assignedBookings : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "orders"
        }
    ]
});

const transporterModel = mongoose.model('transporterModel',transporterSchema);
export default transporterModel;
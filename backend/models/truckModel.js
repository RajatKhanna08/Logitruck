import mongoose from "mongoose";

const trucksSchema = new  mongoose.Schema({
    transporterId : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'transporter',
        required: true
    },
    registrationNumber : {
        type: String,
        required: true
    },
    brand : {
        type: String,     
        required: true
    },
    model : {
        type: String,
        required:true
    },
    vehicleType : {
        type: String,
        enum:[],
        default:""
    },
    capacityInKg : {
        type: Number,
        required : true
    },
    capacityInCubicMeters : {
        type : Number,
        required: true
    },
    documents : {
        rcBook : {
            type : String,
            required: true
        },
        insurance : {
            type : String,
        },
        pollutionCertificate : {
            type: String,
            required:true
        }
    },
    insuranceValidTill : {
        type : Date,
    },
    pollutionCertificateValidTill : {
        type: Date,
        required : true
    },
    assignedDriverId : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'drivers',
        required: true
    },
    isActive : {
        type: Boolean,
        required: true
    }
});

const trucksModel = mongoose.model("trucksModel",trucksSchema);
export default trucksModel;
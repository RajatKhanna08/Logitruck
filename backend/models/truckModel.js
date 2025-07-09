import mongoose from 'mongoose';

const trucksSchema = new mongoose.Schema({
    transporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'transporter',
        required: true
    },
  
    registrationNumber: {
        type: String,
        required: true,
        unique: true
    },
  
    brand: {
        type: String,
        required: true
    },
  
    model: {
        type: String,
        required: true
    },
  
    vehicleType: {
        type: String,
        enum: ['open', 'container', 'tipper', 'flatbed', 'tanker', 'reefer', 'trailer', 'mini-truck'],
        required: true
    },
  
    capacityInTon: {
        type: Number,
        required: true
    },
  
    capacityInCubicMeters: {
        type: Number,
        required: true
    },
  
    documents: {
        rcBook: {
            type: String,
            required: true
        },
        insurance: {
            type: String
        },
        pollutionCertificate: {
            type: String,
            required: true
        }
    },
  
    insuranceValidTill: Date,
  
    pollutionCertificateValidTill: {
        type: Date,
        required: true
    },
  
    assignedDriverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'drivers',
        required: true
    },
  
    status: {
        type: String,
        enum: ['inactive', 'active', 'blocked'],
        default: 'active'
    }
}, { timestamps: true });

const truckModel = mongoose.model("trucks", trucksSchema);

export default truckModel;
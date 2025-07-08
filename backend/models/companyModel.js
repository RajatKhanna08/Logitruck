import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";

const companySchema = new  mongoose.Schema({
    role: {
        type: String,
        enum:["company","transporter","driver","admin"],
        default:"company",
        required:true
    },
    
    companyName: {
        type: String,
        required: true
    },
    
    industry: {
        type: String,
        required: true
    },
    
    registrationNumber: {
        type: String,
        required: true,
        unique: true
    },
    
    password: {
        type: String,
        required: true
    },
    
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
    
    companyEmail: {
        type: String,
        required: true,
        unique: true
    },
    
    companyPhone: {
        type: Number,
        required: true
    },
    
    website: {
        type: String,
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
    
    logo: {
        type: String,
    },
    
    isVerified: {
        type:Boolean,
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
        businesLicense: {
            type: String,
            required: true
        },
        gstCertificate: {
            type: String,
            required: true
        }
    }
});

companySchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password, 12);
}

companySchema.methods.comparePassword = function(enteredPassword){
    return bcrypt.compare(enteredPassword, this.password);
}

companySchema.methods.generateAuthToken = function(){
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });
}

const companyModel = mongoose.model('company',companySchema);

export default companyModel;
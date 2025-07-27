import mongoose from "mongoose";

const ratingSchema = new  mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders'
    },
    
    reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'reviewerRole',
    },
    
    reviewerRole: {
        type: String,
        enum: ["company","transporter","driver","admin"],
        default: "company",
        required: true
    },
    
    reviewedEntityId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'reviewedEntityType',
        required:true
    },
    
    reviewedEntityType: {
        type: String,
        enum: ["admin","company","transporter","driver"],
        required:true
    },
    
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    
    reviewText: {
        type: String,
        maxLength: 100
    }
}, { timestamps: true });

const reviewModel = mongoose.model("review",ratingSchema);

export default reviewModel;
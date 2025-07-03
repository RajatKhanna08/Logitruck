import mongoose from "mongoose";

// Define the schema for storing ratings and reviews
const ratingSchema = new  mongoose.Schema({
    // Reference to the related booking/order
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders'
    },
    
    // ID of the user who is giving the review
    reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company'
    },
    
    // Role of the reviewer (e.g., company, transporter, driver, admin)
    reviewerRole: {
        type: String,
        enum: ["company","transporter","driver","admin"],
        default: "company",
        required: true
    },
    
    // ID of the entity being reviewed (dynamic reference)
    reviewedEntityId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'reviewedEntityType',
        required:true
    },
    
    // Type of the entity being reviewed (used for dynamic reference)
    reviewedEntityType: {
        type: String,
        enum: ["admin","company","transporter","driver"],
        required:true
    },
    
    // Numeric rating value (0 to 5)
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    
    // Optional review text (max 100 characters)
    reviewText: {
        type: String,
        maxLength: 100
    }
});

// Create and export the rating model
const ratingModel = mongoose.model("ratingModel",ratingSchema);
export default ratingModel;
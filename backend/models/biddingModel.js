import mongoose from "mongoose";

// Schema for a single bid entry
const bidSchema = new mongoose.Schema({
  transporterId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'transporter'
    },
    
  truckId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'trucks',
    required: true
    },
  
  bidAmount: {
    type: Number,
    required: true
    },
  
  message: {
    type: String
    },
  
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
    },
  
  createdAt: {
    type: Date,
    default: Date.now
    }
  
},{ _id: true });  // Each bid gets its own unique _id

// Main Bidding Schema
const biddingSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'orders',
    unique: true
  },

  bids: {
    type: [bidSchema],
    validate: {
      validator: function(val) {
        return val.length <= 10;
      },
      message: 'Exceeded the maximum limit of 10 bids per order.'
    }
  },

  fairPrice: {
    type: Number,
    required: true
  },

  isClosed: {
    type: Boolean,
    default: false
  },

  acceptedBid: {
    transporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'transporter'
      },
      
    truckId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'trucks'
      },
    
    bidAmount: {
      type: Number
      },
    
    message: {
      type: String
      }
    
  },

  createdAt: {
    type: Date,
    default: Date.now()
  }
});

// Export the model
const biddingModel = mongoose.model("bidding", biddingSchema);
export default biddingModel;
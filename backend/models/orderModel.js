import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'company',
    required: true
  },

  isMultiStop: { type: Boolean, default: false },

  pickupLocation: {
    address: { type: String, required: true },
    coordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true } // [lng, lat]
    }
  },

  dropLocations: [
    {
      stopIndex: Number,
      address: { type: String, required: true },
      coordinates: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true }
      },
      contactName: { type: String, required: true },
      contactPhone: { type: Number, required: true },
      instructions: { type: String, required: true }
    }
  ],

  routeInfo: {
    estimatedDistance: String,
    estimatedDuration: String,
    polyline: [[Number]]
  },

  scheduleAt: Date,
  startTime: Date,
  endTime: Date,

  urgency: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low"
  },

  bodyTypeMultiplier: { type: Number, default: 1 },
  sizeCategoryMultiplier: { type: Number, default: 1 },

  isBiddingEnabled: { type: Boolean, default: true },
  biddingStatus: {
    type: String,
    enum: ["open", "closed", "accepted"],
    default: "open"
  },
  biddingExpiresAt: Date,

  acceptedTransporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "transporter"
  },
  acceptedTruckId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "trucks"
  },
  acceptedDriverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "drivers"
  },

  finalBidAmount: Number,

  status: {
    type: String,
    enum: ["pending", "delivered", "cancelled", "paused", "in_transit", "delayed"],
    default: "pending"
  },
  currentStatus: {
    type: String,
    enum: ["pending", "delivered", "in-progress", "cancelled", "delayed"],
    default: "pending"
  },

  loadDetails: {
    weightInKg: { type: Number, required: true },
    volumeInCubicMeters: { type: Number, required: true },
    type: {
      type: String,
      enum: ["general", "fragile", "perishable", "bulk", "electronics", "furniture", "others"],
      default: "general"
    },
    quantity: { type: Number, required: true },
    description: { type: String, required: true }
  },

  completedStops: { type: Number, required: true },
  distance: { type: Number, required: true },
  duration: { type: Number, required: true },
  fare: { type: Number, required: true },

  paymentMode: {
    type: String,
    enum: ["UPI", "Credit Card", "Net-Banking"],
    default: "UPI"
  },
  paymentStatus: {
    type: String,
    enum: ["paid", "unpaid", "failed"],
    default: "unpaid"
  },
  advancePaid: { type: Number, default: 0 },
  advanceDiscount: { type: Number, default: 0 },

  isRefundRequested: { type: Boolean, default: false },
  refundRequestedAt: Date,
  refundReason: String,
  refundStatus: {
    type: String,
    enum: ["pending", "approved", "rejected", "not_applicable"],
    default: "not_applicable"
  },
  refundAmount: { type: Number, default: 0 },
  refundedAt: Date,
  isRefunded: { type: Boolean, default: false },

  currentLocation: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number]
    },
    updatedAt: Date
  },

  trackingHistory: [
    {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      timeStamp: Date
    }
  ],

  deliveryRemarks: [ 
    {
      byRole: { type: String, enum: ["driver", "company", "admin"] },
      message: String,
      timeStamp: Date
    }
  ],

  stars: { type: Number, min: 1, max: 5 },
  review: String,
  ratingByCustomer: { type: mongoose.Schema.Types.ObjectId, ref: 'company' },
  ratingByDriver: {
    stars: { type: Number },
    reviews: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ratings'
    }
  },

  deliveryTimeline: {
    startedAt: Date,
    lastknownProgress: {
      type: String,
      enum: ["pending", "delivered", "in-progress"],
      required: true
    },
    completedAt: Date
  },

  tripStatus: {
    type: String,
    enum: [
      "Heading to Pickup",
      "Arrived at Pickup",
      "Loading",
      "In Transit",
      "At Stop",
      "Delivered",
      "Delayed",
      "Cancelled"
    ],
    default: "Heading to Pickup"
  },

  currentStopIndex: { type: Number, default: 0 },
  lastPhaseUpdatedAt: { type: Date, default: Date.now },
  isStalledAt: { type: Boolean, default: false },
  isDelayed: { type: Boolean },

  documents: {
    eWayBill: {
      fileURL: String,
      billNumber: Number,
      uploadedAt: Date,
      extensionRequest: {
        requestedAt: Date,
        reason: String,
        requestedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "drivers"
        },
        newExpiryDate: Date
      }
    },
    bilty: {
      fileURL: String,
      billNumber: Number,
      issuedAt: Date
    },
    kataParchiBefore: {
      fileURL: String,
      uploadedAt: Date
    },
    kataParchiAfter: {
      fileURL: String,
      uploadedAt: Date
    },
    receivingDocument: {
      fileURL: String,
      uploadedAt: Date
    }
  }

}, { timestamps: true });

orderSchema.index({ currentLocation: "2dsphere" }); 

const orderModel = mongoose.model("orders", orderSchema);
export default orderModel;
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["company", "driver", "transporter", "admin"],
    required: true,
  },

  type: {
    type: String,
    enum: [
      "general", "status", "warning", "rest-mode", "stall-alert", "task",
      "alert", "info", "activity","document"
    ],
    default: "status"
  },

  title: {
    type: String,
    required: true,
    trim: true,
  },

  message: {
    type: String,
    required: true,
    trim: true,
  },

  relatedBookingId: {
    type: String,
    default: null, 
  },

  relatedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'role',
  },

  isRead: {
    type: Boolean,
    default: false,
  },

  deliveryMode: {
    type: String,
    enum: ["pending", "accepted", "ongoing", "completed", "cancelled"],
    default: "pending",
  },

  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  }

}, {
  timestamps: true,
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;

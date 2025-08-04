import notificationModel from '../models/notificationModel.js';
import mongoose from 'mongoose';
import { sendNotification } from '../utils/sendNotification.js';

const getUserId = (req) => req.user?._id || req.user?.id || req.query.userId;

export const getAllNotificationsController = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(400).json({ message: "Invalid user" });

    const limit = parseInt(req.query.limit) || 100;

    const notifications = await notificationModel
      .find({ relatedUserId: userId })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({ success: true, notifications });
  } catch (err) {
    console.log("Error fetching notifications", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAllNotificationsController = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(400).json({ success: false, message: 'User ID is required.' });

    await notificationModel.deleteMany({ relatedUserId: new mongoose.Types.ObjectId(userId) });

    res.status(200).json({ success: true, message: 'All notifications deleted' });
  } catch (error) {
    console.error('Error deleting notifications:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const sendNotificationController = async (req, res) => {
  try {
    const {
      role,
      relatedUserId,
      relatedBookingId,
      title,
      message,
      type = 'status',
      deliveryMode = 'pending',
      metadata = {},
    } = req.body;

    const allowedTypes = ['status', 'activity', 'info'];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid notification type' });
    }

    if (!role || !relatedUserId || !title || !message) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const notification = await sendNotification({
      role,
      relatedUserId,
      relatedBookingId,
      title,
      message,
      type,
      deliveryMode,
      metadata,
    });

    res.status(200).json({ success: true, message: 'Notification sent successfully', notification });
  } catch (error) {
    console.error('Error sending notification:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
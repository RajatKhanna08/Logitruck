import Notification from '../models/notificationModel.js';

export const sendNotification = async ({
  role,
  relatedUserId = null,
  relatedBookingId = null,  
  title,
  message,
  type = 'status',
  deliveryMode = 'pending',
  metadata = {},
}) => {
  try {
    if (!role || !title || !message || !relatedUserId) {
      throw new Error('Missing required fields for notification');
    }

    const notification = new Notification({
      role,
      relatedUserId,
      relatedBookingId, 
      title,
      message,
      type,
      deliveryMode,
      metadata,
    });

    console.log("📦 Creating Notification:", notification);

    await notification.save();

    console.log("✅ Notification saved successfully:", notification);
    return notification;

  } catch (error) {
    console.error('❌ Error sending notification:', error.message);
    return { error: true, message: error.message };
  }
};

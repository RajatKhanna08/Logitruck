import notificationModel from '../models/notificationModel.js';

export const getAllNotificationsController = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await notificationModel.find({ relatedUserId: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (err) {
    console.error("Error in getAllNotificationsController:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteAllNotificationsController = async (req, res) => {
  try {
    const userId = req.user.id;
    await notificationModel.deleteMany({ relatedUserId: userId });
    res.status(200).json({ success: true, message: "All notifications deleted." });
  } catch (err) {
    console.error("Error in deleteAllNotificationsController:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
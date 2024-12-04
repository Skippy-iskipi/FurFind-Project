import { Notification } from '../models/notification.model.js';

export const createNotification = async (userId, type, message, relatedId) => {
    try {
        const notification = new Notification({
            userId,
            type,
            message,
            relatedId,
            read: false
        });

        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

export const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.userId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            notifications
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching notifications",
            error: error.message
        });
    }
};

export const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.notificationId,
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        res.status(200).json({
            success: true,
            notification
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            success: false,
            message: "Error marking notification as read",
            error: error.message
        });
    }
}; 
import Message from '../models/message.model.js';

export const getUnreadMessageCount = async (req, res) => {
    try {
        const userId = req.userId;
        
        const count = await Message.countDocuments({
            recipient: userId,
            read: false
        }).exec();

        res.status(200).json({
            success: true,
            unreadCount: count
        });
    } catch (error) {
        console.error('Error getting unread message count:', error);
        res.status(500).json({
            success: false,
            message: "Error getting unread message count",
            error: error.message
        });
    }
};

export const markAllMessagesAsRead = async (req, res) => {
    try {
        const userId = req.userId;
        
        await Message.updateMany(
            {
                recipient: userId,
                read: false
            },
            { read: true }
        );

        res.status(200).json({
            success: true,
            message: "All messages marked as read"
        });
    } catch (error) {
        console.error('Error marking all messages as read:', error);
        res.status(500).json({
            success: false,
            message: "Error marking messages as read",
            error: error.message
        });
    }
};

export const getUnreadMessages = async (req, res) => {
    try {
        const userId = req.userId;
        
        const unreadMessages = await Message.find({
            recipient: userId,
            read: false
        })
        .populate('sender', 'name profilePicture')
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            messages: unreadMessages
        });
    } catch (error) {
        console.error('Error getting unread messages:', error);
        res.status(500).json({
            success: false,
            message: "Error getting unread messages",
            error: error.message
        });
    }
}; 
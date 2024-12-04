import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: [
            'VERIFICATION_STATUS',
            'APPLICATION_STATUS',
            'APPLICATION_RECEIVED',
            'ADOPTION_STATUS',
            'APPLICATION_VIEWED',
            'RATING_RECEIVED',
            'NEW_MESSAGE',
            'MESSAGE_RECEIVED'
        ]
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    }
}, { timestamps: true });

export const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
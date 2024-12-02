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
        enum: ['ADOPTION_STATUS', 'APPLICATION_RECEIVED', 'VERIFICATION_STATUS', 'RATING_RECEIVED', 'APPLICATION_VIEWED']
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
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Notification = mongoose.model('Notification', notificationSchema);
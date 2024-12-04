import mongoose from 'mongoose';

const RatingSchema = new mongoose.Schema({
    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdoptionApplication',
        required: true
    },
    adopterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    feedback: {
        type: String,
        required: true,
        trim: true
    },
    stars: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Rating', RatingSchema);

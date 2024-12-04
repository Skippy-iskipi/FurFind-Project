import mongoose from "mongoose";

const userPreferenceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    preferences: {
        petType: {
            type: String,
            enum: ['Both', 'Dog', 'Cat'],
            default: 'Both'
        },
        agePreferences: [{
            type: String,
            enum: ['Baby', 'Young', 'Teenager', 'Adult']
        }],
        location: {
            type: String
        }
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

export const UserPreference = mongoose.model('UserPreference', userPreferenceSchema); 
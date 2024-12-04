import mongoose from 'mongoose';

const adoptionApplicationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
    address: { type: String, required: true },
    contactNumber: { type: String, required: true },
    occupation: { type: String, required: true },
    emergencyFirstName: { type: String, required: true },
    emergencyLastName: { type: String, required: true },
    emergencyAddress: { type: String, required: true },
    emergencyContact: { type: String, required: true },
    typeOfResidence: { type: String, required: true },
    residenceOwnership: { type: String, required: true },
    hadPetsBefore: { type: String, required: true },
    hasCurrentPets: { type: String, required: true },
    petCareDescription: { type: String, required: true },
    governmentId: { type: String, required: true },
    proofOfResidence: { type: String, required: true },
    proofOfIncome: { type: String, required: true },
    certifyInformation: { type: Boolean, required: true },
    status: { type: String, default: 'Pending' },
    completedAt: {
        type: Date,
        default: null
    },
    rating: {
        type: Number,
        default: null
    }
}, { timestamps: true });

export const AdoptionApplication = mongoose.model('AdoptionApplication', adoptionApplicationSchema);
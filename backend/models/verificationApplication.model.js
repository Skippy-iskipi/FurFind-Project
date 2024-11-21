import mongoose from 'mongoose';

// Pet Owner Schema
const petOwnerSchema = new mongoose.Schema({
    address: { type: String, required: true },
    contactNumber: { type: String, required: true },
    occupation: { type: String, required: true },
    emergencyFirstName: { type: String, required: true },
    emergencyLastName: { type: String, required: true },
    emergencyAddress: { type: String, required: true },
    emergencyContact: { type: String, required: true },
    petCareExperience: { type: String, required: true },
    certifyInformation: { type: Boolean, required: true },
    agreeToGuidelines: { type: Boolean, required: true },
    governmentId: { type: String, required: true },
    proofOfResidence: { type: String, required: true },
});

// Shelter Schema
const shelterSchema = new mongoose.Schema({
    organizationName: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    yearEstablished: { type: String, required: true },
    shelterType: { type: String, required: true },
    shelterAddress: { type: String, required: true },
    shelterContact: { type: String, required: true },
    organizationalBackground: { type: String, required: true },
    certifyInformation: { type: Boolean, required: true },
    agreeToGuidelines: { type: Boolean, required: true },
    registrationCertificate: { type: String, required: true },
    facilityPhotos: [{ type: String, required: true }],
});

// Main Verification Application Schema
const verificationApplicationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Pet Owner', 'Shelter'],
        required: true,
    },
    formData: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
});

const VerificationApplication = mongoose.model('VerificationApplication', verificationApplicationSchema);

// Create a model using the petOwnerSchema
const PetOwner = mongoose.model('PetOwner', petOwnerSchema);

// Create a model using the shelterSchema
const Shelter = mongoose.model('Shelter', shelterSchema);

export { VerificationApplication, PetOwner, Shelter };

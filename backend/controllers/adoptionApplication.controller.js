import { AdoptionApplication } from '../models/adoptionApplication.model.js';
import Pet from "../models/pet.model.js";
import { User } from '../models/user.model.js';
import { createNotification } from './notification.controller.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

export const submitAdoptionApplication = [
    upload.fields([
        { name: 'governmentId', maxCount: 1 },
        { name: 'proofOfResidence', maxCount: 1 },
        { name: 'proofOfIncome', maxCount: 1 },
    ]),
    async (req, res) => {
        try {
            const { userId, petId, ...formData } = req.body;

            if (!userId || !petId) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'User ID and Pet ID are required' 
                });
            }

            // Get pet and user details for notifications
            const [pet, adopter] = await Promise.all([
                Pet.findById(petId).populate('userId', 'name'),
                User.findById(userId).select('name')
            ]);

            if (!pet) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Pet not found" 
                });
            }

            // Handle file uploads
            if (req.files.governmentId) {
                formData.governmentId = req.files.governmentId[0].path;
            }
            if (req.files.proofOfResidence) {
                formData.proofOfResidence = req.files.proofOfResidence[0].path;
            }
            if (req.files.proofOfIncome) {
                formData.proofOfIncome = req.files.proofOfIncome[0].path;
            }

            // Create and save the adoption application
            const adoptionApplication = new AdoptionApplication({
                userId,
                petId,
                ...formData,
            });

            await adoptionApplication.save();

            // Create notification for the pet owner/shelter
            await createNotification(
                pet.userId._id,
                'APPLICATION_RECEIVED',
                `${adopter.name} submitted an adoption request for ${pet.name}`,
                adoptionApplication._id
            );

            // Create notification for the adopter
            await createNotification(
                userId,
                'ADOPTION_STATUS',
                `Your adoption request for ${pet.name} has been submitted successfully`,
                adoptionApplication._id
            );

            res.status(201).json({ 
                success: true, 
                message: 'Adoption application submitted successfully' 
            });

        } catch (error) {
            console.error('Error saving application:', error);
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }
];

export const rejectAdoptionApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;

        // Find the application and update its status
        const application = await AdoptionApplication.findByIdAndUpdate(
            applicationId,
            { status: 'Rejected' },
            { new: true }
        ).populate('userId', 'name');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        // Create a notification for the adopter
        await createNotification(
            application.userId._id,
            'ADOPTION_STATUS',
            `Your adoption application for ${application.petId} has been rejected.`,
            application._id
        );

        res.status(200).json({
            success: true,
            message: "Adoption application rejected",
            application
        });

    } catch (error) {
        console.error('Error rejecting adoption application:', error);
        res.status(500).json({
            success: false,
            message: "Error rejecting application",
            error: error.message
        });
    }
};
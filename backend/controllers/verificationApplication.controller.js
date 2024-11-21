import { VerificationApplication } from '../models/verificationApplication.model.js';
import { User } from '../models/user.model.js';
import multer from 'multer';

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

export const submitVerificationApplication = [
    upload.fields([
        { name: 'governmentId', maxCount: 1 },
        { name: 'proofOfResidence', maxCount: 1 },
        { name: 'registrationCertificate', maxCount: 1 },
        { name: 'facilityPhotos', maxCount: 10 },
    ]),
    async (req, res) => {
        try {
            const { type, userId, ...formData } = req.body;

            if (!type || !formData || !userId) {
                console.error('Missing fields:', { type, formData, userId });
                return res.status(400).json({ success: false, message: 'All fields are required' });
            }

            // Include file paths in formData
            if (req.files.governmentId) {
                formData.governmentId = req.files.governmentId[0].path;
            }
            if (req.files.proofOfResidence) {
                formData.proofOfResidence = req.files.proofOfResidence[0].path;
            }

            if (req.files.registrationCertificate) {
                formData.registrationCertificate = req.files.registrationCertificate[0].path;
            }
            if (req.files.facilityPhotos) {
                formData.facilityPhotos = req.files.facilityPhotos.map(file => file.path);
            }

            const verificationApplication = new VerificationApplication({
                type,
                formData,
                userId,
            });

            await verificationApplication.save();

            res.status(201).json({ success: true, message: 'Verification application submitted successfully' });
        } catch (error) {
            console.error('Error saving application:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
];

export const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.body;

        // Find the verification application for the user
        const application = await VerificationApplication.findOne({ userId });

        if (!application) {
            return res.status(404).json({ success: false, message: 'Verification application not found' });
        }

        // Determine the new role based on the application type
        let newRole;
        if (application.type === 'Pet Owner') {
            newRole = 'Pet Owner';
        } else if (application.type === 'Shelter') {
            newRole = 'Shelter';
        } else {
            return res.status(400).json({ success: false, message: 'Invalid application type' });
        }

        // Update the user's role
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.role = newRole;
        await user.save();

        res.status(200).json({ success: true, message: 'User role updated successfully', role: newRole });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}; 
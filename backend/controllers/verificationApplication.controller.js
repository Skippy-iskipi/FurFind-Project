import { VerificationApplication } from '../models/verificationApplication.model.js';
import { User } from '../models/user.model.js';
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

export const submitVerificationApplication = [
    upload.fields([
        { name: 'governmentId', maxCount: 1 },
        { name: 'proofOfResidence', maxCount: 1 },
        { name: 'registrationCertificate', maxCount: 1 },
        { name: 'facilityPhotos', maxCount: 10 },
    ]),
    async (req, res) => {
        try {
            const { type, userId, googleId, ...formData } = req.body;

            // Find the user either by regular ID or Google ID
            let user;
            if (googleId) {
                user = await User.findOne({ googleId: googleId });
            } else {
                user = await User.findById(userId);
            }

            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
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
                userId: user._id,
            });

            await verificationApplication.save();

            res.status(201).json({ success: true, message: 'Verification application submitted successfully' });
        } catch (error) {
            console.error('Error saving application:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
];

// Approve Verification Application
export const approveVerificationApplication = async (req, res) => {
    const { applicationId } = req.params;

    try {
        const application = await VerificationApplication.findById(applicationId);
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        // Update application status
        application.status = 'approved';
        await application.save();

        // Update user role based on application type
        const user = await User.findById(application.userId);
        if (user) {
            user.role = application.type; // Assuming type is either 'Pet Owner' or 'Shelter'
            await user.save();
        }

        res.status(200).json({ success: true, message: 'Application approved successfully' });
    } catch (error) {
        console.error('Error approving application:', error);
        res.status(500).json({ success: false, message: 'Error approving application', error: error.message });
    }
};

// Reject Verification Application
export const rejectVerificationApplication = async (req, res) => {
    const { applicationId } = req.params;

    try {
        const application = await VerificationApplication.findById(applicationId);
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        // Update application status
        application.status = 'rejected';
        await application.save();

        res.status(200).json({ success: true, message: 'Application rejected successfully' });
    } catch (error) {
        console.error('Error rejecting application:', error);
        res.status(500).json({ success: false, message: 'Error rejecting application', error: error.message });
    }
};

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
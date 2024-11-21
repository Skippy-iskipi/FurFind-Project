import { VerificationApplication } from '../models/verificationApplication.model.js';
import { User } from '../models/user.model.js';

export const submitVerificationApplication = async (req, res) => {
    try {
        console.log('Request Body:', req.body);

        const { type, formData, userId } = req.body;

        if (!type || !formData || !userId) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Create a new verification application
        const verificationApplication = new VerificationApplication({
            type,
            formData,
            userId,
        });

        // Save to the database
        await verificationApplication.save();

        res.status(201).json({ success: true, message: 'Verification application submitted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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
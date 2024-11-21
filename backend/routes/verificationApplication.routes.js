import express from 'express';
import { submitVerificationApplication, updateUserRole } from '../controllers/verificationApplication.controller.js';

const router = express.Router();

// Route to submit a verification application
router.post('/submit', submitVerificationApplication);

// Route to update user role based on verification application type
router.post('/update-role', updateUserRole);

export default router; 
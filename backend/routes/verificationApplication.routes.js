import express from 'express';
import { submitVerificationApplication, updateUserRole } from '../controllers/verificationApplication.controller.js';

const router = express.Router();

router.post('/submit', submitVerificationApplication);
router.post('/update-role', updateUserRole);

export default router;

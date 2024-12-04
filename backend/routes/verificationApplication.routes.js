import express from 'express';
import { submitVerificationApplication, approveVerificationApplication, rejectVerificationApplication } from '../controllers/verificationApplication.controller.js';

const router = express.Router();

router.post('/submit', submitVerificationApplication);
router.put('/approve/:applicationId', approveVerificationApplication);
router.put('/reject/:applicationId', rejectVerificationApplication);

export default router;

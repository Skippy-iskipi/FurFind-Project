import express from 'express';
import { submitAdoptionApplication } from '../controllers/adoptionApplication.controller.js';

const router = express.Router();

router.post('/submit', submitAdoptionApplication);

export default router;
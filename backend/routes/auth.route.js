import express from "express";
import {
	login,
	logout,
	signup,
	postPet,
	verifyEmail,
	forgotPassword,
	resetPassword,
	checkAuth,
	getAllPets,
	getUserById,
	updateProfile,
	getUserProfile,
	getUserPets,
	submitVerificationApplication,
	updateUserRole,
	getAdoptionApplicationDetails,
	getApplicationDetails,
	getAllUsers,
	getVerificationApplications,
	getAnimalShelterApplications
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { customVerifyToken } from "../middleware/customeverifyToken.js";
import { upload } from '../middleware/multer.js';
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.post("/post-pet", verifyToken, upload.single('image'), postPet);

router.put("/profile",
	verifyToken,
	upload.fields([
		{ name: 'profilePicture', maxCount: 1 },
		{ name: 'coverPhoto', maxCount: 1 }
	]),
	updateProfile
);

router.get('/pets', getAllPets);
router.get('/user/:userId', getUserById);
router.get('/user-profile', verifyToken, getUserProfile);

router.post('/submit', verifyToken, submitVerificationApplication);
router.post('/update-role', verifyToken, updateUserRole);

router.get('/user-pets', verifyToken, getUserPets);

router.get('/adoption-applications-details', customVerifyToken, getAdoptionApplicationDetails);

router.get('/application-details/:applicationId', getApplicationDetails);

router.get('/users', authenticate, getAllUsers);
router.get('/verification-applications', authenticate, getVerificationApplications);

router.get('/animal-shelter-applications', authenticate, getAnimalShelterApplications);

export default router;
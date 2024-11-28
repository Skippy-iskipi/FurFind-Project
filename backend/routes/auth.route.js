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
	getAnimalShelterApplications,
	approveVerificationApplication,
	rejectVerificationApplication,
	getAdoptionRequests,
	getApplicationById,
	getUserAdoptionApplications,
	approveAdoptionRequest,
	rejectAdoptionRequest,
	completeAdoptionRequest,
	getAdoptedPets,
	getPetApplication,
	getCompletedAdoptionApplications,
	submitRating,
	getRatings
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

router.post('/verification-applications/:applicationId/approve', authenticate, approveVerificationApplication);
router.post('/verification-applications/:applicationId/reject', authenticate, rejectVerificationApplication);

router.get('/adoption-requests', verifyToken, getAdoptionRequests);

router.get('/application/:applicationId', verifyToken, getApplicationById);

router.get('/user-adoption-applications/:applicationId', verifyToken, getUserAdoptionApplications);

router.post('/adoption-requests/:applicationId/approve', verifyToken, approveAdoptionRequest);
router.post('/adoption-requests/:applicationId/reject', verifyToken, rejectAdoptionRequest);

router.post('/adoption-requests/:applicationId/complete', verifyToken, completeAdoptionRequest);

router.get('/adopted-pets', verifyToken, getAdoptedPets);

router.get('/pet-application/:petId', verifyToken, getPetApplication);

router.get('/completed-adoption-applications', verifyToken, getCompletedAdoptionApplications);

router.post('/ratings/submit', verifyToken, submitRating);
router.get('/feedback', verifyToken, getRatings);

export default router;
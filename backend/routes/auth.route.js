import express from "express";
import passport from 'passport';
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
	getRatings,
	getUserProfileById,
	getUserPetsByUserId,
	getUserRatingsByUserId,
	getAdoptedPetsByAdopter,
	searchUsers,
	updateUserPreferences,
	getRecommendedPets,
	getUserNotifications,
	markNotificationAsRead,
	markAllNotificationsAsRead,
	sendMessage,
	getConversations,
	getMessages,
	deleteMessage,
	markMessageAsRead,
	getUnreadMessageCount
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { customVerifyToken } from "../middleware/customeverifyToken.js";
import { upload } from '../middleware/multer.js';
import { authenticate } from "../middleware/auth.middleware.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

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

router.get('/user-pets/:userId', verifyToken, getUserPetsByUserId);
router.get('/user-ratings/:userId', verifyToken, getUserRatingsByUserId);


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

router.get('/user-profile/:userId', verifyToken, getUserProfileById);

router.get('/adopted-pets/:userId', verifyToken, getAdoptedPetsByAdopter);

router.get('/users/search', verifyToken, searchUsers);

router.post('/preferences', verifyToken, updateUserPreferences);
router.get('/recommended-pets', verifyToken, getRecommendedPets);

router.get('/notifications', verifyToken, getUserNotifications);
router.patch('/notifications/:notificationId/read', verifyToken, markNotificationAsRead);
router.patch('/notifications/mark-all-read', verifyToken, markAllNotificationsAsRead);

router.get('/google', passport.authenticate('google', {
	scope: ['profile', 'email']
}));

router.get('/google/callback', 
	passport.authenticate('google', { failureRedirect: '/login' }),
	async (req, res) => {
		try {
			const user = req.user;
			
			// Create token with necessary user info
			const token = jwt.sign(
				{ 
					userId: user._id,
					email: user.email,
					googleId: user.googleId
				},
				process.env.JWT_SECRET,
				{ expiresIn: '30d' }
			);

			// Store token in cookie
			res.cookie('token', token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
			});

			// Also send token in URL for immediate frontend access
			const userDataStr = encodeURIComponent(JSON.stringify({
				_id: user._id,
				name: user.name,
				email: user.email,
				googleId: user.googleId,
				profilePicture: user.profilePicture || ''
			}));

			// Redirect with both token and user data
			res.redirect(`http://localhost:5173/auth/google/callback?token=${token}&userData=${userDataStr}`);

		} catch (error) {
			console.error('Error in Google callback:', error);
			res.redirect('http://localhost:5173/login?error=auth_failed');
		}
	}
);

// Add a verify endpoint for Google users
router.get('/verify-google', verifyToken, async (req, res) => {
	try {
		const user = await User.findById(req.user.userId);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		
		res.json({
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				googleId: user.googleId,
				profilePicture: user.profilePicture
			}
		});
	} catch (error) {
		console.error('Error verifying Google user:', error);
		res.status(500).json({ message: 'Error verifying user' });
	}
});

router.post('/messages/send', verifyToken, sendMessage);
router.get('/conversations', verifyToken, getConversations);
router.get('/messages/:otherUserId', verifyToken, getMessages);
router.delete('/messages/:messageId', verifyToken, deleteMessage);

router.put('/messages/:messageId/read', verifyToken, markMessageAsRead);

router.get('/messages/unread-count', verifyToken, getUnreadMessageCount);

export default router;
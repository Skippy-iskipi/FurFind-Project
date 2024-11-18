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
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { upload } from '../middleware/multer.js';

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.post("/post-pet", verifyToken, upload.single('image'), postPet);

router.get('/pets', getAllPets);

export default router;
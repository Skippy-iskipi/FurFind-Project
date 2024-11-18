import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail } from "../mailtrap/emails.js";
import { sendWelcomeEmail } from "../mailtrap/emails.js";
import { sendPasswordResetEmail } from "../mailtrap/emails.js";
import { sendResetSuccessEmail } from "../mailtrap/emails.js";

import Pet from "../models/pet.model.js";


export const signup = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        if (!email || !password || !name) {
            return res.status(400).json({success: false, message: "All fields are required" });
        }

        const userAlreadyExists = await User.findOne({ email });
        console.log("userAlreadyExists", userAlreadyExists);

        if (userAlreadyExists) {
            return res.status(400).json({success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateVerificationToken();
        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        await user.save();

        generateTokenAndSetCookie(res, user._id);

        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({success: true,message: "User created successfully",user: {
                ...user._doc,
                password: undefined,
            },
        });

    } catch (error) {
        res.status(400).json({success: false, message: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: new Date() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);
        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try{
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({success: false, message: "Invalid email or password" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({success: false, message: "Invalid email or password" });
        }

        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({success: true, message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
        }});
    } catch (error) {
        res.status(400).json({success: false, message: error.message });
    }
};

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try{
        const user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({success: false, message: "User not found" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({success: true, message: "Password reset email sent" });

    } catch (error) {
        res.status(400).json({success: false, message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try{
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({success: false, message: "Invalid or expired password reset token" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({success: true, message: "Password reset successful" });

    } catch (error) {
        res.status(400).json({success: false, message: error.message });
    }
};

export const checkAuth = async (req, res) => {
    try{
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(401).json({success: false, message: "User not found" });
        }

        res.status(200).json({success: true, user});


    } catch (error) {
        res.status(400).json({success: false, message: error.message });
    }
};

export const postPet = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }

        const { name, classification, breed, age, gender, location, description } = req.body;
        const userId = req.userId;

        // Create image URL
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        const pet = new Pet({
            name,
            classification,
            breed,
            age,
            gender,
            location,
            description,
            status: 'Available',
            image: imageUrl, // Store the complete URL
            userId
        });

        await pet.save();

        res.status(201).json({
            success: true,
            message: "Pet posted successfully",
            pet
        });

    } catch (error) {
        console.error('Server Error:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};



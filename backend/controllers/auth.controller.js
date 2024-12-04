import { User } from "../models/user.model.js";
import { VerificationApplication } from '../models/verificationApplication.model.js';
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from 'jsonwebtoken';
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from "../mailtrap/emails.js";
import Pet from "../models/pet.model.js";
import { AdoptionApplication } from '../models/adoptionApplication.model.js';
import Rating from '../models/Ratings.js';
import { UserPreference } from '../models/userPreference.model.js';
import { calculatePetScore } from '../services/recommendationService.js';
import { getHybridRecommendations } from '../services/recommendationService.js';
import { Notification } from '../models/notification.model.js';
import Message from '../models/message.model.js';



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
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // Generate a token with 5-hour expiration
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { 
            expiresIn: '5h'
        });

        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            token,
            user: {
                ...user._doc,
                password: undefined,
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
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

export const getAllPets = async (req, res) => {
    try {
        const { classification, age, gender, breed, location } = req.query;
        
        const filter = { status: 'Available' };
        
        if (classification && classification !== 'All') {
            filter.classification = classification;
        }
        
        if (age && age.length > 0) {
            filter.age = { $in: age.split(',') };
        }
        
        if (gender && gender.length > 0) {
            filter.gender = { $in: gender.split(',') };
        }
        
        if (breed) {
            filter.breed = breed;
        }
        
        if (location) {
            filter.location = location;
        }

        const pets = await Pet.find(filter)
            .populate({
                path: 'userId',
                select: 'name profilePicture'
            })
            .sort({ createdAt: -1 });

        console.log('Fetched pets:', pets);
        
        res.status(200).json({
            success: true,
            pets
        });
    } catch (error) {
        console.error('Error in getAllPets:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching pets",
            error: error.message
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        console.log('Getting user by ID:', req.params.userId);
        
        const user = await User.findById(req.params.userId).select('name profilePicture');
        
        console.log('Found user:', user);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching user details",
            error: error.message
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { name, email, bio } = req.body;
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check email uniqueness if being changed
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: "Email already in use"
                });
            }
            user.email = email;
        }

        // Update basic fields
        if (name) user.name = name;
        if (bio) user.bio = bio;

        // Handle file uploads
        if (req.files) {
            if (req.files.profilePicture) {
                const profileImageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.files.profilePicture[0].filename}`;
                user.profilePicture = profileImageUrl;
            } else if (req.body.profilePicture === '') {
                user.profilePicture = null;
            }

            if (req.files.coverPhoto) {
                const coverPhotoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.files.coverPhoto[0].filename}`;
                user.coverPhoto = coverPhotoUrl;
            } else if (req.body.coverPhoto === '') {
                user.coverPhoto = null;
            }
        }

        // Handle password update
        if (req.body.password) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            user.password = hashedPassword;
        }

        await user.save();

        // Remove sensitive data before sending response
        const userResponse = user.toObject();
        delete userResponse.password;
        delete userResponse.verificationToken;
        delete userResponse.verificationTokenExpiresAt;
        delete userResponse.resetPasswordToken;
        delete userResponse.resetPasswordExpiresAt;

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: userResponse
        });

    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        console.log('User ID:', req.userId);
        const userId = req.userId;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const submitVerificationApplication = async (req, res) => {
    try {
        const { type, formData, userId } = req.body;

        if (!type || !formData || !userId) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const verificationApplication = new VerificationApplication({
            type,
            formData,
            userId,
        });

        await verificationApplication.save();

        // Create notification for the user
        await createNotification(
            userId,
            'VERIFICATION_STATUS',
            `Your ${type} verification application has been submitted and is under review.`,
            verificationApplication._id
        );

        res.status(201).json({ success: true, message: 'Verification application submitted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.body;

        const application = await VerificationApplication.findOne({ userId });

        if (!application) {
            return res.status(404).json({ success: false, message: 'Verification application not found' });
        }

        let newRole;
        if (application.type === 'Pet Owner') {
            newRole = 'Pet Owner';
        } else if (application.type === 'Shelter') {
            newRole = 'Shelter';
        } else {
            return res.status(400).json({ success: false, message: 'Invalid application type' });
        }

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

export const getUserPets = async (req, res) => {
    try {
        const userId = req.userId;

        const pets = await Pet.find({
            userId,
            status: 'Available'
        })
            .populate({
                path: 'userId',
                select: 'name profilePicture'
            })
            .sort({ createdAt: -1 });

        if (!pets.length) {
            return res.status(404).json({
                success: false,
            });
        }

        res.status(200).json({
            success: true,
            pets
        });
    } catch (error) {
        console.error('Error fetching user pets:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching user pets",
            error: error.message
        });
    }
};

export const getAdoptedPets = async (req, res) => {
    try {
        const userId = req.userId;

        // Find completed adoption applications where user is the adopter
        const adoptedByUser = await AdoptionApplication.find({
            userId,
            status: 'Completed'
        })
        .populate({
            path: 'petId',
            select: 'name image userId',
            populate: {
                path: 'userId',
                select: 'name'
            }
        })
        .sort({ createdAt: -1 });

        // Find pets posted by user that were adopted
        const adoptedFromUser = await Pet.find({
            userId,
            status: 'Adopted'
        })
        .populate({
            path: 'userId',
            select: 'name'
        });

        // Get adoption details for pets adopted from user
        const adoptionDetailsPromises = adoptedFromUser.map(pet => 
            AdoptionApplication.findOne({
                petId: pet._id,
                status: 'Completed'
            }).populate('userId', 'name')
        );
        const adoptionDetails = await Promise.all(adoptionDetailsPromises);

        // Format the responses
        const petsAdoptedByUser = adoptedByUser.map(app => ({
            id: app._id,
            petName: app.petId.name,
            petImage: app.petId.image,
            ownerName: app.petId.userId.name,
            dateAdopted: app.completedAt || app.updatedAt,
            type: 'adopted_by_me'
        }));

        const petsAdoptedFromUser = adoptedFromUser.map((pet, index) => ({
            id: adoptionDetails[index]?._id,
            petName: pet.name,
            petImage: pet.image,
            adopterName: adoptionDetails[index]?.userId?.name,
            dateAdopted: adoptionDetails[index]?.completedAt || adoptionDetails[index]?.updatedAt,
            type: 'adopted_from_me'
        }));

        res.status(200).json({
            success: true,
            applications: {
                adoptedByMe: petsAdoptedByUser,
                adoptedFromMe: petsAdoptedFromUser
            }
        });
    } catch (error) {
        console.error('Error fetching adopted pets:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching adopted pets",
            error: error.message
        });
    }
};

export const getPetApplication = async (req, res) => {
    try {
        const { petId } = req.params;

        // Find the completed application for this pet
        const application = await AdoptionApplication.findOne({ 
            petId,
            status: 'Completed'
        })
        .populate('petId') // Populate pet details
        .populate('userId', 'name email phoneNumber') // Populate adopter details
        .populate('ownerId', 'name email phoneNumber role'); // Populate owner details

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        // Restructure the data to match the expected format
        const formattedApplication = {
            _id: application._id,
            status: application.status,
            completedAt: application.completedAt,
            pet: application.petId,
            adopter: application.userId,
            owner: application.ownerId,
            formData: application.formData // This should include all the form fields
        };

        res.status(200).json({
            success: true,
            application: formattedApplication
        });

    } catch (error) {
        console.error('Error fetching pet application:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching pet application",
            error: error.message
        });
    }
};

export const getAdoptionApplicationDetails = async (req, res) => {
    try {
        const userId = req.userId;
        console.log('User ID:', userId);

        const applications = await AdoptionApplication.find({ userId })
            .populate('petId')
            .populate('userId', 'name email')
            .lean();

        // Map the applications and handle potential null values
        const applicationDetails = applications.map(app => {
            if (!app.petId) {
                return {
                    ...app,
                    petName: 'Pet no longer available',
                    petImage: null
                };
            }

            return {
                ...app,
                petName: app.petId?.name || 'Unknown',
                petImage: app.petId?.image || null,
                applicantName: app.userId?.name || 'Unknown User',
                applicantEmail: app.userId?.email || 'No email'
            };
        });

        res.status(200).json({
            success: true,
            applications: applicationDetails
        });

    } catch (error) {
        console.error('Error fetching adoption applications:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching adoption applications",
            error: error.message
        });
    }
};

export const getApplicationDetails = async (req, res) => {
    try {
        const { applicationId } = req.params;
  
        const application = await AdoptionApplication.findById(applicationId)
            .populate({
                path: 'petId',
                select: 'name image classification breed gender age location userId',
                populate: {
                    path: 'userId',
                    select: 'role name contactNumber shelterContact email',
                },
            })
            .populate({
                path: 'userId',
                select: 'role name email contactNumber',
            });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }

        let ownerContact;
        let owner;
        
        console.log('Looking for verification with userId:', application.petId.userId._id);
        
        const verificationApp = await VerificationApplication.findOne({
            userId: application.petId.userId._id
        });
        
        console.log('Raw Verification App:', verificationApp);
        console.log('User role:', application.petId.userId.role);

        if (!verificationApp) {
            console.log('No verification application found for this user');
        }

        if (application.petId.userId.role === 'Animal Shelter') {
            ownerContact = verificationApp?.formData?.shelterContact;
            owner = {
                name: application.petId.userId.name,
                organizationName: verificationApp?.formData?.organizationName,
                email: application.petId.userId.email,
                contact: ownerContact,
                role: application.petId.userId.role
            };
        } else if (application.petId.userId.role === 'Pet Owner') {
            ownerContact = verificationApp?.formData?.contact || verificationApp?.formData?.contactNumber;
            owner = {
                name: application.petId.userId.name,
                email: application.petId.userId.email,
                contact: ownerContact,
                role: application.petId.userId.role
            };
        }

        console.log('Final owner data:', owner);

        const adopter = {
            name: application.userId.name,
            email: application.userId.email,
            contactNumber: application.contactNumber,
        };
    
        res.status(200).json({
            success: true,
            application: {
                pet: application.petId,
                status: application.status,
                adopter,
                owner,
            },
        });
    } catch (error) {
        console.error('Error fetching application details:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching application details',
            error: error.message,
        });
    }
};

export const getAllUsers = async (_, res) => {
    try {
        const users = await User.find({ email: { $ne: "furfindadmin@furfind.com" } })
            .select('name email profilePicture role');
        res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching users",
            error: error.message,
        });
    }
};

export const getVerificationApplications = async (_, res) => {
    try {
        // Get all Pet Owner applications
        const applications = await VerificationApplication.find({ 
            type: 'Pet Owner'
        }).populate({
            path: 'userId',
            select: 'name email profilePicture googleUser googleId'
        });

        const formattedApplications = applications
            .filter(app => {
                // Skip admin user
                const userEmail = app.userId?.googleUser?.email || app.userId?.email;
                return userEmail !== 'furfindadmin@furfind.com';
            })
            .map(app => ({
                id: app._id,
                name: app.userId?.googleUser?.name || app.userId?.name,
                email: app.userId?.googleUser?.email || app.userId?.email,
                profilePicture: app.userId?.googleUser?.picture || app.userId?.profilePicture,
                submittedDate: app.submittedAt,
                type: app.type,
                status: app.status,
                address: app.formData.address,
                contactNumber: app.formData.contactNumber,
                occupation: app.formData.occupation,
                emergencyFirstName: app.formData.emergencyFirstName,
                emergencyLastName: app.formData.emergencyLastName,
                emergencyAddress: app.formData.emergencyAddress,
                emergencyContact: app.formData.emergencyContact,
                governmentId: app.formData.governmentId,
                proofOfResidence: app.formData.proofOfResidence,
                petCareExperience: app.formData.petCareExperience
            }));

        console.log('Fetched applications:', formattedApplications);

        res.status(200).json({
            success: true,
            applications: formattedApplications,
        });
    } catch (error) {
        console.error('Error fetching verification applications:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching verification applications",
            error: error.message,
        });
    }
};

export const getAnimalShelterApplications = async (_, res) => {
    try {
        // Remove the status filter to get all Animal Shelter applications
        const applications = await VerificationApplication.find({ 
            type: 'Animal Shelter'
        }).populate('userId', 'name email profilePicture');

        const formattedApplications = applications.map(app => ({
            id: app._id,
            name: app.userId.name,
            email: app.userId.email,
            profilePicture: app.userId.profilePicture,
            submittedDate: app.submittedAt,
            type: app.type,
            status: app.status,
            organizationName: app.formData.organizationName,
            registrationNumber: app.formData.registrationNumber,
            yearEstablished: app.formData.yearEstablished,
            shelterAddress: app.formData.shelterAddress,
            shelterContact: app.formData.shelterContact,
            organizationalBackground: app.formData.organizationalBackground,
            registrationCertificate: app.formData.registrationCertificate,
            facilityPhotos: app.formData.facilityPhotos
        }));

        console.log('Fetched shelter applications:', formattedApplications); // Debug log

        res.status(200).json({
            success: true,
            applications: formattedApplications,
        });
    } catch (error) {
        console.error('Error fetching animal shelter applications:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching animal shelter applications",
            error: error.message,
        });
    }
};

export const approveVerificationApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        
        console.log('Approving application:', applicationId);
        
        if (!applicationId) {
            return res.status(400).json({
                success: false,
                message: "Application ID is required"
            });
        }

        const application = await VerificationApplication.findById(applicationId);
        
        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        const user = await User.findById(application.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const newRole = application.type === 'Pet Owner' ? 'Pet Owner' : 'Animal Shelter';
        
        await User.findByIdAndUpdate(application.userId, {
            role: newRole
        });

        application.status = 'Approved';
        await application.save();

        // Create notification for the user
        await createNotification(
            application.userId,
            'VERIFICATION_STATUS',
            `Your ${application.type} verification application has been approved!`,
            applicationId
        );

        res.status(200).json({
            success: true,
            message: "Application approved successfully"
        });

    } catch (error) {
        console.error('Error approving application:', error);
        res.status(500).json({
            success: false,
            message: "Error approving application",
            error: error.message
        });
    }
};

export const rejectVerificationApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        
        const application = await VerificationApplication.findById(applicationId);
        
        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        application.status = 'Rejected';
        await application.save();

        // Create notification for the user
        await createNotification(
            application.userId,
            'VERIFICATION_STATUS',
            `Your ${application.type} verification application has been rejected.`,
            applicationId
        );

        res.status(200).json({
            success: true,
            message: "Application rejected successfully"
        });

    } catch (error) {
        console.error('Error rejecting application:', error);
        res.status(500).json({
            success: false,
            message: "Error rejecting application",
            error: error.message
        });
    }
};

export const getAdoptionRequests = async (req, res) => {
    try {
        const userId = req.userId;

        // Find all pets owned by this user
        const userPets = await Pet.find({ userId });
        const petIds = userPets.map(pet => pet._id);

        // Find all adoption applications for these pets
        const applications = await AdoptionApplication.find({
            petId: { $in: petIds }
        })
        .populate({
            path: 'userId',
            select: 'name'
        })
        .populate({
            path: 'petId',
            select: 'name image'
        })
        .select('createdAt status');

        // Mark related notifications as read when viewing adoption requests
        await Notification.updateMany(
            {
                userId,
                type: 'APPLICATION_RECEIVED',
                read: false,
                relatedId: { $in: applications.map(app => app._id) }
            },
            { read: true }
        );

        if (!applications.length) {
            return res.status(200).json({
                success: true,
                message: "No adoption requests yet",
                applications: []
            });
        }

        const response = applications.map(app => ({
            id: app._id,
            petName: app.petId.name,
            petImage: app.petId.image,
            adopterName: app.userId.name,
            dateApplied: app.createdAt,
            status: app.status
        }));

        res.status(200).json({
            success: true,
            applications: response
        });
    } catch (error) {
        console.error('Error fetching adoption requests:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching adoption requests",
            error: error.message
        });
    }
};

export const getApplicationById = async (req, res) => {
    try {
        const { applicationId } = req.params;
        
        // Find the application with all necessary data
        const application = await AdoptionApplication.findById(applicationId)
            .populate({
                path: 'petId',
                select: 'name image classification breed gender age location userId',
                populate: {
                    path: 'userId',
                    select: 'name email role'
                }
            })
            .select('status completedAt contactNumber userId ratings')
            .populate('userId', 'name email');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        // Get pet owner's verification details
        const ownerVerification = await VerificationApplication.findOne({
            userId: application.petId.userId._id,
            status: 'Approved'
        }).select('formData type');

        // Determine contact number based on owner type
        let ownerContact = 'Not available';
        let ownerName = application.petId.userId.name;
        
        if (ownerVerification) {
            if (application.petId.userId.role === 'Animal Shelter') {
                ownerContact = ownerVerification.formData.shelterContact;
                ownerName = ownerVerification.formData.organizationName || ownerName;
            } else {
                ownerContact = ownerVerification.formData.contactNumber;
            }
        }

        // Format the response
        const response = {
            success: true,
            application: {
                _id: application._id,
                status: application.status,
                completedAt: application.completedAt,
                pet: {
                    name: application.petId.name,
                    image: application.petId.image,
                    classification: application.petId.classification,
                    breed: application.petId.breed,
                    gender: application.petId.gender,
                    age: application.petId.age,
                    location: application.petId.location,
                },
                owner: {
                    name: ownerName,
                    email: application.petId.userId.email,
                    role: application.petId.userId.role,
                    contactNumber: ownerContact,
                    organizationName: application.petId.userId.role === 'Animal Shelter' ? 
                        ownerVerification?.formData?.organizationName : undefined
                },
                adopter: {
                    name: application.userId.name,
                    email: application.userId.email,
                    contactNumber: application.contactNumber
                },
                ratings: application.ratings
            }
        };

        res.status(200).json(response);

    } catch (error) {
        console.error('Error fetching application details:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching application details",
            error: error.message
        });
    }
};

export const getUserAdoptionApplications = async (req, res) => {
    try {
        const applicationId = req.params.applicationId;

        // Fetch specific adoption application with populated fields
        const application = await AdoptionApplication.findById(applicationId)
            .populate('petId', 'name image classification breed gender age location userId')
            .populate('userId', 'name email contactNumber')
            .populate({
                path: 'petId',
                populate: {
                    path: 'userId',
                    select: 'name email role'
                }
            });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        // Mark related notifications as read if the viewer is the pet owner or the applicant
        if (req.userId === application.petId.userId._id.toString() || 
            req.userId === application.userId._id.toString()) {
            await Notification.updateMany(
                {
                    relatedId: applicationId,
                    userId: req.userId,
                    read: false
                },
                { read: true }
            );
        }

        // Get any existing notifications for this application
        const notifications = await Notification.find({
            relatedId: applicationId,
            userId: req.userId
        }).sort({ createdAt: -1 });

        // Format the response to match the expected structure
        const response = {
            success: true,
            applications: [{
                id: application._id,
                userId: application.userId._id,
                petId: application.petId._id,
                formData: {
                    address: application.address || "N/A",
                    contactNumber: application.contactNumber || "N/A",
                    occupation: application.occupation || "N/A",
                    emergencyFirstName: application.emergencyFirstName || "N/A",
                    emergencyLastName: application.emergencyLastName || "N/A",
                    emergencyAddress: application.emergencyAddress || "N/A",
                    emergencyContact: application.emergencyContact || "N/A",
                    typeOfResidence: application.typeOfResidence || "N/A",
                    residenceOwnership: application.residenceOwnership || "N/A",
                    hadPetsBefore: application.hadPetsBefore || "N/A",
                    hasCurrentPets: application.hasCurrentPets || "N/A",
                    petCareDescription: application.petCareDescription || "N/A",
                    governmentId: application.governmentId || "N/A",
                    proofOfResidence: application.proofOfResidence || "N/A",
                    proofOfIncome: application.proofOfIncome || "N/A"
                },
                pet: {
                    ...application.petId.toObject(),
                    owner: {
                        name: application.petId.userId.name,
                        email: application.petId.userId.email,
                        role: application.petId.userId.role
                    }
                },
                adopter: application.userId,
                status: application.status,
                createdAt: application.createdAt,
                notifications: notifications // Include related notifications
            }]
        };

        // Create a notification for the pet owner when application is viewed (optional)
        if (req.userId === application.petId.userId._id.toString()) {
            await createNotification(
                application.userId._id,
                'APPLICATION_VIEWED',
                `Your adoption application for ${application.petId.name} has been viewed by the owner`,
                applicationId
            );
        }

        res.status(200).json(response);

    } catch (error) {
        console.error('Error fetching application form data:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching application form data",
            error: error.message
        });
    }
};

export const approveAdoptionRequest = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const application = await AdoptionApplication.findById(applicationId)
            .populate('userId')
            .populate('petId');
        
        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Adoption application not found"
            });
        }

        application.status = 'Approved';
        await application.save();
        await Pet.findByIdAndUpdate(application.petId._id, { status: 'Adopted' });

        // Create notification for the adopter
        await createNotification(
            application.userId._id,
            'ADOPTION_STATUS',
            `Your adoption application for ${application.petId.name} has been approved!`,
            applicationId
        );

        res.status(200).json({
            success: true,
            message: "Adoption request approved successfully"
        });
    } catch (error) {
        console.error('Error approving adoption request:', error);
        res.status(500).json({
            success: false,
            message: "Error approving adoption request",
            error: error.message
        });
    }
};

export const rejectAdoptionRequest = async (req, res) => {
    try {
        const { applicationId } = req.params;

        // Find the adoption application and populate necessary fields
        const application = await AdoptionApplication.findById(applicationId)
            .populate('petId', 'name')
            .populate('userId', 'name');
        
        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Adoption application not found"
            });
        }

        // Update the status of the adoption application
        application.status = 'Rejected';
        await application.save();

        // Create notification for the adopter
        await createNotification(
            application.userId._id,
            'ADOPTION_STATUS',
            `Your adoption request for ${application.petId.name} has been rejected`,
            applicationId
        );

        res.status(200).json({
            success: true,
            message: "Adoption request rejected successfully"
        });

    } catch (error) {
        console.error('Error rejecting adoption request:', error);
        res.status(500).json({
            success: false,
            message: "Error rejecting adoption request",
            error: error.message
        });
    }
};

export const completeAdoptionRequest = async (req, res) => {
    try {
        const { applicationId } = req.params;

        const application = await AdoptionApplication.findById(applicationId)
            .populate('petId', 'name userId')
            .populate('userId', 'name');
        
        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Adoption application not found"
            });
        }

        if (application.status !== 'Approved') {
            return res.status(400).json({
                success: false,
                message: "Only approved applications can be marked as completed"
            });
        }

        // Update the status to Completed and set completedAt
        application.status = 'Completed';
        application.completedAt = new Date();
        await application.save();

        // Update the pet's status to Adopted
        await Pet.findByIdAndUpdate(application.petId._id, { status: 'Adopted' });

        // Create notifications for both parties
        await Promise.all([
            // Notification for the adopter
            createNotification(
                application.userId._id,
                'ADOPTION_STATUS',
                `Congratulations! Your adoption of ${application.petId.name} is now complete.`,
                applicationId
            ),
            // Notification for the pet owner
            createNotification(
                application.petId.userId,
                'ADOPTION_STATUS',
                `The adoption of ${application.petId.name} by ${application.userId.name} has been completed.`,
                applicationId
            )
        ]);

        res.status(200).json({
            success: true,
            message: "Adoption process marked as completed"
        });

    } catch (error) {
        console.error('Error completing adoption request:', error);
        res.status(500).json({
            success: false,
            message: "Error completing adoption request",
            error: error.message
        });
    }
};

export const getCompletedAdoptionApplications = async (req, res) => {
    try {
        const userId = req.userId;
        const completedApplications = await AdoptionApplication.find({ userId, status: 'Completed' })
            .populate('petId', 'name image')
            .select('createdAt status');

        if (!completedApplications.length) {
            return res.status(200).json({
                success: true,
                message: "No completed adoption applications found",
                applications: []
            });
        }

        const response = completedApplications.map(app => ({
            id: app._id,
            petName: app.petId.name,
            petImage: app.petId.image,
            dateApplied: app.createdAt,
            status: app.status
        }));

        res.status(200).json({
            success: true,
            applications: response
        });
    } catch (error) {
        console.error('Error fetching completed adoption applications:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching completed adoption applications",
            error: error.message
        });
    }
};

export const submitRating = async (req, res) => {
    try {
        const { applicationId, feedback, stars } = req.body;
        const adopterId = req.userId;

        const application = await AdoptionApplication.findById(applicationId).populate('petId');
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }
        const ownerId = application.petId.userId;

        const existingRating = await Rating.findOne({ applicationId, adopterId });
        if (existingRating) {
            return res.status(400).json({ success: false, message: 'You have already rated this application' });
        }

        const newRating = new Rating({ applicationId, adopterId, ownerId, feedback, stars });
        await newRating.save();

        // Create notification for the pet owner
        await createNotification(
            ownerId,
            'RATING_RECEIVED',
            `You received a ${stars}-star rating for an adoption.`,
            newRating._id
        );

        res.status(201).json({ success: true, message: 'Rating submitted successfully' });
    } catch (error) {
        console.error('Error submitting rating:', error);
        res.status(500).json({ success: false, message: 'Error submitting rating', error: error.message });
    }
};

export const getRatings = async (req, res) => {
    try {
        const userId = req.userId;

        // Fetch ratings where the user is the owner
        const ratings = await Rating.find({ ownerId: userId })
            .populate('adopterId', 'name profilePicture')
            .populate('ownerId', 'name role')
            .sort({ createdAt: -1 });
            

        res.status(200).json({ success: true, ratings });
    } catch (error) {
        console.error('Error fetching ratings:', error);
        res.status(500).json({ success: false, message: 'Error fetching ratings', error: error.message });
    }
};

export const getUserProfileById = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching user profile', error: error.message });
    }
};

export const getUserPetsByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const pets = await Pet.find({ userId });
    res.status(200).json({ success: true, pets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserRatingsByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const ratings = await Rating.find({ ownerId: userId })
      .populate('adopterId', 'name profilePicture')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, ratings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdoptedPetsByAdopter = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find completed adoption applications where user is the adopter
    const adoptedByUser = await AdoptionApplication.find({
      userId,
      status: 'Completed'
    })
    .populate({
      path: 'petId',
      select: 'name image userId',
      populate: {
        path: 'userId',
        select: 'name'
      }
    })
    .sort({ createdAt: -1 });

    // Find pets posted by user that were adopted
    const adoptedFromUser = await Pet.find({
      userId,
      status: 'Adopted'
    })
    .populate({
      path: 'userId',
      select: 'name'
    });

    // Get adoption details for pets adopted from user
    const adoptionDetailsPromises = adoptedFromUser.map(pet => 
      AdoptionApplication.findOne({
        petId: pet._id,
        status: 'Completed'
      }).populate('userId', 'name')
    );
    const adoptionDetails = await Promise.all(adoptionDetailsPromises);

    // Format the responses
    const petsAdoptedByUser = adoptedByUser.map(app => ({
      id: app._id,
      petName: app.petId.name,
      petImage: app.petId.image,
      ownerName: app.petId.userId.name,
      dateAdopted: app.completedAt || app.updatedAt,
      type: 'adopted_by_me'
    }));

    const petsAdoptedFromUser = adoptedFromUser.map((pet, index) => ({
      id: adoptionDetails[index]?._id,
      petName: pet.name,
      petImage: pet.image,
      adopterName: adoptionDetails[index]?.userId?.name,
      dateAdopted: adoptionDetails[index]?.completedAt || adoptionDetails[index]?.updatedAt,
      type: 'adopted_from_me'
    }));

    res.status(200).json({
      success: true,
      applications: {
        adoptedByMe: petsAdoptedByUser,
        adoptedFromMe: petsAdoptedFromUser
      }
    });
  } catch (error) {
    console.error('Error fetching adopted pets:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching adopted pets",
      error: error.message
    });
  }
};

export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(200).json({
                success: true,
                users: []
            });
        }

        // Search for users by name, excluding the admin account
        const users = await User.find({
            name: { $regex: query, $options: 'i' },
            email: { $ne: "furfindadmin@furfind.com" }
        })
        .select('name email profilePicture role')
        .limit(5);

        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            success: false,
            message: "Error searching users",
            error: error.message
        });
    }
};

export const updateUserPreferences = async (req, res) => {
    try {
        console.log('Received request body:', req.body); // Debug log
        
        const { preferences } = req.body;
        const userId = req.userId;

        if (!preferences) {
            return res.status(400).json({
                success: false,
                message: "Preferences are required"
            });
        }

        // Validate preferences
        if (!preferences.petType || !Array.isArray(preferences.agePreferences)) {
            return res.status(400).json({
                success: false,
                message: "Invalid preferences format"
            });
        }

        let userPreference = await UserPreference.findOne({ userId });
        
        if (!userPreference) {
            userPreference = new UserPreference({
                userId,
                preferences: {
                    petType: preferences.petType,
                    agePreferences: preferences.agePreferences,
                    // Add other fields as needed
                }
            });
        } else {
            userPreference.preferences = {
                ...userPreference.preferences,
                ...preferences
            };
            userPreference.lastUpdated = new Date();
        }

        console.log('Saving preferences:', userPreference); // Debug log

        await userPreference.save();

        res.status(200).json({
            success: true,
            message: "Preferences updated successfully",
            preferences: userPreference
        });
    } catch (error) {
        console.error('Error in updateUserPreferences:', error);
        res.status(500).json({
            success: false,
            message: "Error updating preferences",
            error: error.message
        });
    }
};

export const getRecommendedPets = async (req, res) => {
    try {
        const userId = req.userId;
        const userPreference = await UserPreference.findOne({ userId });
        
        // Get base query for available pets
        const query = { status: 'Available' };
        if (userPreference?.preferences?.petType !== 'Both') {
            query.classification = userPreference.preferences.petType;
        }

        const pets = await Pet.find(query);
        
        if (!pets.length) {
            return res.status(200).json({ success: true, pets: [] });
        }

        // Get hybrid scoring function
        const getScore = await getHybridRecommendations(userId, userPreference?.preferences);

        // Score and sort pets
        const scoredPets = await Promise.all(pets.map(async (pet) => ({
            ...pet.toObject(),
            score: await getScore(pet)
        })));

        const recommendedPets = scoredPets
            .filter(pet => pet.score > 0.5)
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);

        res.status(200).json({
            success: true,
            pets: recommendedPets
        });
    } catch (error) {
        console.error('Error in getRecommendedPets:', error);
        res.status(500).json({
            success: false,
            message: "Error getting recommendations",
            error: error.message
        });
    }
};

export const createNotification = async (userId, type, message, relatedId) => {
    try {
        const notification = new Notification({
            userId,
            type,
            message,
            relatedId
        });
        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

export const getUserNotifications = async (req, res) => {
    try {
        const userId = req.userId;
        const notifications = await Notification.find({ 
            userId,
            // Exclude message-related notifications
            type: { 
                $nin: ['NEW_MESSAGE', 'MESSAGE_RECEIVED'] 
            }
        })
        .sort({ createdAt: -1 })
        .limit(50);

        res.status(200).json({
            success: true,
            notifications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching notifications",
            error: error.message
        });
    }
};

export const markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.userId;

        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, userId },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        res.status(200).json({
            success: true,
            notification
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error marking notification as read",
            error: error.message
        });
    }
};

export const markAllNotificationsAsRead = async (req, res) => {
    try {
        const userId = req.userId;

        // Update all unread notifications for the user
        const result = await Notification.updateMany(
            { 
                userId,
                read: false 
            },
            { 
                read: true 
            }
        );

        res.status(200).json({
            success: true,
            message: "All notifications marked as read",
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({
            success: false,
            message: "Error marking all notifications as read",
            error: error.message
        });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { recipientId, content } = req.body;
        const senderId = req.userId;

        if (!content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message content cannot be empty"
            });
        }

        const message = new Message({
            sender: senderId,
            recipient: recipientId,
            content
        });

        await message.save();

        // Create notification for recipient
        await createNotification(
            recipientId,
            'NEW_MESSAGE',
            'You have received a new message',
            message._id
        );

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: message
        });

    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({
            success: false,
            message: "Error sending message",
            error: error.message
        });
    }
};

export const getConversations = async (req, res) => {
    try {
        const userId = req.userId;

        // Get all messages where user is either sender or recipient
        const messages = await Message.find({
            $or: [{ sender: userId }, { recipient: userId }]
        })
        .populate('sender', 'name profilePicture role')
        .populate('recipient', 'name profilePicture role')
        .sort({ createdAt: -1 });

        // Group messages by conversation
        const conversations = messages.reduce((acc, message) => {
            const otherUser = message.sender._id.toString() === userId ? 
                message.recipient : message.sender;
            
            const conversationId = otherUser._id.toString();
            
            if (!acc[conversationId]) {
                acc[conversationId] = {
                    user: {
                        _id: otherUser._id,
                        name: otherUser.name,
                        profilePicture: otherUser.profilePicture
                    },
                    lastMessage: message,
                    unreadCount: message.recipient._id.toString() === userId && !message.read ? 1 : 0
                };
            } else if (!message.read && message.recipient._id.toString() === userId) {
                acc[conversationId].unreadCount += 1;
            }

            return acc;
        }, {});

        res.status(200).json({
            success: true,
            conversations: Object.values(conversations)
        });

    } catch (error) {
        console.error('Error getting conversations:', error);
        res.status(500).json({
            success: false,
            message: "Error getting conversations",
            error: error.message
        });
    }
};
export const getMessages = async (req, res) => {
    try {
        const { otherUserId } = req.params;
        const userId = req.userId;

        // Get messages between the two users
        const messages = await Message.find({
            $or: [
                { sender: userId, recipient: otherUserId },
                { sender: otherUserId, recipient: userId }
            ]
        })
        .populate('sender', 'name profilePicture role')
        .populate('recipient', 'name profilePicture role')
        .sort({ createdAt: 1 });

        // Mark unread messages as read
        await Message.updateMany(
            {
                sender: otherUserId,
                recipient: userId,
                read: false
            },
            { read: true }
        );

        res.status(200).json({
            success: true,
            messages
        });

    } catch (error) {
        console.error('Error getting messages:', error);
        res.status(500).json({
            success: false,
            message: "Error getting messages",
            error: error.message
        });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.userId;

        const message = await Message.findOne({
            _id: messageId,
            $or: [{ sender: userId }, { recipient: userId }]
        });

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }

        await message.deleteOne();

        res.status(200).json({
            success: true,
            message: "Message deleted successfully"
        });

    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({
            success: false,
            message: "Error deleting message",
            error: error.message
        });
    }
};

export const markMessageAsRead = async (req, res) => {
    try {
        const { messageId } = req.params;
        await Message.findByIdAndUpdate(messageId, { read: true });
        res.json({ success: true });
    } catch (error) {
        console.error('Error marking message as read:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking message as read'
        });
    }
};

export const getUnreadMessageCount = async (req, res) => {
    try {
        const userId = req.userId;
        
        const count = await Message.countDocuments({
            recipient: userId,
            read: false
        });

        res.status(200).json({
            success: true,
            unreadCount: count
        });
    } catch (error) {
        console.error('Error getting unread message count:', error);
        res.status(500).json({
            success: false,
            message: "Error getting unread message count",
            error: error.message
        });
    }
};

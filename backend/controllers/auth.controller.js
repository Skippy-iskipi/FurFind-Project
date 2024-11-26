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
import { authenticate } from '../middleware/auth.middleware.js';

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

        // Generate a token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            token, // Include the token in the response
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
        
        const filter = {};
        
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

        const pets = await Pet.find({ userId })
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

export const getAdoptionApplicationDetails = async (req, res) => {
    try {
        console.log('User ID:', req.userId);
        const userId = req.userId;

        const applications = await AdoptionApplication.find({ userId })
            .populate({
                path: 'petId',
                select: 'name image'
            })
            .select('createdAt status');

        if (!applications.length) {
            return res.status(200).json({
                success: true,
                message: "No adoption applications yet",
                applications: []
            });
        }

        const response = applications.map(app => ({
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
          select: 'name contactNumber email',
        },
      })
      .populate({
        path: 'userId',
        select: 'role name email',
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    const adopter = {
      name: application.userId.name,
      email: application.userId.email,
      contactNumber: application.contactNumber,
    };
    const owner = application.petId.userId;

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
            .select('name email profilePicture');
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
        // Remove the status filter to get all Pet Owner applications
        const applications = await VerificationApplication.find({ 
            type: 'Pet Owner'
        }).populate('userId', 'name email profilePicture');

        const formattedApplications = applications.map(app => ({
            id: app._id,
            name: app.userId.name,
            email: app.userId.email,
            profilePicture: app.userId.profilePicture,
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

        console.log('Fetched applications:', formattedApplications); // Debug log

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
        
        console.log('Approving application:', applicationId); // Debug log
        
        if (!applicationId) {
            return res.status(400).json({
                success: false,
                message: "Application ID is required"
            });
        }

        // Find the verification application
        const application = await VerificationApplication.findById(applicationId);
        
        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        // Find the user
        const user = await User.findById(application.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Update user role based on application type
        const newRole = application.type === 'Pet Owner' ? 'Pet Owner' : 'Animal Shelter';
        
        // Update user role
        await User.findByIdAndUpdate(application.userId, {
            role: newRole
        });

        // Update application status
        application.status = 'Approved';
        await application.save();

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
        
        // Find the verification application
        const application = await VerificationApplication.findById(applicationId);
        
        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        application.status = 'Rejected';
        await application.save();

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


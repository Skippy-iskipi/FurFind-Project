import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: function() {
				// Password is required only if googleId is not present
				return !this.googleId;
			},
		},
		name: {
			type: String,
			required: true,
		},
		lastLogin: {
			type: Date,
			default: Date.now,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		role: {
			type: String,
			enum: ["Adopter", "Pet Owner", "Animal Shelter", "Admin"],
			default: "Adopter",
		},
		profilePicture: {
			type: String,
			default: '',
		},
		coverPhoto: {
			type: String,
			default: '',
		},
		bio: {
			type: String,
			default: '',
		},
		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		verificationToken: String,
		verificationTokenExpiresAt: Date,
		googleId: {
			type: String,
		},
	},
	{ timestamps: true }
);

export const User = mongoose.model("User", userSchema);
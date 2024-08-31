const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const userSchema = new Schema(
	{
		username: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		friends: [
			{
				type: Types.ObjectId,
				ref: "User",
				default: [],
			},
		],
		requests: [
			{
				type: Types.ObjectId,
				ref: "User",
				default: [],
			},
		],
	},
	{ timestamps: true }
);

// Static signup method
userSchema.statics.signup = async function (email, password) {
	// Check for existing email
	const exists = await this.findOne({ email });
	if (exists) {
		throw new Error("Email already in use");
	}

	// Validate email and password
	if (!email || !password) {
		throw new Error("All fields must be filled");
	}
	if (email.length < 12) {
		throw new Error("Email must be at least 12 characters");
	}
	if (!email.endsWith("@gmail.com")) {
		throw new Error("Email must be a Gmail account");
	}
	if (password.length < 8) {
		throw new Error("Password must be at least 8 characters long");
	}
	if (!/\d/.test(password)) {
		throw new Error("Password must contain at least one number");
	}
	if (!/[!@#$%^&*(),.?"|<>]/.test(password)) {
		throw new Error("Password must contain at least one symbol");
	}

	// Hashing password for the new account
	// Add bcrypt hashing logic here
};

const User = mongoose.model("User", userSchema);
module.exports = User;

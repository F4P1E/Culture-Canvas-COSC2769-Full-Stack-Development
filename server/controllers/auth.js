import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

// Register user
export const register = async (req, res) => {
	try {
		const {
			firstName,
			lastName,
			email,
			password,
			picturePath,
			friends,
			location,
			occupation,
		} = req.body;

		// Hash the password
		const salt = await bcrypt.genSalt();
		const passwordHash = await bcrypt.hash(password, salt);

		// Create new user object
		const newUser = new User({
			firstName,
			lastName,
			email,
			password: passwordHash,
			picturePath,
			friends,
			location,
			occupation,
			viewedProfile: Math.floor(Math.random() * 10000),
			impressions: Math.floor(Math.random() * 10000),
		});
		const savedUser = await newUser.save();
		res.status(201).json(savedUser);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Login user
export const login = async (req, res) => {
	try {
		// Find the requested user in the database
		const { email, password } = req.body;
		const user = await User.findOne({ email: email });
		if (!user) return res.status(400).json({ msg: "User does not exist." });

		// Compare passwords if the user exists
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(4000).json({ msg: "Invalid credentials." });

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); // Create and assign a token to the user ID
		delete user.password; // Remove the password from the user object

		// Return the token and the user object
		res.status(200).json({ token, user });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

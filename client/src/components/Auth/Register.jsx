// Importing React hooks for component state management.
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Importing action creator for setting register state.
import { setRegister } from "../../slices/authSlice";

// Register component for user registration.
const Register = () => {
	// Local state to manage input values for email, password, first name, and last name.
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUserName] = useState("");
	const dispatch = useDispatch(); // Hook to dispatch Redux actions.
	const navigate = useNavigate(); // Hook to navigate between routes.

	// Function to handle form submission for registration.
	const handleSubmit = async (e) => {
		e.preventDefault(); // Prevent default form submission behavior.

		// Send registration request to the server.
		const response = await fetch("http://localhost:8000/signup", {
			method: "POST", // HTTP method for the request.
			headers: { "Content-Type": "application/json" }, // Header to indicate JSON body.
			body: JSON.stringify({ username, email, password }), // Request body with registration data.
			credentials: "include", // Include credentials (cookies) in the request.
		});

		// Log success or error based on response status.
		if (response.ok) {
			const data = await response.json(); // Parse the response data.
			dispatch(setRegister(data)); // Dispatch register action with user data.
			navigate("/login"); // Redirect to the login page after register.
			console.log("Registration successful");
		} else {
			console.error("Registration failed");
		}
	};

	// Render registration form with input fields and submit button.
	return (
		<form onSubmit={handleSubmit}>
			<input
				type="text"
				placeholder="Username"
				value={username}
				onChange={(e) => setUserName(e.target.value)}
				required
			/>
			<br />
			<input
				type="email"
				placeholder="Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
			/>
			<br />
			<input
				type="password"
				placeholder="Password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
			/>
			<br />
			<button type="submit">Register</button>
		</form>
	);
};

export default Register;

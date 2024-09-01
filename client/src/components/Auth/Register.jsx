// Importing React hooks for component state management.
import React, { useState } from "react";

// Register component for user registration.
const Register = () => {
	// Local state to manage input values for email, password, first name, and last name.
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [username, setUserName] = useState("");

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
				placeholder="First Name"
				value={firstName}
				onChange={(e) => setFirstName(e.target.value)}
				required
			/>
			<br />
			<input
				type="text"
				placeholder="Last Name"
				value={lastName}
				onChange={(e) => setLastName(e.target.value)}
				required
			/>
			<br />
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

// Importing React hooks, Redux dispatch function, and navigation from React Router.
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Importing action creator for setting login state.
import { setLogin } from "../../slices/authSlice";

// Login component for user authentication.
const Login = () => {
	// Local state to manage input values for email and password.
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const dispatch = useDispatch(); // Hook to dispatch Redux actions.
	const navigate = useNavigate(); // Hook to navigate between routes.

	// Function to handle form submission for login.
	const handleSubmit = async (e) => {
		e.preventDefault(); // Prevent default form submission behavior.

		// Send login request to the server.
		const response = await fetch("http://localhost:8000/login", {
			method: "POST", // HTTP method for the request.
			headers: { "Content-Type": "application/json" }, // Header to indicate JSON body.
			body: JSON.stringify({ email, password }), // Request body with email and password.
			credentials: "include", // Include credentials (cookies) in the request.
		});

		// If the response is OK, update Redux store with user data.
		if (response.ok) {
			const data = await response.json(); // Parse the response data.
			dispatch(setLogin(data)); // Dispatch login action with user data.
			navigate("/home"); // Redirect to the dashboard page after login.
		} else {
			console.error("Login failed"); // Log error if login fails.
		}
	};

	// Render login form with input fields and submit button.
	return (
		<form onSubmit={handleSubmit}>
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
			<button type="submit">Login</button>
		</form>
	);
};

export default Login;

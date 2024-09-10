// SCSS
import "../styles/login.scss";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
	setLoginStart,
	setLoginSuccess,
	setLoginFailure,
} from "../../slices/authSlice";
import { useAuth } from "../../context/authContext";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { setUser } = useAuth();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { isLoading, error } = useSelector((state) => state.auth);

	const handleSubmit = async (e) => {
		e.preventDefault();

		dispatch(setLoginStart());

		try {
			const response = await fetch("http://localhost:8000/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
				credentials: "include",
			});
			if (!response.ok) {
				throw new Error("Login failed");
			}

			const data = await response.json();
			console.log(`${data}`);

			function removePassFromUser(user) {
				const { password, ...userWithoutPassword } = user;
				console.log(
					`Login Credentials: ${JSON.stringify(userWithoutPassword)}`
				);

				return userWithoutPassword;
			}

			setUser(removePassFromUser(data));

			dispatch(setLoginSuccess(data));
			// Check email domain to redirect
			if (email.endsWith("@admin")) {
				navigate("/admindashboard");
			} else {
				navigate("/home"); // Default redirection
			}
		} catch (error) {
			dispatch(setLoginFailure(error.message));
		}
	};

	const handleRedirectToRegister = (e) => {
		e.preventDefault();
		navigate("/register");
	};

	return (
		<div className="login-form">
			<h1>Culture Canvas</h1>
			<form onSubmit={handleSubmit}>
				{error && <p style={{ color: "red" }}>{error}</p>}
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					disabled={isLoading}
				/>
				<br />
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					disabled={isLoading}
				/>
				<br />
				<button className="btn-login" type="submit" disabled={isLoading}>
					{isLoading ? "Logging in..." : "Login"}
				</button>

				<br />
				<button onClick={handleRedirectToRegister}>Register now!</button>
			</form>
		</div>
	);
};

export default Login;

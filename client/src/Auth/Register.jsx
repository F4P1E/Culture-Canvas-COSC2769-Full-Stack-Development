import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setRegisterStart, setRegisterSuccess, setRegisterFailure } from "../slices/authSlice";

const Register = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, error } = useSelector((state) => state.auth);



 const handleSubmit = async (e) => {
	e.preventDefault();

	dispatch(setRegisterStart());

	// Email validation
	if (!email.endsWith("@gmail.com") && !email.endsWith("@admin")) {
		alert("Email must end with @gmail.com or @admin");
		return;
	}

	try {
		const response = await fetch("http://localhost:8000/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, email, password }),
			credentials: "include",
		});

		if (!response.ok) {
			throw new Error("Registration failed");
		}

		const data = await response.json();
		dispatch(setRegisterSuccess(data));
		navigate("/login");
	} catch (error) {
		dispatch(setRegisterFailure(error.message));
	}
};


  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUserName(e.target.value)}
        required
        disabled={isLoading}
      />
      <br />
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
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default Register;
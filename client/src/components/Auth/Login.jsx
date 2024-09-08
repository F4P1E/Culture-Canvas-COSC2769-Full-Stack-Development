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

      if (data.accessToken) {
  
        localStorage.setItem("accessToken", data.accessToken);
      } else {
        console.error("Access token not found in API response");
      }

      function removePassFromUser(user) {
        const { password, ...userWithoutPassword } = user;
        console.log(`Data: ${JSON.stringify(userWithoutPassword)}`);
        return userWithoutPassword;
      }

      setUser(removePassFromUser(data));
      dispatch(setLoginSuccess(data));

      // Check email domain to redirect
      if (email.endsWith("@gmail.com")) {
        navigate("/admin");
      } else if (email.endsWith("@admin")) {
        navigate("/admin");
      } else {
        navigate("/home"); // Default redirection
      }
    } catch (error) {
      dispatch(setLoginFailure(error.message));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <label>Email:</label>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={isLoading}
      />
      <br />
      <label>Password:</label>
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
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default Login;
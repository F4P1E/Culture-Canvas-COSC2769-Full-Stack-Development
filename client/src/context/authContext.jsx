import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  	if (!context) {
    throw Error('useAuthContext must be used inside an AuthContextProvider');
  }

  const setUser = (user) => {
    context.setUser(user);
  };

  return { ...context, setUser };
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(() => {
		// Retrieve user from localStorage if available

		const savedUser = localStorage.getItem("user");
		return savedUser ? JSON.parse(savedUser) : null;
	});

	const isAuthenticated = !!user;

	// Save user data to localStorage whenever it changes
	useEffect(() => {
		if (user) {
			localStorage.setItem("user", JSON.stringify(user));
		} else {
			localStorage.removeItem("user");
		}
	}, [user]);

	return (
		<AuthContext.Provider value={{ user, setUser, isAuthenticated }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
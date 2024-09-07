import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	user: null, // Stores the currently logged-in user's data
	isLoading: false, // Indicates if an authentication action is in progress
	error: null, // Stores any error messages related to authentication
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setRegisterStart: (state) => {
			state.isLoading = true;
			state.error = null;
		},
		setRegisterSuccess: (state, action) => {
			state.isLoading = false;
			// Ensure that action.payload contains the entire user object, including the role
			state.user = action.payload.user; 
		},
		setRegisterFailure: (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		},
		setLoginStart: (state) => {
			state.isLoading = true;
			state.error = null;
		},
		setLoginSuccess: (state, action) => {
			state.isLoading = false;
			// Assuming action.payload.user has the user data including the role
			state.user = action.payload.user;
		},
		setLoginFailure: (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		},
		setLogout: (state) => {
			state.user = null;
		},
	},
});

// Exporting actions
export const {
	setRegisterStart,
	setRegisterSuccess,
	setRegisterFailure,
	setLoginStart,
	setLoginSuccess,
	setLoginFailure,
	setLogout,
} = authSlice.actions;

// Default export the reducer
export default authSlice.reducer;

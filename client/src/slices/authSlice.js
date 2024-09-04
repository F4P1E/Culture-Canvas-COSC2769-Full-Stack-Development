// // Importing createSlice from Redux Toolkit to create a slice of the Redux state.
// import { createSlice } from "@reduxjs/toolkit";

// // Initial state for the authentication slice.
// const initialState = {
// 	user: null, // Stores the currently logged-in user's data
// };

// // Creating a slice for authentication with name 'auth'.
// const authSlice = createSlice({
// 	name: "auth",
// 	initialState, // Setting the initial state defined above
// 	reducers: {
// 		setRegister: (state, action) => {
// 			// Reducer to handle user registration
// 			state.user = action.payload.user; // Set the user data from action payload
// 		},
// 		setLogin: (state, action) => {
// 			// Reducer to handle user login
// 			state.user = action.payload.user; // Set the user data from action payload
// 		},
// 		setLogout: (state) => {
// 			// Reducer to handle user logout
// 			state.user = null; // Reset the user to null
// 		},
// 	},
// });

// // Exporting the action creators for register, login, and logout.
// export const { setRegister, setLogin, setLogout } = authSlice.actions;

// // Exporting the reducer to be used in the store.
// export default authSlice.reducer;

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

export const {
  setRegisterStart,
  setRegisterSuccess,
  setRegisterFailure,
  setLoginStart,
  setLoginSuccess,
  setLoginFailure,
  setLogout,
} = authSlice.actions;

export default authSlice.reducer;

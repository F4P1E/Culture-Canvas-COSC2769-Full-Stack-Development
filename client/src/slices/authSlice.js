// Importing createSlice from Redux Toolkit to create a slice of the Redux state.
import { createSlice } from '@reduxjs/toolkit';

// Initial state for the authentication slice.
const initialState = {
  user: null,   // Stores the currently logged-in user's data
  token: null,  // Stores the JWT token for authentication
};

// Creating a slice for authentication with name 'auth'.
const authSlice = createSlice({
  name: 'auth',
  initialState,  // Setting the initial state defined above
  reducers: {
    setLogin: (state, action) => {   // Reducer to handle user login
      state.user = action.payload.user;   // Set the user data from action payload
      state.token = action.payload.token; // Set the token from action payload
    },
    setLogout: (state) => {  // Reducer to handle user logout
      state.user = null;     // Reset the user to null
      state.token = null;    // Reset the token to null
    },
  },
});

// Exporting the action creators for login and logout.
export const { setLogin, setLogout } = authSlice.actions;

// Exporting the reducer to be used in the store.
export default authSlice.reducer;

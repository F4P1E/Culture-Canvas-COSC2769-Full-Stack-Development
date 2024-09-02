// Importing createSlice from Redux Toolkit to create a slice of the Redux state.
import { createSlice } from '@reduxjs/toolkit';

// Initial state for the authentication slice.
const initialState = {
  user: null,   // Stores the currently logged-in user's data
};

// Creating a slice for authentication with name 'auth'.
const authSlice = createSlice({
  name: 'auth',
  initialState,  // Setting the initial state defined above
  reducers: {
    setRegister: (state, action) => {  // Reducer to handle user registration
      state.user = action.payload.user;   // Set the user data from action payload
    },
    setLogin: (state, action) => {   // Reducer to handle user login
      state.user = action.payload.user;   // Set the user data from action payload
    },
    setLogout: (state) => {  // Reducer to handle user logout
      state.user = null;     // Reset the user to null
    },
  },
});

// Exporting the action creators for register, login, and logout.
export const { setRegister, setLogin, setLogout } = authSlice.actions;

// Exporting the reducer to be used in the store.
export default authSlice.reducer;

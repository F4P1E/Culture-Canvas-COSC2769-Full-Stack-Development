// Importing createSlice from Redux Toolkit to create a slice of the Redux state.
import { createSlice } from '@reduxjs/toolkit';

// Initial state for the notification slice.
const initialState = {
  notifications: [],  // Array to store notifications
};

// Creating a slice for notifications with name 'notifications'.
const notificationSlice = createSlice({
  name: 'notifications',
  initialState,  // Setting the initial state defined above
  reducers: {
    setNotifications: (state, action) => {   // Reducer to set notifications
      state.notifications = action.payload.notifications;  // Set notifications from action payload
    },
    addNotification: (state, action) => {   // Reducer to add a notification
      state.notifications.push(action.payload.notification);  // Add new notification to the array
    },
  },
});

// Exporting the action creators for the notification slice.
export const { setNotifications, addNotification } = notificationSlice.actions;

// Exporting the reducer to be used in the store.
export default notificationSlice.reducer;

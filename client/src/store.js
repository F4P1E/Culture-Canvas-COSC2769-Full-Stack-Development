// Importing configureStore from Redux Toolkit to create a Redux store.
import { configureStore } from '@reduxjs/toolkit';

// Importing reducers from different slices.
import authReducer from './slices/authSlice';
import postReducer from './slices/postSlice';
import groupReducer from './slices/groupSlice';
import notificationReducer from './slices/notificationSlice';

// Configuring the Redux store with reducers for authentication, posts, groups, and notifications.
const store = configureStore({
  reducer: {
    auth: authReducer,             // Reducer managing authentication state
    posts: postReducer,            // Reducer managing posts state
    groups: groupReducer,          // Reducer managing groups state
    notifications: notificationReducer,  // Reducer managing notifications state
  },
});

// Exporting the configured Redux store to be used in the application.
export default store;

// Importing necessary libraries and middleware
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage"; // LocalStorage for web
import { combineReducers } from "redux";

// Importing reducers from slices
import authReducer from "./slices/authSlice";
import friendsReducer from "./slices/friendSlice";
import postReducer from "./slices/postSlice";
import groupReducer from "./slices/groupSlice";
import notificationReducer from "./slices/notificationSlice";

// Configuration for redux-persist
const persistConfig = {
  key: "root",
  storage,
};

// Combining all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  friends: friendsReducer,
  posts: postReducer,
  groups: groupReducer,
  notifications: notificationReducer,
});

// Creating a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configuring the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      },
    }),
});

const persistor = persistStore(store);

// Exporting the store and persistor as named exports
export { store, persistor };

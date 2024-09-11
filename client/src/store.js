// Importing configureStore from Redux Toolkit to create a Redux store.
import { configureStore } from "@reduxjs/toolkit";

// Importing Redux library for persisting state.
import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { combineReducers } from "redux";

// Importing reducers from different slices.
import authReducer from "./slices/authSlice";
import friendsReducer from "./slices/friendSlice";
import postReducer from "./slices/postSlice";
import groupReducer from "./slices/groupSlice";
import notificationReducer from "./slices/notificationSlice";

// Configuration object for redux-persist
const persistConfig = {
	key: "root",
	storage,
};

const rootReducer = combineReducers({
	auth: authReducer,
	friends: friendsReducer,
	posts: postReducer,
	groups: groupReducer,
	notifications: notificationReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				// Ignore actions with these action types
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
});

const persistor = persistStore(store);

export default { store, persistor };

import { createSlice } from "@reduxjs/toolkit";

// Slice
const friendsSlice = createSlice({
	name: "friends",
	initialState: {
		friends: [],
		strangers: [],
		loading: false,
		error: null,
	},
	reducers: {
		// Set the friends list
		viewFriendList: (state, action) => {
			state.friends = action.payload;
			state.loading = false;
		},
		// Add a friend
		addFriend: (state, action) => {
			state.friends.push(action.payload);
			state.strangers = state.strangers.filter(
				(stranger) => stranger._id !== action.payload._id
			); // Remove from strangers
			state.loading = false;
		},
		// Remove a friend
		unFriend: (state, action) => {
			state.friends = state.friends.filter(
				(friend) => friend._id !== action.payload
			);
			state.loading = false;
		},
		// Accept a friend request
		acptFriendRequest: (state, action) => {
			state.friends.push(action.payload);
			state.loading = false;
		},
		// Cancel a friend request
		cancelFriendRequest: (state, action) => {
			state.friends = state.friends.filter(
				(friend) => friend._id !== action.payload
			);
			state.loading = false;
		},
		// Set the strangers list (users who are not friends)
		viewStrangersList: (state, action) => {
			state.strangers = action.payload;
			state.loading = false;
		},
		// Handle loading state
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		// Handle errors
		setError: (state, action) => {
			state.error = action.payload;
			state.loading = false;
		},
	},
});

export const {
	viewFriendList,
	addFriend,
	unFriend,
	acceptFriendRequest,
	cancelFriendRequest,
	viewStrangersList,
	setLoading,
	setError,
} = friendsSlice.actions;

export default friendsSlice.reducer;

// Importing createSlice from Redux Toolkit to create a slice of the Redux state.
import { createSlice } from "@reduxjs/toolkit";

// Initial state for the post slice.
const initialState = {
	posts: [], // Array to store all posts
};

// Creating a slice for posts with name 'posts'.
const postSlice = createSlice({
	name: "posts",
	initialState, // Setting the initial state defined above
	reducers: {
		setPosts: (state, action) => {
			// Reducer to set multiple posts
			state.posts = action.payload.posts; // Set posts from action payload
		},
		addPost: (state, action) => {
			// Reducer to add a new post
			state.posts.push(action.payload.post); // Add new post to the posts array
		},
		updatePost: (state, action) => {
			// Reducer to update a post
			const index = state.posts.findIndex(
				(post) => post._id === action.payload.post._id
			); // Find the index of the post to update
			if (index !== -1) {
				state.posts[index] = action.payload.post; // Update the post in the array
			}
		},
		deletePost: (state, action) => {
			// Reducer to delete a post
			state.posts = state.posts.filter(
				(post) => post._id !== action.payload.postId
			); // Remove post by ID
		},
		addComment: (state, action) => {
			// Reducer to add a comment to a post
			const postIndex = state.posts.findIndex(
				(post) => post._id === action.payload.postId
			); // Find the index of the post to add the comment to
			if (postIndex !== -1) {
				state.posts[postIndex].comments = state.posts[postIndex].comments || []; // Initialize comments array if it doesn't exist
				state.posts[postIndex].comments.push(action.payload.comment); // Add the new comment to the comments array
			}
		},
	},
});

// Exporting the action creators for the post slice.
export const { setPosts, addPost, updatePost, deletePost, addComment } =
	postSlice.actions;

// Exporting the reducer to be used in the store.
export default postSlice.reducer;

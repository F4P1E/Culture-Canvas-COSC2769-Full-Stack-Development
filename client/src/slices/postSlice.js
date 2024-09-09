// Importing createSlice from Redux Toolkit to create a slice of the Redux state.
import { createSlice } from "@reduxjs/toolkit";

// Initial state for the post slice.
const initialState = {
	posts: [], // Array to store all posts
	postHistories: [],
	commentHistories: [],
	comments: [],
	isLoading: false, // Track loading state
	error: null, // Track errors
	reactions: [],
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
		setCommentHistory: (state, action) => {
			// Reducer to set multiple posts
			state.commentHistories = action.payload; // Set posts from action payload
		},
		setPostHistory: (state, action) => {
			// Reducer to set multiple posts
			state.postHistories = action.payload; // Set posts from action payload
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
		getComments: (state, action) => {
			// Reducer to set comments for a post
			state.comments = action.payload;
		},
		addComment: (state, action) => {
			// Reducer to add a comment to a post
			const postIndex = state.posts.findIndex(
				(post) => post._id === action.payload.postId
			); // Find the index of the post to add the comment to
			if (postIndex !== -1) {
				state.posts[postIndex].comments = state.posts[postIndex].comments || []; // Initialize comments array if it doesn't exist
				state.posts[postIndex].comments.push(action.payload.comment); // Add the new comment to the comments array
				state.posts[postIndex].commentCount += 1; // Increment comment count
			}
		},
		deleteComment: (state, action) => {
			// Reducer to delete a comment from a post
			const postIndex = state.posts.findIndex(
				(post) => post._id === action.payload.postId
			);
			if (postIndex !== -1) {
				state.posts[postIndex].comments = state.posts[
					postIndex
				].comments.filter(
					(comment) => comment._id !== action.payload.commentId
				); // Remove the comment
				state.posts[postIndex].commentCount -= 1; // Decrement comment count
			}
		},
		updateComment: (state, action) => {
			// Reducer to update a comment
			const postIndex = state.posts.findIndex(
				(post) => post._id === action.payload.postId
			);
			if (postIndex !== -1) {
				const commentIndex = state.posts[postIndex].comments.findIndex(
					(comment) => comment._id === action.payload.comment._id
				);
				if (commentIndex !== -1) {
					state.posts[postIndex].comments[commentIndex] =
						action.payload.comment; // Update the comment
				}
			}
		},
		addReaction: (state, action) => {
			const postIndex = state.posts.findIndex(
				(post) => post._id === action.payload.postId
			);
		
			if (postIndex !== -1) {
				// Ensure reactions array exists
				state.posts[postIndex].reactions = state.posts[postIndex].reactions || [];
		
				// Find existing reaction
				const existingReaction = state.posts[postIndex].reactions.find(
					(reaction) => reaction.userId.toString() === action.payload.userId.toString()
				);
		
				if (existingReaction) {
					// Update reaction
					existingReaction.reactionType = action.payload.reactionType;
				} else {
					// Add new reaction
					state.posts[postIndex].reactions.push({
						userId: action.payload.userId,
						reactionType: action.payload.reactionType,
					});
				}
		
				// Update reaction count
				state.posts[postIndex].reactionCount = state.posts[postIndex].reactions.length;
			}
		},
		
		addCommentReaction: (state, action) => {
			// Reducer to add or update a reaction to a comment
			const postIndex = state.posts.findIndex(
				(post) => post._id === action.payload.postId
			);
			if (postIndex !== -1) {
				const commentIndex = state.posts[postIndex].comments.findIndex(
					(comment) => comment._id === action.payload.commentId
				);
				if (commentIndex !== -1) {
					const existingReaction = state.posts[postIndex].comments[
						commentIndex
					].reactions.find(
						(reaction) => reaction.userId === action.payload.userId
					);
					if (existingReaction) {
						existingReaction.reactionType = action.payload.reactionType; // Update comment reaction
					} else {
						state.posts[postIndex].comments[commentIndex].reactions.push({
							userId: action.payload.userId,
							reactionType: action.payload.reactionType,
						}); // Add new reaction to comment
					}
					state.posts[postIndex].comments[commentIndex].reactionCount =
						state.posts[postIndex].comments[commentIndex].reactions.length;
				}
			}
		},
		setError: (state, action) => {
			// Reducer to handle errors
			state.error = action.payload.error;
		},
		setLoading: (state, action) => {
			// Reducer to handle loading state
			state.isLoading = action.payload.isLoading;
		},
		setCommentFailure: (state, action) => {
			// Reducer to handle comment-specific errors
			state.commentFailure = action.payload;
		},
	},
});

// Exporting the action creators for the post slice.
export const {
	setPosts,
	addPost,
	updatePost,
	deletePost,
	getComments,
	addComment,
	setPostHistory,
	setCommentHistory,
	deleteComment,
	updateComment,
	addReaction,
	addCommentReaction,
	setError,
	setLoading,
	setCommentFailure,
} = postSlice.actions;

// Exporting the reducer to be used in the store.
export default postSlice.reducer;

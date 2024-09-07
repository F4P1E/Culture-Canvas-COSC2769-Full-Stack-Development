
// Importing createSlice from Redux Toolkit to create a slice of the Redux state.
import { createSlice } from "@reduxjs/toolkit";

// Initial state for the group slice.
const initialState = {
	groups: [], // Array to store all groups
	currentGroupId: null, // Stores the currently selected group ID
	requests: [], // Array to store pending join requests
	groupInfo: {}, // New field to store detailed group information
	members: [], // Array to store members of the current group, excluding the current user
};

// Creating a slice for groups with name 'groups'.
const groupSlice = createSlice({
	name: "groups",
	initialState, // Setting the initial state defined above
	reducers: {
		setGroups: (state, action) => {
			// Reducer to set multiple groups
			state.groups = action.payload; // Set groups directly from action payload
		},
		fetchOneGroupInfo: (state, action) => {
			state.groupInfo = action.payload; // Store the detailed information of one group
		},
		setRequests: (state, action) => {
			// Reducer to set the list of join requests
			state.requests = action.payload; // Set the requests directly from action payload
		},
		setMembers: (state, action) => {
			const { groupId, members, currentUserId } = action.payload;

			// Filter out the current user from the members list
			state.members = members.filter((member) => member._id !== currentUserId);
		},
		addGroup: (state, action) => {
			// Reducer to add a new group
			state.groups.push(action.payload.group); // Add new group to the groups array
		},
		removeGroup: (state, action) => {
			// Reducer to remove a group
			state.groups = state.groups.filter(
				(group) => group._id !== action.payload.groupId
			); // Remove group by ID
		},
		// Reducer to handle join request for a group
		requestJoinGroup: (state, action) => {
			const group = state.groups.find(
				(group) => group._id === action.payload.groupId
			);
			if (group) {
				state.requests.push({
					groupId: action.payload.groupId,
					userId: action.payload.userId,
				});
			}
		},
		// Reducer to handle approval of a join request
		approveJoinRequest: (state, action) => {
			const group = state.groups.find(
				(group) => group._id === action.payload.groupId
			);
			if (group) {
				// Add the approved user to the group members
				group.members.push(action.payload.userId);
				// Remove the request from the requests array
				state.requests = state.requests.filter(
					(request) => request.userId !== action.payload.userId
				);
			}
		},
		// Reducer to delete a member from the group
		deleteMemberFromGroup: (state, action) => {
			const group = state.groups.find(
				(group) => group._id === action.payload.groupId
			);
			if (group) {
				// Remove the member from the group
				group.members = group.members.filter(
					(memberId) => memberId !== action.payload.userId
				);
			}
		},
		deletePostFromGroup: (state, action) => {
			const { groupId, postId } = action.payload;

			// Find the group that contains the post
			const group = state.groups.find((group) => group._id === groupId);

			if (group) {
				// Remove the post from the group's posts array
				group.posts = group.posts.filter((post) => post._id !== postId);
			}
		},
		removeCommentFromPost: (state, action) => {
			const { groupId, postId, commentId } = action.payload;

			// Find the group that contains the post
			const group = state.groups.find((group) => group._id === groupId);

			if (group) {
				// Find the post within the group
				const post = group.posts.find((post) => post._id === postId);

				if (post) {
					// Remove the comment from the post's comments array
					post.comments = post.comments.filter(
						(comment) => comment._id !== commentId
					);
				}
			}
		},
	},
});

// Exporting the action creators for the group slice.
export const {
	setGroups,
	setCurrentGroup,
	fetchOneGroupInfo,
	setRequests,
	setMembers,
	addGroup,
	removeGroup,
	requestJoinGroup,
	approveJoinRequest,
	deleteMemberFromGroup,
	deletePostFromGroup,
	removeCommentFromPost,
} = groupSlice.actions;

// Exporting the reducer to be used in the store.
export default groupSlice.reducer;

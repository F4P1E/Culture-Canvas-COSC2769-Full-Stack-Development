// Importing createSlice from Redux Toolkit to create a slice of the Redux state.
import { createSlice } from '@reduxjs/toolkit';

// Initial state for the group slice.
const initialState = {
  groups: [],            // Array to store all groups
  currentGroupId: null,  // Stores the currently selected group ID
};

// Creating a slice for groups with name 'groups'.
const groupSlice = createSlice({
  name: 'groups',
  initialState,  // Setting the initial state defined above
  reducers: {
    setGroups: (state, action) => {   // Reducer to set multiple groups
      state.groups = action.payload;  // Set groups directly from action payload
    },
    setCurrentGroup: (state, action) => {   // Reducer to set the current group
      state.currentGroupId = action.payload.groupId;  // Set the current group ID
    },
    addGroup: (state, action) => {   // Reducer to add a new group
      state.groups.push(action.payload.group);  // Add new group to the groups array
    },
    removeGroup: (state, action) => {   // Reducer to remove a group
      state.groups = state.groups.filter(group => group._id !== action.payload.groupId);  // Remove group by ID
    },
  },
});

// Exporting the action creators for the group slice.
export const { setGroups, setCurrentGroup, addGroup, removeGroup } = groupSlice.actions;

// Exporting the reducer to be used in the store.
export default groupSlice.reducer;
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setGroups, setCurrentGroup, addGroup, removeGroup } from '../../slices/groupSlice';

const GroupList = () => {
  const dispatch = useDispatch();

  // Access user ID and groups from the Redux store
  const userId = useSelector((state) => state.auth.user?._id);
  const groups = useSelector((state) => state.groups.groups);  // Access the groups array from state
  const currentGroupId = useSelector((state) => state.groups.currentGroupId); // Access the current group ID

  // State to handle new group input
  const [newGroupName, setNewGroupName] = useState('');

  // Fetch groups when the component mounts or userId changes.
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('http://localhost:8000/group', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json(); // Parse the response data.
        dispatch(setGroups(data));  // Update Redux store with fetched groups.
      } catch (err) {
        console.error('Failed to fetch groups:', err);
      }
    };

    if (userId) {
      fetchGroups();
    }
  }, [userId, dispatch]);

  // Handle selecting the current group
  const handleSelectGroup = (groupId) => {
    dispatch(setCurrentGroup({ groupId }));  // Set the current group in Redux store
  };

  // Handle adding a new group
  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      const newGroup = {
        _id: Math.random().toString(36).substr(2, 9),  // Generate a random ID for the new group
        name: newGroupName,
      };
      dispatch(addGroup({ group: newGroup }));  // Dispatch action to add the new group
      setNewGroupName('');  // Clear the input
    }
  };

  // Handle removing a group
  const handleRemoveGroup = (groupId) => {
    dispatch(removeGroup({ groupId }));  // Dispatch action to remove the group
  };

  return (
    <div>
      <h2>Group List</h2>
      
      {/* Input field for adding a new group */}
      <input 
        type="text" 
        value={newGroupName} 
        onChange={(e) => setNewGroupName(e.target.value)} 
        placeholder="New group name"
      />
      <button onClick={handleAddGroup}>Add Group</button>

      <ul>
        {groups.map((group) => (
          <li key={group._id}>
            {group.name}
            {currentGroupId === group._id ? ' (Current)' : ''} 
            <button onClick={() => handleSelectGroup(group._id)}>Select</button>
            <button onClick={() => handleRemoveGroup(group._id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupList;

// Importing React hooks, Redux hooks, and action creators.
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setGroups, removeGroup } from '../../slices/groupSlice';

// GroupAdmin component for managing groups.
const GroupAdmin = () => {
  const dispatch = useDispatch();  // Hook to dispatch Redux actions.
  const groups = useSelector((state) => state.groups.groups);  // Selector to access groups state from Redux store.
  const [loading, setLoading] = useState(true);  // State to manage loading state.
  const [error, setError] = useState(null);  // State to manage error state.

  // Fetch groups from the server when the component mounts.
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('http://localhost:3001/routes/groups', {
          method: 'GET',  // HTTP method for the request.
        });

        if (!response.ok) {
          throw new Error('Failed to fetch groups');  // Throw error if response is not ok.
        }

        const data = await response.json();  // Parse the response data.
        dispatch(setGroups(data.groups));  // Dispatch action to set groups in Redux store.
      } catch (err) {
        setError(err.message);  // Set error message if fetch fails.
      } finally {
        setLoading(false);  // Set loading to false when fetch completes.
      }
    };

    fetchGroups();  // Call the fetch function.
  }, [dispatch]);  // Dependency array to run effect when dispatch changes.

  // Function to handle group removal.
  const handleRemoveGroup = async (groupId) => {
    try {
      const response = await fetch(`http://localhost:3001/routes/groups/${groupId}`, {
        method: 'DELETE',  // HTTP method to delete a group.
      });

      if (!response.ok) {
        throw new Error('Failed to remove group');  // Throw error if response is not ok.
      }

      dispatch(removeGroup({ groupId }));  // Dispatch action to remove group by ID.
    } catch (err) {
      console.error('Error removing group:', err.message);  // Log error to console.
    }
  };

  // Render loading state, error message, or list of groups.
  return (
    <>
      {loading ? (  // Display loading message if loading.
        <p>Loading groups...</p>
      ) : error ? (  // Display error message if there is an error.
        <p>Error: {error}</p>
      ) : (
        <ul>
          {groups.map((group) => (  // Map over groups array to render each group.
            <li key={group._id}>
              {group.name}
              <button onClick={() => handleRemoveGroup(group._id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default GroupAdmin;

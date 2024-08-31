// Importing React hooks, Redux hooks, and action creators.
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setGroups, removeGroup } from '../../slices/groupSlice';

// GroupAdmin component for managing groups.
const GroupAdmin = () => {
  const dispatch = useDispatch();  // Hook to dispatch Redux actions.
  const groups = useSelector((state) => state.groups.groups);  // Selector to access groups state from Redux store.
  const token = useSelector((state) => state.auth.token);  // Selector to access auth token from Redux store.

  // Fetch groups from the server when the component mounts.
  useEffect(() => {
    const fetchGroups = async () => {
      const response = await fetch('http://localhost:3001/routes/groups', {
        method: 'GET',  // HTTP method for the request.
        headers: { Authorization: `Bearer ${token}` },  // Authorization header with token.
      });
      const data = await response.json();  // Parse the response data.
      dispatch(setGroups(data.groups));  // Dispatch action to set groups in Redux store.
    };

    fetchGroups();  // Call the fetch function.
  }, [dispatch, token]);  // Dependency array to run effect when dispatch or token changes.

  // Function to handle group removal.
  const handleRemoveGroup = (groupId) => {
    dispatch(removeGroup({ groupId }));  // Dispatch action to remove group by ID.
  };

  // Render a list of groups with remove buttons.
  return (
    <ul>
      {groups.map((group) => (  // Map over groups array to render each group.
        <li key={group._id}>
          {group.name}
          <button onClick={() => handleRemoveGroup(group._id)}>Remove</button>
        </li>
      ))}
    </ul>
  );
};

export default GroupAdmin;

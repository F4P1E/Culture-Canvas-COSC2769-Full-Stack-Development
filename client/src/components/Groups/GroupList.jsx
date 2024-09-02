// Importing React hooks for state and effect, and Redux hook for accessing state.
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const GroupList = () => {
  const [groups, setGroups] = useState([]); // Local state for storing groups.

  // useEffect to fetch groups when the component mounts or token changes.
  useEffect(() => {
    const fetchGroups = async () => {
      // Fetch groups from server.
      const response = await fetch('/api/groups', {

      });
      const data = await response.json(); // Parse the response data.
      setGroups(data); // Update state with fetched groups.
    };

    fetchGroups(); // Call the fetch function.
  }, []); 

  // Render a list of groups.
  return (
    <div>
      <ul>
        {groups.map((group) => ( // Map over groups array to render each group.
          <li key={group._id}>{group.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default GroupList;

// src/components/Friends/FriendList.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// Functional component to display a list of friends
const FriendList = () => {
  // State to hold the list of friends
  const [friends, setFriends] = useState([]);

  // Access user ID and authentication token from the Redux store
  const userId = useSelector((state) => state.auth.user?._id);
  const token = useSelector((state) => state.auth.token);

  // useEffect hook to fetch friends data when the component mounts or dependencies change
  useEffect(() => {
    // Function to fetch friends data from the API
    const fetchFriends = async () => {
      try {
        // Fetch friends data from the API with authorization header
        const response = await fetch(`/api/users/${userId}/friends`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // Parse the response JSON
        const data = await response.json();
        
        // Update the state with the fetched friends data
        setFriends(data);
      } catch (error) {
        // Handle errors (e.g., network issues, invalid responses)
        console.error('Failed to fetch friends:', error);
      }
    };

    // Only fetch friends if userId is available (ensures user is logged in)
    if (userId) {
      fetchFriends();
    }
  }, [userId, token]); // Dependencies array: runs the effect if userId or token changes

  return (
    <div>
      <ul>
        {/* Render the list of friends */}
        {friends.map((friend) => (
          <li key={friend._id}>
            {/* Display friend's first and last names */}
            {friend.firstName} {friend.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Export the component for use in other parts of the application
export default FriendList;

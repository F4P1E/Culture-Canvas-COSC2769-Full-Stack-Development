// Importing React hooks for state and effect, and Redux hook for accessing state.
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { acceptFriendRequest, viewFriendRequest } from '../../slices/friendSlice';

const FriendRequest = () => {
  const { requestId } = useSelector((state) => state.friends.requests); // Accessing strangers list from Redux store.
  const dispatch = useDispatch(); // Hook to dispatch Redux actions.

  // Access user ID from the Redux store
	const userId = useSelector((state) => state.auth.user?._id);

  // useEffect to fetch friend requests when the component mounts.
  useEffect(() => {
    const fetchRequests = async () => {
      const response = await fetch(`http://localhost:8000/${userId}/requests`, {
        method: "GET",
				credentials: "include",
      }) ;
      const data = await response.json(); // Parse the response data.
      dispatch(viewFriendRequest(data)); // Update state with fetched requests.
    };

    if (userId) {
      fetchRequests(); // Call the fetch function.
    }
    
  }, []); // Empty dependency array to run effect once when component mounts.

  // Function to handle accepting a friend request.
  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:8000/friendRequest/${requestId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Network error');
      }

      const data = await response.json();
      // Dispatch the acceptFriendRequest action.
      dispatch(acceptFriendRequest(data));
      
    } catch (error) {
      console.error('Failed to accept friend request:', error);
    }
  };

  // Render a list of friend requests with Accept button.
  return (
    <div>
      <ul>
        {requests.map((request) => ( // Map over requests array to render each request.
          <li key={request._id}>
            {request.username} 
            <button onClick={() => handleAcceptRequest(request.sender._id)}>
              Accept friend request
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendRequest;

// Importing React hooks for state and effect, and Redux hook for accessing state.
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { acceptFriendRequest, viewStrangersList } from '../../slices/friendSlice';

const FriendRequest = () => {
  const [requests, setRequests] = useState([]); // Local state for storing friend requests.
  const { strangers } = useSelector((state) => state.friends); // Accessing strangers list from Redux store.
  const dispatch = useDispatch(); // Hook to dispatch Redux actions.

  // useEffect to fetch friend requests when the component mounts.
  useEffect(() => {
    const fetchRequests = async () => {
      const response = await fetch('/api/friend-requests');
      const data = await response.json(); // Parse the response data.
      setRequests(data); // Update state with fetched requests.
    };

    fetchRequests(); // Call the fetch function.
  }, []); // Empty dependency array to run effect once when component mounts.

  // Function to handle accepting a friend request.
  const handleAcceptRequest = async (strangerId) => {
    try {
      const response = await fetch(`/api/friend-request/${strangerId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to accept friend request');
      }

      // Dispatch the acceptFriendRequest action.
      dispatch(acceptFriendRequest(strangerId));

      // Update the local state to remove the accepted request from the list.
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.sender._id !== strangerId)
      );

      // Remove the stranger from the strangers list.
      dispatch(viewStrangersList(strangers.filter((stranger) => stranger._id !== strangerId)));
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  // Render a list of friend requests with Accept button.
  return (
    <div>
      <ul>
        {requests.map((request) => ( // Map over requests array to render each request.
          <li key={request._id}>
            {request.sender.firstName} {request.sender.lastName}
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

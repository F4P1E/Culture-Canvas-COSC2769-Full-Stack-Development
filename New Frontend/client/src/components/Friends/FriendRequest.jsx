// Importing React hooks for state and effect, and Redux hook for accessing state.
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const FriendRequest = () => {
  const [requests, setRequests] = useState([]); // Local state for storing friend requests.
  const token = useSelector((state) => state.auth.token); // Accessing auth token from Redux store.

  // useEffect to fetch friend requests when the component mounts or token changes.
  useEffect(() => {
    const fetchRequests = async () => {
      // Fetch friend requests from server.
      const response = await fetch('/api/friend-requests', {
        headers: { Authorization: `Bearer ${token}` }, // Authorization header with token.
      });
      const data = await response.json(); // Parse the response data.
      setRequests(data); // Update state with fetched requests.
    };

    fetchRequests(); // Call the fetch function.
  }, [token]); // Dependency array with token to refetch when it changes.

  // Render a list of friend requests with Accept and Reject buttons.
  return (
    <div>
      <h2>Friend Requests</h2>
      <ul>
        {requests.map((request) => ( // Map over requests array to render each request.
          <li key={request._id}>
            {request.sender.firstName} {request.sender.lastName}
            <button>Accept</button>
            <button>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendRequest;

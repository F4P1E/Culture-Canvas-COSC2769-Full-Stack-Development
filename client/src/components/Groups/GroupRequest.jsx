// Importing React hooks for state and effect, and Redux hook for accessing state.
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const GroupRequest = () => {
  const [requests, setRequests] = useState([]); // Local state for storing group requests.

  // useEffect to fetch group requests when the component mounts.
  useEffect(() => {
    const fetchRequests = async () => {
      // Fetch group requests from server.
      const response = await fetch('/api/group-requests', {
        headers: { Authorization: `Bearer ${token}` }, // Authorization header with token.
      });
      const data = await response.json(); // Parse the response data.
      setRequests(data); // Update state with fetched requests.
    };

    fetchRequests(); // Call the fetch function.
  }); // Dependency array with token to refetch when it changes.

  // Render a list of group requests with Approve and Reject buttons.
  return (
    <div>
      <h2>Group Requests</h2>
      <ul>
        {requests.map((request) => ( // Map over requests array to render each request.
          <li key={request._id}>
            {request.sender.firstName} {request.sender.lastName}
            <button>Approve</button>
            <button>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupRequest;

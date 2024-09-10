import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRequests, addGroup } from "../../slices/groupSlice"; // Import actions from groupSlice

const GroupCreationRequest = () => {
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.groups.requests); // Get requests from Redux state
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling

  // Fetch group creation requests from the backend
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/group/create/requests", {
            method: "GET",
            credentials: 'include',
        }); // Fetch group creation requests (assuming your API endpoint is set up this way)
        const data = await response.json();
        if (response.ok) {
          dispatch(setRequests(data)); // Update Redux state with the fetched requests
        } else {
          setError(data.error || "Failed to fetch group requests.");
        }
      } catch (err) {
        setError("An error occurred while fetching group requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [dispatch]);

  // Approve group creation request
  const handleApproveRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:8000/group/create/approve/${requestId}`, {
        method: "POST", // Assuming the approval endpoint is set up with POST
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        dispatch(addGroup({ group: data.group })); // Add the new group to Redux state
        dispatch(setRequests(requests.filter((req) => req._id !== requestId))); // Remove the approved request from the requests 
        alert("Group creation request approved!");
      } else {
        setError(data.message || "Failed to approve the request.");
      }
    } catch (err) {
      setError("An error occurred while approving the request.");
    }
  };

  return (
    <div>
      <h2>Group Creation Requests</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {requests.map((request) => (
          <li key={request._id}>
            <p>
              <strong>Group Name:</strong> {request.name}
            </p>
            <p>
              <strong>Requested By:</strong> {request.admins[0].username}
            </p>
            <button onClick={() => handleApproveRequest(request._id)}>
              Approve Request
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupCreationRequest;

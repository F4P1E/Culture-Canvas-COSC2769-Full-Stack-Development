import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setGroups, setCurrentGroup, setRequests, setMembers, approveJoinRequest, deleteMemberFromGroup, deletePostFromGroup, removeCommentFromPost } from '../../slices/groupSlice';

const GroupAdmin = () => {
  const dispatch = useDispatch();
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  const userId = useSelector((state) => state.auth.user?._id);
  const groups = useSelector((state) => state.groups.groups);  // Access the groups array from state
  const requests = useSelector((state) => state.groups.requests);
  const members = useSelector((state) => state.groups.members);

  const currentGroupId = useSelector((state) => state.groups.currentGroupId);

  // Fetch groups when the component mounts
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('http://localhost:8000/group/joined/admin', {
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
  }, [userId, dispatch]); // Dependency array to refetch when it changes.

  // useEffect to fetch group requests when the component mounts.
  useEffect(() => {   
    const fetchRequests = async () => {
      if (!currentGroupId) return; // Exit if no groupId is available

      try {
        const response = await fetch(`http://localhost:8000/group/${currentGroupId}/requests`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json(); // Parse the response data.
        dispatch(setRequests({groupId: currentGroupId, requests: data}));  // Update Redux store with fetched groups.
      } catch (err) {
        console.error('Failed to fetch requests:', err);
      }
    };

    if (userId) {
      fetchRequests();
    } 
  }, [userId, currentGroupId, dispatch]); // Dependency array to refetch when it changes.

  // useEffect to fetch group members when the component mounts.
  useEffect(() => {
    const fetchMembers = async () => {
      if (!currentGroupId) return; // Exit if no groupId is available
      try {
        const response = await fetch(`http://localhost:8000/group/joined/${currentGroupId}/members`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json(); // Parse the response data.
        dispatch(setMembers({groupId: currentGroupId, members: data}));  // Update Redux store with fetched groups.
      } catch (err) {
        console.error('Failed to fetch members:', err);
      }
    };

    if (userId) {
      fetchMembers();
    } 
  }, [userId, currentGroupId, dispatch]); // Dependency array to refetch when it changes.

  // Handle approving a join request
  const handleApproveJoinRequest = (groupId) => {
  
    const approveRequest = async () => {
			try {
				// Send DELETE request to the server to unfriend the user
				const response = await fetch(
					`http://localhost:8000/group/approve/${groupId}/:requestId`,
					{
						method: "POST",
						credentials: "include",
					}
				);

				// Check if the response is ok
				if (!response.ok) {
					throw new Error("Failed to approve request");
				}

				const data = await response.json(); // Parse the response data.
				dispatch(approveJoinRequest(data));
			} catch (error) {
				// Handle any errors
				console.error("Network error:", error);
			}
		};

		// Only proceed if userId is available
		if (userId) {
			approveRequest();
		}
  };

  // Handle deleting a member from a group
  const handleDeleteMember = (groupId, memberId) => {
    const deleteMember = async () => {
			try {
				// Send DELETE request to the server to unfriend the user
				const response = await fetch(
					`http://localhost:8000/group/approve/${groupId}/${memberId}`,
					{
						method: "DELETE",
						credentials: "include",
					}
				);

				// Check if the response is ok
				if (!response.ok) {
					throw new Error("Failed to remove this member");
				}

				const data = await response.json(); // Parse the response data.
				dispatch(deleteMemberFromGroup(data));
			} catch (error) {
				// Handle any errors
				console.error("Network error:", error);
			}
		};

		// Only proceed if userId is available
		if (userId) {
			deleteMember();
		}
  };

  // Handle deleting a post from a group
  const handleDeletePost = () => {
    if (selectedGroupId && selectedPostId) {
      dispatch(deletePostFromGroup({ groupId: selectedGroupId, postId: selectedPostId }));
      setSelectedPostId('');
    }
  };

  // Handle removing a comment from a post
  const handleRemoveComment = () => {
    if (selectedGroupId && selectedPostId && selectedCommentId) {
      dispatch(removeCommentFromPost({ groupId: selectedGroupId, postId: selectedPostId, commentId: selectedCommentId }));
      setSelectedCommentId('');
    }
  };

  return (
    <div>
      <h2>Group Admin Panel</h2>
      
      {/* Group selection */}
      <div>
        <h3>Group Selection</h3>
        <select onChange={(e) => setSelectedGroupId(e.target.value)} value={selectedGroupId || ''}>
          <option value="" disabled>Select a group</option>
          {groups.map((group) => (
            <option key={group._id} value={group._id}>{group.name}</option>
          ))}
        </select>
      </div>
      {groups.map((group) => (
        console.log(`Group: ${group}\nGroup ID: ${group._id}`)
      ))}

      <div>
      <h3>Group Requests</h3>
      <ul>
        {requests.map((request) => ( // Map over requests array to render each request.
          <li key={request._id}>
            {request.sender.username}
            <button onClick={handleApproveJoinRequest}>Approve Request</button>
          </li>
        ))}
      </ul>
    </div>

    <div>
      <h3>Group Members</h3>
      <ul>
        {members.map((member) => ( // Map over requests array to render each request.
          <li>
            {member.username}
            <button onClick={handleDeleteMember}>Remove Member</button>
          </li>
        ))}
      </ul>
    </div>

      {/* Delete post */}
      <div
          value={selectedPostId} 
          onChange={(e) => setSelectedPostId(e.target.value)} 
        />
        <button onClick={handleDeletePost}>Delete Post</button>

      {/* Remove comment */}
      <div 
          value={selectedCommentId} 
          onChange={(e) => setSelectedCommentId(e.target.value)} 
        />
        <button onClick={handleRemoveComment}>Remove Comment</button>
      </div>
  );
};

export default GroupAdmin;

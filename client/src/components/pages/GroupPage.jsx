// Importing React hooks for state and effect, routing hook, and Redux hook for accessing state.
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import GroupAdmin from '../Groups/GroupAdmin'; // Importing GroupAdmin component.
import PostFeed from '../Posts/PostFeed'; // Importing PostFeed component.

const GroupPage = () => {
  const { id } = useParams(); // Getting group ID from route parameters.
  const [group, setGroup] = useState(null); // Local state for storing group data.
  const token = useSelector((state) => state.auth.token); // Accessing auth token from Redux store.

 
  useEffect(() => {
    const fetchGroup = async () => {
      // Fetch group data from server.
      const response = await fetch(`http://localhost:8000/group/${id}`, {
        headers: { Authorization: `Bearer ${token}` }, // Authorization header with token.
      });
      const data = await response.json(); 
      setGroup(data); // Update state with fetched group data.
    };

    fetchGroup(); 
  }, [id, token]); // Dependency array with ID and token to refetch when they change.

  if (!group) return <div>Loading...</div>; 

  // Render the group page with group details, admin actions, and posts.
  return (
    <div>
      <h1>{group.name}</h1>
      <p>{group.description}</p>
      {group.admin && <GroupAdmin groupId={id} />} 
      <h2>Group Posts</h2>
      <PostFeed posts={group.posts} /> 
    </div>
  );
};

export default GroupPage;

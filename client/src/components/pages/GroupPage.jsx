// Importing React hooks for state and effect, routing hook, and Redux hook for accessing state.
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import GroupAdmin from "../Groups/GroupAdmin"; // Importing GroupAdmin component.
import PostFeed from "../Posts/PostFeed"; // Importing PostFeed component.
import GroupVisibility from "./GroupVisibility";

const GroupPage = () => {
  const { id } = useParams(); // Getting group ID from route parameters.
  const [group, setGroup] = useState(null); // Local state for storing group data.
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.auth.token); // Accessing auth token from Redux store.

  // useEffect to fetch group data when the component mounts or ID/token changes.
  useEffect(() => {
    const fetchGroup = async () => {
      // Fetch group data from server.
      const response = await fetch(`/api/groups/${id}`, {
        headers: { Authorization: `Bearer ${token}` }, // Authorization header with token.
      });
      const data = await response.json(); // Parse the response data.
      setGroup(data); // Update state with fetched group data.
      
    };

    fetchGroup(); // Call the fetch function.
  }, [id, token]); // Dependency array with ID and token to refetch when they change.

  if (!group) return <div>Loading...</div>; // Loading state while fetching data.

  // Render the group page with group details, admin actions, and posts.
  return (
    <div>
      <h1>{group.name}</h1>
      <p>{group.description}</p>
      <GroupVisibility
        visibility={group.visibility}
        isAdmin={group.admin}
        onChangeVisibility={handleVisibilityChange}
      />
      {group.admin && <GroupAdmin groupId={id} />} {/* Conditionally render */}
      GroupAdmin if user is admin.
      <h2>Group Posts</h2>
      <PostFeed posts={group.posts} />  {/* Render PostFeed with group's posts. */}
    </div>
  );
};

export default GroupPage;

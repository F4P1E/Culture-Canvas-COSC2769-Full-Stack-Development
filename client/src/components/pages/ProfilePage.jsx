// Importing React hooks for state and effect, routing hook, and Redux hook for accessing state.
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import FriendList from "../Friends/FriendList"; // Importing FriendList component.
import PostFeed from "../Posts/PostFeed"; // Importing PostFeed component.
import "../../styles/ProfilePage.scss";

const ProfilePage = () => {
  const { id } = useParams(); // Getting user ID from route parameters.
  const [profile, setProfile] = useState(null); // Local state for storing profile data.
  const [posts, setPosts] = useState([]); // Local state for storing posts.
  const token = useSelector((state) => state.auth.token); // Accessing auth token from Redux store.

  // useEffect to fetch profile and posts data when the component mounts or ID/token changes.
  useEffect(() => {
    const fetchProfile = async () => {
      // Fetch profile data from server.
      const response = await fetch(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }, // Authorization header with token.
      });
      const data = await response.json(); // Parse the response data.
      setProfile(data); // Update state with fetched profile data.
    };

    const fetchPosts = async () => {
      // Fetch posts data from server.
      const response = await fetch(`/api/users/${id}/posts`, {
        headers: { Authorization: `Bearer ${token}` }, // Authorization header with token.
      });
      const data = await response.json(); // Parse the response data.
      setPosts(data); // Update state with fetched posts data.
    };

    fetchProfile(); // Call the fetch function for profile.
    fetchPosts(); // Call the fetch function for posts.
  }, [id, token]); // Dependency array with ID and token to refetch when they change.

  if (!profile) return <div>Loading...</div>; // Loading state while fetching data.

  // Render the profile page with user details, friend list, and posts.
  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>
          {profile.firstName} {profile.lastName}
        </h1>
        <p>Location: {profile.location}</p>
        <p>Occupation: {profile.occupation}</p>
      </div>

      <div className="profile-info">
        <div className="profile-details">
          <p>Location: {profile.location}</p>
          <p>Occupation: {profile.occupation}</p>
        </div>
      </div>

      <div className="friend-list">
        <FriendList userId={id} /> {/* Render FriendList with user ID.*/}
      </div>

      <div className="post-feed">
        <h2>Posts</h2>
        <PostFeed posts={posts} /> {/* Render PostFeed with user's posts.*/}
      </div>
    </div>
  );
};

export default ProfilePage;

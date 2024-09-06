import React from "react";
import { useNavigate } from "react-router-dom"; // Correct import for useNavigate
import PostFeed from "../Posts/PostFeed";
import FriendList from "../Friends/FriendList";
import GroupList from "../Groups/GroupList";

const HomePage = () => {
  const navigate = useNavigate();

  const handleRedirect = (e) => {
    e.preventDefault();
    navigate("/people"); 
  };

  return (
    <div>
      <h1>Home Page</h1>

      <button onClick={handleRedirect}>
        See more people
      </button>

      <section>
        <h2>Latest Posts</h2>
        <PostFeed />
      </section>

      <section>
        <h2>Your Friends:</h2>
        <FriendList />
      </section>

      <section>
        <h2>Your Groups:</h2>
        <GroupList />
      </section>
    </div>
  );
};

export default HomePage;

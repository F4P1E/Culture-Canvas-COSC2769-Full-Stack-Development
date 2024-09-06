// Importing React and necessary hooks for state and effect management.
import React from 'react';
// Importing components to be used on the HomePage.
import PostFeed from '../Posts/PostFeed'; // Component to display a feed of posts.
import FriendList from '../Friends/FriendList'; // Component to display a list of friends.
import GroupList from '../Groups/GroupList' // Component to display a list of groups.

const HomePage = () => {
  return (
    <div>
      {/* Header for the HomePage */}
      <h1>Home Page</h1>
      
      {/* PostFeed component to display a feed of posts */}
      <section>
        <h2>Latest Posts</h2>
        <PostFeed />
      </section>

      {/* FriendList component to display the list of friends */}
      <section>
        <h2>Your Friends:</h2>
        <FriendList />
      </section>

      {/* GroupList component to display the list of groups */}
      <section>
        <h2>Your Groups:</h2>
        <GroupList />
      </section>
    </div>
  );
};

export default HomePage;

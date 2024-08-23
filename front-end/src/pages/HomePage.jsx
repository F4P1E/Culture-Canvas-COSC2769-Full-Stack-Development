import React from 'react';
import PostCreationBox from '../components/PostCreationBox';
import PostFeed from '../components/PostFeed';

const HomePage = () => {
  const handleCreatePost = (content) => {
    // API logic to handle post creation
  };

  return (
    <div className="home-page">
      <PostCreationBox onCreatePost={handleCreatePost} />
      <PostFeed />
    </div>
  );
};

export default HomePage;

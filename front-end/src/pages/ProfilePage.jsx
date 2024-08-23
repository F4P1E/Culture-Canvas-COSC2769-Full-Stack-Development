import React from 'react';
import { useParams } from 'react-router-dom';

const ProfilePage = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Profile Page</h1>
      <p>Viewing profile for user ID: {id}</p>
    </div>
  );
};

export default ProfilePage;

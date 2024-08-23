import React from 'react';
import { useParams } from 'react-router-dom';
import CreatePost from '../components/PostCreationBox';
import GroupInfoSidebar from '../components/GroupInfoSideBar';

const GroupPage = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Group Page</h1>
      <p>Viewing group with ID: {id}</p>
      <CreatePost />
      <GroupInfoSidebar/>
    </div>
    
  );
};

export default GroupPage;

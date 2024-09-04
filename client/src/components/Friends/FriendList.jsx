import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { viewFriendList, addFriend, unFriend, acceptFriendRequest, cancelFriendRequest } from '../../slices/friendSlice';;

const FriendList = () => {
  const dispatch = useDispatch();
  
  // Access user ID from the Redux store
  const userId = useSelector((state) => state.auth.user?._id);

  // Access friends list, loading state, and error state from the Redux store
  const { friends, loading, error } = useSelector((state) => state.friends);

  // Fetch friends list when the component mounts or when userId changes

  useEffect(() => {
    // Function to fetch friends data from the API
    const fetchFriends = async () => {
      try {
        // Fetch friends data from the API with authorization header
        const response = await fetch(`http://localhost:8000/${userId}/friends`, {
          method: "GET",
          credentials: "include",
        });
        
        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // Parse the response JSON
        const data = await response.json();
        
        // Update the state with the fetched friends data
        dispatch(viewFriendList(data));
      } catch (error) {
        // Handle errors (e.g., network issues, invalid responses)
        console.error('Failed to fetch friends:', error);
      }
    };

    // Only fetch friends if userId is available (ensures user is logged in)
    if (userId) {
      fetchFriends();
    }
  }, [userId]); // Dependencies array: runs the effect if userId changes

  // Function to handle adding a friend
  const handleAddFriend = (friendId) => {
    if (userId) {
      dispatch(addFriend({ userId, friendId }));
    }
  };

  // Function to handle unfriending a friend
  const handleUnFriend = (friendId) => {
    if (userId) {
      dispatch(unFriend({ userId, friendId }));
    }
  };

  // Function to handle accepting a friend request
  const handleAcceptFriendRequest = (requestId) => {
    if (userId) {
      dispatch(acceptFriendRequest({ userId, requestId }));
    }
  };

  // Function to handle canceling a friend request
  const handleCancelFriendRequest = (requestId) => {
    if (userId) {
      dispatch(cancelFriendRequest({ userId, requestId }));
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {/* Render the list of friends */}
        {friends.map((friend) => (
          <li key={friend._id}>
            {friend.firstName} {friend.lastName}
            {/* Example buttons for adding, unfriending, accepting, and canceling friend requests */}
            <button onClick={() => handleAddFriend(friend._id)}>Add Friend</button>
            <button onClick={() => handleUnFriend(friend._id)}>Unfriend</button>
            <button onClick={() => handleAcceptFriendRequest(friend._id)}>Accept Request</button>
            <button onClick={() => handleCancelFriendRequest(friend._id)}>Cancel Request</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendList;

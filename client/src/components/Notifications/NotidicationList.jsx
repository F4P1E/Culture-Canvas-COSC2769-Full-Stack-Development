// Importing React hooks, Redux hooks, and action creator.
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNotifications } from '../../slices/notificationSlice';

// NotificationList component to display a list of notifications.
const NotificationList = () => {
  const dispatch = useDispatch();  // Hook to dispatch Redux actions.
  const notifications = useSelector((state) => state.notifications.notifications);  // Selector to access notifications state from Redux store.
  
  // Fetch notifications from the server when the component mounts.
  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch('http://localhost:3001/routes/notifications', {
        method: 'GET',  // HTTP method for the request.
        headers: { Authorization: `Bearer ${token}` },  // Authorization header with token.
      });
      const data = await response.json();  // Parse the response data.
      dispatch(setNotifications(data.notifications));  // Dispatch action to set notifications in Redux store.
    };

    fetchNotifications();  // Call the fetch function.
  }, dispatch);  // Dependency array to run effect when dispatch or token changes.

  // Render a list of notifications.
  return (
    <ul>
      {notifications.map((notification) => (  // Map over notifications array to render each notification.
        <li key={notification._id}>{notification.message}</li>
      ))}
    </ul>
  );
};

export default NotificationList;

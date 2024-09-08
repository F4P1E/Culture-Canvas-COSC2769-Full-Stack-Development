import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../admin/admin.css';  // Ensure you have the corresponding CSS

function Sidebar({ selectPage }) {
  const navigate = useNavigate(); // Instantiate navigate function
  const [activeItem, setActiveItem] = useState('Dashboard'); // Default active page

  const handleLogout = () => {
    // Simply navigate to the login page
    navigate('/login');
  };

  const handleSelectPage = (page) => {
    if (page === 'Logout') {
      handleLogout(); // Call handleLogout when "Logout" is selected
    } else {
      selectPage(page);
      setActiveItem(page); // Set active item state
      navigate(`/${page.toLowerCase()}`); // Navigate to the selected page
    }
  };

  return (
    <div style={{ height: '100vh', backgroundColor: 'white' }} className="p-3">
    <h3>Admin Panel</h3>
    <div className="list-group">
      <button className="list-group-item list-group-item-action" onClick={() => selectPage('Dashboard')}>
        Dashboard
      </button>
      <button className="list-group-item list-group-item-action" onClick={() => selectPage('Groups')}>
        Groups
      </button>
      <button className="list-group-item list-group-item-action" onClick={() => selectPage('Users')}>
        Users
      </button>
      <button className="list-group-item list-group-item-action" onClick={() => selectPage('Posts')}>
        Posts
      </button>
      <button className="list-group-item list-group-item-action text-danger" onClick={() => selectPage('Logout')}>
        Logout
      </button>
    </div>
  </div>
  );
}

export default Sidebar;

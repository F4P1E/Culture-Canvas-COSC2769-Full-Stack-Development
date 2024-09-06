// src/App.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';

const App = () => {
  return (
    <div>
      <Navbar /> {/* Add the Navbar here */}
      <main>
        <Outlet /> {/* Render the matched route's component */}
      </main>
    </div>
  );
};

export default App;

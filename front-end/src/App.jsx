import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import GroupPage from './pages/GroupPage';
import RegisterPage from './pages/RegisterPage'; 
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} /> 
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/group/:id" element={<GroupPage />} />
      </Routes>
    </Router>
  );
}

export default App;

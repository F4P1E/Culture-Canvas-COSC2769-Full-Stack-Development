// Importing React hooks for component state management.
import React, { useState } from 'react';

// Register component for user registration.
const Register = () => {
  // Local state to manage input values for email, password, first name, and last name.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Function to handle form submission for registration.
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent default form submission behavior.
    
    // Send registration request to the server.
    const response = await fetch('http://localhost:3001/routes/auth', {
      method: 'POST',  // HTTP method for the request.
      headers: { 'Content-Type': 'application/json' },  // Header to indicate JSON body.
      body: JSON.stringify({ email, password, firstName, lastName }),  // Request body with registration data.
    });

    // Log success or error based on response status.
    if (response.ok) {
      console.log('Registration successful');
    } else {
      console.error('Registration failed');
    }
  };

  // Render registration form with input fields and submit button.
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <br />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />
      <br />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <br />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;

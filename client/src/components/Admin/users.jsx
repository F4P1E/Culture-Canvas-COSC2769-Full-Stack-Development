import React, { useEffect, useState } from 'react';

function User() {
    const [users, setUsers] = useState([]);

    // Fetch users from the backend
    useEffect(() => {
        fetch('http://localhost:8000/users')  
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Failed to fetch users:', error));
    }, []);

    // Function to handle user deletion
    const deleteUser = (userId) => {
        fetch(`http://localhost:8000/users/${userId}`, { method: 'DELETE' })  // Adjust your API endpoint as needed
            .then(response => {
                if (response.ok) {
                    // Filter out the user from the state to update the UI
                    setUsers(users.filter(user => user._id !== userId));
                } else {
                    alert('Failed to delete the user.');
                }
            })
            .catch(error => console.error('Failed to delete user:', error));
    };

    return (
        <div>
            <h1>User List</h1>
            {users.map(user => (
                <div key={user._id}>
                    <span>{user.username}</span>
                    <button onClick={() => deleteUser(user._id)}>Delete</button>
                </div>
            ))}
        </div>
    );
}

export default User;

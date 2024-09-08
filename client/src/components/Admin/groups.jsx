import React, { useEffect, useState } from 'react';

function Groups() {
    const [groups, setGroups] = useState([]);

    // Fetch groups from the backend
    useEffect(() => {
        fetch('http://localhost:8000/group')  
            .then(response => response.json())
            .then(data => setGroups(data))
            .catch(error => console.error('Failed to fetch groups:', error));
    }, []);

    // Function to handle group deletion
    const deleteGroup = (groupId) => {
        fetch(`http://localhost:8000/group/${groupId}`, { method: 'DELETE' }) 
            .then(response => {
                if (response.ok) {
                    setGroups(groups.filter(group => group._id !== groupId));
                } else {
                    alert('Failed to delete the group.');
                }
            })
            .catch(error => console.error('Failed to delete group:', error));
    };

    return (
        <div>
            <h1>Group List</h1>
            {groups.map(group => (
                <div key={group._id}>
                    <span>{group.name} - Admin: {group.adminUsername}</span>  {/* Assuming adminUsername is provided */}
                    <button onClick={() => deleteGroup(group._id)}>Delete</button>
                </div>
            ))}
        </div>
    );
}

export default Groups;

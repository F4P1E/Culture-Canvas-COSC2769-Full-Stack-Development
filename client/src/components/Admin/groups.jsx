import React, { useEffect, useState } from 'react';

function Groups() {
    const [groups, setGroups] = useState([]);
    // Fetch groups from the backend
    useEffect(() => {
        fetch('http://localhost:8000/group', {
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => {
                const groupsArray = Array.isArray(data) ? data : [data];
                setGroups(groupsArray);
            })
            .catch(error => console.error('Failed to fetch groups:', error));
    }, []);

    const deleteGroup = (groupId) => {
        fetch(`http://localhost:8000/group/${groupId}`, {
            method: 'DELETE',
            credentials: 'include',
        })
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
            {groups.map((group, index) => (
                <div key={index}>
                    <br />
                    <span>{group.name} - Admin: {group.admin}</span>
                    <br />
                </div>
            ))}
        </div>
    );
}

export default Groups;
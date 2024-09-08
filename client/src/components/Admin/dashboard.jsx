import React, { useEffect, useState } from 'react';

function AdminDashboard() {
    const [data, setData] = useState({
        totalGroups: 0,
        totalPosts: 0,
        totalUsers: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                console.log('Access token not found. Please login again.');
                return;
            }

            const urls = [
                'http://localhost:8000/groups',
                'http://localhost:8000/posts',
                'http://localhost:8000/users'
            ];

            const fetchOptions = {
                headers: { Authorization: `Bearer ${accessToken}` }
            };

            // Fetch data from multiple endpoints
            try {
                const responses = await Promise.all(urls.map(url => fetch(url, fetchOptions)));
                const dataPromises = responses.map(res => {
                    if (!res.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return res.json();
                });

                const results = await Promise.all(dataPromises);

                setData({
                    totalGroups: results[0].length,
                    totalPosts: results[1].length,
                    totalUsers: results[2].length
                });
            } catch (err) {
                console.error("Failed to fetch data:", err.message);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p>Total Groups: {data.totalGroups}</p>
            <p>Total Posts: {data.totalPosts}</p>
            <p>Total Users: {data.totalUsers}</p>
        </div>
    );
}

export default AdminDashboard;

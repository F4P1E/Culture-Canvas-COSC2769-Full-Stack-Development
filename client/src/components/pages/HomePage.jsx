import React from "react";
import { useNavigate } from "react-router-dom"; // Correct import for useNavigate
import { useDispatch } from "react-redux";
import PostFeed from "../Posts/PostFeed";
import FriendList from "../Friends/FriendList";
import GroupList from "../Groups/JoinedGroupList";
import JoinedGroupList from "../Groups/JoinedGroupList";
import UnjoinedGroupList from "../Groups/UnjoinedGroupList";

import { setLogout } from "../../slices/authSlice";
import { useAuth } from "../../context/authContext";

const HomePage = () => {
	const navigate = useNavigate();

	const dispatch = useDispatch();
	const { setUser } = useAuth();

	const handleRedirect = (e) => {
		e.preventDefault();
		navigate("/people");
	};

	const handleRedirectToMoreGroups = (e) => {
		e.preventDefault();
		navigate("/moregroups");
	};

	const handleRedirectToGroupsAdmin = (e) => {
		e.preventDefault();
		navigate("/groupadmin");
	};

	const handleLogout = async (e) => {
		try {
			e.preventDefault();

			const response = await fetch("http://localhost:8000/logout", {
				method: "GET",
				credentials: "include",
			});

			if (!response.ok) {
				throw new Error("Logout failed");
			}
      
			dispatch(setLogout());
			setUser(null);

			navigate("/home");
		} catch (e) {
			console.log("Unable to logout");
		}
	};

	return (
		<div>
			<h1>Home Page</h1>

			<button onClick={handleRedirect}>See more people</button>

			<section>
				<h2>Latest Posts</h2>
				<PostFeed />
			</section>

			<section>
				<h2>Your Friends:</h2>
				<FriendList />
			</section>

			<section>
				<h2>Your Groups:</h2>
				<JoinedGroupList />
			</section>

			<button onClick={handleRedirectToMoreGroups}>See new groups</button>

			<br />
			<button onClick={handleRedirectToGroupsAdmin}>See your groups</button>

			<br />
			<button onClick={handleLogout}>Logout</button>
		</div>
	);
};

export default HomePage;

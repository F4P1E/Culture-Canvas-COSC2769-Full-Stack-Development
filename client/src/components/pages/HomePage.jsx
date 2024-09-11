// SCSS
import "../styles/HomePage.scss";

import React from "react";
import { useNavigate } from "react-router-dom"; // Correct import for useNavigate
import { useDispatch } from "react-redux";
import CreatePost from "../Posts/CreatePost";
import PostFeed from "../Posts/PostFeed";
import FriendList from "../Friends/FriendList";
import FriendRequest from "../Friends/FriendRequest";
import GroupList from "../Groups/JoinedGroupList";
import JoinedGroupList from "../Groups/JoinedGroupList";
import UnjoinedGroupList from "../Groups/UnjoinedGroupList";
import GroupCreation from "../Groups/GroupCreation";

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

	const handleRedirectToPostFeed = (e) => {
		e.preventDefault();
		navigate("/feed");
	};

	const handleRedirectToFriendRequests = (e) => {
		e.preventDefault();
		navigate("/friendRequest");
	};

	const handleRedirectToMoreGroups = (e) => {
		e.preventDefault();
		navigate("/moregroups");
	};

	const handleRedirectToGroupsAdmin = (e) => {
		e.preventDefault();
		navigate("/groupadmin");
	};

	const handleRedirectToGroupCreation = (e) => {
		e.preventDefault();
		navigate("/groupcreation");
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
		<div className="homepage">
			<h1>Home Page</h1>

			<section>
				<h2>Post something ...</h2>
				<CreatePost /> {/* Add the CreatePost component here */}
			</section>

			<section>
				<button onClick={handleRedirectToPostFeed}>Go to post feed</button>
			</section>

			<section>
				<h2>Your Friends:</h2>
				<FriendList />
			</section>

			<section>
				<button onClick={handleRedirect}>See more people</button>
			</section>
			<br />
			<section>
				<button onClick={handleRedirectToFriendRequests}>
					View Friend Request
				</button>
			</section>

			<section>
				<h2>Your Groups:</h2>
				<JoinedGroupList />
				<button onClick={handleRedirectToGroupCreation}>
					Create a new group
				</button>
			</section>

			<br />
			<button className="see-new-groups" onClick={handleRedirectToMoreGroups}>
				See new groups
			</button>
			<br />

			<br />
			<button className="see-your-groups" onClick={handleRedirectToGroupsAdmin}>
				See your groups
			</button>
			<br />

			<br />
			<button className="logout-button" onClick={handleLogout}>
				Logout
			</button>
		</div>
	);
};

export default HomePage;

// SCSS
import "../styles/CreatePost.scss";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addPost } from "../../slices/postSlice";
import "../styles/GroupPage.scss";

const CreatePost = (groupIdRaw) => {
	const groupId = groupIdRaw.groupId;
	const [content, setContent] = useState("");
	const [visibility, setVisibility] = useState("public");
	const [error, setError] = useState("");
	const dispatch = useDispatch();

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Simple validation
		if (!content) {
			setError("Username and content are required.");
			return;
		}

		try {
			console.log(
				`Content: ${content}, Visibility: ${visibility}, GroupId: ${groupId}`
			);

			let response;

			if (groupId) {
				response = await fetch(`http://localhost:8000/post`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ content, visibility, groupId }),
					credentials: "include",
				});
			} else {
				response = await fetch(`http://localhost:8000/post`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ content, visibility }),
					credentials: "include",
				});
			}

			if (!response.ok) {
				throw new Error("Create post failed");
			}

			dispatch(addPost({ content, visibility }));

			// Clear fields on success
			setContent("");
			setVisibility("public");
			setError("");

			alert("Post created successfully");
			window.location.reload();
		} catch (error) {
			console.log("Error: ", error.message);
		}
	};

	return (
		<div className="create-post">
			{error && <p className="error">{error}</p>}
			<form className="create-post-form" onSubmit={handleSubmit}>
				<div>
					<textarea
						rows="4"
						cols="50"
						id="content"
						placeholder="What's on your mind?"
						value={content}
						onChange={(e) => setContent(e.target.value)}
						required
					/>
				</div>
				<div className="visibility-select">
					<label htmlFor="visibility">Visibility: </label>
					<select
						id="visibility"
						value={visibility}
						onChange={(e) => setVisibility(e.target.value)}
					>
						{!groupId ? (
							<>
								<option value="public">Public</option>
								<option value="friendsOnly">Friends Only</option>
							</>
						) : (
							<>
								<option value="public">Public</option>
								<option value="private">Private</option>
							</>
						)}
					</select>
				</div>
				<br />
				<button type="submit" className="create-post-button">
					Create Post
				</button>
			</form>
			<br />
		</div>
	);
};

export default CreatePost;

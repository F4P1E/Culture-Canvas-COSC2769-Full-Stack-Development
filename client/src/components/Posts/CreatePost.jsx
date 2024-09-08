import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addPost } from "../../slices/postSlice";

const CreatePost = () => {
	const [username, setUsername] = useState("");
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
      console.log(`Content: ${content}, Visibility: ${visibility}`);

			const response = await fetch("http://localhost:8000/post", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content }),
				credentials: "include",
			});

			if (!response.ok) {
				throw new Error("Create post failed");
			}

			dispatch(addPost({ content, visibility }));
			// Clear fields on success
			setContent("");
			setVisibility("public");
			setError("");
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div className="create-post">
			{error && <p className="error">{error}</p>}
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="content">Content:</label>
					<textarea
						id="content"
						value={content}
						onChange={(e) => setContent(e.target.value)}
						required
					/>
				</div>
				<div>
					<label htmlFor="visibility">Visibility:</label>
					<select
						id="visibility"
						value={visibility}
						onChange={(e) => setVisibility(e.target.value)}
					>
						<option value="public">Public</option>
						<option value="friendsOnly">Friends Only</option>
					</select>
				</div>
				<button type="submit">Create Post</button>
			</form>
		</div>
	);
};

export default CreatePost;

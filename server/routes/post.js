const express = require("express");
const {
	createPost,
	getPosts,
	getPostsFromSpecificUser,
	getSpecificPost,
	deletePost,
	updatePost,
	getPostHistory,
	getPostComments,
	createComment,
	deleteComment,
	updateComment,
	getPostComment,
	getCommentHistory,
	reaction,
	commentReaction,
} = require("../controllers/postController");

const router = express.Router();

router.get("/", getPosts);

router.post("/", createPost);

router.get("/:id", getSpecificPost); //:id is post id

router.delete("/:id", deletePost); //:id is post id

router.patch("/:id", updatePost); //:id is post id

router.get("/user/:id", getPostsFromSpecificUser); //:id is user id

router.get("/:id/history", getPostHistory); //id is post id

router.get("/comment/:id/history", getCommentHistory); //id is comment id

router.get("/:id/comments", getPostComments); //id is post id

router.post("/:id/comment", createComment); //id is post id

router.delete("/:id/comment/:commentId", deleteComment); //comment on the post with the route parameter's id

router.patch("/:id/comment/:commentId", updateComment); //     post/postID/comment/commentID

router.get("/:id/comment", getPostComment);

router.post("/:id/react", reaction); //react to post

router.post("/comment/:id/react", commentReaction); // react to comment

module.exports = router;

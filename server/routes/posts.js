import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Read
router.get("/", verifyToken, getFeedPosts); // Get feed posts
router.get("/:userId/posts", verifyToken, getUserPosts); // Get user's posts

// Update
router.get("/:id/like", verifyToken, likePost); // Like or unlike a post

export default router;

import express from "express";
import { login } from "../controllers/auth.js";

const router = express.Router();

// Login user
router.post("/login", login);

export default router;

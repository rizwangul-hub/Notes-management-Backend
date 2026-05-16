import express, { Router } from "express";
import { Login, Register } from "../controller/auth.js";
import { authMiddleware } from "../middleware/auth.js";
import { getProfile } from "../controller/notes.js";



const router = Router();
router.get("/profile", authMiddleware, getProfile);
router.post("/register", Register);
router.post("/login", Login );

export default router;

import express, { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
    allNotes,
    archiveNote,
    deleteNotes,
    notesCreate,
    searchNotes,
    singleNotes,
    updateNotes,
} from "../controller/notes.js";

const router = Router();
router.post("/notes", authMiddleware, notesCreate);
router.get("/notes", authMiddleware, allNotes);
router.get("/notes/search", authMiddleware, searchNotes);
router.patch("/notes/:id/archive", authMiddleware, archiveNote);
router.get("/notes/:id", authMiddleware, singleNotes);
router.put("/notes/:id", authMiddleware, updateNotes);
router.delete("/notes/:id", authMiddleware, deleteNotes);


export default router;

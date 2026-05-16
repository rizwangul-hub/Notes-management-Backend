import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Notes } from "../modules/notes.js";

export const notesCreate = async (req, res) => {
  const userId = req.user._id;
  const { title, content, category } = req.body;
  
  try {
    const isExistTitle = await Notes.findOne({ title, user: userId });
    if (isExistTitle) {
      return res.status(409).json({
        message: "You already have a note with this title",
        forword: false,
      });
    }
    const Note = await Notes.create({
      title,
      content,
      category,
      user: userId,
    });
    return res.status(201).json({
      message: "Notes created successfully",
      forword: true,
      data: Note,
    });
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: error.message, forword: false });
  }
};

export const allNotes = async (req, res) => {
  const userId = req.user._id;
  const sort = req.query.sort || "newest";
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const sortOrder = sort === "oldest" ? 1 : -1;
  const skip = (page - 1) * limit;

  try {
    console.log(`Fetching notes for user: ${userId}, page: ${page}, limit: ${limit}`);
    
    const query = { 
      $or: [
        { user: userId },
        { user: userId.toString() }
      ], 
      archived: false 
    };
    const userNotes = await Notes.find(query)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit);

    const total = await Notes.countDocuments(query);
    const archivedQuery = { 
      $or: [
        { user: userId },
        { user: userId.toString() }
      ], 
      archived: true 
    };
    const archivedCount = await Notes.countDocuments(archivedQuery);
    
    console.log(`Found ${userNotes.length} notes out of ${total} total (${archivedCount} archived)`);

    res.status(200).json({
      message: "Here are all your notes",
      data: userNotes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      forward: true,
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: error.message, forward: false });
  }
};

export const searchNotes = async (req, res) => {
  const search = req.query.search;

  if (!search) {
    return res.status(400).json({
      message: "Search query is required",
      forward: false,
    });
  }

  try {
    const notes = await Notes.find({
      user: req.user._id,
      title: { $regex: search, $options: "i" },
      archived: false,
    });

    res.status(200).json({
      message: "Here are the Notes data",
      data: notes,
      forward: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      forward: false,
    });
  }
};

export const singleNotes = async (req, res) => {
  const notesId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(notesId)) {
    return res.status(400).json({
      message: "Invalid Notes ID",
      forward: false,
    });
  }

  try {
    const notes = await Notes.findOne({ _id: notesId, user: req.user._id });

    if (!notes) {
      return res.status(404).json({
        message: "Notes not found or access denied",
        forward: false,
      });
    }
    res.status(200).json({
      message: "Notes fetched successfully",
      data: notes,
      forward: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      forward: false,
    });
  }
};

export const updateNotes = async (req, res) => {
  const notesId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(notesId)) {
    return res.status(400).json({
      message: "Invalid Notes ID",
      forward: false,
    });
  }
  const { title, content, category } = req.body;
  try {
    const notes = await Notes.findOne({ _id: notesId, user: req.user._id });
    if (!notes) {
      return res.status(404).json({
        message: "Notes not found or access denied",
        forward: false,
      });
    }
    notes.title = title || notes.title;
    notes.content = content || notes.content;
    notes.category = category || notes.category;

    const updatedNotes = await notes.save();

    res.status(200).json({
      message: "Notes updated successfully",
      data: updatedNotes,
      forward: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      forward: false,
    });
  }
};

export const deleteNotes = async (req, res) => {
  const notestId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(notestId)) {
    return res.status(400).json({
      message: "Invalid Notes ID",
      forward: false,
    });
  }
  try {
    const notes = await Notes.findOneAndDelete({ _id: notestId, user: req.user._id });
    if (!notes) {
      return res.status(404).json({
        message: "Notes not found or access denied",
        forward: false,
      });
    }

    res.status(200).json({
      message: "Notes deleted successfully",
      forward: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      forward: false,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = req.user; // comes from authMiddleware

    res.json({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const archiveNote = async (req, res) => {
  const notesId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(notesId)) {
    return res.status(400).json({ message: "Invalid Notes ID", forward: false });
  }

  try {
    const updated = await Notes.findOneAndUpdate(
      { _id: notesId, user: req.user._id },
      { archived: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Notes not found or access denied", forward: false });
    }

    res.status(200).json({
      message: "Notes archived successfully",
      data: updated,
      forward: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, forward: false });
  }
};




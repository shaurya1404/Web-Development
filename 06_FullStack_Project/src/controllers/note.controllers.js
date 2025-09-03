import mongoose from "mongoose";
import { Project } from "../models/project.models.js";
import asyncHandler from "../utils/async-handler.js";
import { ApiError } from "../utils/api_errors.js";
import { Note } from "../models/note.models.js";
import { ApiResponse } from "../utils/api_response.js";

const getNotes = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const project = await Project.findById(mongoose.Types.ObjectId(projectId)); // Ensuring projectId is a mongoose objectId, not a string

    if(!project) {
        throw new ApiError(404, "Project not found");
    }

    const note = await Note.find({
        project: mongoose.Types.ObjectId(projectId)
    }).populate("createdBy", "username fullname avatar")

    return res
        .status(200)
        .json(new ApiResponse(200, getNotes, "Notes fetched successfully"))
})

const getNoteById = asyncHandler(async (req, res) => {
    const { noteId } = req.params;
    
    const note = await Note.findById(noteId).populate("createdBy", "username fullName avatar");

    if(!note) { 
        throw new ApiError(404, "Note not found")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, note, "Note fetched successfully"))
})

const createNote = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { content } = req.body;

    const project = await Project.findById(projectId);

    if(!project) {
        throw new ApiError(404, "Project not found");
    }

    const note = Note.create({
        project: mongoose.Types.ObjectId(projectId),
        content: content,
        createdBy: mongoose.Types.ObjectId(req.user._id) // req.user comes from "isLoggedIn"
    })

    const detailedNote = await Note.findById(note._id).populate("createdBy", "username fullname avatar"); // returning detailedNote to front-end in case it requires details of who created the note too

    return res
        .status(200)
        .json(new ApiResponse(200, detailedNote, "Note fetched successfully"));
})

const updateNote = asyncHandler(async (req, res) => {
    const { noteId } = req.params;
    const { content } = req.body;

    const existingNote = await Note.findById(noteId);

    if(!existingNote) {
        throw new ApiError(404, "Note not found");
    }

    const updatedNote = await Note.findByIdAndUpdate( noteId, {content: content}, {new: true}) // findByIdAndUpdate(id, {newContent}, *return the updated note*)
    .populate("createdBy", "username fullName avatar");

    return res
        .status(200)
        .json(new ApiResponse(200, detailedNote, "Note updated successfully"));
})

const deleteNote = asyncHandler(async (req, res) => {
    const { noteId } = req.params;

    const deletedNote = await Note.findByIdAndDelete(noteId); // findByIdAndDelete() returns the note after deleting it 


    if(!deletedNote) {
        throw new ApiError(404, "Note not found");
    }
    
    return res
        .status(200)
        .json(new ApiResponse(200, detailedNote, "Note deleted successfully"));
})

export { getNotes, getNoteById, createNote, updateNote, deleteNote }

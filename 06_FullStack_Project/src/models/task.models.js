import mongoose, { Schema } from "mongoose";
import { TaskStatusEnums, TaskStatusOptions } from "../utils/constants";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assignedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: TaskStatusOptions,
        default: TaskStatusEnums.TODO
    },
    attachments: {
        type: [{
            url: String,
            mimetype: String,
            size: Number
        }],
        default: []
    }
})

export const Task = mongoose.model("Task", taskSchema);

import mongoose, { Schema } from "mongoose";
import { UserRoleEnums, AvailableUserRoles } from "../utils/constants";

const projectMemberSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project"
    },
    role: {
        type: String,
        enum: AvailableUserRoles,
        default: UserRoleEnums.MEMBER
    }
}, {timestamps: true})
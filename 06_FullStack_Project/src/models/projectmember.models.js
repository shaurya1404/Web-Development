import mongoose, { Schema } from "mongoose";
import { UserRoleEnums, AvailableUserRoles } from "../utils/constants";

const projectMemberSchema = new mongoose.Schema({ // Project member schema is the collection that connects project members to their respective projects
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

export const ProjectMember = mongoose.model("ProjectMember", projectMemberSchema);
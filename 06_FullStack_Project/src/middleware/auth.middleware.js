import jwt from 'jsonwebtoken'
import { User } from '../models/user.models.js'
import { ApiError } from '../utils/api_errors.js'
import asyncHandler from '../utils/async-handler.js'
import { ProjectMember } from '../models/projectmember.models.js'
import mongoose from 'mongoose'

export const isLoggedIn = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.header("Authorization").replace("Bearer ", "") // Mobile apps do not have cookies. Hence, JWT may also be transferred in the "Headers" with the key as "Authorization"
        // The value of the Authorization key is standardized as "Bearer *encodedToken*". Hence, we use the "replace" method for strings to extract the token
        if(!token) {
            throw new ApiError(401, "Unauthorized Request. Please login again")
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
        const id = decoded.id;
        const user = await User.findOne({_id: id}).select("-password -refreshToken -emailVerificationToken"); // "select" mongoose method removes the specified attributes from being selected
        
        if(!user) {
            throw new ApiError(401, "Invalid Access Token. Please login again")
        }
        req.user = user;
        next();
    }
    catch(err) {
        throw new ApiError(422, error?.message || "Please login again!")
    }
}

export const validateProjectPermissions = (roles = []) => {
    asyncHandler(async (req, res, next) => { // asyncHandler and try-catch block are the same functionality-wise
        const { projectId } = req.params;
        
        if(!projectId) {
            throw new ApiError(401, "Invalid Project ID")
        }

        const projectMember = await ProjectMember.findOne({ // Finding the logged-in user in the projectId they are trying to access. Hence, both "project" and "user" will need to match in the ProjectMember model
            project: mongoose.Types.ObjectId(projectId), // mongoose.Types.ObjectId(parameter) ensures that the given parameter is a mongoose objectId (and not a string by any chance)
            user: mongoose.Types.ObjectId(req.user._id)
        })

        if(!projectMember) {
            throw new ApiError(401, "This user is not associated with the project you are trying to access!")
        }

        const givenRole = projectMember.role // accessing the "role" attribute of the project member

        if(!roles.includes(givenRole)) { // If the user's role saved in the database (givenRole) is not a part of the parameter array which are the rolesg given permission, then deny from performing action
            throw new ApiError(401, "You do not have permissions to perform this action!")
        }
        next()
    })
}
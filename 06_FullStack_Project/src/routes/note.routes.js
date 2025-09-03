import { Router } from "express"
import { UserRoleEnums, AvailableUserRoles } from "../utils/constants.js"
import { isLoggedIn, validateProjectPermissions } from "../middleware/auth.middleware.js";

import { getNotes, getNoteById, createNote, updateNote, deleteNote } from "../controllers/note.controllers.js";

const router = Router();

router.route("/:projectId")
    .get(isLoggedIn, validateProjectPermissions(AvailableUserRoles), getNotes) // Both user and admin (only those who are part of the project) can perform a "get" action on the project, i.e, anyone can read the its contents
    .post(isLoggedIn, validateProjectPermissions([UserRoleEnums.ADMIN]), createNote); // Giving permission only to project admin to perform "post" action

router.route("/:projectId/n/:noteId")
    .get(isLoggedIn, validateProjectPermissions(AvailableUserRoles), getNoteById)
    .put(isLoggedIn, validateProjectPermissions([UserRoleEnums.ADMIN]), updateNote)
    .delete(isLoggedIn, validateProjectPermissions([UserRoleEnums.ADMIN]), deleteNote);

export default router 
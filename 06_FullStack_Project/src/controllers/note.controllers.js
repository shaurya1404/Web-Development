import { Router } from "express"
import { UserRoleEnums } from "../utils/constants.js"
import { validateProjectPermissions } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/:projectId")
    .get(validateProjectPermissions([UserRoleEnums.ADMIN, UserRoleEnums.MEMBER]), getNotes) // Both user and admin (only those who are part of the project) can perform a "get" action on the project, i.e, anyone can read the its contents
    .post(validateProjectPermissions([UserRoleEnums.ADMIN]), createNotes) // Giving permission only to project admin to perform "post" action

export default router 

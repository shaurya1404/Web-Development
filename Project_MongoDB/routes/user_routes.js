import express from 'express'
import { loginUser, profile, registerUser, verifyUser } from '../controller/user_controller.js'
import { loggedIn } from '../middleware/auth_middleware.js';

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify/:token", verifyUser);
router.post("/login", loginUser);
router.get("/profile", loggedIn, profile)

export default router
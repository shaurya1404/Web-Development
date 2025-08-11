import express from 'express'
import { loginUser, profile, registerUser, verifyUser, logoutUser, resetPassword, forgotPassword } from '../controller/user_controller.js'
import { isLoggedIn } from '../middleware/auth_middleware.js';

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify/:token", verifyUser);
router.post("/login", loginUser);
router.get("/profile", isLoggedIn, profile);
router.get("/logout", isLoggedIn, logoutUser);
router.post("/forgot", forgotPassword);
router.post("/reset/:token", resetPassword);

export default router
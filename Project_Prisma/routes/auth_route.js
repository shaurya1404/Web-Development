import express from 'express'
import { registerUser } from '../controllers/auth_controller.js';

const userRouter = express.Router();

userRouter.post("/register", registerUser);

export default userRouter
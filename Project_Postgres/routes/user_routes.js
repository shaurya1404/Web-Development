import express from 'express'
import { registerUser } from '../controllers/user_controllers';

const router = express.Router();

router.post("/register", registerUser);

export default router
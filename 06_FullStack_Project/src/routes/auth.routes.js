import { Router } from 'express';
import { registerUser } from '../controllers/auth.controllers.js';
import { userRegistrationValidator } from "../validators/index.js";
import { validate } from '../middleware/validator.middleware.js';

const router = Router();

router.get('/register', userRegistrationValidator(), validate, registerUser) // calling userRegistrationValidator() because it needs to be executed to return the array ( as it doesn not use next())
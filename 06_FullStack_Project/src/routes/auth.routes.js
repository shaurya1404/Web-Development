import { Router } from 'express';
import { registerUser, loginUser, verifyEmail, resendEmailVerification, resetForgottenPassword, logout } from '../controllers/auth.controllers.js';
import { userRegistrationValidator, userLoginValidator, userPasswordResetValidator } from "../validators/index.js";
import { validate } from '../middleware/validator.middleware.js';
import { isLoggedIn } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/register', userRegistrationValidator(), validate, registerUser) // calling userRegistrationValidator() because it needs to be executed to return the array (since it doesn't use next())
router.post('/login', userLoginValidator(), validate, loginUser)
router.get('/verify/:token', verifyEmail)
router.get('/resendEmail', isLoggedIn, resendEmailVerification)
router.post('/resetPassword', isLoggedIn, userPasswordResetValidator(), validate, resetForgottenPassword)
router.get('/logout', isLoggedIn, logout)

export default router
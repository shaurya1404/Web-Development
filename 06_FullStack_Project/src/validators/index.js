import { body } from "express-validator"; // gives access to req.body from "express"

const userRegistrationValidator = () => {
    return [
        body('email') // points to req.body.email
            .trim()
            .notEmpty().withMessage("Email is required")
            .isEmail().withMessage("Email is invalid"),
        body('username')
            .trim()
            .notEmpty().withMessage("Username is required")
            .isLength({min: 3}).withMessage("Username cannot have less than 3 characters")
            .isLength({max: 13}).withMessage("Username cannot have more than 13 characters")
    ]
}

const userLoginValidator = () => {
    return [
        body('email')
            .isEmail().withMessage("Email is invalid"),
        body('password')
            .notEmpty().withMessage("Password cannot be empty")
    ]
}

export { userRegistrationValidator, userLoginValidator }
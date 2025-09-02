import { body } from "express-validator"; // gives access to req.body from "express"

const userRegistrationValidator = () => {
    return [
        body('email') // points to req.body.email
            .trim()
            .notEmpty().withMessage("Email is required")
            .isEmail().withMessage("Email is invalid"),
        body('username') // each of these is an individual middleware function. Thus, we can say the userRegistrationValidator() returns an array of 4 middlware functions
            .trim()
            .notEmpty().withMessage("Username is required")
            .isLength({min: 3}).withMessage("Username cannot have less than 3 characters")
            .isLength({max: 13}).withMessage("Username cannot have more than 13 characters"),
        body('fullname')
            .trim()
            .notEmpty().withMessage("Name is required")
            .isLength({min: 2}).withMessage("Name cannot have less than 3 characters"),
        body('password')
            .trim()
            .notEmpty().withMessage("Password is required")
            .isLength({min: 6}).withMessage("Password cannot have less than 3 characters")
            .isLength({max: 14}).withMessage("Password cannot have more than 14 characters")
    ]
}

const userLoginValidator = () => {
    return [
        body('email')
            .trim()
            .notEmpty().withMessage("Email is required")
            .isEmail().withMessage("Email is invalid"),
        body('password')
            .trim()
            .notEmpty().withMessage("Password is required")
    ]
}

const userPasswordResetValidator = () => {
    return [ 
        body('password')
            .trim()
            .notEmpty().withMessage("Password is required")
    ]
}

export { userRegistrationValidator, userLoginValidator, userPasswordResetValidator }
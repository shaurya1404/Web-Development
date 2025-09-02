import { validationResult } from "express-validator"; // "validationResults" is a function in express-validator that collects all the results of all the validation middlewares ran earlier
import { ApiError } from "../utils/api_errors.js"

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if(errors.isEmpty()) {
        return next();
    }
    
    const extractedErrors = []
    errors.array().forEach((err) => extractedErrors.push({
        [err.path]: err.msg // [] to ensure JS doesn't interpret it the property name as literally "err.path" instead of using its actual value
    }));

    throw new ApiError(422, "Received data is not valid", extractedErrors);
}

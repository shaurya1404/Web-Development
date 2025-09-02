import jwt from 'jsonwebtoken'
import { User } from '../models/user.models.js'
import { ApiError } from '../utils/api_errors.js'

export const isLoggedIn = async (req, res, next) => {
    try {
        const token = req.cookies.token || undefined

        if(!token) {
            next(err)
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
        const id = decoded.id;
        const user = await User.findOne({_id: id});
        req.user = user;
        next();
    }
    catch(err) {
        throw new ApiError(422, {"error": err})
    }
}
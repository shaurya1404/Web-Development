import jwt from 'jsonwebtoken'

export const loggedIn = async (req, res, next) => {
    // access cookie
    // extract token from cookie
    //extract payload(data) from token

    try {
        console.log(req.cookies)
        const token = req.cookies.token || undefined;
        console.log("Token Found: ", token ? "YES" : "NO");

        if(!token) {
            return res.status(400).json({
                success: false,
                message: "Authentication failed!"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    }
    catch(error) {
        console.log("auth middleware failed");
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }

}
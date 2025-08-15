import { ApiResponse } from "../utils/api_response.js"

const healthCheck = (req, res) => {
    res.status(200).json(new ApiResponse(200, {message: "Server is running"}))
}

export { healthCheck }
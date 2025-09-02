class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong", errors, stack ="") {
    super(message); // Call parent constructor first
    this.statusCode = statusCode;
    this.errors = errors || []

    // Maintains proper stack trace (only works in V8 engines like Node.js & Chrome)
    if (stack) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Example usage:
// throw new ApiError(404, "Resource not found");

export  { ApiError }

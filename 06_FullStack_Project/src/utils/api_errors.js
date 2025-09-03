class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong", errors, stack ="") {
    super(message); // Always call parent constructor first (Error(message) in this case)
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

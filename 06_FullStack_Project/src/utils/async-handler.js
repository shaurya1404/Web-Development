function asyncHandler (requestHandler) {
    return function(req, res, next) { // wrapping original requestHandler in another function to add extra logic to it
        Promise.resolve(requestHandler(req, res, next)) // Executing requestHandler how it normally would and wrapping its result in a Promise
        .catch(function(err) { // If the Promise is rejected, the error is passed on to the error-handling middleware instead of crashing the app
            next(err)
        })
    }
}

export default asyncHandler

// Hence, asynchandler provides the same functionality as a try-catch block, i.e, it is a drop-in replacement

// By wrapping requestHandler in Promise.resolve():
// if requestHandler is a non-promise value (synchronous code) --> the value it returns gets resolved in a resolved promise
// if requestHandler is a promise (asynchronous code) --> returns the promise as it is (unchanged)
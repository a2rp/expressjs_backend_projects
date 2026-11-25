const errorHandler = (error, req, res, next) => {
    console.error(error);

    // Handle invalid MongoDB ObjectId values that reach Mongoose.
    if (error.name === "CastError" && error.kind === "ObjectId") {
        return res.status(400).json({
            success: false,
            message: "Invalid resource ID.",
            method: req.method,
            path: req.originalUrl,
        });
    }

    // Handle Mongoose validation failures.
    if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((item) => item.message);

        return res.status(400).json({
            success: false,
            message: "Database validation failed.",
            errors,
            method: req.method,
            path: req.originalUrl,
        });
    }

    // Handle duplicate values such as registering the same email twice.
    if (error.code === 11000) {
        return res.status(409).json({
            success: false,
            message: "An account with the same unique value already exists.",
            method: req.method,
            path: req.originalUrl,
        });
    }

    // Handle malformed or invalid JWT values that are not handled earlier.
    if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
            success: false,
            message: "Invalid authentication token.",
            method: req.method,
            path: req.originalUrl,
        });
    }

    // Handle expired JWT values.
    if (error.name === "TokenExpiredError") {
        return res.status(401).json({
            success: false,
            message: "Authentication token has expired.",
            method: req.method,
            path: req.originalUrl,
        });
    }

    // Use an intentional custom status code when available.
    const statusCode =
        Number.isInteger(error.statusCode) &&
        error.statusCode >= 400 &&
        error.statusCode < 600
            ? error.statusCode
            : 500;

    const message =
        typeof error.message === "string" && error.message.trim()
            ? error.message
            : "Internal server error.";

    return res.status(statusCode).json({
        success: false,
        message,
        method: req.method,
        path: req.originalUrl,
    });
};

module.exports = errorHandler;

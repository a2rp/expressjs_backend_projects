const errorHandler = (error, req, res, next) => {
    console.error(error);

    // Handle invalid MongoDB ObjectId casts that reach Mongoose.
    if (error.name === "CastError" && error.kind === "ObjectId") {
        return res.status(400).json({
            success: false,
            message: "Invalid resource ID.",
            method: req.method,
            path: req.originalUrl,
        });
    }

    // Handle Mongoose schema validation failures.
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

    // Handle MongoDB duplicate-key errors.
    if (error.code === 11000) {
        return res.status(409).json({
            success: false,
            message: "A record with the same unique value already exists.",
            method: req.method,
            path: req.originalUrl,
        });
    }

    // Use a custom status code when one has been assigned intentionally.
    const errorStatus = error.statusCode ?? error.status;
    const statusCode =
        Number.isInteger(errorStatus) &&
        errorStatus >= 400 &&
        errorStatus < 600
            ? errorStatus
            : 500;

    const message =
        statusCode < 500 &&
        typeof error.message === "string" &&
        error.message.trim()
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

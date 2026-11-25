const errorHandler = (error, req, res, next) => {
    console.error("Notification API request failed:", error.name || "Error", error.code || "");

    if (error.type === "entity.parse.failed") {
        return res.status(400).json({ success: false, message: "Invalid JSON request body." });
    }

    if (error.type === "entity.too.large") {
        return res.status(413).json({ success: false, message: "Request body is too large." });
    }

    // Handle invalid MongoDB ObjectId values.
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

    // Handle duplicate unique values if any unique field is added later.
    if (error.code === 11000) {
        return res.status(409).json({
            success: false,
            message: "A record with the same unique value already exists.",
            method: req.method,
            path: req.originalUrl,
        });
    }

    // Handle common SMTP authentication failures.
    if (error.code === "EAUTH" || error.responseCode === 535) {
        return res.status(502).json({
            success: false,
            message: "SMTP authentication failed.",
            method: req.method,
            path: req.originalUrl,
        });
    }

    // Handle SMTP connection and network failures.
    if (
        error.code === "ECONNECTION" ||
        error.code === "ETIMEDOUT" ||
        error.code === "ECONNREFUSED"
    ) {
        return res.status(502).json({
            success: false,
            message: "Notification delivery service is unavailable.",
            method: req.method,
            path: req.originalUrl,
        });
    }

    // Use a custom status code when the application intentionally provides one.
    const statusCode =
        Number.isInteger(error.statusCode) &&
        error.statusCode >= 400 &&
        error.statusCode < 600
            ? error.statusCode
            : 500;

    const message = statusCode < 500 && error.expose === true
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

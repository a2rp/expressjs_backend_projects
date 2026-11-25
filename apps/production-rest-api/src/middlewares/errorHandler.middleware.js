const errorHandler = (error, req, res, next) => {
    if (res.headersSent) return next(error);

    console.error(error);

    const candidateStatus = Number.isInteger(error.statusCode)
        ? error.statusCode
        : error.status;
    const statusCode =
        Number.isInteger(candidateStatus) &&
        candidateStatus >= 400 &&
        candidateStatus < 600
            ? candidateStatus
            : 500;

    const message =
        statusCode >= 500
            ? "Internal server error."
            : error.type === "entity.parse.failed"
              ? "Request body must contain valid JSON."
              : typeof error.message === "string" && error.message.trim()
                ? error.message
                : "Request could not be processed.";

    res.status(statusCode).json({
        success: false,
        message,
        path: req.originalUrl,
        method: req.method,
    });
};

module.exports = errorHandler;

const notFound = (req, res) => {
    // Return a consistent response when no valid route matches the request.
    res.status(404).json({
        success: false,
        message: "Route not found.",
        method: req.method,
        path: req.originalUrl,
    });
};

module.exports = notFound;

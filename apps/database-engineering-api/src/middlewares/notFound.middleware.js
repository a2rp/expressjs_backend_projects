const notFound = (req, res) => {
    // Return a clear response for every unmatched route.
    res.status(404).json({
        success: false,
        message: "Route not found.",
        method: req.method,
        path: req.originalUrl,
    });
};

module.exports = notFound;

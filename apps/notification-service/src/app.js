const express = require("express");

const notificationRoutes = require("./routes/notification.routes");

const requireApiKey = require("./middlewares/apiKey.middleware");
const notFound = require("./middlewares/notFound.middleware");
const errorHandler = require("./middlewares/errorHandler.middleware");

const app = express();

// Hide the default ExpressJS identification header.
app.disable("x-powered-by");

// Parse incoming JSON request bodies.
app.use(
    express.json({
        limit: "100kb",
    }),
);

// Root endpoint confirms that the service is available.
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Notification Service is running.",
        version: "v1",
    });
});

// Health endpoint provides lightweight runtime information.
app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "healthy",
        service: "notification-service",
        version: "1.0.0",
        uptime: Number(process.uptime().toFixed(2)),
        timestamp: new Date().toISOString(),
    });
});

// All notification-related endpoints are versioned here.
app.use("/api/v1/notifications", requireApiKey, notificationRoutes);

// Handle unknown routes after all valid routes.
app.use(notFound);

// Keep centralized error handling as the final middleware.
app.use(errorHandler);

module.exports = app;

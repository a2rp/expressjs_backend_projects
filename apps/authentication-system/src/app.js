const express = require("express");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const notFound = require("./middlewares/notFound.middleware");
const errorHandler = require("./middlewares/errorHandler.middleware");

const app = express();

// Hide the default ExpressJS identification header.
app.disable("x-powered-by");

// Parse incoming JSON bodies.
app.use(express.json());

// Parse cookies so access and refresh tokens can be read from HttpOnly cookies.
app.use(cookieParser());

// Root endpoint confirms that the API is available.
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Authentication System is running.",
        version: "v1",
    });
});

// Health endpoint provides basic runtime information.
app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "healthy",
        service: "authentication-system",
        version: "1.0.0",
        uptime: Number(process.uptime().toFixed(2)),
        timestamp: new Date().toISOString(),
    });
});

// All authentication endpoints are grouped under one versioned route.
app.use("/api/v1/auth", authRoutes);

// Handle routes that do not exist.
app.use(notFound);

// Keep centralized error handling as the final middleware.
app.use(errorHandler);

module.exports = app;

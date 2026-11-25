const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const adminRoutes = require("./routes/admin.routes");
const apiKeyRoutes = require("./routes/apiKey.routes");
const authRoutes = require("./routes/auth.routes");
const resourceRoutes = require("./routes/resource.routes");

const errorHandler = require("./middlewares/errorHandler.middleware");
const notFound = require("./middlewares/notFound.middleware");

const app = express();

// Hide the default ExpressJS identification header.
app.disable("x-powered-by");

// Add common HTTP security headers.
app.use(helmet());

// Build the CORS allow-list from environment configuration.
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

// Allow configured browser origins while keeping non-browser tools usable.
app.use(
    cors({
        origin(origin, callback) {
            // REST Client, curl, Postman, and server-to-server requests
            // may not include an Origin header.
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Origin is not allowed by CORS."));
        },
        credentials: true,
    }),
);

// Parse JSON request bodies and prevent unusually large payloads.
app.use(
    express.json({
        limit: "100kb",
    }),
);

// Apply a general rate limit across the API.
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please try again later.",
    },
});

app.use(generalLimiter);

// Authentication endpoints receive a stricter rate limit
// because login-style endpoints are common brute-force targets.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 50,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many authentication requests. Please try again later.",
    },
});

// Confirm that the API is available.
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Authorization Security API is running.",
        version: "v1",
    });
});

// Provide lightweight runtime information.
app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "healthy",
        service: "authorization-security-api",
        version: "1.0.0",
        uptime: Number(process.uptime().toFixed(2)),
        timestamp: new Date().toISOString(),
    });
});

// Registration, login, and authenticated profile.
app.use("/api/v1/auth", authLimiter, authRoutes);

// Demonstrate role-based and permission-based access.
app.use("/api/v1/resources", resourceRoutes);

// Admin-only user authorization management.
app.use("/api/v1/admin", adminRoutes);

// Demonstrate server-to-server API key protection.
app.use("/api/v1/api-key", apiKeyRoutes);

// Handle every unmatched route after valid routes have run.
app.use(notFound);

// Centralized error handling must remain last.
app.use(errorHandler);

module.exports = app;

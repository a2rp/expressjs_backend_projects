const express = require("express");
const mongoose = require("mongoose");

const productRoutes = require("./routes/product.routes");
const notFound = require("./middlewares/notFound.middleware");
const errorHandler = require("./middlewares/errorHandler.middleware");

const app = express();

// Hide the default Express header for a cleaner production response.
app.disable("x-powered-by");

// Parse incoming JSON request bodies with a conservative size limit.
app.use(express.json({ limit: "1mb" }));

// Keep responses consistent: the requested endpoint is always the first field.
app.use((req, res, next) => {
    const sendJson = res.json.bind(res);
    res.json = (body) => {
        if (body && typeof body === "object" && !Array.isArray(body)) {
            return sendJson({ apiUrl: req.originalUrl, ...body });
        }
        return sendJson({ apiUrl: req.originalUrl, data: body });
    };

    res.on("finish", () => {
        console.log(`[API] ${req.method} ${req.path} -> ${res.statusCode}`);
    });
    next();
});

// Root endpoint confirms that the API is available.
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Database Engineering API is running.",
        version: "v1",
    });
});

// Health endpoint provides basic runtime information.
app.get("/api/v1/health", (req, res) => {
    const databaseConnected = mongoose.connection.readyState === 1;

    res.status(databaseConnected ? 200 : 503).json({
        success: databaseConnected,
        status: databaseConnected ? "healthy" : "database-unavailable",
        service: "database-engineering-api",
        version: "1.0.0",
        uptime: Number(process.uptime().toFixed(2)),
        timestamp: new Date().toISOString(),
    });
});

// All product-related database routes are versioned under /api/v1.
app.use("/api/v1/products", productRoutes);

// Handle unmatched routes after all valid routes have been checked.
app.use(notFound);

// Keep the centralized error handler as the final middleware.
app.use(errorHandler);

module.exports = app;

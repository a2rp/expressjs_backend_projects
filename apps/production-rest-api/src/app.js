const express = require("express");

const productRoutes = require("./routes/product.routes");
const notFound = require("./middlewares/notFound.middleware");
const errorHandler = require("./middlewares/errorHandler.middleware");

const app = express();

app.disable("x-powered-by");

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Production REST API is running.",
        version: "v1",
    });
});

app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "healthy",
        service: "production-rest-api",
        version: "1.0.0",
        uptime: Number(process.uptime().toFixed(2)),
        timestamp: new Date().toISOString(),
    });
});

app.use("/api/v1/products", productRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

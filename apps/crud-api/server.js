require("dotenv").config();

const express = require("express");

const productRoutes = require("./src/routes/product.routes");

const app = express();

const PORT = process.env.PORT || 1198;

app.disable("x-powered-by");
app.use(express.json({ limit: "16kb" }));

// Keep every JSON response self-describing for REST clients and logs.
app.use((req, res, next) => {
    const sendJson = res.json.bind(res);
    res.json = (payload) => sendJson({ apiUrl: req.originalUrl, ...payload });
    next();
});

app.use((req, res, next) => {
    res.on("finish", () => console.log(`[API] ${req.method} ${req.path} -> ${res.statusCode}`));
    next();
});

app.get("/", (req, res) => {
    res.json({
        apiUrl: req.originalUrl,
        message: "CRUD API is running.",
    });
});

app.get("/health", (req, res) => res.status(200).json({ apiUrl: req.originalUrl, status: "ok" }));

app.use("/products", productRoutes);

app.use((req, res) => res.status(404).json({ apiUrl: req.originalUrl, success: false, message: "Route not found." }));

app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);

    const status = Number.isInteger(error.status) && error.status >= 400 && error.status < 500
        ? error.status
        : 500;
    if (status === 500) console.error("[API] Unexpected error:", error);
    const message = status === 413
        ? "Request body is too large."
        : status === 400
          ? "Invalid JSON request body."
          : "Internal server error.";
    res.status(status).json({ apiUrl: req.originalUrl, success: false, message });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

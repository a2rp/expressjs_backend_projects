require("dotenv").config();

const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const { rateLimit } = require("express-rate-limit");
const connectDB = require("./src/utils/connect-db");
const userRoutes = require("./src/routes/user.routes");
const customerRoutes = require("./src/routes/customer.routes");

const app = express();
const PORT = Number(process.env.PORT || 5000);
const jwtSecret = process.env.JWT_SECRET;
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000,https://mern-auth-template-tutorial.netlify.app")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler(req, res) {
        res.status(429).json({ success: false, message: "Too many authentication attempts. Try again later." });
    },
});

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
}

if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI must be set before starting the API.");
}

if (!jwtSecret || Buffer.byteLength(jwtSecret) < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters.");
}

app.disable("x-powered-by");
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());
app.use(cors({
    origin(origin, callback) {
        callback(null, !origin || allowedOrigins.includes(origin));
    },
    credentials: true,
}));

app.get("/api/health", (req, res) => {
    res.json({ success: true, status: "ok" });
});

app.use("/api/user/register", authLimiter);
app.use("/api/user/login", authLimiter);
app.use("/api/user", userRoutes);
app.use("/api/customer", customerRoutes);

app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found." });
});

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    const isMalformedJson = error.type === "entity.parse.failed";
    const isOversizedBody = error.type === "entity.too.large";
    const status = isMalformedJson ? 400 : isOversizedBody ? 413 : 500;
    const message = isMalformedJson
        ? "Invalid JSON request body."
        : isOversizedBody
            ? "Request body too large."
            : "Internal server error.";

    if (status === 500) {
        console.error("Unhandled API error:", error.name || "Error");
    }

    res.status(status).json({ success: false, message });
});

async function startServer() {
    await connectDB();
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}.`));
}

startServer().catch((error) => {
    console.error("Server startup failed:", error.name || "Error");
    process.exitCode = 1;
});

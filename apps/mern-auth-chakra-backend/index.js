require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose"); // for clean shutdown
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const { connectDB } = require("./src/config/db");

const app = express();
const isProd = process.env.NODE_ENV === "production";
const PORT = Number(process.env.PORT) || 1198;
const cookieSameSite = (process.env.COOKIE_SAME_SITE || "lax").toLowerCase();
if (!process.env.MONGODB_URI || !process.env.JWT_SECRET || Buffer.byteLength(process.env.JWT_SECRET) < 32) {
    throw new Error("Set MONGODB_URI and a JWT_SECRET with at least 32 bytes in the environment.");
}
if (!["strict", "lax", "none"].includes(cookieSameSite) || (cookieSameSite === "none" && !isProd)) {
    throw new Error("COOKIE_SAME_SITE must be strict, lax, or none; none requires NODE_ENV=production.");
}

// core middleware
app.set("trust proxy", 1);
app.use(helmet());
app.use(morgan(isProd ? "combined" : "dev"));
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());

// CORS with credentials
const allowed = (process.env.FRONTEND_URL || "http://localhost:5173")
    .split(",")
    .map((s) => s.trim().replace(/\/+$/, ""))
    .filter(Boolean);

app.use(
    cors({
        origin(origin, cb) {
            if (!origin) return cb(null, true); // Postman/CLI
            cb(
                allowed.includes(origin)
                    ? null
                    : new Error("Not allowed by CORS"),
                true
            );
        },
        credentials: true,
    })
);

// rate limit for auth endpoints
const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api/auth", authLimiter);

// health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// routes
app.use("/api/auth", require("./src/routes/auth.routes"));
app.use("/api/users", require("./src/routes/user.routes"));
app.use("/api/admin", require("./src/routes/admin.routes")); // <-- admin mounted

// api 404
app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
        return res.status(404).json({ ok: false, message: "Not found" });
    }
    next();
});

// errors
app.use((err, _req, res, _next) => {
    const status = err.type === "entity.parse.failed" ? 400
        : err.message === "Not allowed by CORS" ? 403
            : 500;
    if (status === 500) console.error("Request failed:", err.message);
    res.status(status).json({
        ok: false,
        message: status === 400 ? "Request body must contain valid JSON."
            : status === 403 ? "This origin is not allowed."
                : "Unable to process this request right now.",
    });
});

// start
connectDB()
    .then(() => {
        app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error("Boot error:", err.message);
        process.exit(1);
    });

// graceful shutdown
process.on("SIGINT", async () => {
    await mongoose.connection.close();
    process.exit(0);
});

const dotenv = require("dotenv");
const connectDB = require("./config/db");
dotenv.config();
const app = require("./app");

const validateEnvironment = () => {
    const missing = ["MONGO_URI", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"].filter((key) => !process.env[key]);
    if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
    for (const key of ["JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"]) {
        const secret = process.env[key].trim();
        if (secret.length < 32) throw new Error(`${key} must contain at least 32 characters`);
        if (/^(replace_with|change_me|your[_-])/i.test(secret)) throw new Error(`Replace the example ${key} with a unique random secret`);
    }
    if (process.env.JWT_ACCESS_SECRET.trim() === process.env.JWT_REFRESH_SECRET.trim()) {
        throw new Error("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different");
    }
    const origins = (process.env.CLIENT_ORIGINS || "").split(",").map((origin) => origin.trim()).filter(Boolean);
    if (process.env.NODE_ENV === "production" && origins.length === 0) throw new Error("CLIENT_ORIGINS must be configured in production");
    const sameSite = (process.env.COOKIE_SAME_SITE || "lax").toLowerCase();
    if (!["strict", "lax", "none"].includes(sameSite)) throw new Error("COOKIE_SAME_SITE must be strict, lax, or none");
    if (sameSite === "none" && process.env.NODE_ENV !== "production") throw new Error("COOKIE_SAME_SITE=none requires NODE_ENV=production so cookies use Secure");
    if (process.env.PORT !== undefined) {
        const port = Number(process.env.PORT);
        if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("PORT must be an integer from 1 to 65535");
    }
};
const startServer = async () => {
    try {
        validateEnvironment();
        await connectDB();
        const port = process.env.PORT === undefined ? 1198 : Number(process.env.PORT);
        app.listen(port, () => console.log(`Server running on port ${port}`));
    } catch (error) {
        console.error(`Server startup failed: ${error.message}`);
        process.exitCode = 1;
    }
};
if (require.main === module) startServer();
module.exports = { app, startServer, validateEnvironment };

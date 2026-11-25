const jwt = require("jsonwebtoken");

// Read a required environment variable and fail clearly if it is missing.
const getRequiredEnv = (name) => {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
};

// Generate a short-lived JWT used for authenticated API requests.
const generateAccessToken = (userId) => {
    const secret = getRequiredEnv("JWT_ACCESS_SECRET");
    const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || "15m";

    return jwt.sign(
        {
            userId,
            type: "access",
        },
        secret,
        {
            expiresIn,
        },
    );
};

// Verify an incoming access token and reject tokens of the wrong type.
const verifyAccessToken = (token) => {
    const secret = getRequiredEnv("JWT_ACCESS_SECRET");

    const payload = jwt.verify(token, secret);

    if (payload.type !== "access") {
        throw new Error("Invalid access token.");
    }

    return payload;
};

module.exports = {
    generateAccessToken,
    verifyAccessToken,
};

const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// Read a required environment variable and fail clearly if it is missing.
const getRequiredEnv = (name) => {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
};

// Generate a short-lived access token used to authorize API requests.
const generateAccessToken = (userId, authVersion = 0) => {
    const secret = getRequiredEnv("JWT_ACCESS_SECRET");
    const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || "15m";

    return jwt.sign(
        {
            userId,
            type: "access",
            authVersion,
        },
        secret,
        {
            expiresIn,
        },
    );
};

// Generate a longer-lived refresh token used to obtain new access tokens.
const generateRefreshToken = (userId) => {
    const secret = getRequiredEnv("JWT_REFRESH_SECRET");
    const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

    return jwt.sign(
        {
            userId,
            type: "refresh",
        },
        secret,
        {
            expiresIn,
        },
    );
};

// Verify an access token and ensure a refresh token cannot be used as access.
const verifyAccessToken = (token) => {
    const secret = getRequiredEnv("JWT_ACCESS_SECRET");

    const payload = jwt.verify(token, secret);

    if (payload.type !== "access") {
        throw new Error("Invalid access token.");
    }

    return payload;
};

// Verify a refresh token and ensure an access token cannot be used for refresh.
const verifyRefreshToken = (token) => {
    const secret = getRequiredEnv("JWT_REFRESH_SECRET");

    const payload = jwt.verify(token, secret);

    if (payload.type !== "refresh") {
        throw new Error("Invalid refresh token.");
    }

    return payload;
};

// Generate a cryptographically secure token for email verification
// and password-reset links.
const generateRandomToken = () => {
    return crypto.randomBytes(32).toString("hex");
};

// Store hashes instead of raw verification, reset, or refresh tokens.
const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex");
};

// Convert a duration in milliseconds into an absolute expiration Date.
const createExpiryDate = (durationInMilliseconds) => {
    return new Date(Date.now() + durationInMilliseconds);
};

module.exports = {
    createExpiryDate,
    generateAccessToken,
    generateRandomToken,
    generateRefreshToken,
    hashToken,
    verifyAccessToken,
    verifyRefreshToken,
};

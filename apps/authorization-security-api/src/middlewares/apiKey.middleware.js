const crypto = require("crypto");

// Compare API keys using a timing-safe comparison to reduce
// information leakage during secret validation.
const safeCompare = (receivedKey, expectedKey) => {
    const receivedBuffer = Buffer.from(receivedKey);
    const expectedBuffer = Buffer.from(expectedKey);

    if (receivedBuffer.length !== expectedBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(receivedBuffer, expectedBuffer);
};

// Protect selected routes using a server-side API key.
const requireApiKey = (req, res, next) => {
    const receivedKey = req.headers["x-api-key"];

    const expectedKey = process.env.API_KEY;

    if (!expectedKey) {
        return res.status(500).json({
            success: false,
            message: "API key configuration is missing.",
        });
    }

    if (typeof receivedKey !== "string" || receivedKey.trim().length === 0) {
        return res.status(401).json({
            success: false,
            message: "API key is required.",
        });
    }

    const isValid = safeCompare(receivedKey.trim(), expectedKey);

    if (!isValid) {
        return res.status(401).json({
            success: false,
            message: "Invalid API key.",
        });
    }

    return next();
};

module.exports = {
    requireApiKey,
};

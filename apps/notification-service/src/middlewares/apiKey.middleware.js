const { timingSafeEqual } = require("node:crypto");

const configuredApiKey = Buffer.from(process.env.API_KEY || "");

const requireApiKey = (req, res, next) => {
    if (configuredApiKey.length < 32) {
        return res.status(503).json({
            success: false,
            message: "Notification API authentication is not configured.",
        });
    }

    const authorization = req.get("authorization") || "";
    const match = /^Bearer\s+([^\s]+)$/i.exec(authorization);

    if (!match) {
        res.set("WWW-Authenticate", "Bearer");
        return res.status(401).json({
            success: false,
            message: "A valid bearer token is required.",
        });
    }

    const providedApiKey = Buffer.from(match[1]);
    if (providedApiKey.length !== configuredApiKey.length || !timingSafeEqual(providedApiKey, configuredApiKey)) {
        res.set("WWW-Authenticate", "Bearer");
        return res.status(401).json({
            success: false,
            message: "A valid bearer token is required.",
        });
    }

    return next();
};

module.exports = requireApiKey;

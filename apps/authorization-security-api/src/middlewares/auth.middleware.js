const { User } = require("../models/user.model");

const { verifyAccessToken } = require("../utils/token.utils");

// Authenticate the request using a Bearer access token.
const requireAuth = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization || "";

        const [scheme, token] = authorization.split(" ");

        if (scheme !== "Bearer" || !token) {
            return res.status(401).json({
                success: false,
                message: "Bearer access token is required.",
            });
        }

        const payload = verifyAccessToken(token);

        const user = await User.findById(payload.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Authenticated user no longer exists.",
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "This account is inactive.",
            });
        }

        // Attach the authenticated user so later middleware
        // and controllers can apply authorization rules.
        req.user = user;

        return next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired access token.",
        });
    }
};

module.exports = {
    requireAuth,
};

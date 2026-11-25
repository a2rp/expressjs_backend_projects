const User = require("../models/user.model");
const { verifyAccessToken } = require("../utils/token.utils");

// Protect private routes by validating the access token
// stored in the HttpOnly cookie.
const requireAuth = async (req, res, next) => {
    try {
        const accessToken = req.cookies?.accessToken;

        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: "Authentication required.",
            });
        }

        const payload = verifyAccessToken(accessToken);

        const user = await User.findById(payload.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Authenticated user no longer exists.",
            });
        }

        if ((payload.authVersion ?? 0) !== (user.authVersion ?? 0)) {
            return res.status(401).json({
                success: false,
                message: "Authentication session is no longer valid.",
            });
        }

        // Attach the authenticated user to the request
        // so protected controllers can reuse it.
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

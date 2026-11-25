
const jwt = require("jsonwebtoken");
const { clearAuthCookieOptions } = require("../utils/auth-cookie");

function auth(req, res, next) {
    try {
        const token = req.cookies?.token;
        if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

        const verified = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
        if (typeof verified.user !== "string" || verified.user.length === 0) {
            throw new Error("Invalid token payload.");
        }

        req.user = verified.user;
        next();
    } catch (error) {
        res.clearCookie("token", clearAuthCookieOptions);
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
}

module.exports = auth;
